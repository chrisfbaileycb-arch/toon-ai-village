import { MarketingReel } from '../types';

export interface ExportProgress {
  currentSecond: number;
  totalSeconds: number;
  percent: number;
  statusText: string;
}

/**
 * Render and export a MarketingReel or Toon Animation to a WebM/MP4 video file using Canvas and MediaRecorder
 */
export async function exportReelToVideo(
  reel: MarketingReel,
  onProgress?: (progress: ExportProgress) => void
): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      let width = 720;
      let height = 1280; // 9:16 vertical by default
      if (reel.aspectRatio === '16:9') {
        width = 1280;
        height = 720;
      } else if (reel.aspectRatio === '1:1') {
        width = 1080;
        height = 1080;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D context not supported on this browser');
      }

      if (onProgress) {
        onProgress({
          currentSecond: 0,
          totalSeconds: reel.totalDuration,
          percent: 5,
          statusText: 'Preloading scene graphics...',
        });
      }

      // Preload scene images
      const loadedImages = await Promise.all(
        reel.scenes.map((scene) => {
          return new Promise<HTMLImageElement>((res) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => res(img);
            img.onerror = () => {
              const fallback = document.createElement('canvas');
              fallback.width = 800;
              fallback.height = 1200;
              const fctx = fallback.getContext('2d');
              if (fctx) {
                fctx.fillStyle = '#18181b';
                fctx.fillRect(0, 0, 800, 1200);
                fctx.fillStyle = '#f59e0b';
                fctx.font = 'bold 36px sans-serif';
                fctx.textAlign = 'center';
                fctx.fillText(scene.title, 400, 600);
              }
              const fbImg = new Image();
              fbImg.src = fallback.toDataURL();
              res(fbImg);
            };
            img.src = scene.imageUrl;
          });
        })
      );

      // Preload avatar image
      let loadedAvatar: HTMLImageElement | null = null;
      if (reel.characterCartoonUrl) {
        loadedAvatar = await new Promise<HTMLImageElement | null>((res) => {
          const aImg = new Image();
          aImg.crossOrigin = 'anonymous';
          aImg.onload = () => res(aImg);
          aImg.onerror = () => res(null);
          aImg.src = reel.characterCartoonUrl;
        });
      }

      // Setup MediaRecorder
      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 4000000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
      };

      recorder.start(100);

      const fps = 30;
      const totalFrames = Math.max(30, Math.round(reel.totalDuration * fps));
      let frame = 0;

      function renderFrame() {
        if (!ctx) return;
        const currentTime = frame / fps;
        const currentSceneIdx = reel.scenes.findIndex(
          (s) => currentTime >= s.startSeconds && currentTime < s.endSeconds
        );
        const scene = reel.scenes[currentSceneIdx >= 0 ? currentSceneIdx : reel.scenes.length - 1];
        const sceneImg =
          loadedImages[currentSceneIdx >= 0 ? currentSceneIdx : loadedImages.length - 1];

        // 1. Draw Background
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, width, height);

        // 2. Ken Burns Camera Motion
        if (sceneImg) {
          const sceneElapsed = currentTime - scene.startSeconds;
          const sceneProgress = Math.min(1, Math.max(0, sceneElapsed / (scene.durationSeconds || 1)));
          let scale = 1.0;
          let dx = 0;
          let dy = 0;

          if (scene.motionType === 'zoom-in') {
            scale = 1.0 + sceneProgress * 0.18;
          } else if (scene.motionType === 'zoom-out') {
            scale = 1.18 - sceneProgress * 0.18;
          } else if (scene.motionType === 'pan-left') {
            dx = -sceneProgress * 45;
            scale = 1.08;
          } else if (scene.motionType === 'pan-right') {
            dx = sceneProgress * 45;
            scale = 1.08;
          } else {
            dy = -sceneProgress * 35;
            scale = 1.06;
          }

          ctx.save();
          ctx.translate(width / 2 + dx, height / 2 + dy);
          ctx.scale(scale, scale);

          const imgRatio = sceneImg.width / sceneImg.height;
          const canvasRatio = width / height;
          let drawW = width;
          let drawH = height;
          if (imgRatio > canvasRatio) {
            drawH = height;
            drawW = height * imgRatio;
          } else {
            drawW = width;
            drawH = width / imgRatio;
          }
          ctx.drawImage(sceneImg, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();
        }

        // 3. Cinematic Vignette
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
        gradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.1)');
        gradient.addColorStop(0.65, 'rgba(0, 0, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // 4. Header Branding
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`⚡ ${reel.targetAppOrProduct}`, 36, 60);

        // Duration timer badge
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        roundRect(ctx, width - 150, 32, 114, 38, 19);
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        const remaining = Math.max(0, Math.ceil(reel.totalDuration - currentTime));
        ctx.fillText(`⏱️ 00:${remaining.toString().padStart(2, '0')}`, width - 93, 57);

        // 5. Marketing Badge
        if (scene.badgeText) {
          ctx.fillStyle = '#f97316';
          const badgeWidth = Math.min(width - 80, 240);
          roundRect(ctx, width / 2 - badgeWidth / 2, 95, badgeWidth, 42, 21);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 18px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(scene.badgeText, width / 2, 122);
        }

        // 6. Floating Avatar Mascot
        if (loadedAvatar) {
          const avatarSize = 90;
          const avatarX = 40;
          const avatarY = height - 390;

          // Avatar circular background & border
          ctx.save();
          ctx.beginPath();
          ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 4, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(loadedAvatar, avatarX, avatarY, avatarSize, avatarSize);
          ctx.restore();

          // Speaking pulse ring
          ctx.save();
          ctx.beginPath();
          ctx.arc(
            avatarX + avatarSize / 2,
            avatarY + avatarSize / 2,
            avatarSize / 2 + 6 + Math.sin(currentTime * 8) * 3,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        }

        // 7. Kinetic Subtitle Box
        const captionBoxY = height - 280;
        ctx.fillStyle = 'rgba(15, 15, 20, 0.85)';
        roundRect(ctx, 36, captionBoxY, width - 72, 115, 16);

        // Subtitle line
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(scene.captionText, width / 2, captionBoxY + 48);

        // Highlighted keyword glow
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 21px sans-serif';
        ctx.fillText(`✨ "${scene.highlightedKeyword}"`, width / 2, captionBoxY + 90);

        // 8. Interactive Call To Action Button
        ctx.fillStyle = '#ea580c';
        const btnY = height - 130;
        roundRect(ctx, 36, btnY, width - 72, 64, 32);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`🚀 ${reel.ctaButtonText}`, width / 2, btnY + 41);

        // 9. Timeline Progress Bar
        const progressW = (currentTime / reel.totalDuration) * width;
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(0, height - 8, progressW, 8);

        frame++;

        if (frame % 15 === 0 && onProgress) {
          const percent = Math.min(99, Math.round((frame / totalFrames) * 100));
          onProgress({
            currentSecond: Math.round(currentTime),
            totalSeconds: reel.totalDuration,
            percent,
            statusText: `Encoding video frame ${frame} of ${totalFrames} (${percent}%)...`,
          });
        }

        if (frame <= totalFrames) {
          setTimeout(renderFrame, 1000 / (fps * 2));
        } else {
          recorder.stop();
        }
      }

      renderFrame();
    } catch (err) {
      reject(err);
    }
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}
