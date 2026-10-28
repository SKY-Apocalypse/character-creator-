export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface RPGTradingStats {
  health: number; // 1 to 100
  mana: number; // 1 to 100
  strength: number; // 1 to 100
}

export interface SignatureAbility {
  name: string;
  description: string;
}

export interface Character {
  id: string;
  name: string;
  class: string;
  title: string;
  race: string;
  alignment: string;
  element: string;
  backstory: string;
  signatureAbility: SignatureAbility;
  equipment: string;
  stats: CharacterStats;
  rpgStats: RPGTradingStats;
  isAiGenerated: boolean;
  generatedAt: number;
}

export interface SavedDeckCard {
  id: string;
  name: string;
  class: string;
  stats: RPGTradingStats;
  portrait: string | null;
  backstory: string;
  race?: string;
  title?: string;
  savedAt: number;
}

export type FantasyClass = 
  | 'Mage'
  | 'Rogue'
  | 'Warrior'
  | 'Paladin'
  | 'Ranger'
  | 'Cleric'
  | 'Druid'
  | 'Bard'
  | 'Warlock'
  | 'Monk'
  | 'Necromancer'
  | 'Artificer'
  | string;
