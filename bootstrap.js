import { loadSecrets } from "./src/lib/loadSecrets.js"
import { execSync } from "child_process"

async function start() {
  try {
    await loadSecrets()
    console.log("Secrets loaded successfully.")
    console.log("DATABASE_URL set:", !!process.env.DATABASE_URL) // logs true/false
  } catch (err) {
    console.error("Failed to load secrets:", err)
    process.exit(1)
  }

  console.log("Running database migrations...")
  execSync("npx prisma migrate deploy", { 
    stdio: "inherit",
    env: process.env
  })
  console.log("Migrations complete.")

  process.argv.push("start")
  await import("next/dist/bin/next")
}

start()
