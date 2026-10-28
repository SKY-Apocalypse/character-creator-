/**
 * Generates high-quality cartoon / video game style SVG character portrait avatars
 * used as an instant, reliable fallback if Gemini image generation key is pending or quota is reached.
 */

export function generateCartoonPortraitSvg(
  name: string,
  charClass: string,
  race: string = '',
  variation: number = 0
): string {
  const normClass = (charClass || '').toLowerCase();
  const normRace = (race || '').toLowerCase();

  // Color palettes per class
  let primaryColor = '#8b5cf6'; // violet
  let secondaryColor = '#3b82f6'; // blue
  let glowColor = '#c084fc';
  let armorColor = '#1e1b4b';
  let accentColor = '#fbbf24';
  let eyeColor = '#38bdf8';
  let hairColor = '#fcd34d';
  let skinTone = '#fed7aa'; // light warm
  let classIconPath = '';

  if (normClass.includes('warrior') || normClass.includes('barbarian')) {
    primaryColor = '#dc2626';
    secondaryColor = '#991b1b';
    glowColor = '#f87171';
    armorColor = '#374151';
    accentColor = '#f59e0b';
    eyeColor = '#fbbf24';
    hairColor = variation % 2 === 0 ? '#78350f' : '#1f2937';
  } else if (normClass.includes('rogue') || normClass.includes('assassin')) {
    primaryColor = '#059669';
    secondaryColor = '#064e3b';
    glowColor = '#34d399';
    armorColor = '#111827';
    accentColor = '#10b981';
    eyeColor = '#10b981';
    hairColor = variation % 2 === 0 ? '#111827' : '#4b5563';
  } else if (normClass.includes('paladin') || normClass.includes('cleric')) {
    primaryColor = '#f59e0b';
    secondaryColor = '#b45309';
    glowColor = '#fde68a';
    armorColor = '#d97706';
    accentColor = '#ffffff';
    eyeColor = '#67e8f9';
    hairColor = variation % 2 === 0 ? '#fef08a' : '#b45309';
  } else if (normClass.includes('ranger') || normClass.includes('druid')) {
    primaryColor = '#16a34a';
    secondaryColor = '#14532d';
    glowColor = '#86efac';
    armorColor = '#78350f';
    accentColor = '#facc15';
    eyeColor = '#4ade80';
    hairColor = variation % 2 === 0 ? '#d97706' : '#15803d';
  } else if (normClass.includes('warlock') || normClass.includes('necromancer')) {
    primaryColor = '#7c3aed';
    secondaryColor = '#31104b';
    glowColor = '#a855f7';
    armorColor = '#09090b';
    accentColor = '#4ade80';
    eyeColor = '#a855f7';
    hairColor = variation % 2 === 0 ? '#e2e8f0' : '#18181b';
  }

  // Adjust for race features
  const isElf = normRace.includes('elf');
  const isTiefling = normRace.includes('tiefling');
  const isDwarf = normRace.includes('dwarf');
  if (isTiefling) {
    skinTone = '#f43f5e'; // crimson/rose
    eyeColor = '#facc15';
  } else if (normRace.includes('drow')) {
    skinTone = '#475569'; // obsidian slate
    hairColor = '#f8fafc';
    eyeColor = '#ec4899';
  }

  // Variation offsets for "Regenerate"
  const tilt = (variation % 3) - 1; // -1, 0, 1
  const bgGradAngle = (variation * 60) % 360;
  const runeScale = 1 + (variation % 3) * 0.1;

  const svg = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="${glowColor}" stop-opacity="0.55"/>
      <stop offset="60%" stop-color="${primaryColor}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="0.95"/>
    </radialGradient>
    <linearGradient id="armorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${armorColor}"/>
      <stop offset="50%" stop-color="${primaryColor}"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="hairGrad" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="${hairColor}"/>
      <stop offset="100%" stop-color="${secondaryColor}"/>
    </linearGradient>
    <filter id="magicGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Deep Arcane Backdrop -->
  <rect width="512" height="512" fill="#030712"/>
  <circle cx="256" cy="240" r="230" fill="url(#bgGlow)"/>

  <!-- Magical Rune Ring -->
  <g transform="translate(256, 240) rotate(${variation * 45}) scale(${runeScale}) translate(-256, -240)" opacity="0.45">
    <circle cx="256" cy="240" r="190" fill="none" stroke="${glowColor}" stroke-width="2" stroke-dasharray="16, 12"/>
    <circle cx="256" cy="240" r="215" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="8, 24"/>
  </g>

  <!-- Shoulders & Video Game Armor Bust -->
  <g transform="translate(${tilt * 6}, 0)">
    <!-- Pauldrons / Armor Backing -->
    <path d="M 120 480 Q 256 420 392 480 L 440 512 L 72 512 Z" fill="url(#armorGrad)" stroke="${accentColor}" stroke-width="2"/>
    
    <!-- Left Pauldron -->
    <path d="M 80 430 Q 130 380 180 440 L 150 490 L 70 470 Z" fill="url(#armorGrad)" stroke="${accentColor}" stroke-width="2.5"/>
    <circle cx="125" cy="435" r="10" fill="${accentColor}" opacity="0.8"/>

    <!-- Right Pauldron -->
    <path d="M 432 430 Q 382 380 332 440 L 362 490 L 442 470 Z" fill="url(#armorGrad)" stroke="${accentColor}" stroke-width="2.5"/>
    <circle cx="387" cy="435" r="10" fill="${accentColor}" opacity="0.8"/>

    <!-- Collar / Cloak Mantle -->
    <path d="M 170 380 Q 256 420 342 380 L 330 450 Q 256 480 182 450 Z" fill="${armorColor}" stroke="${accentColor}" stroke-width="2"/>
    <!-- Crest Medallion -->
    <polygon points="256,410 275,435 256,460 237,435" fill="${accentColor}" filter="url(#magicGlow)"/>
  </g>

  <!-- Neck -->
  <rect x="230" y="320" width="52" height="70" rx="8" fill="${skinTone}"/>

  <!-- Cartoon Head / Jaw -->
  <g transform="translate(${tilt * 4}, 0)">
    <path d="M 176 220 Q 170 340 256 360 Q 342 340 336 220 Q 330 150 256 150 Q 182 150 176 220 Z" fill="${skinTone}"/>

    ${isElf ? `
      <!-- Elf Pointed Ears -->
      <polygon points="160,230 120,180 180,210" fill="${skinTone}" stroke="${skinTone}" stroke-width="2"/>
      <polygon points="352,230 392,180 332,210" fill="${skinTone}" stroke="${skinTone}" stroke-width="2"/>
    ` : `
      <!-- Rounded Ears -->
      <circle cx="170" cy="245" r="16" fill="${skinTone}"/>
      <circle cx="342" cy="245" r="16" fill="${skinTone}"/>
    `}

    ${isTiefling ? `
      <!-- Tiefling Horns -->
      <path d="M 190 170 Q 150 100 130 50 Q 170 90 200 140 Z" fill="#450a0a" stroke="${accentColor}" stroke-width="1.5"/>
      <path d="M 322 170 Q 362 100 382 50 Q 342 90 312 140 Z" fill="#450a0a" stroke="${accentColor}" stroke-width="1.5"/>
    ` : ''}

    <!-- Expressive Cartoon Hair (Front / Crest) -->
    <path d="M 150 200 Q 256 100 362 200 Q 380 140 350 110 Q 256 70 162 110 Q 132 140 150 200 Z" fill="url(#hairGrad)"/>
    <path d="M 210 130 Q 256 170 302 130 Q 270 190 240 185 Z" fill="${hairColor}"/>

    <!-- Eyebrows -->
    <path d="M 195 220 Q 220 ${210 - tilt * 3} 235 220" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <path d="M 317 220 Q 292 ${210 + tilt * 3} 277 220" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round" fill="none"/>

    <!-- Large Video Game Cartoon Eyes -->
    <g>
      <!-- Sclera -->
      <ellipse cx="218" cy="240" rx="18" ry="14" fill="#ffffff"/>
      <ellipse cx="294" cy="240" rx="18" ry="14" fill="#ffffff"/>

      <!-- Glowing Irises -->
      <circle cx="${218 + tilt * 2}" cy="240" r="10" fill="${eyeColor}" filter="url(#magicGlow)"/>
      <circle cx="${294 + tilt * 2}" cy="240" r="10" fill="${eyeColor}" filter="url(#magicGlow)"/>

      <!-- Pupils -->
      <circle cx="${218 + tilt * 2}" cy="240" r="5" fill="#09090b"/>
      <circle cx="${294 + tilt * 2}" cy="240" r="5" fill="#09090b"/>

      <!-- Catchlight highlights -->
      <circle cx="${215 + tilt * 2}" cy="236" r="3" fill="#ffffff"/>
      <circle cx="${291 + tilt * 2}" cy="236" r="3" fill="#ffffff"/>
      <circle cx="${221 + tilt * 2}" cy="243" r="1.5" fill="#ffffff"/>
      <circle cx="${297 + tilt * 2}" cy="243" r="1.5" fill="#ffffff"/>
    </g>

    <!-- Stylized Nose -->
    <path d="M 256 250 L 252 275 L 260 275" stroke="#9a3412" stroke-width="2.5" fill="none" stroke-linecap="round"/>

    <!-- Confident Heroic Smile / Mouth -->
    <path d="M 235 305 Q 256 ${318 + (variation % 2) * 4} 277 305" stroke="#7f1d1d" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    
    ${isDwarf ? `
      <!-- Dwarf Braided Beard -->
      <path d="M 190 320 Q 256 450 322 320 Q 290 440 256 460 Q 222 440 190 320 Z" fill="url(#hairGrad)" stroke="${accentColor}" stroke-width="1.5"/>
    ` : ''}
  </g>

  <!-- Floating Arcane Particles -->
  <circle cx="90" cy="120" r="4" fill="${glowColor}" filter="url(#magicGlow)" opacity="0.8"/>
  <circle cx="420" cy="140" r="5" fill="${accentColor}" filter="url(#magicGlow)" opacity="0.85"/>
  <circle cx="80" cy="300" r="3" fill="${glowColor}" filter="url(#magicGlow)" opacity="0.6"/>
  <circle cx="430" cy="320" r="4" fill="${accentColor}" filter="url(#magicGlow)" opacity="0.7"/>

  <!-- Ornate Frame Corner Accents -->
  <path d="M 20 50 L 20 20 L 50 20" stroke="${accentColor}" stroke-width="3" fill="none"/>
  <path d="M 462 20 L 492 20 L 492 50" stroke="${accentColor}" stroke-width="3" fill="none"/>
  <path d="M 20 462 L 20 492 L 50 492" stroke="${accentColor}" stroke-width="3" fill="none"/>
  <path d="M 492 462 L 492 492 L 462 492" stroke="${accentColor}" stroke-width="3" fill="none"/>

  <!-- Bottom Title Tag -->
  <g transform="translate(256, 485)">
    <rect x="-180" y="-18" width="360" height="28" rx="6" fill="#020617" fill-opacity="0.85" stroke="${accentColor}" stroke-width="1"/>
    <text x="0" y="2" font-family="'Cinzel', Georgia, serif" font-size="12" font-weight="bold" fill="#fef08a" text-anchor="middle" letter-spacing="1">
      ${escapeXml(name)} • ${escapeXml(charClass)}
    </text>
  </g>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return (unsafe || '').replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
