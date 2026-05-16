const USERS = {
  admin: "private ai",
  user: "user123",
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const { username, password } = req.body;

  if (USERS[username] && USERS[username] === password) {
    return res.json({ ok: true });
  }

  return res.json({ ok: false, message: "Invalid credentials" });
}