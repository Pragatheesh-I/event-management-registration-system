import { loadSecrets } from "./src/lib/loadSecrets.js"
import { spawnSync } from "child_process"

async function start() {
  try {
    await loadSecrets()
    console.log("Secrets loaded successfully.")
    console.log("DATABASE_URL set:", !!process.env.DATABASE_URL)
  } catch (err) {
    console.error("Failed to load secrets:", err)
    process.exit(1)
  }

  console.log("Running database migrations...")
  const result = spawnSync("npx", ["prisma", "migrate", "deploy"], { 
    stdio: "inherit",
    env: { ...process.env },  // spread to ensure full copy
    shell: true
  })

  if (result.status !== 0) {
    console.error("Migration failed with status:", result.status)
    process.exit(1)
  }

  console.log("Migrations complete.")
  process.argv.push("start")
  await import("next/dist/bin/next")
}

start()
