import React from 'react';
import { Dialect } from '../types';
import { DIALECTS } from '../utils/audioSynthesizer';
import { Volume2, VolumeX, Mic, Check } from 'lucide-react';

interface VoiceGuidanceWidgetProps {
  currentDialect: Dialect;
  onChangeDialect: (dialect: Dialect) => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  onSpeakWelcome: () => void;
}

export const VoiceGuidanceWidget: React.FC<VoiceGuidanceWidgetProps> = ({
  currentDialect,
  onChangeDialect,
  isSpeaking,
  onStopSpeaking,
  onSpeakWelcome,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const activeDialectObj = DIALECTS.find((d) => d.code === currentDialect) || DIALECTS[0];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Dialect Picker Drawer */}
      {isOpen && (
        <div className="mb-3 w-80 bg-slate-900 border border-purple-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 text-white">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Assistance Vocale (VUI)</h4>
                <p className="text-[11px] text-slate-400">Audio adapté pour analphabétisme</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-purple-200 mb-2 font-medium">Choisissez votre dialecte guinéen :</p>
          <div className="space-y-1.5 mb-4">
            {DIALECTS.map((d) => (
              <button
                key={d.code}
                onClick={() => {
                  onChangeDialect(d.code);
                  onSpeakWelcome();
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                  currentDialect === d.code
                    ? 'bg-purple-950/80 border-purple-500 text-purple-200'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{d.flag}</span>
                  <div>
                    <div className="text-xs font-bold">{d.nativeName}</div>
                    <div className="text-[10px] text-slate-400">{d.description}</div>
                  </div>
                </div>
                {currentDialect === d.code && <Check className="w-4 h-4 text-purple-400" />}
              </button>
            ))}
          </div>

          {/* Audio Wave Visualizer & Test Button */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isSpeaking ? (
                <div className="flex items-end gap-1 h-5">
                  <span className="w-1 bg-purple-400 animate-[bounce_1s_infinite_100ms] h-full rounded-full" />
                  <span className="w-1 bg-purple-400 animate-[bounce_1s_infinite_300ms] h-3/4 rounded-full" />
                  <span className="w-1 bg-purple-400 animate-[bounce_1s_infinite_200ms] h-full rounded-full" />
                  <span className="w-1 bg-purple-400 animate-[bounce_1s_infinite_400ms] h-1/2 rounded-full" />
                </div>
              ) : (
                <Volume2 className="w-5 h-5 text-purple-400" />
              )}
              <span className="text-xs font-medium text-purple-200">
                {isSpeaking ? 'Audio en cours...' : 'Prêt pour guidance'}
              </span>
            </div>

            {isSpeaking ? (
              <button
                onClick={onStopSpeaking}
                className="px-2.5 py-1 bg-red-500/20 border border-red-500/40 text-red-300 rounded-lg text-xs font-bold hover:bg-red-500/30 flex items-center gap-1"
              >
                <VolumeX className="w-3.5 h-3.5" /> Stop
              </button>
            ) : (
              <button
                onClick={onSpeakWelcome}
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow"
              >
                Tester Audio
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 border ${
          isSpeaking
            ? 'bg-purple-600 text-white ring-4 ring-purple-400/50 scale-105 border-purple-300 animate-pulse'
            : 'bg-slate-900 text-purple-300 border-purple-500/40 hover:border-purple-400 hover:bg-slate-800'
        }`}
      >
        <div className="relative">
          <Volume2 className="w-5 h-5 text-purple-300 group-hover:rotate-12 transition-transform" />
          {isSpeaking && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-ping" />
          )}
        </div>

        <span className="text-xs font-bold tracking-tight">
          VUI Dialecte: <span className="text-white">{activeDialectObj.flag} {activeDialectObj.name}</span>
        </span>
      </button>
    </div>
  );
};
