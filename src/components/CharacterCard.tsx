import React, { useState } from 'react';
import { Character } from '../types';
import { ClassBadge, getClassTheme } from './ClassBadge';
import { PortraitSection } from './PortraitSection';
import { 
  Sparkles, 
  Shield, 
  Copy, 
  Check, 
  Scroll, 
  Swords, 
  Compass, 
  HeartHandshake, 
  Zap, 
  Activity,
  Flame,
  Award,
  FlaskConical,
  Feather,
  RefreshCw,
  BookOpen
} from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  portraitUrl: string | null;
  portraitLoading: boolean;
  onGeneratePortrait: () => void;
  onRegeneratePortrait: () => void;
  generatedBackstory: string | null;
  backstoryLoading: boolean;
  onGenerateBackstory: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ 
  character,
  portraitUrl,
  portraitLoading,
  onGeneratePortrait,
  onRegeneratePortrait,
  generatedBackstory,
  backstoryLoading,
  onGenerateBackstory,
}) => {
  const [copied, setCopied] = useState(false);
  const theme = getClassTheme(character.class);

  const copyCharacterSheet = async () => {
    const text = `=== ALCHEMICAL CHARACTER DOSSIER ===
Name: ${character.name}
Class: ${character.class}
Title: ${character.title}
Race: ${character.race}
Alignment: ${character.alignment}
Element: ${character.element}

Signature Ability: ${character.signatureAbility.name}
${character.signatureAbility.description}

Equipment: ${character.equipment}

Attributes:
- Strength: ${character.stats.strength}
- Dexterity: ${character.stats.dexterity}
- Constitution: ${character.stats.constitution}
- Intelligence: ${character.stats.intelligence}
- Wisdom: ${character.stats.wisdom}
- Charisma: ${character.stats.charisma}

Chronicle & Lore:
${character.backstory}
`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statLabels = [
    { key: 'strength', label: 'STR', full: 'Strength', icon: Swords },
    { key: 'dexterity', label: 'DEX', full: 'Dexterity', icon: Zap },
    { key: 'constitution', label: 'CON', full: 'Constitution', icon: Activity },
    { key: 'intelligence', label: 'INT', full: 'Intelligence', icon: Sparkles },
    { key: 'wisdom', label: 'WIS', full: 'Wisdom', icon: Compass },
    { key: 'charisma', label: 'CHA', full: 'Charisma', icon: HeartHandshake },
  ] as const;

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Warm amber candlelight & alchemist glow behind parchment */}
      <div 
        className="absolute -inset-2 rounded-3xl opacity-40 blur-2xl transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, #f59e0b 0%, #b45309 40%, transparent 75%)`
        }}
      />

      {/* Main Parchment Dossier with Brass Borders & Wood Backing */}
      <div className="relative bg-parchment-vellum border-2 border-[#b45309] rounded-2xl shadow-2xl overflow-hidden text-[#f7ede2]">
        
        {/* Brass corner brackets */}
        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-amber-400 pointer-events-none z-20" />
        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-amber-400 pointer-events-none z-20" />
        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-amber-400 pointer-events-none z-20" />
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-amber-400 pointer-events-none z-20" />

        {/* Four corner brass rivets */}
        <div className="absolute top-3 left-3 brass-rivet z-20" />
        <div className="absolute top-3 right-3 brass-rivet z-20" />
        <div className="absolute bottom-3 left-3 brass-rivet z-20" />
        <div className="absolute bottom-3 right-3 brass-rivet z-20" />

        {/* Aged Alchemical Manuscript Header */}
        <div className="relative border-b-2 border-[#78350f] bg-[#140c07]/90 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-400/80 animate-candle-flicker" />
            <span className="text-xs uppercase tracking-widest font-fantasy text-amber-300 flex items-center gap-1.5 font-bold">
              <FlaskConical size={14} className="text-amber-400" />
              Alchemist's Grimoire • {character.race} {character.element} Transmutation
            </span>
          </div>

          <div className="flex items-center gap-3">
            {character.isAiGenerated && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#2a170b] border border-amber-600/50 text-xs font-mono text-amber-300 shadow-inner">
                <Sparkles size={13} className="text-amber-400" />
                Gemini Arcana
              </span>
            )}
            <button
              onClick={copyCharacterSheet}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-fantasy font-semibold text-amber-200 bg-[#29170c] hover:bg-[#3d2313] border border-amber-600/60 rounded-lg shadow-sm transition-colors cursor-pointer active:scale-95"
              title="Copy character dossier to clipboard"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Transcribed!' : 'Copy Scroll'}</span>
            </button>
          </div>
        </div>

        {/* HERO TITLE SECTION - PRIMARY LABELS: "NAME" & "CLASS" */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left side: PRIMARY LABELS FOR "NAME" AND "CLASS" */}
            <div className="md:col-span-8 space-y-5">
              
              {/* CLEARLY LABELED "NAME" BLOCK */}
              <div className="bg-[#180e08]/90 border-2 border-[#b45309] rounded-xl p-5 shadow-2xl relative overflow-hidden group">
                {/* Brass decorative corners */}
                <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-amber-400/80" />
                <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-amber-400/80" />
                <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-amber-400/80" />
                <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-amber-400/80" />
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-fantasy tracking-widest font-extrabold text-amber-400 flex items-center gap-1.5">
                    <Award size={15} className="text-amber-400" />
                    Name
                  </span>
                  <span className="text-xs text-amber-300/80 font-parchment-lore italic">
                    "{character.title}"
                  </span>
                </div>

                {/* CHARACTER NAME: STYLIZED FANTASY-STYLE FONT (MedievalSharp / Cinzel Decorative) */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-character-name font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 tracking-wide drop-shadow-[0_2px_8px_rgba(245,158,11,0.45)] leading-tight py-1">
                  {character.name}
                </h2>
              </div>

              {/* CLEARLY LABELED "CLASS" BLOCK */}
              <div className="bg-[#180e08]/90 border-2 border-[#b45309] rounded-xl p-5 shadow-2xl relative overflow-hidden group">
                {/* Brass decorative corners */}
                <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-amber-400/80" />
                <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-amber-400/80" />
                <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-amber-400/80" />
                <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-amber-400/80" />

                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs uppercase font-fantasy tracking-widest font-extrabold text-amber-400 flex items-center gap-1.5">
                    <Shield size={15} className="text-amber-400" />
                    Class
                  </span>
                  <span className="text-xs text-amber-300/70 font-mono">
                    Alignment: {character.alignment}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <ClassBadge classNameStr={character.class} size="lg" />
                  <span className="text-sm text-amber-200/90 font-parchment-lore font-medium italic">
                    — {theme.tag}
                  </span>
                </div>
              </div>

            </div>

            {/* Right side: Workbench Ledger & Relic Record */}
            <div className="md:col-span-4 bg-[#140c07]/95 border-2 border-[#92400e] rounded-xl p-5 flex flex-col justify-between h-full space-y-4 shadow-xl relative">
              <div className="absolute top-2 right-2 brass-rivet" />
              <div className="absolute bottom-2 right-2 brass-rivet" />

              <div className="space-y-3">
                <h4 className="text-xs uppercase font-fantasy tracking-widest text-amber-400 font-bold border-b border-amber-900/60 pb-2 flex items-center gap-1.5">
                  <Feather size={14} />
                  Alchemical Ledger
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-amber-400/70 block font-serif">Ancestry</span>
                    <span className="font-semibold text-amber-100 font-fantasy">{character.race}</span>
                  </div>
                  <div>
                    <span className="text-amber-400/70 block font-serif">Aura / Element</span>
                    <span className="font-semibold text-amber-300 flex items-center gap-1 font-fantasy">
                      <Flame size={12} className="text-amber-400" />
                      {character.element}
                    </span>
                  </div>
                  <div>
                    <span className="text-amber-400/70 block font-serif">Moral Stance</span>
                    <span className="font-semibold text-amber-100">{character.alignment}</span>
                  </div>
                  <div>
                    <span className="text-amber-400/70 block font-serif">Distillation</span>
                    <span className="font-semibold text-emerald-400">Pure Essence</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-amber-900/60 text-xs text-amber-200/90 leading-relaxed font-parchment-lore">
                <span className="text-amber-400 font-fantasy uppercase tracking-wider text-[11px] font-bold block mb-1">
                  Enchanted Armament:
                </span>
                <span className="italic">{character.equipment}</span>
              </div>
            </div>

          </div>

          {/* ATTRIBUTES & REAGENT MEASUREMENTS */}
          <div className="mt-8 pt-6 border-t border-amber-900/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase font-fantasy tracking-widest text-amber-300 font-bold flex items-center gap-2">
                <FlaskConical size={15} className="text-amber-400" />
                Vessel Attributes & Potency Scores
              </h3>
              <span className="text-[11px] text-amber-400/70 font-mono">Standard Metric: 8–20</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {statLabels.map(({ key, label, full, icon: StatIcon }) => {
                const val = character.stats[key] || 10;
                const modifier = Math.floor((val - 10) / 2);
                const modStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
                const pct = Math.min(100, Math.max(10, ((val - 6) / 14) * 100));

                return (
                  <div 
                    key={key} 
                    className="bg-[#150d08]/90 border border-[#b45309] hover:border-amber-400 rounded-xl p-3 text-center transition-all group shadow-md"
                  >
                    <div className="flex items-center justify-center text-amber-400/80 group-hover:text-amber-300 transition-colors mb-1">
                      <StatIcon size={14} />
                    </div>
                    <div className="text-[10px] uppercase tracking-wider font-bold text-amber-400/80 font-fantasy">
                      {label}
                    </div>
                    <div className="text-2xl font-bold font-character-name text-amber-100 my-0.5">
                      {val}
                    </div>
                    <div className="text-[11px] text-amber-400 font-mono font-medium">
                      {modStr} mod
                    </div>
                    {/* Alchemist fluid level bar */}
                    <div className="w-full bg-[#27160c] rounded-full h-1.5 mt-2 overflow-hidden border border-amber-900/60">
                      <div 
                        className="bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 h-full rounded-full transition-all duration-700" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIGNATURE ABILITY & CHRONICLE / BACKSTORY */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Signature Spell / Arcane Recipe */}
            <div className="bg-[#180e08]/90 border border-[#b45309] rounded-xl p-5 relative overflow-hidden shadow-lg">
              <div className="flex items-center gap-2 mb-2.5 text-amber-400">
                <Zap size={16} />
                <h4 className="text-xs uppercase font-fantasy tracking-wider font-bold">
                  Signature Transmutation: <span className="text-amber-100 normal-case font-character-name text-sm">{character.signatureAbility.name}</span>
                </h4>
              </div>
              <p className="text-xs md:text-sm text-amber-200/90 leading-relaxed font-parchment-lore">
                {character.signatureAbility.description}
              </p>
            </div>

            {/* Backstory & Alchemical Manuscript */}
            <div className="bg-[#180e08]/90 border border-[#b45309] rounded-xl p-5 relative overflow-hidden shadow-lg">
              <div className="flex items-center gap-2 mb-2.5 text-amber-400">
                <Scroll size={16} />
                <h4 className="text-xs uppercase font-fantasy tracking-wider font-bold">
                  Chronicle & Lore
                </h4>
              </div>
              <p className="text-xs md:text-sm text-amber-200/90 leading-relaxed italic font-parchment-lore">
                "{character.backstory}"
              </p>
            </div>
          </div>

          {/* GENERATE BACKSTORY SECTION */}
          <div className="mt-8 pt-6 border-t-2 border-[#78350f]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-amber-400" />
                <h3 className="text-base sm:text-lg font-fantasy font-bold text-amber-300">
                  Origin Story
                </h3>
              </div>

              {/* Exact button labeled "Generate Backstory" */}
              <button
                onClick={onGenerateBackstory}
                disabled={backstoryLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-fantasy font-bold text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-stone-950 shadow-md shadow-amber-900/40 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-amber-300/80"
              >
                {backstoryLoading && <RefreshCw size={15} className="animate-spin text-stone-950" />}
                <span>Generate Backstory</span>
              </button>
            </div>

            {/* Displayed below the character when generated or loading */}
            {backstoryLoading ? (
              <div className="bg-[#140c07]/90 border-2 border-dashed border-[#b45309] rounded-xl p-5 flex items-center justify-center gap-3 text-amber-300 text-sm font-parchment-lore animate-pulse">
                <RefreshCw size={18} className="animate-spin text-amber-400" />
                <span>Consulting the celestial annals for {character.name}'s origin...</span>
              </div>
            ) : generatedBackstory ? (
              <div className="bg-[#140c07]/95 border-2 border-[#b45309] rounded-xl p-5 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
                <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
                <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
                <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-amber-400" />
                
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-amber-900/60">
                  <span className="text-xs uppercase font-fantasy tracking-wider font-bold text-amber-400 flex items-center gap-1.5">
                    <Scroll size={14} />
                    Inscribed Origin Story • {character.name} the {character.class}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400/70">Gemini Inscription</span>
                </div>

                <p className="text-sm md:text-base text-amber-100 font-parchment-lore leading-relaxed italic">
                  "{generatedBackstory}"
                </p>
              </div>
            ) : (
              <div className="bg-[#140c07]/60 border border-amber-900/60 rounded-xl p-4 text-center text-xs text-amber-300/70 font-parchment-lore">
                Click <strong className="text-amber-300 font-fantasy">"Generate Backstory"</strong> to inscribe a unique one-to-two-sentence origin story for {character.name} based on their Name and Class.
              </div>
            )}
          </div>

          {/* BELOW CHARACTER DETAILS: PORTRAIT SECTION */}
          <PortraitSection
            character={character}
            portraitUrl={portraitUrl}
            loading={portraitLoading}
            onGenerate={onGeneratePortrait}
            onRegenerate={onRegeneratePortrait}
          />

        </div>

      </div>
    </div>
  );
};
