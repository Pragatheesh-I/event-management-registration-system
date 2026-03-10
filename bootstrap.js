import { loadSecrets } from "./src/lib/loadSecrets.js"

async function start() {
  await loadSecrets()

  await import("next/dist/bin/next")
}

start()