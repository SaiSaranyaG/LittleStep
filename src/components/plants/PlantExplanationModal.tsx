import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  X,
  CheckCircle2,
  Send,
  Loader2,
  Compass,
  Sun,
  Droplet,
  Lightbulb,
} from 'lucide-react';
import { PlantSpecies, SpaceZone } from '../../types';

interface PlantExplanationModalProps {
  species: PlantSpecies | null;
  zone: SpaceZone | null;
  isOpen: boolean;
  onClose: () => void;
  onAskAi: (question: string) => Promise<{ explanation: string; placementAdvice: string; careTip?: string }>;
}

export const PlantExplanationModal: React.FC<PlantExplanationModalProps> = ({
  species,
  zone,
  isOpen,
  onClose,
  onAskAi,
}) => {
  const [customQuestion, setCustomQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<{
    explanation: string;
    placementAdvice: string;
    careTip?: string;
  } | null>(null);

  if (!isOpen || !species) return null;

  const quickQuestions = [
    `Why is ${species.commonName} better than other plants for ${zone?.lightLevel?.replace('_', ' ') || 'this light'}?`,
    `How will ${species.commonName} handle winter room temperatures?`,
    `What are the most common beginner mistakes with this species?`,
    `Is this plant safe if I have curious cats or dogs?`,
  ];

  const handleAskQuestion = async (q: string) => {
    setIsLoading(true);
    try {
      const res = await onAskAi(q);
      setAiResponse(res);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        id="plant-explanation-modal"
        className="bg-slate-900 border border-emerald-800/80 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-900/60 border border-emerald-700/50 rounded-xl text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  AI Botanical Rationale
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Why {species.commonName}?
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Botanical Baseline */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-semibold text-white">Target Zone:</span>
            <span className="text-emerald-400">{zone?.name || 'Selected Growth Zone'} ({zone?.lightLevel?.replace('_', ' ') || 'ambient light'})</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            {species.scientificFacts || species.description}
          </p>
        </div>

        {/* AI Answer Stream / Display */}
        {aiResponse ? (
          <div className="p-4 bg-emerald-950/40 border border-emerald-700/60 rounded-xl space-y-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              <span>Botanical Recommendation Insight</span>
            </div>
            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{aiResponse.explanation}</p>
            
            {aiResponse.placementAdvice && (
              <div className="pt-2 border-t border-emerald-800/60 text-emerald-300">
                <strong>Placement Advice: </strong>
                <span>{aiResponse.placementAdvice}</span>
              </div>
            )}

            {aiResponse.careTip && (
              <div className="text-teal-300">
                <strong>Care Rhythm: </strong>
                <span>{aiResponse.careTip}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Quick Questions
            </span>
            <div className="space-y-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskQuestion(q)}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-600/60 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group disabled:opacity-50"
                >
                  <span>{q}</span>
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Question Bar */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Ask specific question about {species.commonName}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="e.g., Can I place this near an AC unit?"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customQuestion.trim()) {
                  handleAskQuestion(customQuestion);
                }
              }}
            />
            <button
              onClick={() => customQuestion.trim() && handleAskQuestion(customQuestion)}
              disabled={isLoading || !customQuestion.trim()}
              className="p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
