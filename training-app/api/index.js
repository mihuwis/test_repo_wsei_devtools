const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

// Compose będzie dawał nam taki connection string:
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Missing DATABASE_URL env var");
  process.exit(1);
}

const pool = new Pool({ connectionString });

// Init bazy: jedna tabelka i jeden rekord (id=1)
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS stats (
      id INT PRIMARY KEY,
      successful_sessions INT NOT NULL
    );
  `);

  await pool.query(`
    INSERT INTO stats (id, successful_sessions)
    VALUES (1, 0)
    ON CONFLICT (id) DO NOTHING;
  `);
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/stats", async (req, res) => {
  try {
    const result = await pool.query("SELECT successful_sessions FROM stats WHERE id=1;");
    res.json({ successfulSessions: result.rows[0].successful_sessions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db_error" });
  }
});

app.post("/api/sessions", async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE stats
      SET successful_sessions = successful_sessions + 1
      WHERE id=1
      RETURNING successful_sessions;
    `);
    res.json({ successfulSessions: result.rows[0].successful_sessions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db_error" });
  }
});

initDb()
  .then(() => {
    app.listen(port, () => console.log(`API listening on port ${port}`));
  })
  .catch((err) => {
    console.error("DB init failed:", err);
    process.exit(1);
  });
