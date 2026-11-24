import { describe, expect, test } from "bun:test";
import { calculateBillFromKwh, estimateFromAppliances } from "../src/calculator.js";

describe("Unit Test - Kalkulator & Estimator Peralatan", () => {
  test("Menghitung akumulasi peralatan dan mengurutkan top consumer", () => {
    const items = [
      { name: "Lampu", watt: 10, hoursPerDay: 10, qty: 2, daysPerMonth: 30 }, // 6 kWh
      { name: "AC", watt: 500, hoursPerDay: 8, qty: 1, daysPerMonth: 30 },   // 120 kWh
    ];

    const res = estimateFromAppliances(items, "R1_1300", 3);
    expect(res.summary.kwh).toBe(126);
    expect(res.analytics.topConsumer.name).toBe("AC");
    expect(res.breakdown[0].sharePercent).toBe(95.2);
  });

  test("Mendeteksi risiko overload jika total watt melebihi kapasitas VA", () => {
    const heavyItems = [
      { name: "Water Heater", watt: 1200, hoursPerDay: 1, qty: 1, daysPerMonth: 30 },
    ];
    const res = estimateFromAppliances(heavyItems, "R1_900", 3);
    expect(res.analytics.isOverloadRisk).toBe(true);
  });

  test("Menolak input jam pemakaian lebih dari 24 jam sehari", () => {
    const invalidItems = [
      { name: "Kulkas", watt: 100, hoursPerDay: 25, qty: 1, daysPerMonth: 30 },
    ];
    expect(() => estimateFromAppliances(invalidItems, "R1_1300")).toThrow();
  });
});