import { UserData, CalculationResult } from '../types';

const QUOTES_LOW = [
  "Monk Mode Activated 🙏",
  "You're either lying or an enlightened spirit.",
  "Spiritual energy detected. You're too pure for this app. 🧘‍♂️",
  "You're a rare species in this digital age. Touch some grass anyway.",
  "Built different. Literal self-control king or just a slow starter.",
  "Are you okay? How is this level of control even possible? 😂",
  "Legendary discipline. Your ancestors are proud.",
  "Respect... absolute control mode unlocked. Teach us your ways.",
  "Future world leader vibes with this insane discipline.",
  "Your willpower is actually terrifying. Are you a robot? 🏅"
];

const QUOTES_MID = [
  "Not bad, not legendary… just average and stable. 😎",
  "A perfectly balanced human. Kind of boring, but okay.",
  "You're normal… or a very good liar. 😂",
  "Respectable discipline. Society might actually accept you.",
  "God made you well-calibrated. Not a freak, not a saint.",
  "You do the deed, but you also touch grass occasionally. 🌱",
  "The middle path. Safest player in the game.",
  "Perfectly balanced, as all things should be. Perfectly mid.",
  "Respectable stats. You're a casual player in a pro league.",
  "Stable like a 9-to-5. No surprises here. ✅"
];

const QUOTES_HIGH = [
  "You've wasted enough soldiers to conquer the Milky Way. 💀",
  "Certified Menace to Society. Please stay inside. ⚠️",
  "Your keyboard is probably crying for help. 😭",
  "The dopamine receptors are just decorative at this point. 🤯",
  "A biological miracle. How are you still standing? 🫡",
  "Elite soldier of degeneracy. You're a hall of famer. 🏆",
  "Your history logs are a war zone. 🚩",
  "Bro, the local power grid spikes when you're bored. ⚡",
  "You've populated three different galaxies in another dimension. 🌌",
  "Legendary status. Not for the right reasons, but still legendary. 🤴"
];

/**
 * Deterministic pseudo-random jitter based on input data.
 * Adds 0% to 3% variation for realism without being completely random on re-submits with same data.
 */
