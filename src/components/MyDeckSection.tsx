import React from 'react';
import { SavedDeckCard } from '../types';
import { Layers, Heart, Sparkles, Swords, Trash2, Eye, Shield } from 'lucide-react';

interface MyDeckSectionProps {
  deck: SavedDeckCard[];
  onSelectCard: (card: SavedDeckCard) => void;
  onRemoveCard: (id: string) => void;
}

export const MyDeckSection: React.FC<MyDeckSectionProps> = ({
  deck,
  onSelectCard,
  onRemoveCard,
}) => {
  return (
    <section className="w-full max-w-4xl mx-auto mt-12 mb-8">
      {/* Section Header titled "My Deck" */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-[#78350f]">
        <div className="flex items-center gap-2.5">
          <Layers size={20} className="text-amber-400" />
          <h2 className="text-xl sm:text-2xl font-fantasy font-bold tracking-wider text-amber-200">
            My Deck
          </h2>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#24140b] border border-amber-600/60 text-amber-300">
          {deck.length} {deck.length === 1 ? 'Card' : 'Cards'} in Deck
        </span>
      </div>

      {deck.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-parchment-vellum border-2 border-dashed border-[#78350f] shadow-lg">
          <p className="text-sm font-fantasy text-amber-300/80 mb-1">
            Your Deck is Empty
          </p>
          <p className="text-xs text-amber-200/60 font-parchment-lore">
            Summon a character and click <strong className="text-amber-400 font-bold">"Save to Deck"</strong> to add their trading card to your deck.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {deck.map((card) => (
            <div
              key={card.id}
              className="group relative bg-[#180e08] border-2 border-[#b45309] hover:border-amber-400 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Mini Card Header with Name & Class */}
              <div className="p-3 bg-gradient-to-b from-[#24140b] to-[#180e08] border-b border-amber-900/60">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] uppercase font-fantasy tracking-wider text-amber-400 font-bold">
                    {card.class}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveCard(card.id);
                    }}
                    className="text-stone-500 hover:text-red-400 p-1 rounded transition-colors"
                    title="Remove from deck"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <h4 className="font-character-name text-base font-bold text-amber-100 truncate">
                  {card.name}
                </h4>
              </div>

              {/* Mini Portrait Thumbnail */}
              <div className="relative w-full aspect-square bg-[#0c0704] overflow-hidden border-y border-amber-950 flex items-center justify-center">
                {card.portrait ? (
                  <img
                    src={card.portrait}
                    alt={card.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="text-center p-3 text-amber-500/40">
                    <Shield size={32} className="mx-auto mb-1" />
                    <span className="text-[10px] font-fantasy uppercase tracking-wider block">
                      No Portrait
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Mini RPG Stats Badges: Health, Mana, Strength */}
              <div className="p-2.5 bg-[#140c07] border-t border-amber-950">
                <div className="grid grid-cols-3 gap-1 text-center mb-2">
                  <div className="bg-[#2a0e0e] border border-red-800/60 rounded px-1 py-0.5" title="Health">
                    <div className="flex items-center justify-center gap-0.5 text-[9px] text-red-300 font-bold font-fantasy">
                      <Heart size={9} className="fill-red-400 text-red-400" />
                      <span>{card.stats.health}</span>
                    </div>
                    <span className="text-[8px] text-red-400/70 block uppercase">HP</span>
                  </div>
                  <div className="bg-[#0e1c2a] border border-sky-800/60 rounded px-1 py-0.5" title="Mana">
                    <div className="flex items-center justify-center gap-0.5 text-[9px] text-sky-300 font-bold font-fantasy">
                      <Sparkles size={9} className="text-sky-400" />
                      <span>{card.stats.mana}</span>
                    </div>
                    <span className="text-[8px] text-sky-400/70 block uppercase">MP</span>
                  </div>
                  <div className="bg-[#2a1d0e] border border-amber-800/60 rounded px-1 py-0.5" title="Strength">
                    <div className="flex items-center justify-center gap-0.5 text-[9px] text-amber-300 font-bold font-fantasy">
                      <Swords size={9} className="text-amber-400" />
                      <span>{card.stats.strength}</span>
                    </div>
                    <span className="text-[8px] text-amber-400/70 block uppercase">STR</span>
                  </div>
                </div>

                {/* Backstory snippet */}
                <p className="text-[10px] text-amber-200/70 font-parchment-lore line-clamp-2 italic leading-snug">
                  "{card.backstory}"
                </p>

                {/* Inspect / View Button */}
                <button
                  onClick={() => onSelectCard(card)}
                  className="w-full mt-2.5 py-1 px-2 text-[11px] font-fantasy font-semibold text-amber-200 bg-[#29170c] hover:bg-[#3d2313] border border-amber-600/50 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye size={12} />
                  <span>Inspect Card</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
