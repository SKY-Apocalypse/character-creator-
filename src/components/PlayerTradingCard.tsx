import React, { useState } from 'react';
import { Character, RPGTradingStats } from '../types';
import { ClassBadge, getClassTheme } from './ClassBadge';
import { 
  Sparkles, 
  Shield, 
  Heart, 
  Swords, 
  Zap, 
  Scroll, 
  BookmarkPlus, 
  Check, 
  Copy, 
  RefreshCw, 
  BookOpen, 
  FlaskConical, 
  Wand2,
  Award,
  Flame,
  Layers
} from 'lucide-react';

interface PlayerTradingCardProps {
  character: Character;
  portraitUrl: string | null;
  portraitLoading: boolean;
  onGeneratePortrait: () => void;
  onRegeneratePortrait: () => void;
  generatedBackstory: string | null;
  backstoryLoading: boolean;
  onGenerateBackstory: () => void;
  onSaveToDeck: () => void;
  isSavedInDeck?: boolean;
}

export const PlayerTradingCard: React.FC<PlayerTradingCardProps> = ({
  character,
  portraitUrl,
  portraitLoading,
  onGeneratePortrait,
  onRegeneratePortrait,
  generatedBackstory,
  backstoryLoading,
  onGenerateBackstory,
  onSaveToDeck,
  isSavedInDeck = false,
}) => {
  const [copied, setCopied] = useState(false);
  const theme = getClassTheme(character.class);

  // Active backstory is either the freshly generated 1-2 sentence origin story or the character's chronicle
  const activeBackstory = generatedBackstory || character.backstory;

  const copyCard = async () => {
    const text = `=== RPG TRADING CARD ===
Name: ${character.name}
Class: ${character.class}
Title: ${character.title}
Race: ${character.race}

STATS:
- Health: ${character.rpgStats.health} / 100
- Mana: ${character.rpgStats.mana} / 100
- Strength: ${character.rpgStats.strength} / 100

Backstory:
${activeBackstory}
`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto my-4">
      {/* Ambient alchemical backlight */}
      <div 
        className="absolute -inset-2 rounded-[32px] opacity-45 blur-2xl transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, #f59e0b 0%, #b45309 45%, transparent 75%)`
        }}
      />

      {/* SINGLE BORDERED RPG TRADING CARD */}
      <div className="relative bg-parchment-vellum border-4 border-[#b45309] rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-4 sm:p-5 text-[#f7ede2] overflow-hidden">
        
        {/* Brass filigree corner brackets & rivets */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400 pointer-events-none z-20" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400 pointer-events-none z-20" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400 pointer-events-none z-20" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400 pointer-events-none z-20" />

        <div className="absolute top-3.5 left-3.5 brass-rivet z-20" />
        <div className="absolute top-3.5 right-3.5 brass-rivet z-20" />
        <div className="absolute bottom-3.5 left-3.5 brass-rivet z-20" />
        <div className="absolute bottom-3.5 right-3.5 brass-rivet z-20" />

        {/* Inner Card Bezel */}
        <div className="border-2 border-[#78350f] rounded-2xl p-3 sm:p-4 bg-[#140c07]/90 shadow-inner flex flex-col gap-4">
          
          {/* CARD TOP HEADER: CLEARLY LABELED "NAME" AND "CLASS" */}
          <div className="bg-[#1c110a] border-2 border-[#b45309] rounded-xl p-3 shadow-lg relative">
            <div className="flex items-center justify-between gap-2 mb-1">
              {/* CLEAR "NAME" LABEL */}
              <div className="flex items-center gap-1.5">
                <Award size={14} className="text-amber-400" />
                <span className="text-[10px] uppercase font-fantasy tracking-widest font-extrabold text-amber-400">
                  Name
                </span>
                <span className="text-amber-500/50">•</span>
                <span className="text-[11px] text-amber-300/70 font-parchment-lore italic truncate max-w-[140px] sm:max-w-[200px]">
                  "{character.title}"
                </span>
              </div>

              {/* CLEAR "CLASS" LABEL */}
              <div className="flex items-center gap-1.5">
                <Shield size={14} className="text-amber-400" />
                <span className="text-[10px] uppercase font-fantasy tracking-widest font-extrabold text-amber-400">
                  Class
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              {/* CHARACTER NAME IN FANTASY FONT (MedievalSharp / Cinzel Decorative) */}
              <h2 className="font-character-name text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight truncate">
                {character.name}
              </h2>

              {/* CLASS BADGE */}
              <div className="shrink-0">
                <ClassBadge classNameStr={character.class} size="sm" />
              </div>
            </div>
          </div>

          {/* TRADING CARD ARTWORK PORTRAIT WINDOW */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-xl border-2 border-[#b45309] bg-[#0c0704] overflow-hidden shadow-2xl flex items-center justify-center group">
            {/* Ambient backlight glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-orange-500/10 to-transparent pointer-events-none" />

            {portraitLoading ? (
              /* Loading State */
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 z-10">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400 animate-rune-spin" />
                  <FlaskConical size={24} className="text-amber-400 animate-pulse" />
                </div>
                <span className="text-xs font-character-name font-semibold text-amber-200 block">
                  Distilling Portrait...
                </span>
              </div>
            ) : portraitUrl ? (
              /* Display Portrait */
              <div className="relative w-full h-full">
                <img
                  src={portraitUrl}
                  alt={`Cartoon / video game portrait of ${character.name}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded bg-black/80 border border-amber-600/60 backdrop-blur-md flex items-center justify-between text-[11px] text-amber-200 font-character-name">
                  <span className="truncate">{character.name}</span>
                  <span className="text-amber-400 font-fantasy text-[10px] uppercase font-bold">{character.race} {character.class}</span>
                </div>
              </div>
            ) : (
              /* Blank / Empty Portrait */
              <div className="flex flex-col items-center justify-center p-4 text-center space-y-2 z-10 text-amber-300/60">
                <div className="w-12 h-12 rounded-xl bg-[#1b1009] border border-amber-600/40 flex items-center justify-center text-amber-400 shadow-inner">
                  <Wand2 size={22} />
                </div>
                <p className="text-[11px] font-fantasy uppercase tracking-wider text-amber-300 font-bold">
                  Portrait Canvas Awaiting
                </p>
              </div>
            )}
          </div>

          {/* PORTRAIT SECTION CONTROLS: EXACT BUTTONS "Generate" AND "Regenerate" */}
          <div className="bg-[#180e08] border border-[#78350f] rounded-xl p-2.5 flex items-center justify-between gap-2">
            <span className="text-xs font-fantasy font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 pl-1">
              <Sparkles size={13} className="text-amber-400" />
              Portrait
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onGeneratePortrait}
                disabled={portraitLoading}
                className="px-4 py-1.5 rounded-lg font-fantasy font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-stone-950 shadow-sm disabled:opacity-50 border border-amber-300"
              >
                Generate
              </button>
              <button
                onClick={onRegeneratePortrait}
                disabled={portraitLoading}
                className="px-4 py-1.5 rounded-lg font-fantasy font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer bg-[#24140b] hover:bg-[#341e10] text-amber-300 border border-amber-600/70 shadow-sm disabled:opacity-50"
              >
                Regenerate
              </button>
            </div>
          </div>

          {/* RANDOMLY GENERATED STATS FOR HEALTH, MANA AND STRENGTH (1-100) */}
          <div className="bg-[#180e08] border-2 border-[#b45309] rounded-xl p-3 shadow-lg">
            <div className="text-[10px] uppercase font-fantasy tracking-wider font-extrabold text-amber-400/90 mb-2 flex items-center justify-between border-b border-amber-950 pb-1">
              <span>Card Attributes</span>
              <span className="font-mono text-amber-400/70 text-[9px]">Range: 1–100</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* HEALTH STAT (1-100) */}
              <div className="bg-[#240c0c] border border-red-700/80 rounded-lg p-2 text-center shadow-md relative overflow-hidden group">
                <div className="flex items-center justify-center gap-1 text-red-400 mb-0.5">
                  <Heart size={14} className="fill-red-500 text-red-500" />
                  <span className="text-[10px] font-fantasy font-bold uppercase tracking-wider text-red-300">Health</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-character-name text-red-100">
                  {character.rpgStats.health}
                </div>
                {/* Health mini bar */}
                <div className="w-full bg-[#3d1212] rounded-full h-1 mt-1 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-red-600 to-rose-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${character.rpgStats.health}%` }}
                  />
                </div>
              </div>

              {/* MANA STAT (1-100) */}
              <div className="bg-[#0b1724] border border-sky-700/80 rounded-lg p-2 text-center shadow-md relative overflow-hidden group">
                <div className="flex items-center justify-center gap-1 text-sky-400 mb-0.5">
                  <Sparkles size={14} className="text-sky-400" />
                  <span className="text-[10px] font-fantasy font-bold uppercase tracking-wider text-sky-300">Mana</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-character-name text-sky-100">
                  {character.rpgStats.mana}
                </div>
                {/* Mana mini bar */}
                <div className="w-full bg-[#112437] rounded-full h-1 mt-1 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-sky-600 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${character.rpgStats.mana}%` }}
                  />
                </div>
              </div>

              {/* STRENGTH STAT (1-100) */}
              <div className="bg-[#24170b] border border-amber-700/80 rounded-lg p-2 text-center shadow-md relative overflow-hidden group">
                <div className="flex items-center justify-center gap-1 text-amber-400 mb-0.5">
                  <Swords size={14} className="text-amber-400" />
                  <span className="text-[10px] font-fantasy font-bold uppercase tracking-wider text-amber-300">Strength</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-character-name text-amber-100">
                  {character.rpgStats.strength}
                </div>
                {/* Strength mini bar */}
                <div className="w-full bg-[#3b2511] rounded-full h-1 mt-1 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-600 to-yellow-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${character.rpgStats.strength}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BACKSTORY & ORIGIN SCROLL SECTION */}
          <div className="bg-[#180e08] border-2 border-[#b45309] rounded-xl p-3.5 shadow-lg relative">
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-amber-900/60">
              <span className="text-[10px] uppercase font-fantasy tracking-wider font-extrabold text-amber-400 flex items-center gap-1.5">
                <Scroll size={13} />
                Backstory
              </span>
              
              {/* EXACT BUTTON LABELED "Generate Backstory" */}
              <button
                onClick={onGenerateBackstory}
                disabled={backstoryLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-fantasy font-bold text-[11px] tracking-wider uppercase transition-all duration-200 cursor-pointer bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-stone-950 shadow-sm disabled:opacity-50 border border-amber-300"
              >
                {backstoryLoading && <RefreshCw size={12} className="animate-spin text-stone-950" />}
                <span>Generate Backstory</span>
              </button>
            </div>

            {/* Backstory text */}
            {backstoryLoading ? (
              <div className="p-3 text-center text-xs text-amber-300 font-parchment-lore animate-pulse">
                Inscribing origin scroll for {character.name}...
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-amber-100 font-parchment-lore leading-relaxed italic">
                "{activeBackstory}"
              </p>
            )}
          </div>

          {/* CARD ACTION FOOTER: "Save to Deck" BUTTON */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-amber-900/80">
            <button
              onClick={copyCard}
              className="px-3 py-2 text-xs font-fantasy font-semibold text-amber-300/80 hover:text-amber-200 bg-[#24140b] hover:bg-[#341e10] border border-amber-700/60 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* EXACT BUTTON LABELED "Save to Deck" */}
            <button
              onClick={onSaveToDeck}
              className="flex-1 py-3 px-6 rounded-xl font-fantasy font-extrabold text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-900/50 hover:shadow-xl active:scale-95 border-2 border-amber-200 flex items-center justify-center gap-2"
            >
              <BookmarkPlus size={17} className="stroke-[2.5]" />
              <span>Save to Deck</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
