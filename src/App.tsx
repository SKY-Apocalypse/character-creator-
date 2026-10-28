/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Character, SavedDeckCard } from './types';
import { PlayerTradingCard } from './components/PlayerTradingCard';
import { MyDeckSection } from './components/MyDeckSection';
import { CharacterHistory } from './components/CharacterHistory';
import { soundFX } from './utils/sound';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  AlertCircle, 
  RefreshCw, 
  Wand2, 
  FlaskConical,
  Flame,
  Scroll,
  Layers
} from 'lucide-react';

export default function App() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [history, setHistory] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [summonStage, setSummonStage] = useState(0);

  // Portrait state (cleared whenever a new character is generated)
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);
  const [portraitLoading, setPortraitLoading] = useState(false);
  const [portraitVariation, setPortraitVariation] = useState(0);

  // Generated backstory state (cleared whenever a new character is generated)
  const [generatedBackstory, setGeneratedBackstory] = useState<string | null>(null);
  const [backstoryLoading, setBackstoryLoading] = useState(false);

  // My Deck state (persisted to localStorage)
  const [deck, setDeck] = useState<SavedDeckCard[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('fantasy_character_deck');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Could not read saved deck from localStorage:', e);
      }
    }
    return [];
  });
  
  // Track previous names to guarantee distinctness on every single click
  const pastNamesRef = useRef<string[]>([]);

  const summoningTexts = [
    'Heating the crucible of fate...',
    'Distilling astral essence via Gemini...',
    'Forging Health, Mana and Strength...',
    'Inscribing character onto the trading card...'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setSummonStage((prev) => (prev + 1) % summoningTexts.length);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.setMuted(!next);
  };

  const handleGenerateCharacter = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);
    setSummonStage(0);

    // CRITICAL: When a new character is generated, clear the old portrait and backstory
    setPortraitUrl(null);
    setPortraitVariation(0);
    setGeneratedBackstory(null);

    if (soundEnabled) {
      soundFX.playSummonStart();
    }

    try {
      const response = await fetch('/api/character/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          excludeNames: pastNamesRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`The alchemical crucible failed to transmutate (${response.status} ${response.statusText})`);
      }

      const data = await response.json();
      
      if (!data.character || !data.character.name || !data.character.class) {
        throw new Error('Received malformed essence from the alchemist apparatus.');
      }

      // Random numbers from 1 to 100 for Health, Mana, and Strength for EACH new character
      const health = Math.floor(Math.random() * 100) + 1;
      const mana = Math.floor(Math.random() * 100) + 1;
      const strength = Math.floor(Math.random() * 100) + 1;

      const newChar: Character = {
        ...data.character,
        id: `char-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        generatedAt: Date.now(),
        rpgStats: {
          health,
          mana,
          strength,
        },
      };

      // Add to unique names tracker
      pastNamesRef.current.push(newChar.name);

      setCharacter(newChar);
      setHistory((prev) => [newChar, ...prev]);

      if (soundEnabled) {
        setTimeout(() => {
          soundFX.playCharacterRevealed();
        }, 150);
      }
    } catch (err: any) {
      console.error('Character generation failed:', err);
      setError(err.message || 'An unexpected disturbance in the crucible prevented transmutation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePortrait = async () => {
    if (!character || portraitLoading) return;

    setPortraitLoading(true);
    if (soundEnabled) {
      soundFX.playDiceRoll();
    }

    try {
      const response = await fetch('/api/character/portrait', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: character.name,
          characterClass: character.class,
          race: character.race,
          isRegenerate: false,
          variation: 0,
        }),
      });

      if (!response.ok) {
        throw new Error(`Portrait divination failed (${response.status})`);
      }

      const data = await response.json();
      if (data.imageUrl) {
        setPortraitUrl(data.imageUrl);
        if (soundEnabled) {
          soundFX.playCharacterRevealed();
        }
      }
    } catch (err: any) {
      console.error('Portrait generation failed:', err);
    } finally {
      setPortraitLoading(false);
    }
  };

  const handleRegeneratePortrait = async () => {
    if (!character || portraitLoading) return;

    setPortraitLoading(true);
    const nextVar = portraitVariation + 1;
    setPortraitVariation(nextVar);

    if (soundEnabled) {
      soundFX.playDiceRoll();
    }

    try {
      const response = await fetch('/api/character/portrait', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: character.name,
          characterClass: character.class,
          race: character.race,
          isRegenerate: true,
          variation: nextVar,
        }),
      });

      if (!response.ok) {
        throw new Error(`Portrait regeneration failed (${response.status})`);
      }

      const data = await response.json();
      if (data.imageUrl) {
        setPortraitUrl(data.imageUrl);
        if (soundEnabled) {
          soundFX.playCharacterRevealed();
        }
      }
    } catch (err: any) {
      console.error('Portrait regeneration failed:', err);
    } finally {
      setPortraitLoading(false);
    }
  };

  const handleGenerateBackstory = async () => {
    if (!character || backstoryLoading) return;

    setBackstoryLoading(true);
    if (soundEnabled) {
      soundFX.playDiceRoll();
    }

    try {
      const response = await fetch('/api/character/backstory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: character.name,
          characterClass: character.class,
          race: character.race,
          title: character.title,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backstory divination failed (${response.status})`);
      }

      const data = await response.json();
      if (data.backstory) {
        setGeneratedBackstory(data.backstory);
        if (soundEnabled) {
          soundFX.playCharacterRevealed();
        }
      }
    } catch (err: any) {
      console.error('Backstory generation failed:', err);
    } finally {
      setBackstoryLoading(false);
    }
  };

  // Button labeled "Save to Deck" saves current character into list called "My Deck"
  const handleSaveToDeck = () => {
    if (!character) return;

    const activeBackstory = generatedBackstory || character.backstory;
    const newCard: SavedDeckCard = {
      id: `deck-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: character.name,
      class: character.class,
      stats: { ...character.rpgStats },
      portrait: portraitUrl,
      backstory: activeBackstory,
      race: character.race,
      title: character.title,
      savedAt: Date.now(),
    };

    const updatedDeck = [newCard, ...deck];
    setDeck(updatedDeck);
    try {
      localStorage.setItem('fantasy_character_deck', JSON.stringify(updatedDeck));
    } catch (e) {
      console.warn('Failed to persist deck:', e);
    }

    if (soundEnabled) {
      soundFX.playCharacterRevealed();
    }
  };

  const handleRemoveFromDeck = (id: string) => {
    const updated = deck.filter((c) => c.id !== id);
    setDeck(updated);
    try {
      localStorage.setItem('fantasy_character_deck', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist deck:', e);
    }
  };

  const handleSelectDeckCard = (card: SavedDeckCard) => {
    const restoredChar: Character = {
      id: card.id,
      name: card.name,
      class: card.class,
      title: card.title || 'Deck Champion',
      race: card.race || 'Heroic',
      alignment: 'True Neutral',
      element: 'Arcane',
      backstory: card.backstory,
      signatureAbility: {
        name: 'Deck Resonance',
        description: 'Unleashes the synthesized power of your custom-crafted card collection.',
      },
      equipment: 'Alchemical Card Foil',
      stats: {
        strength: Math.min(20, Math.max(10, Math.round(card.stats.strength / 5))),
        dexterity: 14,
        constitution: 14,
        intelligence: Math.min(20, Math.max(10, Math.round(card.stats.mana / 5))),
        wisdom: 13,
        charisma: 14,
      },
      rpgStats: card.stats,
      isAiGenerated: true,
      generatedAt: card.savedAt,
    };

    setCharacter(restoredChar);
    setPortraitUrl(card.portrait);
    setGeneratedBackstory(card.backstory);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-alchemist-workbench text-[#f7ede2] flex flex-col justify-between selection:bg-amber-600/30 selection:text-amber-200 relative">
      
      {/* Alchemist's Workbench Atmospheric Candlelight & Amber Lantern Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] left-[25%] w-[650px] h-[650px] bg-amber-500/15 rounded-full blur-[140px] animate-candle-flicker" />
        <div className="absolute top-[35%] left-[-5%] w-[450px] h-[450px] bg-orange-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[550px] h-[550px] bg-amber-600/15 rounded-full blur-[150px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        
        {/* Navigation & Header */}
        <header className="border-b-2 border-[#78350f] bg-[#120a06]/95 backdrop-blur-md sticky top-0 z-30 shadow-2xl">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center text-amber-100 shadow-xl shadow-amber-900/50 border-2 border-amber-400">
                <FlaskConical size={24} className="stroke-[2.2] animate-candle-flicker text-amber-200" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-fantasy font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Fantasy Character Creator
                </h1>
                <p className="text-[11px] text-amber-400/80 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Flame size={12} className="text-amber-500 inline" />
                  Alchemist's Trading Card Forge • Gemini AI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                className="p-2.5 rounded-xl bg-[#22130b] border-2 border-amber-700/80 text-amber-300 hover:text-amber-100 hover:border-amber-400 hover:bg-[#321d11] transition-all shadow-md cursor-pointer active:scale-95"
                title={soundEnabled ? 'Mute Alchemical Chimes' : 'Enable Alchemical Chimes'}
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-amber-700" />}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="max-w-5xl mx-auto px-4 py-8 flex-1 flex flex-col items-center justify-start w-full">
          
          {/* Subheader introduction */}
          <div className="text-center max-w-2xl mb-6 space-y-1">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-fantasy tracking-wider uppercase bg-[#24140b] border border-amber-500/50 text-amber-300 shadow-md mb-1">
              <Sparkles size={14} className="text-amber-400" />
              RPG Trading Card Collector
            </span>
            <p className="text-xs sm:text-sm text-amber-200/80 font-parchment-lore leading-relaxed max-w-md mx-auto">
              Forge an original champion trading card with custom stats and portrait, then save them into your personal deck.
            </p>
          </div>

          {/* PRIMARY BUTTON: "Generate Character" */}
          <div className="mb-6 w-full flex flex-col items-center">
            <button
              onClick={handleGenerateCharacter}
              disabled={loading}
              className={`group relative inline-flex items-center justify-center gap-3 px-9 sm:px-12 py-3.5 sm:py-4 rounded-2xl font-fantasy font-extrabold text-lg tracking-wider uppercase transition-all duration-300 cursor-pointer select-none ${
                loading
                  ? 'bg-[#29170c] border-[#78350f] text-amber-500/50 cursor-not-allowed opacity-90'
                  : 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:via-amber-400 hover:to-yellow-400 text-stone-950 shadow-[0_10px_30px_rgba(217,119,6,0.35)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 active:translate-y-0 border-2 border-amber-300 ring-4 ring-amber-600/20'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw size={22} className="animate-spin text-amber-400" />
                  <span>Transmuting Card...</span>
                </>
              ) : (
                <>
                  <Wand2 size={22} className="transition-transform group-hover:rotate-12 group-hover:scale-110 text-stone-950 stroke-[2.5]" />
                  <span>Generate Character</span>
                  <Sparkles size={16} className="text-stone-950/80 animate-pulse" />
                </>
              )}
            </button>

            {loading && (
              <div className="mt-3 flex items-center gap-2 text-xs font-parchment-lore text-amber-300 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-candle-flicker" />
                <span>{summoningTexts[summonStage]}</span>
              </div>
            )}
          </div>

          {/* ERROR DISPLAY */}
          {error && (
            <div className="w-full max-w-xl mb-6 bg-[#2d0f0c] border-2 border-red-700 rounded-xl p-4 flex items-start gap-3 backdrop-blur-sm shadow-xl">
              <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <h4 className="font-fantasy font-bold text-red-200 mb-0.5">
                  Crucible Reaction Failed
                </h4>
                <p className="text-red-300/90 text-xs leading-relaxed mb-3 font-parchment-lore">
                  {error}
                </p>
                <button
                  onClick={handleGenerateCharacter}
                  className="inline-flex items-center gap-1.5 text-xs font-fantasy font-bold text-red-200 bg-red-900/80 hover:bg-red-800 px-3.5 py-1.5 rounded-lg border border-red-500/50 transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Rekindle Crucible</span>
                </button>
              </div>
            </div>
          )}

          {/* LOADING STATE FOR TRADING CARD */}
          {loading && !character && (
            <div className="w-full max-w-md py-16 px-6 bg-[#160e08]/90 border-4 border-[#b45309] rounded-[28px] flex flex-col items-center justify-center text-center space-y-5 shadow-2xl">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/60 animate-rune-spin" />
                <div className="absolute inset-3 rounded-full border border-amber-600/40 animate-pulse" />
                <FlaskConical size={36} className="text-amber-400 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-fantasy font-bold text-amber-200">
                  Transmuting Trading Card
                </h3>
                <p className="text-xs text-amber-300/80 font-parchment-lore">
                  {summoningTexts[summonStage]}
                </p>
              </div>
            </div>
          )}

          {/* EMPTY STATE (Before first click) */}
          {!character && !loading && (
            <div className="w-full max-w-md py-12 px-6 bg-parchment-vellum border-4 border-[#b45309] rounded-[28px] flex flex-col items-center justify-center text-center space-y-4 shadow-2xl relative">
              <div className="absolute top-2 left-2 brass-rivet" />
              <div className="absolute top-2 right-2 brass-rivet" />
              <div className="absolute bottom-2 left-2 brass-rivet" />
              <div className="absolute bottom-2 right-2 brass-rivet" />

              <div className="w-16 h-16 rounded-2xl bg-[#1e120a] border-2 border-amber-600/50 flex items-center justify-center text-amber-400 shadow-inner">
                <Layers size={30} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-fantasy font-bold text-amber-200">
                  Ready to Forge Your Card
                </h3>
                <p className="text-xs text-amber-200/80 max-w-xs mx-auto leading-relaxed font-parchment-lore">
                  Click <strong className="text-amber-400 font-bold">"Generate Character"</strong> above to manifest a complete RPG trading card with Name, Class, Health, Mana, Strength and backstory.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap justify-center gap-2 text-[11px] text-amber-300/90 font-fantasy">
                <span className="px-2.5 py-1 rounded-md bg-[#25150b] border border-amber-800">Mage</span>
                <span className="px-2.5 py-1 rounded-md bg-[#25150b] border border-amber-800">Rogue</span>
                <span className="px-2.5 py-1 rounded-md bg-[#25150b] border border-amber-800">Warrior</span>
                <span className="px-2.5 py-1 rounded-md bg-[#25150b] border border-amber-800">Paladin</span>
                <span className="px-2.5 py-1 rounded-md bg-[#25150b] border border-amber-800">Ranger</span>
              </div>
            </div>
          )}

          {/* SINGLE BORDERED PLAYER CARD (RPG TRADING CARD FORMAT) */}
          {character && (
            <div className="w-full transition-all duration-500 animate-in fade-in zoom-in-95">
              <PlayerTradingCard
                character={character}
                portraitUrl={portraitUrl}
                portraitLoading={portraitLoading}
                onGeneratePortrait={handleGeneratePortrait}
                onRegeneratePortrait={handleRegeneratePortrait}
                generatedBackstory={generatedBackstory}
                backstoryLoading={backstoryLoading}
                onGenerateBackstory={handleGenerateBackstory}
                onSaveToDeck={handleSaveToDeck}
              />
            </div>
          )}

          {/* LIST CALLED "MY DECK" DISPLAYED ON PAGE BELOW CARD */}
          <MyDeckSection
            deck={deck}
            onSelectCard={handleSelectDeckCard}
            onRemoveCard={handleRemoveFromDeck}
          />

          {/* PREVIOUS CHARACTER HISTORY VAULT */}
          <CharacterHistory
            characters={history}
            activeId={character?.id || null}
            onSelect={(selected) => {
              setCharacter(selected);
              setPortraitUrl(null);
              setPortraitVariation(0);
              setGeneratedBackstory(null);
            }}
          />

        </main>

        {/* Footer */}
        <footer className="border-t-2 border-[#78350f] bg-[#0e0704] py-6 mt-12 text-center text-xs text-amber-400/70 shadow-2xl">
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-fantasy">
              <span className="text-amber-300 font-bold">Fantasy Character Creator</span>
              <span className="text-amber-800">•</span>
              <span className="font-parchment-lore text-amber-200/80">RPG Trading Card Deck Builder</span>
            </div>
            <div className="text-[11px] text-amber-400/80 font-mono">
              Powered by <span className="text-amber-300 font-bold">Google Gemini API</span>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
