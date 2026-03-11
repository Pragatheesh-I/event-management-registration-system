import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";

export async function getSecret(secretName: string) {
  const vaultName = "events-kv-unique123";
  const url = `https://events-kv-unique123.vault.azure.net/`;
  
  // Uses environment variables (AZURE_CLIENT_ID, etc.) or Managed Identity
  const credential = new DefaultAzureCredential();
  const client = new SecretClient(url, credential);

  const secret = await client.getSecret(secretName);
  console.log("Secret Value:", secret.value);
  return secret.value;
}
