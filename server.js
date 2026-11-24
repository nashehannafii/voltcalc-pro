import { calculateBillFromKwh, estimateFromAppliances } from "./src/calculator.js";
import { TARIFF_RATES, DEFAULT_APPLIANCES } from "./src/tariffs.js";

export function createServer(port = process.env.PORT || 3000) {
  return Bun.serve({
    port,
    async fetch(req) {
      const url = new URL(req.url);

      // 1. Inisialisasi data tarif & preset peralatan
      if (url.pathname === "/api/init" && req.method === "GET") {
        return Response.json({
          tariffs: TARIFF_RATES,
          defaultAppliances: DEFAULT_APPLIANCES,
        });
      }

      // 2. Hitung berdasarkan input kWh langsung
      if (url.pathname === "/api/calculate-kwh" && req.method === "POST") {
        try {
          const body = await req.json();
          const result = calculateBillFromKwh(
            Number(body.kwh),
            body.tariffKey,
            Number(body.ppjPercent ?? 3)
          );
          return Response.json({ success: true, data: result });
        } catch (err) {
          return Response.json({ success: false, error: err.message }, { status: 400 });
        }
      }

      // 3. Hitung berdasarkan simulasi daftar peralatan listrik
      if (url.pathname === "/api/estimate-appliances" && req.method === "POST") {
        try {
          const body = await req.json();
          const result = estimateFromAppliances(
            body.appliances,
            body.tariffKey,
            Number(body.ppjPercent ?? 3)
          );
          return Response.json({ success: true, data: result });
        } catch (err) {
          return Response.json({ success: false, error: err.message }, { status: 400 });
        }
      }

      // 4. Sajikan Frontend
      if (url.pathname === "/" || url.pathname === "/index.html") {
        return new Response(Bun.file("./public/index.html"), {
          headers: { "Content-Type": "text/html" },
        });
      }

      return new Response("Not Found", { status: 404 });
    },
  });
}

if (import.meta.main) {
  const server = createServer();
  console.log(`⚡ VoltCalc Pro berjalan di http://localhost:${server.port}`);
}