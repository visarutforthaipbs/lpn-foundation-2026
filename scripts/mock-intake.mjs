// Dev-only mock of the intake API contract (intake/docs/API.md) on :3100.
// Copied from right-guide/scripts/mock-intake.mjs; adds the website dev origin :3002.
// Usage: node scripts/mock-intake.mjs   (then NEXT_PUBLIC_INTAKE_URL=http://localhost:3100)
import http from "node:http";

const PORT = Number(process.env.PORT || 3100);
const CODE = "K7Q2M9XD";
const STAGE = process.env.MOCK_STAGE || "reviewing";
const LABELS = { th: "เจ้าหน้าที่กำลังตรวจสอบ", my: "ဝန်ထမ်းစိစစ်နေသည်", km: "បុគ្គលិកកំពុងពិនិត្យ", en: "Being reviewed" };
const ORIGINS = new Set(["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]);

const server = http.createServer((req, res) => {
  const origin = req.headers.origin;
  if (origin && ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.writeHead(204).end();

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const json = (status, body) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(body));
  };

  if (req.method === "POST" && (url.pathname === "/api/intake/voice" || url.pathname === "/api/intake/form")) {
    let bytes = 0;
    req.on("data", (c) => (bytes += c.length));
    req.on("end", () => {
      console.log(`${url.pathname} ${bytes} bytes ${req.headers["content-type"]}`);
      json(201, { tracking_code: CODE });
    });
    return;
  }
  if (req.method === "GET" && url.pathname === "/api/track") {
    const code = (url.searchParams.get("code") || "").toUpperCase();
    const lang = url.searchParams.get("lang") || "th";
    if (code === "RATE4290") return json(429, { error: "rate_limited" });
    if (code !== CODE) return json(404, { error: "not_found" });
    return json(200, { stage: STAGE, label: LABELS[lang] ?? LABELS.th, updated_at: new Date().toISOString() });
  }
  if (url.pathname === "/api/health") return json(200, { ok: true, db: true, redis: true, ai_node: "ok", version: "mock" });
  json(404, { error: "not_found" });
});

server.listen(PORT, () => console.log(`mock intake API on http://localhost:${PORT} (code ${CODE}, stage ${STAGE})`));
