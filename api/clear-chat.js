export default function handler(req, res) {
  return res.json({
    ok: true,
    message: "Chat cleared (frontend handles memory)",
  });
}