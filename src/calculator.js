import { TARIFF_RATES } from "./tariffs.js";

/**
 * Menghitung rincian tagihan berdasarkan total kWh.
 */
export function calculateBillFromKwh(kwh, tariffKey = "R1_1300", ppjPercent = 3) {
  if (typeof kwh !== "number" || Number.isNaN(kwh) || kwh < 0) {
    throw new Error("Pemakaian kWh harus berupa angka positif atau nol");
  }
  if (typeof ppjPercent !== "number" || ppjPercent < 0 || ppjPercent > 20) {
    throw new Error("Persentase PPJ harus berada di antara 0% hingga 20%");
  }

  const tariff = TARIFF_RATES[tariffKey];
  if (!tariff) {
    throw new Error(`Golongan tarif '${tariffKey}' tidak ditemukan`);
  }

  const baseCost = kwh * tariff.rate;
  const ppjCost = baseCost * (ppjPercent / 100);
  const adminFee = kwh > 0 ? 3000 : 0;
  const totalCost = Math.round(baseCost + ppjCost + adminFee);

  return {
    kwh: Number(kwh.toFixed(2)),
    tariffName: tariff.name,
    vaCapacity: tariff.va,
    ratePerKwh: tariff.rate,
    baseCost: Math.round(baseCost),
    ppjCost: Math.round(ppjCost),
    adminFee,
    totalCost,
    isHighUsage: kwh > tariff.maxRecommendedKwh,
  };
}

/**
 * Menghitung estimasi pemakaian & biaya dari daftar peralatan listrik.
 */
export function estimateFromAppliances(appliances, tariffKey = "R1_1300", ppjPercent = 3) {
  if (!Array.isArray(appliances)) {
    throw new Error("Daftar peralatan harus berupa array");
  }

  const tariff = TARIFF_RATES[tariffKey];
  if (!tariff) {
    throw new Error(`Golongan tarif '${tariffKey}' tidak ditemukan`);
  }

  let totalKwh = 0;
  let peakSimultaneousWatt = 0;

  const breakdown = appliances.map((item, idx) => {
    const watt = Number(item.watt);
    const hoursPerDay = Number(item.hoursPerDay);
    const qty = Number(item.qty ?? 1);
    const daysPerMonth = Number(item.daysPerMonth ?? 30);

    if (watt < 0 || hoursPerDay < 0 || hoursPerDay > 24 || qty < 0 || daysPerMonth < 1 || daysPerMonth > 31) {
      throw new Error(`Data tidak valid pada peralatan '${item.name || idx + 1}'`);
    }

    const itemTotalWatt = watt * qty;
    const monthlyKwh = (itemTotalWatt * hoursPerDay * daysPerMonth) / 1000;
    const monthlyCost = Math.round(monthlyKwh * tariff.rate);

    totalKwh += monthlyKwh;
    peakSimultaneousWatt += itemTotalWatt;

    return {
      name: item.name || `Peralatan #${idx + 1}`,
      watt,
      qty,
      hoursPerDay,
      daysPerMonth,
      monthlyKwh: Number(monthlyKwh.toFixed(2)),
      monthlyCost,
    };
  });

  // Hitung persentase kontribusi & urutkan dari yang paling boros
  const sortedBreakdown = breakdown
    .map((b) => ({
      ...b,
      sharePercent: totalKwh > 0 ? Number(((b.monthlyKwh / totalKwh) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.monthlyKwh - a.monthlyKwh);

  const summary = calculateBillFromKwh(totalKwh, tariffKey, ppjPercent);

  return {
    summary,
    analytics: {
      peakSimultaneousWatt,
      isOverloadRisk: peakSimultaneousWatt > tariff.va,
      topConsumer: sortedBreakdown.length > 0 && totalKwh > 0 ? sortedBreakdown[0] : null,
    },
    breakdown: sortedBreakdown,
  };
}