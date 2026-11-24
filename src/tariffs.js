export const TARIFF_RATES = {
  R1_900: { name: "R-1/TR 900 VA-RTM", va: 900, rate: 1352, maxRecommendedKwh: 200 },
  R1_1300: { name: "R-1/TR 1.300 VA", va: 1300, rate: 1444.70, maxRecommendedKwh: 350 },
  R1_2200: { name: "R-1/TR 2.200 VA", va: 2200, rate: 1444.70, maxRecommendedKwh: 600 },
  R2_3500: { name: "R-2/TR 3.500 - 5.500 VA", va: 3500, rate: 1699.53, maxRecommendedKwh: 1200 },
  R3_6600: { name: "R-3/TR > 6.600 VA", va: 6600, rate: 1699.53, maxRecommendedKwh: 2500 },
};

export const DEFAULT_APPLIANCES = [
  { id: "ac-1", name: "AC 1/2 PK Inverter", watt: 350, hoursPerDay: 8, qty: 1, daysPerMonth: 30 },
  { id: "kulkas-1", name: "Kulkas 2 Pintu", watt: 120, hoursPerDay: 24, qty: 1, daysPerMonth: 30 },
  { id: "lampu-1", name: "Lampu LED Rumah", watt: 12, hoursPerDay: 12, qty: 8, daysPerMonth: 30 },
  { id: "tv-1", name: "Smart TV 43 Inch", watt: 85, hoursPerDay: 5, qty: 1, daysPerMonth: 30 },
  { id: "mesin-cuci", name: "Mesin Cuci Top Load", watt: 350, hoursPerDay: 1, qty: 1, daysPerMonth: 15 },
];