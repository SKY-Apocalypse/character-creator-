import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { generateCartoonPortraitSvg } from './src/utils/serverPortrait.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Google GenAI client according to instructions
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback generator in case of network/quota issues or missing key
const FALLBACK_CLASSES = [
  'Mage', 'Rogue', 'Warrior', 'Paladin', 'Ranger',
  'Druid', 'Bard', 'Warlock', 'Cleric', 'Monk', 'Necromancer', 'Artificer'
];
const FALLBACK_NAMES = [
  'Valerius Shadowthorn', 'Lyra Windstrider', 'Balthazar Ironfist', 'Kaelen Sunshard',
  'Seraphina Nightshade', 'Thorgar Deepforge', 'Zephyr Duskveil', 'Astrid Ravenscar',
  'Morwenna Frostwhisper', 'Corvus Dreadmourn', 'Elysia Dawnfire', 'Ignis Embercaller',
  'Sylas Gloomhaven', 'Vespera Moonrune', 'Gideon Crestfallen', 'Rhiannon Wildbloom'
];
const FALLBACK_RACES = ['High Elf', 'Mountain Dwarf', 'Tiefling', 'Dragonborn', 'Human', 'Half-Elf', 'Drow', 'Aasimar', 'Gnome'];
const FALLBACK_TITLES = [
  'Keeper of the Eternal Flame', 'Shadow of the Whisperwood', 'The Unbroken Aegis',
  'Harbinger of the Silver Veil', 'Bane of the Serpent King', 'Watcher of the Starlit Void'
];
const FALLBACK_ABILITIES = [
  { name: 'Arcane Singularity', description: 'Collapses cosmic ether into a gravitational vortex that disorients foes.' },
  { name: 'Shadowmeld Step', description: 'Steps through phase dimensions to appear instantaneously behind targets.' },
  { name: 'Solaris Aegis', description: 'Conjures a radiant barrier of incandescent sunlight that purges dark hexes.' },
  { name: 'Sylvan Gale', description: 'Summons whispering phantom winds that guide projectile strikes.' },
  { name: 'Titan Tremor', description: 'Slams the earth with primordial force, creating a fissure of molten stone.' }
];

function generateFallbackCharacter(excludeNames: string[] = []) {
  const availableNames = FALLBACK_NAMES.filter(n => !excludeNames.includes(n));
  const chosenName = availableNames.length > 0 
    ? availableNames[Math.floor(Math.random() * availableNames.length)]
    : `${FALLBACK_NAMES[Math.floor(Math.random() * FALLBACK_NAMES.length)]} II`;
  
  const chosenClass = FALLBACK_CLASSES[Math.floor(Math.random() * FALLBACK_CLASSES.length)];
  const chosenRace = FALLBACK_RACES[Math.floor(Math.random() * FALLBACK_RACES.length)];
  const chosenTitle = FALLBACK_TITLES[Math.floor(Math.random() * FALLBACK_TITLES.length)];
  const chosenAbility = FALLBACK_ABILITIES[Math.floor(Math.random() * FALLBACK_ABILITIES.length)];

  return {
    name: chosenName,
    class: chosenClass,
    title: chosenTitle,
    race: chosenRace,
    alignment: ['Lawful Good', 'Chaotic Good', 'Neutral Good', 'True Neutral', 'Chaotic Neutral'][Math.floor(Math.random() * 5)],
    backstory: `${chosenName} was bound to an ancient prophecy after discovering an astral rune in the ruins of the Sunken Citadel. Now wandering the realm, they seek to restore balance before the Eclipse of the Seven Moons.`,
    signatureAbility: chosenAbility,
    equipment: 'A weathered celestial astrolabe and a rune-engraved silvered blade',
    stats: {
      strength: 10 + Math.floor(Math.random() * 9),
      dexterity: 10 + Math.floor(Math.random() * 9),
      constitution: 10 + Math.floor(Math.random() * 9),
      intelligence: 10 + Math.floor(Math.random() * 9),
      wisdom: 10 + Math.floor(Math.random() * 9),
      charisma: 10 + Math.floor(Math.random() * 9),
    },
    element: ['Fire', 'Ice', 'Lightning', 'Void', 'Radiant', 'Arcane', 'Nature'][Math.floor(Math.random() * 7)],
    isAiGenerated: false
  };
}

