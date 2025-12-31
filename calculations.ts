
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
  // 1. Determine Starting Age
  const startingAgeMap: Record<string, number> = {
    '10–11': 10.5,
    '12–13': 12.5,
    '14–15': 14.5,
    '16+': 17
  };
  const startingAge = startingAgeMap[data.startingAgeRange] || 13;

  // 2. Determine Frequencies (Sessions per week)
  const peakFreqMap: Record<string, number> = {
    '2–3 times': 2.5,
    '4–6 times': 5,
    '7–10 times': 8.5,
    '10+ (beast mode 😭)': 13
  };
  const peakFreq = peakFreqMap[data.peakFreqLevel] || 5;
  const currentFreq = data.currentFreq;

  // 3. Durations
  const totalActiveYears = Math.max(0, data.age - startingAge);
  const peakDuration = Math.min(totalActiveYears, Math.max(0, data.peakEndAge - data.peakStartAge));
  const normalDuration = Math.max(0, totalActiveYears - peakDuration);

  // 4. Base Counts
  const peakCount = peakDuration * 52 * peakFreq;
  const normalCount = normalDuration * 52 * currentFreq;

  // 5. Multi-Day "Demon Mode" Additions
  // Assume each demon mode day adds ~2.5 extra sessions on average
  const multiAdditions = data.multiDayActive ? data.multiDayCount * 2.5 : 0;

  // 6. Stress Boosters
  // Map level to extra sessions per week for a fraction of the active time
  const stressMultiplierMap: Record<string, number> = {
    'Nope, normal life': 0,
    'Few stress phases': 0.1, // 10% of time boosted
    'Many stress phases': 0.2, // 20% of time boosted
    'Bro I lived in chaos 💀': 0.35 // 35% of time boosted
  };
  const stressImpact = (peakCount + normalCount) * (stressMultiplierMap[data.stressPhaseBoosterLevel] || 0);

  // 7. Deductions
  // Relationship Impact: Assume 40% reduction in solo sessions during relationship time
  const relationshipWeeks = (data.relationshipImpactMonths / 12) * 52;
  const avgFreq = (peakFreq + currentFreq) / 2;
  const relationshipDeduction = relationshipWeeks * avgFreq * 0.4;

  // NoFap Breaks
  const noFapDaysMap: Record<string, number> = {
    'Hardly any breaks (0–50 days)': 25,
    'Few breaks (50–150 days)': 100,
    'Quite a lot (150–300 days)': 225,
    'Legendary Monk (300+ days)': 450
  };
  const totalBreakDays = noFapDaysMap[data.noFapBreaksRange] || 0;
  const sessionsPerDayAvg = (avgFreq / 7);
  const noFapDeduction = totalBreakDays * sessionsPerDayAvg;

  // 8. Final Sum
  let total = peakCount + normalCount + multiAdditions + stressImpact - relationshipDeduction - noFapDeduction;
  const finalCount = Math.max(0, Math.round(total));

  // 9. Determine Rank & Meta Data
  let rank = "";
  let rankBadge = "";
  let rankColor = "";
  let quote = "";
  let comparisonPercent = 0;

  if (finalCount >= 1500) {
    rank = "Menace to Society";
    rankBadge = "💀";
    rankColor = "text-red-500 font-black";
    quote = QUOTES_HIGH[Math.floor(Math.random() * QUOTES_HIGH.length)];
    // Bell curve calculation for comparison: 
    // 1500 is roughly 80th percentile for the "active" population
    comparisonPercent = Math.min(99, 80 + Math.floor((finalCount - 1500) / 100));
  } else if (finalCount >= 800) {
    rank = "Elite Grinder";
    rankBadge = "🫡";
    rankColor = "text-pink-500 font-black";
    quote = QUOTES_HIGH[Math.floor(Math.random() * QUOTES_HIGH.length)];
    comparisonPercent = 60 + Math.floor((finalCount - 800) / 17);
  } else if (finalCount >= 400) {
    rank = "Balanced Human";
    rankBadge = "✅";
    rankColor = "text-yellow-500 font-black";
    quote = QUOTES_MID[Math.floor(Math.random() * QUOTES_MID.length)];
    comparisonPercent = 30 + Math.floor((finalCount - 400) / 13);
  } else {
    rank = "Monk Candidate";
    rankBadge = "🧘‍♂️";
    rankColor = "text-green-500 font-black";
    quote = QUOTES_LOW[Math.floor(Math.random() * QUOTES_LOW.length)];
    comparisonPercent = Math.max(1, Math.floor(finalCount / 14));
  }

  // 10. Biological Stats
  const spermPerEjac = 300000000; // 300 Million
  const totalSperm = finalCount * spermPerEjac;
  const spermBillions = (totalSperm / 1000000000);
  const potentialBabiesWasted = spermBillions.toFixed(1) + " BILLION";

  // 11. Consistency Stats
  const gapDaysValue = currentFreq > 0 ? parseFloat((7 / currentFreq).toFixed(1)) : 7;

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
