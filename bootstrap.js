import { loadSecrets } from "./src/lib/loadSecrets.js"

async function start() {
  await loadSecrets()
  process.argv.push("start")  // tells next to run `next start`
  await import("next/dist/bin/next")
}

start()
