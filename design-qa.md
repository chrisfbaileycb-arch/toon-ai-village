# Design QA — Integrated Toon AI Village rebuild

## Visual target

- Approved dimensional Village direction: navy navigation, warm cinematic illustration,
  cream workspace, coral/orange actions, rich scene imagery, and clear visual depth.
- Primary journey: Village onboarding → Story Builder → Character Bible → Story Studio →
  scene approval/regeneration → voice/captions → preview/export.
- The former vector-rig/2D-script workflow is not part of the primary application.

## Verified

- [x] `npm run lint`
- [x] `npm run build`
- [x] Onboarding data contract preserves idea, URL, duration, creation type, and aspect ratio
- [x] Character Bible fallback API returns identity prompt and guardrails
- [x] Unified 30-second story fallback produces three complete scenes
- [x] Scene regeneration fallback returns replacement artwork
- [x] Disconnected `/api/generate-toon-story` 2D endpoint returns 404
- [x] Story Studio shares the generated reel, Character Bible, approvals, and preview state
- [x] Responsive desktop/tablet/mobile styles and reduced-motion behavior are present

## Browser limitation

The managed browser previously rejected both `localhost` and `127.0.0.1` with
`ERR_BLOCKED_BY_CLIENT`. The production bundle and API workflow are verified, but a final visual
comparison at 1440 × 1024 and 390 × 844 must still be performed in a preview environment that can
reach the app.

final result: blocked — functional/build verification passed; managed visual browser unavailable.
