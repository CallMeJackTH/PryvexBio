
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const adminToken = process.env.PRYVEX_DONATE_ADMIN_TOKEN;
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");

  if (!adminToken) {
    return res.status(503).json({
      error: "Missing PRYVEX_DONATE_ADMIN_TOKEN"
    });
  }

  if (!token || token !== adminToken) {
    return res.status(401).json({
      error: "Unauthorized",
      detail: "รหัสแอดมินไม่ถูกต้อง"
    });
  }

  const apiKey = process.env.EASYDONATE_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      error: "Missing EASYDONATE_API_KEY"
    });
  }

  try {
    const response = await fetch(
      "https://easydonate.app/api/v1/donations?page=1",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json"
        },
        signal: AbortSignal.timeout(15000)
      }
    );

    const raw = await response.text();
    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }

    if (!response.ok) {
      return res.status(502).json({
        error: "EasyDonate API error",
        upstreamStatus: response.status,
        detail:
          data?.message ||
          data?.error ||
          (response.status === 401
            ? "API Key ไม่ถูกต้องหรือหมดอายุ"
            : response.status === 403
            ? "ไม่มีสิทธิ์ใช้งาน API"
            : response.status === 404
            ? "ไม่พบ API endpoint"
            : "EasyDonate ปฏิเสธคำขอ")
      });
    }

    if (data === null) {
      return res.status(502).json({
        error: "Invalid API response",
        detail: "EasyDonate ไม่ได้ส่ง JSON ที่ถูกต้อง"
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({
      error: "Could not reach EasyDonate API",
      detail: "เชื่อมต่อไม่ได้หรือหมดเวลารอ API"
    });
  }
}
