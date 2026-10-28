import React from 'react';
import { Character } from '../types';
import { History, ChevronRight, FlaskConical, Scroll } from 'lucide-react';

interface CharacterHistoryProps {
  characters: Character[];
  activeId: string | null;
  onSelect: (character: Character) => void;
}

export const CharacterHistory: React.FC<CharacterHistoryProps> = ({
  characters,
  activeId,
  onSelect,
}) => {
  if (characters.length <= 1) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-[#140c07]/90 border-2 border-[#b45309] rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-sm">
      {/* Brass corner brackets */}
      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-amber-400" />

      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-[#78350f]">
        <div className="flex items-center gap-2">
          <FlaskConical size={16} className="text-amber-400" />
          <h3 className="text-sm font-fantasy font-bold uppercase tracking-wider text-amber-200">
            Transmuted Champions Archive
          </h3>
        </div>
        <span className="text-xs text-amber-300 font-mono px-2.5 py-0.5 rounded bg-[#24150b] border border-amber-800">
          {characters.length} Vesselled Souls
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {characters.map((c) => {
          const isActive = c.id === activeId;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className={`text-left p-3 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden group flex items-center justify-between ${
                isActive
                  ? 'bg-[#29170c] border-amber-400 shadow-md shadow-amber-900/40'
                  : 'bg-[#180e08]/90 border-[#78350f] hover:border-amber-600 hover:bg-[#22130b]'
              }`}
            >
              <div className="space-y-1 min-w-0 pr-2">
                <div className="text-xs text-amber-400/90 font-fantasy uppercase tracking-wider flex items-center gap-1.5">
                  <span className="font-bold">Name:</span>
                  <span className="truncate font-character-name text-sm font-bold text-amber-100">
                    {c.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-300/80">
                  <span className="text-[11px] font-fantasy uppercase text-amber-500 font-bold">Class:</span>
                  <span className="font-semibold text-amber-200">{c.class}</span>
                  <span className="text-amber-800">•</span>
                  <span className="text-[11px] text-amber-300/70 font-parchment-lore">{c.race}</span>
                </div>
              </div>

              <div className="shrink-0 text-amber-600 group-hover:text-amber-400 transition-colors">
                <ChevronRight size={16} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
