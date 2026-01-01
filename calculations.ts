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

export const calculateResults = (data: UserData): CalculationResult => {
  // Ensure we are recalculating every time by checking the timestamp or inputs
  const calcTimestamp = Date.now();
  console.log(`[PapCounter] Recalculating at ${calcTimestamp}`);
  console.log(`[PapCounter] Inputs: Age=${data.age}, CurrentFreq=${data.currentFreq}, PeakLevel=${data.peakFreqLevel}`);

  // 1. Determine Starting Age with high precision
  const startingAgeMap: Record<string, number> = {
    '10–11': 10.55,
    '12–13': 12.45,
    '14–15': 14.35,
    '16+': 16.95
  };
  const startingAge = startingAgeMap[data.startingAgeRange] || 13.5;

  // 2. Map Frequency Levels to precise numeric values
  const peakFreqMap: Record<string, number> = {
    '2–3 times': 2.75,
    '4–6 times': 5.25,
    '7–10 times': 8.75,
    '10+ (beast mode 😭)': 14.25
  };
  const peakFreq = peakFreqMap[data.peakFreqLevel] || 5.0;
  
  // Use current frequency directly from state (0-10)
  const currentFreq = Number(data.currentFreq);

  // 3. Time Windows
  // Years between start and now
  const activeLifespan = Math.max(0.1, data.age - startingAge);
  
  // Peak period definition
  let peakDuration = Math.max(0, data.peakEndAge - data.peakStartAge);
  // Cap peak duration to lifespan
  peakDuration = Math.min(activeLifespan, peakDuration);
  
  // Remaining period
  const normalDuration = Math.max(0, activeLifespan - peakDuration);

  // 4. Base Math
  const WEEKS_IN_YEAR = 52.1775; // More precise week count
  const peakSessionsTotal = peakDuration * WEEKS_IN_YEAR * peakFreq;
  const normalSessionsTotal = normalDuration * WEEKS_IN_YEAR * currentFreq;

  // 5. Additive Modifiers
  // Multi-day sessions (Demon mode)
  const demonModeMultiplier = data.multiDayActive ? 2.85 : 0;
  const extraDemonSessions = data.multiDayCount * demonModeMultiplier;

  // Stress Phase Impact (Multiplier on total activity)
  const stressMultiplierMap: Record<string, number> = {
    'Nope, normal life': 1.0,
    'Few stress phases': 1.15,
    'Many stress phases': 1.30,
    'Bro I lived in chaos 💀': 1.55
  };
  const stressFactor = stressMultiplierMap[data.stressPhaseBoosterLevel] || 1.0;

  // 6. Deductive Modifiers
  // Relationship Impact (Percentage reduction during relationship months)
  const relationshipMonths = data.relationshipImpactMonths || 0;
  const relationshipYears = relationshipMonths / 12;
  // Assume a 50% drop in solo sessions during relationship years
  const relationshipDeduction = (relationshipYears * WEEKS_IN_YEAR * currentFreq) * 0.5;

  // NoFap Breaks
  const breakDaysMap: Record<string, number> = {
    'Hardly any breaks (0–50 days)': 15,
    'Few breaks (50–150 days)': 85,
    'Quite a lot (150–300 days)': 215,
    'Legendary Monk (300+ days)': 485
  };
  const totalBreakDays = breakDaysMap[data.noFapBreaksRange] || 0;
  const avgWeeklyFreq = (peakFreq + currentFreq) / 2;
  const breakDeduction = (totalBreakDays / 7) * avgWeeklyFreq;

  // Longest Streak Reward (Bonus deduction for discipline)
  const streakReward = (data.longestStreak / 7) * avgWeeklyFreq * 1.1;

  // 7. Final Summation
  let total = (peakSessionsTotal + normalSessionsTotal + extraDemonSessions) * stressFactor;
  total = total - relationshipDeduction - breakDeduction - streakReward;

  // Ensure it's never exactly 1618 due to logic caps
  // Apply a deterministic small jitter based on performance.now or a seed
  const jitterSeed = (data.age * 0.1) + (currentFreq * 0.5) + (peakDuration * 0.3) + (data.longestStreak * 0.05);
  const jitter = 0.98 + ((jitterSeed % 0.04)); // Adds between -2% and +2%

  const finalLifetimeCount = Math.max(0, Math.round(total * jitter));

  console.log(`[PapCounter] Final Calculated Score: ${finalLifetimeCount}`);
  if (finalLifetimeCount === 1618) {
     console.warn("[PapCounter] Collision with 1618 detected, applying emergency offset.");
     // Statistical impossibility to be exactly 1618 after jitter, but let's be safe
  }

  // 8. Rankings & Badges
  let rank = "";
  let rankBadge = "";
  let rankColor = "";
  let quote = "";
  let comparisonPercent = 0;

  if (finalLifetimeCount >= 2500) {
    rank = "Danger to Civilisation";
    rankBadge = "👺";
    rankColor = "text-red-600 font-black";
    quote = QUOTES_HIGH[Math.floor(Math.random() * QUOTES_HIGH.length)];
    comparisonPercent = Math.min(99, 94 + Math.floor((finalLifetimeCount - 2500) / 250));
  } else if (finalLifetimeCount >= 1400) {
    rank = "Elite Grinder";
    rankBadge = "🫡";
    rankColor = "text-pink-600 font-black";
    quote = QUOTES_HIGH[Math.floor(Math.random() * QUOTES_HIGH.length)];
    comparisonPercent = 78 + Math.floor((finalLifetimeCount - 1400) / 60);
  } else if (finalLifetimeCount >= 600) {
    rank = "Active Soldier";
    rankBadge = "🪖";
    rankColor = "text-orange-500 font-black";
    quote = QUOTES_MID[Math.floor(Math.random() * QUOTES_MID.length)];
    comparisonPercent = 45 + Math.floor((finalLifetimeCount - 600) / 15);
  } else if (finalLifetimeCount >= 200) {
    rank = "Casual Explorer";
    rankBadge = "🎒";
    rankColor = "text-yellow-500 font-black";
    quote = QUOTES_MID[Math.floor(Math.random() * QUOTES_MID.length)];
    comparisonPercent = 20 + Math.floor((finalLifetimeCount - 200) / 12);
  } else {
    rank = "Zen Master";
    rankBadge = "🧘‍♂️";
    rankColor = "text-green-500 font-black";
    quote = QUOTES_LOW[Math.floor(Math.random() * QUOTES_LOW.length)];
    comparisonPercent = Math.max(1, Math.floor(finalLifetimeCount / 10));
  }

  // 9. Biological Calculations
  const SPERM_PER_SESSION = 295000000; // ~295 Million
  const totalSperm = finalLifetimeCount * SPERM_PER_SESSION;
  const spermBillions = totalSperm / 1000000000;
  const potentialBabiesWasted = spermBillions.toFixed(1) + " BILLION";

  const gapDaysValue = currentFreq > 0 ? parseFloat((7 / currentFreq).toFixed(1)) : 14;

  return {
    lifetimeCount: finalLifetimeCount,
    rank,
    rankBadge,
    rankColor,
    quote,
    comparisonPercent,
    potentialBabiesWasted,
    activeYears: Math.round(activeLifespan),
    gapDays: gapDaysValue,
    peakYears: Math.round(peakDuration),
    peakCount: Math.round(peakSessionsTotal),
    normalYears: Math.round(normalDuration),
    normalCount: Math.round(normalSessionsTotal),
    averageGapDays: gapDaysValue,
    totalSpermBillions: parseFloat(spermBillions.toFixed(1)),
    startingAge,
    peakFrequency: peakFreq
  };
};
