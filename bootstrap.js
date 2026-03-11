import { loadSecrets } from "./src/lib/loadSecrets.js"
import { execSync } from "child_process"

async function start() {
  await loadSecrets()
  
  console.log("Running database migrations...")
  execSync("npx prisma migrate deploy", { 
    stdio: "inherit",
    env: process.env  // explicitly pass updated env with DATABASE_URL
  })
  console.log("Migrations complete.")

  process.argv.push("start")
  await import("next/dist/bin/next")
}

start()