// Character Generation API Endpoint
app.post('/api/character/generate', async (req: Request, res: Response) => {
  const { excludeNames = [], requestedClass, theme } = req.body || {};
  const recentExclusions = Array.isArray(excludeNames) ? excludeNames.slice(-15).join(', ') : '';

  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is not set. Using rich fallback generator.');
    const fallback = generateFallbackCharacter(Array.isArray(excludeNames) ? excludeNames : []);
    return res.json({ character: fallback, notice: 'Generated with realm archives (API key pending in Secrets)' });
  }

  try {
    const genAi = ai || new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are a legendary fantasy master and roleplaying architect.
Create an inventive, distinct, and high-fantasy character.
CRITICAL REQUIREMENTS:
1. Provide a unique, evocative fantasy Name.
2. Provide a clear fantasy Class (such as Mage, Rogue, Warrior, Paladin, Ranger, Cleric, Druid, Bard, Warlock, Monk, Necromancer, Artificer).
${requestedClass ? `The user preferred class category is: ${requestedClass}.` : 'Choose a surprising, flavorful class.'}
${recentExclusions ? `DO NOT duplicate or closely resemble any of these recent characters: ${recentExclusions}. Make this one feel completely fresh.` : ''}
${theme ? `Character aesthetic/vibe hint: ${theme}.` : ''}
Every character must feel deeply textured and distinctive, with high literary quality names (e.g. "Valthea Mistwalker", "Garrick Stoneheart", "Zephyros of the Nine Spires").`;

    const response = await genAi.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 1.05,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "The character's unique fantasy Name (e.g. 'Aeloria Dawnweaver', 'Brom Ironhide'). MUST be labeled Name."
            },
            class: {
              type: Type.STRING,
              description: "The fantasy Class (e.g. 'Mage', 'Rogue', 'Warrior', 'Paladin', 'Ranger', 'Druid', 'Warlock', 'Cleric', 'Bard'). MUST be labeled Class."
            },
            title: {
              type: Type.STRING,
              description: "A grandiose epithet or title, e.g. 'The Ashbound Oracle', 'Blade of the North Star'."
            },
            race: {
              type: Type.STRING,
              description: "Fantasy ancestry/race (e.g. 'High Elf', 'Deep Dwarf', 'Moon Tiefling', 'Celestial Human', 'Silver Dragonborn')."
            },
            alignment: {
              type: Type.STRING,
              description: "Moral alignment, e.g. 'Chaotic Good', 'Lawful Neutral', 'Neutral Good'."
            },
            element: {
              type: Type.STRING,
              description: "Dominant affinity: Fire, Frost, Lightning, Arcane, Shadow, Radiant, Nature, or Void."
            },
            backstory: {
              type: Type.STRING,
              description: "A vivid 2-3 sentence lore narrative snippet."
            },
            signatureAbility: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Name of their signature attack or spell" },
                description: { type: Type.STRING, description: "What this ability does in combat or ritual" },
              },
              required: ["name", "description"]
            },
            equipment: {
              type: Type.STRING,
              description: "Their signature weapon, artifact, armor, or focus"
            },
            stats: {
              type: Type.OBJECT,
              properties: {
                strength: { type: Type.INTEGER, description: "Value 8-20" },
                dexterity: { type: Type.INTEGER, description: "Value 8-20" },
                constitution: { type: Type.INTEGER, description: "Value 8-20" },
                intelligence: { type: Type.INTEGER, description: "Value 8-20" },
                wisdom: { type: Type.INTEGER, description: "Value 8-20" },
                charisma: { type: Type.INTEGER, description: "Value 8-20" },
              },
              required: ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"]
            }
          },
          required: [
            "name",
            "class",
            "title",
            "race",
            "alignment",
            "element",
            "backstory",
            "signatureAbility",
            "equipment",
            "stats"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response text returned from Gemini API.');
    }

    const parsed = JSON.parse(text);
    return res.json({
      character: {
        ...parsed,
        isAiGenerated: true
      }
    });
  } catch (error: any) {
    console.error('Error generating character with Gemini:', error);
    // Return structured error message or fallback with error notice
    const fallback = generateFallbackCharacter(Array.isArray(excludeNames) ? excludeNames : []);
    return res.status(200).json({
      character: fallback,
      warning: `Gemini service notice: ${error.message || 'Temporary connection glitch'}. Displaying an arcane archive character. Click Generate Character to try again!`
    });
  }
});

// Character Portrait Generation API Endpoint
app.post('/api/character/portrait', async (req: Request, res: Response) => {
  const { name = 'Hero', characterClass = 'Adventurer', race = 'Fantasy', isRegenerate = false, variation = 0 } = req.body || {};

  // Build the prompt containing Name and Class explicitly
  const prompt = isRegenerate
    ? `A vibrant alternate cartoon / video game style character portrait bust of ${name}, a legendary ${race} ${characterClass}. Dynamic pose, expressive heroic facial features, colorful video game digital art, stylized hero avatar, detailed fantasy costume and glowing accents, sharp focus, clean background with subtle arcane magic.`
    : `A vibrant cartoon / video game style character portrait bust of ${name}, a legendary ${race} ${characterClass}. Expressive heroic face, detailed fantasy video game concept art, colorful stylized digital illustration, bust portrait, clean vibrant background with subtle mystical glow.`;

  if (process.env.GEMINI_API_KEY) {
    try {
      const genAi = ai || new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      console.log(`Generating portrait for ${name} (${characterClass}) with prompt: "${prompt}"`);

      const response = await genAi.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: prompt,
        config: {
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      });

      let foundImage: string | null = null;
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            foundImage = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (foundImage) {
        return res.json({
          imageUrl: foundImage,
          isAiGenerated: true,
          promptUsed: prompt
        });
      }
    } catch (err: any) {
      console.warn('Gemini image generation attempt failed:', err.message || err);
    }
  }

  // Graceful fallback to custom cartoon / video game SVG avatar
  const fallbackSvg = generateCartoonPortraitSvg(name, characterClass, race, variation);
  return res.json({
    imageUrl: fallbackSvg,
    isAiGenerated: false,
    notice: 'Stylized cartoon portrait crafted by realm artisans.'
  });
});

// Character Backstory Generation API Endpoint (1-2 sentence origin story based on Name and Class)
app.post('/api/character/backstory', async (req: Request, res: Response) => {
  const { name = 'Unknown Adventurer', characterClass = 'Hero', race = '', title = '' } = req.body || {};

  const prompt = `You are a master fantasy chronicler.
Write a unique, compelling, one-to-two-sentence origin story for this fantasy character:
Name: ${name}
Class: ${characterClass}
${race ? `Race: ${race}` : ''}
${title ? `Title: ${title}` : ''}

CRITICAL RULES:
1. Base the origin story directly on their Name and Class.
2. The backstory MUST be strictly one or two sentences long. Never more than two sentences.
3. Make it evocative, dramatic, and memorable.`;

  if (process.env.GEMINI_API_KEY) {
    try {
      const genAi = ai || new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await genAi.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.95,
        },
      });

      const backstory = response.text?.trim();
      if (backstory) {
        return res.json({ backstory, isAiGenerated: true });
      }
    } catch (err: any) {
      console.warn('Gemini backstory generation failed, using archive fallback:', err.message || err);
    }
  }

  // Graceful rich archive fallback
  const fallbackStories = [
    `Orphaned during the Siege of the Ashen Spires, ${name} discovered their true calling as a ${characterClass} after awakening a dormant celestial relic in the family ruins. Now they roam the realm, bound to protect the fragile peace before the moons align once more.`,
    `Before taking up the mantle of a ${characterClass}, ${name} was an archivist in the Sunken Citadel until a forbidden prophecy etched itself onto their soul. Guided by whispers of forgotten gods, they walk between light and shadow to avert the foretold catastrophe.`,
    `Exiled from the High Canopy for challenging the Elder Conclave, ${name} honed their arts as a ${characterClass} in the perilous wilds of the Frostpeaks. With blade and arcane fury, they seek retribution against the ancient cabal that betrayed their kin.`,
    `Bound by an unbroken oath sworn under the Blood Moon, ${name} mastered the mysteries of the ${characterClass} to vanquish the shadow behemoth that consumed their ancestral homeland. Every step they take is measured by the toll of a spectral bell only they can hear.`
  ];
  const chosen = fallbackStories[Math.floor(Math.random() * fallbackStories.length)];
  return res.json({ backstory: chosen, isAiGenerated: false });
});

// Setup Vite or static serving
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fantasy Character Creator server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