const getRealismJitter = (data: UserData): number => {
  const seed = `${data.age}-${data.gender}-${data.startingAgeRange}-${data.currentFreq}-${data.longestStreak}-${data.peakFreqLevel}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  // Returns a value between 1.00 and 1.03
  return 1 + (Math.abs(hash % 31) / 1000);
};

export const calculateResults = (data: UserData): CalculationResult => {
  // Fresh calculation triggered
  console.debug("[PapCounter] Initializing dynamic recalculation for:", data.age, data.gender);

  // 1. Determine Starting Age
  const startingAgeMap: Record<string, number> = {
    '10–11': 10.7,
    '12–13': 12.8,
    '14–15': 14.6,
    '16+': 17.2
  };
  const startingAge = startingAgeMap[data.startingAgeRange] || 13.5;

  // 2. Frequency Logic (Sessions Per Week)
  const peakFreqMap: Record<string, number> = {
    '2–3 times': 2.6,
    '4–6 times': 5.2,
    '7–10 times': 8.8,
    '10+ (beast mode 😭)': 13.7
  };
  const peakFreq = peakFreqMap[data.peakFreqLevel] || 5.0;
  const currentFreq = data.currentFreq;

  // 3. Durations (Years)
  const totalActiveYears = Math.max(0.2, data.age - startingAge);
  // Define peak duration based on the window between peakStart and peakEnd
  let peakDuration = Math.max(0, data.peakEndAge - data.peakStartAge);
  // Constrain peak to be no more than the actual total years active
  peakDuration = Math.min(totalActiveYears, peakDuration);
  const normalDuration = Math.max(0, totalActiveYears - peakDuration);

  // 4. Base Calculation (Weeks per year roughly 52.14)
  const WEEKS_PER_YEAR = 52.143;
  const peakCount = peakDuration * WEEKS_PER_YEAR * peakFreq;
  const normalCount = normalDuration * WEEKS_PER_YEAR * currentFreq;

  // 5. Additive Modifiers
  // Demon mode addition (Multi-day sessions)
  const multiAdditions = data.multiDayActive ? (data.multiDayCount * 2.3) : 0;

  // Stress Phase Booster (Multiplies total density)
  const stressMultipliers: Record<string, number> = {
    'Nope, normal life': 1.0,
    'Few stress phases': 1.12,
    'Many stress phases': 1.24,
    'Bro I lived in chaos 💀': 1.42
  };
  const stressFactor = stressMultipliers[data.stressPhaseBoosterLevel] || 1.0;

  // 6. Subtractive Modifiers (Deductions for discipline and breaks)
  // Relationship deduction (Assuming ~45% reduction in solo activity during relationship months)
  const relationshipWeeks = (data.relationshipImpactMonths || 0) * 4.33;
  const relDeduction = relationshipWeeks * currentFreq * 0.45;

  // NoFap breaks deduction
  const breakDaysMap: Record<string, number> = {
    'Hardly any breaks (0–50 days)': 20,
    'Few breaks (50–150 days)': 100,
    'Quite a lot (150–300 days)': 220,
    'Legendary Monk (300+ days)': 500
  };
  const totalBreakDays = breakDaysMap[data.noFapBreaksRange] || 0;
  const avgDailyFreq = ((peakFreq + currentFreq) / 2) / 7;
  const noFapDeduction = totalBreakDays * avgDailyFreq;

  // Longest streak "discipline reward" (deducts potential sessions from lifetime count)
  const disciplineReward = data.longestStreak * avgDailyFreq * 1.2;

  // 7. Final Summation
  let totalRaw = (peakCount + normalCount + multiAdditions) * stressFactor;
  totalRaw = totalRaw - relDeduction - noFapDeduction - disciplineReward;

  // Apply Realistic Jitter (2-3%)
  const jitter = getRealismJitter(data);
  const finalCount = Math.max(0, Math.round(totalRaw * jitter));

  console.debug("[PapCounter] Calculation Detailed Breakdown:", {
    totalYears: totalActiveYears.toFixed(2),
    peakContribution: Math.round(peakCount),
    normalContribution: Math.round(normalCount),
    stressFactor,
    relDeduction: Math.round(relDeduction),
    noFapDeduction: Math.round(noFapDeduction),
    finalResult: finalCount
  });

  // 8. Meta Data & Ranking
  let rank = "";
  let rankBadge = "";
  let rankColor = "";
  let quote = "";
  let comparisonPercent = 0;

  if (finalCount >= 2200) {
    rank = "Danger to Civilisation";
    rankBadge = "👺";
    rankColor = "text-red-600 font-black";
    quote = QUOTES_HIGH[Math.floor(Math.random() * QUOTES_HIGH.length)];
    comparisonPercent = Math.min(99, 92 + Math.floor((finalCount - 2200) / 200));
  } else if (finalCount >= 1200) {
    rank = "Elite Grinder";
    rankBadge = "🫡";
    rankColor = "text-pink-600 font-black";
    quote = QUOTES_HIGH[Math.floor(Math.random() * QUOTES_HIGH.length)];
    comparisonPercent = 75 + Math.floor((finalCount - 1200) / 40);
  } else if (finalCount >= 500) {
    rank = "Active Soldier";
    rankBadge = "🪖";
    rankColor = "text-orange-500 font-black";
    quote = QUOTES_MID[Math.floor(Math.random() * QUOTES_MID.length)];
    comparisonPercent = 40 + Math.floor((finalCount - 500) / 10);
  } else if (finalCount >= 150) {
    rank = "Casual Explorer";
    rankBadge = "🎒";
    rankColor = "text-yellow-500 font-black";
    quote = QUOTES_MID[Math.floor(Math.random() * QUOTES_MID.length)];
    comparisonPercent = 15 + Math.floor((finalCount - 150) / 10);
  } else {
    rank = "Zen Master";
    rankBadge = "🧘‍♂️";
    rankColor = "text-green-500 font-black";
    quote = QUOTES_LOW[Math.floor(Math.random() * QUOTES_LOW.length)];
    comparisonPercent = Math.max(1, Math.floor(finalCount / 10));
  }

  // 9. Biological & Comparison Stats
  const spermPerEjac = 280000000; // ~280 Million average
  const totalSperm = finalCount * spermPerEjac;
  const spermBillions = totalSperm / 1000000000;
  const potentialBabiesWasted = spermBillions.toFixed(1) + " BILLION";

  const gapDaysValue = currentFreq > 0 ? parseFloat((7 / currentFreq).toFixed(1)) : 14;

  return {
    lifetimeCount: finalCount,
    rank,
    rankBadge,
    rankColor,
    quote,
    comparisonPercent,
    potentialBabiesWasted,
    activeYears: Math.round(totalActiveYears),
    gapDays: gapDaysValue,
    peakYears: Math.round(peakDuration),
    peakCount: Math.round(peakCount),
    normalYears: Math.round(normalDuration),
    normalCount: Math.round(normalCount),
    averageGapDays: gapDaysValue,
    totalSpermBillions: parseFloat(spermBillions.toFixed(1)),
    startingAge,
    peakFrequency: peakFreq
  };
};
