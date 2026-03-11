import { SecretClient } from "@azure/keyvault-secrets"
import { DefaultAzureCredential } from "@azure/identity"

export async function loadSecrets() {
  const credential = new DefaultAzureCredential()

  const vaultName = process.env.KEYVAULT_NAME
  const url = `https://events-kv-unique123.vault.azure.net/`

  const client = new SecretClient(url, credential)

  const jwtSecret = await client.getSecret("JWT-SECRET")
  const dbUrl = await client.getSecret("DATABASE-URL")

  process.env.JWT_SECRET = jwtSecret.value
  process.env.DATABASE_URL = dbUrl.value
}