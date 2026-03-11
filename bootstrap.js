import { loadSecrets } from "./src/lib/loadSecrets.js"
import { execSync } from "child_process"

async function start() {
  await loadSecrets()
    // Run migrations before starting the app
  console.log("Running database migrations...")
  execSync("npx prisma migrate deploy", { stdio: "inherit" })
  console.log("Migrations complete.")
  process.argv.push("start")  // tells next to run `next start`
  await import("next/dist/bin/next")
}

start()
