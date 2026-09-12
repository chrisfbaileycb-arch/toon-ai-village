import React, { useState } from 'react';
import {
  Check,
  Download,
  Film,
  Globe,
  Image,
  Package,
  Smartphone,
  Youtube,
  X,
} from 'lucide-react';
import {
  RenderJob,
  DeliveryOption,
  deliveryOptions,
  formatDuration,
} from '../lib/workflowEngine';
import { updateProjectWorkflowState } from '../lib/projectService';

interface DeliveryModalProps {
  renderJob: RenderJob;
  projectName: string;
  projectId?: string;
  onClose: () => void;
  onDelivered?: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  smartphone: Smartphone,
  youtube: Youtube,
  globe: Globe,
  image: Image,
};

export const DeliveryModal: React.FC<DeliveryModalProps> = ({
  renderJob,
  projectName,
  projectId,
  onClose,
  onDelivered,
}) => {
  const [selectedOption, setSelectedOption] = useState<DeliveryOption>(
    deliveryOptions[0]
  );
  const [delivered, setDelivered] = useState(false);

  const handleDeliver = async () => {
    setDelivered(true);
    if (projectId) {
      try {
        await updateProjectWorkflowState(
          projectId,
          'delivery_ready',
          100,
          `Delivered animation package as ${selectedOption.format} (${selectedOption.resolution})`,
          renderJob
        );
      } catch (err) {
        console.warn('Delivery state update error:', err);
      }
    }
    if (onDelivered) {
      onDelivered();
    }
  };

  return (
    <div
      id="delivery-export-modal"
      className="fixed inset-0 z-50 bg-[#120820]/80 backdrop-blur-sm p-4 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delivery-modal-title"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border-4 border-[#2a1b4e]">
        <div className="bg-[#1a0b2e] px-6 py-5 md:px-8 flex items-start justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-[#ff9900]">
              <Package className="w-5 h-5" aria-hidden="true" />
              <h2
                id="delivery-modal-title"
                className="font-bold uppercase tracking-[0.16em] text-xs"
              >
                Delivery & Export Package
              </h2>
            </div>
            <p className="text-white font-extrabold text-2xl mt-2">
              {projectName}
            </p>
            <p className="text-gray-300 text-sm mt-1">
              Duration: {formatDuration(renderJob.duration)} · Format:{' '}
              {renderJob.outputFormat}
            </p>
          </div>

          <button
            id="close-delivery-modal-btn"
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
            aria-label="Close delivery modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h3 className="text-gray-900 font-extrabold text-base mb-1">
              Select Output Channel & Platform Target
            </h3>
            <p className="text-gray-500 text-sm">
              Your cartoon scenes and character rigs are optimized for instantaneous deployment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3.5">
            {deliveryOptions.map((opt) => {
              const Icon = iconMap[opt.icon] || Film;
              const isSelected = selectedOption.id === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`delivery-opt-${opt.id}`}
                  type="button"
                  onClick={() => setSelectedOption(opt)}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-[#ff9900] bg-orange-50/50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#ff9900] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm">
                      {opt.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {opt.description}
                    </p>
                    <span className="inline-block mt-2 font-mono text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-semibold">
                      {opt.resolution} · {opt.format}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {delivered && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-sm font-semibold">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Export package delivered successfully! File rendered as{' '}
                <strong>
                  {selectedOption.format} ({selectedOption.resolution})
                </strong>
                .
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <button
              id="cancel-delivery-btn"
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 cursor-pointer"
            >
              Close
            </button>

            <button
              id="confirm-deliver-btn"
              type="button"
              onClick={handleDeliver}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-white font-extrabold text-xs shadow-lg hover:brightness-110 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>
                {delivered ? 'Export Another Copy' : 'Download Animation Package'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryModal;
