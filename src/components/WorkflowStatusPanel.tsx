import React, { useMemo, useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Film,
  Loader2,
  Package,
  PlayCircle,
  Settings2,
  Zap,
  Terminal,
} from 'lucide-react';
import {
  WorkflowStage,
  getStageOrder,
  getStageIndex,
  getStageLabel,
  getStageDescription,
  calculateProgress,
  ProjectValidation,
  RenderJob,
} from '../lib/workflowEngine';
import {
  subscribeToWorkflowEvents,
  WorkflowEventLog,
} from '../lib/projectService';

interface WorkflowStatusPanelProps {
  projectId?: string;
  currentStage: WorkflowStage;
  validation: ProjectValidation;
  renderJob: RenderJob | null;
  onStartRender: () => void;
  onDeliver: () => void;
}

const stageIcons: Record<WorkflowStage, React.ElementType> = {
  project_created: Settings2,
  scenes_configured: Film,
  characters_assigned: Settings2,
  actions_assigned: PlayCircle,
  backgrounds_set: Film,
  transitions_set: Film,
  captions_added: Film,
  workflow_validated: CheckCircle2,
  render_queued: Clock,
  render_processing: Loader2,
  render_complete: CheckCircle2,
  delivery_ready: Package,
};

export const WorkflowStatusPanel: React.FC<WorkflowStatusPanelProps> = ({
  projectId,
  currentStage,
  validation,
  renderJob,
  onStartRender,
  onDeliver,
}) => {
  const stages = useMemo(() => getStageOrder(), []);
  const currentIndex = useMemo(() => getStageIndex(currentStage), [currentStage]);
  const progress = useMemo(() => calculateProgress(currentStage), [currentStage]);

  const [liveEvents, setLiveEvents] = useState<WorkflowEventLog[]>([]);

  useEffect(() => {
    if (!projectId) return;
    const unsubscribe = subscribeToWorkflowEvents(projectId, (events) => {
      setLiveEvents(events.slice(-6));
    });
    return () => unsubscribe();
  }, [projectId]);

  const isRenderComplete = renderJob?.status === 'complete';
  const isRenderProcessing = renderJob?.status === 'processing';
  const isRenderQueued = renderJob?.status === 'queued';
  const canRender = validation.readyToRender && !renderJob;
  const canDeliver = isRenderComplete;

  return (
    <div id="workflow-status-panel" className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-[#1a0b2e] px-6 py-5 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#ff9900]">
              <Settings2 className="w-5 h-5" aria-hidden="true" />
              <h2 className="font-bold uppercase tracking-[0.16em] text-xs">
                End-to-End Workflow Status
              </h2>
              <span className="ml-2 inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-mono">
                <Zap className="w-3 h-3 text-emerald-400" />
                Live Pipeline
              </span>
            </div>
            <p className="text-white font-extrabold text-xl mt-2">
              {getStageLabel(currentStage)}
            </p>
            <p className="text-gray-300 text-sm mt-1">
              {getStageDescription(currentStage)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {canRender && (
              <button
                id="start-render-job-btn"
                type="button"
                onClick={onStartRender}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff9900] to-[#ff5500] text-white font-extrabold text-xs shadow-lg hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                Start Full Render
              </button>
            )}

            {canDeliver && (
              <button
                id="open-delivery-modal-btn"
                type="button"
                onClick={onDeliver}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-extrabold text-xs shadow-lg hover:bg-emerald-600 transition flex items-center gap-2 cursor-pointer"
              >
                <Package className="w-4 h-4" />
                Package Delivery Ready
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-gray-300 mb-1.5 font-mono">
            <span>Pipeline Progression</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ff9900] to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pipeline Stepper */}
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {stages.map((stage, idx) => {
            const Icon = stageIcons[stage] || Settings2;
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div
                key={stage}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-between min-h-[90px] ${
                  isCurrent
                    ? 'border-[#ff9900] bg-orange-50/60 shadow-sm'
                    : isCompleted
                      ? 'border-emerald-200 bg-emerald-50/40 text-emerald-800'
                      : 'border-gray-100 bg-gray-50/50 text-gray-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 ${
                    isCurrent
                      ? 'bg-[#ff9900] text-white'
                      : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] font-extrabold leading-tight line-clamp-2">
                  {getStageLabel(stage)}
                </p>
                <span className="text-[9px] font-mono mt-1 opacity-75">
                  Step {idx + 1}
                </span>
              </div>
            );
          })}
        </div>

        {/* Live Event Stream */}
        {liveEvents.length > 0 && (
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2.5">
              <Terminal className="w-3.5 h-3.5 text-[#ff9900]" />
              <span>Real-Time Production Logs</span>
            </div>
            <div className="bg-[#120622] rounded-2xl p-3.5 text-[11px] font-mono text-gray-300 space-y-1.5 max-h-36 overflow-y-auto">
              {liveEvents.map((evt) => (
                <div key={evt.id || evt.timestamp} className="flex items-start gap-2">
                  <span className="text-gray-500">[{new Date(evt.timestamp).toLocaleTimeString()}]</span>
                  <span className="text-emerald-400 font-bold">{evt.stage}:</span>
                  <span className="text-gray-200">{evt.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowStatusPanel;
