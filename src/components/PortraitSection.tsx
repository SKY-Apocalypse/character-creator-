import React from 'react';
import { Character } from '../types';
import { Sparkles, Image as ImageIcon, Wand2, FlaskConical } from 'lucide-react';

interface PortraitSectionProps {
  character: Character;
  portraitUrl: string | null;
  loading: boolean;
  onGenerate: () => void;
  onRegenerate: () => void;
}

export const PortraitSection: React.FC<PortraitSectionProps> = ({
  character,
  portraitUrl,
  loading,
  onGenerate,
  onRegenerate,
}) => {
  return (
    <div className="mt-8 pt-6 border-t-2 border-[#78350f]">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-fantasy font-bold text-amber-300 flex items-center gap-2">
          <ImageIcon size={18} className="text-amber-400" />
          Portrait
        </h3>
        <span className="text-[11px] text-amber-400/90 font-mono px-2.5 py-0.5 rounded bg-[#24150b] border border-amber-800/80">
          Cartoon / Video Game Style
        </span>
      </div>

      <div className="bg-[#140c07]/90 border-2 border-[#b45309] rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
        {/* Brass corner brackets */}
        <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
        <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
        <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-amber-400" />

        <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
          
          {/* Portrait Easel Frame */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl border-4 border-[#b45309] bg-[#0c0704] shadow-[0_10px_30px_rgba(0,0,0,0.85)] overflow-hidden flex items-center justify-center shrink-0 group">
            {/* Ambient amber candlelight backlight glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/15 via-yellow-600/10 to-transparent pointer-events-none" />

            {/* Brass frame rivets */}
            <div className="absolute top-2 left-2 brass-rivet z-20" />
            <div className="absolute top-2 right-2 brass-rivet z-20" />
            <div className="absolute bottom-2 left-2 brass-rivet z-20" />
            <div className="absolute bottom-2 right-2 brass-rivet z-20" />

            {loading ? (
              /* Loading State */
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400 animate-rune-spin" />
                  <FlaskConical size={26} className="text-amber-400 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-character-name font-semibold text-amber-200 block">
                    Distilling Portrait...
                  </span>
                  <span className="text-[11px] text-amber-300/80 block font-parchment-lore">
                    Transmuting likeness of {character.name}
                  </span>
                </div>
              </div>
            ) : portraitUrl ? (
              /* Display Portrait */
              <div className="relative w-full h-full">
                <img
                  src={portraitUrl}
                  alt={`Cartoon / video game style portrait of ${character.name} the ${character.class}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0805]/85 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-lg bg-[#1a0e08]/90 border border-amber-600/60 backdrop-blur-md flex items-center justify-between text-xs text-amber-200 font-character-name shadow-lg">
                  <span className="truncate">{character.name}</span>
                  <span className="text-amber-400 font-fantasy text-[11px] uppercase tracking-wider">{character.class}</span>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 z-10 text-amber-200/60">
                <div className="w-16 h-16 rounded-2xl bg-[#1b1009] border-2 border-amber-600/40 flex items-center justify-center text-amber-400 shadow-inner">
                  <Wand2 size={28} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-fantasy uppercase tracking-wider text-amber-300 font-bold">
                    Blank Alchemical Canvas
                  </p>
                  <p className="text-[11px] text-amber-300/70 max-w-[190px] font-parchment-lore">
                    Click <strong className="text-amber-400 font-normal">Generate</strong> to distill a cartoon / video game portrait.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls & Alchemist Notes */}
          <div className="flex flex-col justify-center space-y-4 max-w-sm text-center md:text-left">
            <div>
              <h4 className="text-sm font-fantasy font-bold text-amber-200 tracking-wide">
                Alchemical Likeness Projection
              </h4>
              <p className="text-xs text-amber-200/80 mt-1.5 leading-relaxed font-parchment-lore">
                Transmute a colorful video game & cartoon portrait of <strong className="text-amber-300 font-medium">{character.name}</strong>, reflecting their identity as a {character.race} <strong className="text-amber-300 font-medium">{character.class}</strong>.
              </p>
            </div>

            {/* Exactly two buttons: "Generate" and "Regenerate" */}
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start pt-1">
              <button
                onClick={onGenerate}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl font-fantasy font-bold text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 shadow-md shadow-amber-600/30 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-amber-300/70"
              >
                Generate
              </button>

              <button
                onClick={onRegenerate}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl font-fantasy font-bold text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer bg-[#24140b] hover:bg-[#341e10] text-amber-300 border-2 border-amber-600/70 hover:border-amber-400 shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Regenerate
              </button>
            </div>

            {portraitUrl && (
              <p className="text-[11px] text-amber-400/80 italic font-parchment-lore">
                Click "Regenerate" to distill an alternate pose and aesthetic for {character.name}.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
