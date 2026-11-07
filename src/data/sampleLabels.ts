import { SampleLabel } from '../types';

// Helper to create an SVG Data URL representing a realistic pesticide or seed packet label
function createLabelSvg(options: {
  title: string;
  subtitle: string;
  category: string;
  regNo: string;
  batchNo: string;
  mfgDate: string;
  expDate: string;
  bandColor: 'red' | 'yellow' | 'blue' | 'green';
  cautionWord: string;
  toxicSymbol: string;
  composition: string;
  dosage: string;
  antidote: string;
  warningText: string;
  isBlurry?: boolean;
}): string {
  const {
    title,
    subtitle,
    category,
    regNo,
    batchNo,
    mfgDate,
    expDate,
    bandColor,
    cautionWord,
    toxicSymbol,
    composition,
    dosage,
    antidote,
    warningText,
    isBlurry = false,
  } = options;

  const bandColors = {
    red: '#dc2626',
    yellow: '#eab308',
    blue: '#2563eb',
    green: '#16a34a',
  };

  const selectedColor = bandColors[bandColor];

  const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <filter id="blurFilter" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="${isBlurry ? '5.5' : '0'}" />
    </filter>
    <linearGradient id="canisterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="20%" stop-color="#f8fafc"/>
      <stop offset="80%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
  </defs>

  <!-- Background / Canister Surface -->
  <rect width="800" height="1000" fill="url(#canisterGrad)" stroke="#cbd5e1" stroke-width="6"/>

  <g filter="${isBlurry ? 'url(#blurFilter)' : 'none'}">
    <!-- Header Banner -->
    <rect x="20" y="20" width="760" height="110" rx="8" fill="#14532d"/>
    <text x="400" y="65" font-family="Arial, sans-serif" font-size="28" font-weight="900" fill="#facc15" text-anchor="middle" letter-spacing="1.5">
      KisanSuraksha Certified Agro-Chemicals
    </text>
    <text x="400" y="100" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">
      GOVERNMENT APPROVED FORMULATION • CIB&amp;RC REGISTERED
    </text>

    <!-- Product Identity Box -->
    <rect x="40" y="150" width="720" height="140" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
    <text x="60" y="195" font-family="Arial, sans-serif" font-size="36" font-weight="900" fill="#0f172a">
      ${title}
    </text>
    <text x="60" y="230" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#047857">
      ${subtitle}
    </text>
    <text x="60" y="265" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#475569">
      CATEGORY: <tspan fill="#1e293b">${category.toUpperCase()}</tspan> | REG NO: <tspan fill="#1e293b">${regNo}</tspan>
    </text>

    <!-- Toxicity Triangle Band (Indian Statutory Diamond Scheme) -->
    <rect x="40" y="310" width="720" height="160" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
    
    <!-- Split Triangle/Diamond -->
    <polygon points="120,440 220,330 320,440" fill="${selectedColor}" stroke="#1e293b" stroke-width="2"/>
    <polygon points="120,440 220,440 220,330" fill="${selectedColor}"/>
    <polygon points="220,330 220,440 320,440" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
    <text x="270" y="415" font-family="Arial, sans-serif" font-size="22" font-weight="900" fill="#1e293b" text-anchor="middle">
      ${toxicSymbol}
    </text>

    <text x="350" y="360" font-family="Arial, sans-serif" font-size="26" font-weight="900" fill="${selectedColor}">
      ${cautionWord.toUpperCase()} / విషం / जहर
    </text>
    <text x="350" y="395" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#334155">
      TOXICITY CLASSIFICATION: ${bandColor.toUpperCase()} LABEL
    </text>
    <text x="350" y="425" font-family="Arial, sans-serif" font-size="14" fill="#64748b">
      KEEP OUT OF REACH OF CHILDREN AND DOMESTIC ANIMALS
    </text>

    <!-- Composition & Recommended Dosage Details -->
    <rect x="40" y="490" width="720" height="190" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="60" y="525" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#0f172a">
      CHEMICAL COMPOSITION &amp; ACTIVE INGREDIENTS:
    </text>
    <text x="60" y="555" font-family="Arial, sans-serif" font-size="15" fill="#334155">
      ${composition}
    </text>
    <line x1="60" y1="575" x2="720" y2="575" stroke="#cbd5e1" stroke-width="1.5"/>

    <text x="60" y="605" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#0f172a">
      RECOMMENDED CROPS &amp; DOSAGE (As per Official Label):
    </text>
    <text x="60" y="635" font-family="Arial, sans-serif" font-size="15" font-weight="600" fill="#166534">
      ${dosage}
    </text>
    <text x="60" y="660" font-family="Arial, sans-serif" font-size="14" fill="#475569">
      Water requirement: 150-200 Litres/Acre depending upon knapsack sprayer nozzle.
    </text>

    <!-- Precautions, First Aid & Antidote -->
    <rect x="40" y="700" width="720" height="150" rx="8" fill="#fffbeb" stroke="#fcd34d" stroke-width="2"/>
    <text x="60" y="730" font-family="Arial, sans-serif" font-size="16" font-weight="900" fill="#b45309">
      ⚠️ PRECAUTIONS &amp; MANDATORY PROTECTIVE GEAR (PPE):
    </text>
    <text x="60" y="755" font-family="Arial, sans-serif" font-size="14" fill="#78350f">
      ${warningText}
    </text>
    <text x="60" y="790" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#0f172a">
      FIRST AID &amp; ANTIDOTE:
    </text>
    <text x="60" y="815" font-family="Arial, sans-serif" font-size="14" fill="#1e293b">
      ${antidote}
    </text>

    <!-- Batch, Expiry & Barcode Section -->
    <rect x="40" y="870" width="720" height="95" rx="8" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="60" y="900" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#0f172a">
      Batch No: <tspan font-weight="normal" fill="#334155">${batchNo}</tspan> | Mfg Date: <tspan font-weight="normal" fill="#334155">${mfgDate}</tspan>
    </text>
    <text x="60" y="930" font-family="Arial, sans-serif" font-size="16" font-weight="900" fill="${expDate.includes('2024') ? '#dc2626' : '#0f172a'}">
      Expiry Date: ${expDate}
    </text>

    <!-- Barcode simulation -->
    <rect x="520" y="885" width="220" height="40" fill="#1e293b"/>
    <line x1="530" y1="885" x2="530" y2="925" stroke="#ffffff" stroke-width="3"/>
    <line x1="540" y1="885" x2="540" y2="925" stroke="#ffffff" stroke-width="5"/>
    <line x1="555" y1="885" x2="555" y2="925" stroke="#ffffff" stroke-width="2"/>
    <line x1="570" y1="885" x2="570" y2="925" stroke="#ffffff" stroke-width="6"/>
    <line x1="590" y1="885" x2="590" y2="925" stroke="#ffffff" stroke-width="3"/>
    <line x1="610" y1="885" x2="610" y2="925" stroke="#ffffff" stroke-width="4"/>
    <line x1="630" y1="885" x2="630" y2="925" stroke="#ffffff" stroke-width="7"/>
    <line x1="655" y1="885" x2="655" y2="925" stroke="#ffffff" stroke-width="2"/>
    <line x1="675" y1="885" x2="675" y2="925" stroke="#ffffff" stroke-width="5"/>
    <line x1="700" y1="885" x2="700" y2="925" stroke="#ffffff" stroke-width="4"/>
    <text x="630" y="948" font-family="Courier, monospace" font-size="12" font-weight="bold" fill="#475569" text-anchor="middle">
      *CIB-RC-VERIFIED*
    </text>
  </g>
</svg>
`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export const SAMPLE_LABELS: SampleLabel[] = [
  {
    id: 'sample-1',
    name: 'Chlorpyrifos 20% EC',
    type: 'Insecticide (Organophosphate)',
    description: 'Broad spectrum insecticide for paddy stem borer, cotton bollworm, and soil termites. High toxicity Yellow Band.',
    toxicityBand: 'Yellow',
    imageUrl: createLabelSvg({
      title: 'CHLORPYRIFOS 20% EC',
      subtitle: 'Organophosphate Insecticide - Broad Spectrum',
      category: 'Insecticide',
      regNo: 'CIR-4521/2018-Chlorpyrifos(EC)-1042',
      batchNo: 'CP20-HYD-9812',
      mfgDate: '10/2025',
      expDate: '09/2027 (Valid)',
      bandColor: 'yellow',
      cautionWord: 'POISON - HIGHLY TOXIC',
      toxicSymbol: '☠',
      composition: 'Chlorpyrifos a.i. 20.00% w/w, Emulsifier blend 6.00% w/w, Solvent aromax Q.S.',
      dosage: 'Paddy: 2.5 to 3.0 ml/litre of water (500 ml/acre). Cotton: 3 ml/litre.',
      antidote: 'Administer Atropine Sulphate (2 to 4 mg IV) repeated every 10 min. 2-PAM can be given.',
      warningText: 'Wear nitrile rubber gloves, full face mask, and rubber boots. DO NOT spray against the wind.',
    }),
    barcode: '8901234567890',
  },
  {
    id: 'sample-2',
    name: 'Coragen (Chlorantraniliprole 18.5% SC)',
    type: 'Modern Diamide Insecticide',
    description: 'Eco-safe anthranilic diamide for Lepidopteran caterpillars and stem borer. Green Band (Slightly Toxic / Safe for honeybees).',
    toxicityBand: 'Green',
    imageUrl: createLabelSvg({
      title: 'CORAGEN 18.5% SC',
      subtitle: 'Anthranilic Diamide Insecticide',
      category: 'Insecticide',
      regNo: 'CIR-6102/2019-Chlorantraniliprole(SC)-883',
      batchNo: 'CG-FMC-7741',
      mfgDate: '01/2026',
      expDate: '12/2028 (Valid)',
      bandColor: 'green',
      cautionWord: 'CAUTION - SLIGHTLY TOXIC',
      toxicSymbol: '✓',
      composition: 'Chlorantraniliprole a.i. 18.50% w/w (200 g/l), Inactive co-formulants 81.50% w/w',
      dosage: 'Paddy & Sugarcane: 0.3 to 0.4 ml/litre of water (60 ml per acre in 200 Litres water).',
      antidote: 'No specific antidote known. Treat symptomatically with activated charcoal slurry.',
      warningText: 'Wear protective apron and face shield. Safe for beneficial predatory insects when used at label dose.',
    }),
    barcode: '8909876543210',
  },
  {
    id: 'sample-3',
    name: 'Mancozeb 75% WP',
    type: 'Contact Fungicide (Dithiocarbamate)',
    description: 'Broad spectrum contact protective fungicide for tomato late blight, potato blight, and chilli leaf spots. Blue Band.',
    toxicityBand: 'Blue',
    imageUrl: createLabelSvg({
      title: 'MANCOZEB 75% WP',
      subtitle: 'Broad-Spectrum Protective Contact Fungicide',
      category: 'Fungicide',
      regNo: 'CIR-2219/2016-Mancozeb(WP)-412',
      batchNo: 'MZ75-UPL-3310',
      mfgDate: '11/2025',
      expDate: '10/2027 (Valid)',
      bandColor: 'blue',
      cautionWord: 'DANGER - MODERATELY TOXIC',
      toxicSymbol: '▲',
      composition: 'Mancozeb a.i. 75.00% w/w, Wetting and dispersing adjuvant agents 25.00% w/w',
      dosage: 'Tomato & Potato: 2.0 to 2.5 grams per litre of water (600 to 800 grams per acre).',
      antidote: 'Gastric lavage with 5% sodium bicarbonate solution. Symptomatic supportive care.',
      warningText: 'Avoid contact with skin and eyes. Do not breathe dust powder. Wash hands with soap after mixing.',
    }),
    barcode: '8904561237890',
  },
  {
    id: 'sample-4',
    name: 'Bollgard II Hybrid Cotton Seed (BG-II)',
    type: 'Certified Transgenic Seed Packet',
    description: 'Genetically modified BG-II hybrid cotton seed packet with non-Bt refuge pack. Poisonous seed treatment warning.',
    toxicityBand: 'Green',
    imageUrl: createLabelSvg({
      title: 'BOLLGARD-II HYBRID COTTON SEED',
      subtitle: 'Certified Transgenic Cotton Seed with Cry1Ac & Cry2Ab',
      category: 'Seed',
      regNo: 'GEAC/CS-450-Cotton/2022',
      batchNo: 'BG2-RASI-2026',
      mfgDate: '02/2026',
      expDate: '01/2027 (Seed Germination Viability Period: 9 Mos)',
      bandColor: 'green',
      cautionWord: 'CAUTION - TREATED POISONOUS SEED',
      toxicSymbol: '🌱',
      composition: 'Certified BG-II 450 grams + Non-Bt Refuge 120 grams. Genetic purity min 90%, Germination min 75%.',
      dosage: 'Sowing rate: 1 packet per 0.5 acre. Spacing 90 cm x 60 cm. Plant refuge seeds in 5 outer border rows.',
      antidote: 'Seeds treated with Thiram fungicide & Imidacloprid. DO NOT EAT OR FEED TO ANIMALS.',
      warningText: 'Wash hands thoroughly after handling treated seeds. Do not use empty bags for storing food grains.',
    }),
    barcode: '8903334445551',
  },
  {
    id: 'sample-5',
    name: 'Challenging / Blurry & Damaged Label',
    type: 'Stress Test: Blur, Torn Expiry & Glare',
    description: 'Simulates a real-world field condition: curved bottle with glare, motion blur, and torn expiry date to trigger safety gates!',
    toxicityBand: 'Red',
    isChallenging: true,
    challengeReason: 'Simulates low lighting, motion blur, and torn dosage field to test Safety Gate & Retake Guidance',
    imageUrl: createLabelSvg({
      title: 'PHORATE 10% CG (GRANULES)',
      subtitle: 'Systemic Soil Insecticide - Extremely Hazardous',
      category: 'Insecticide',
      regNo: 'CIR-1090/2012-Phorate(CG)-...',
      batchNo: 'PH10-TORN-???',
      mfgDate: '04/2023',
      expDate: '03/2025 [EXPIRED & TORN]',
      bandColor: 'red',
      cautionWord: 'POISON - EXTREMELY TOXIC',
      toxicSymbol: '☠',
      composition: 'Phorate a.i. 10.00% w/w, Granular carrier clay 90.00% [PARTIALLY TORN]',
      dosage: 'Dosage: [SMUDGED / UNREADABLE ON THIS LABEL - DO NOT GUESS]',
      antidote: 'Atropine Sulfate in high doses. Consult doctor IMMEDIATELY.',
      warningText: 'EXTREMELY DANGEROUS TO HUMANS AND BIRDS. NEVER APPLY BY BARE HANDS.',
      isBlurry: true,
    }),
    barcode: '8907778889999',
  },
];
