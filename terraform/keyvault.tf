data "azurerm_client_config" "current" {}
 
resource "azurerm_key_vault" "main" {
  name                        = "${var.prefix}-kv-unique123"
  location                    = azurerm_resource_group.main.location
  resource_group_name         = azurerm_resource_group.main.name
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  sku_name                    = "standard"
  network_acls {
    default_action             = "Deny"                         # block everything by default
    bypass                     = "AzureServices"               # allow trusted MS services if needed
    virtual_network_subnet_ids = [azurerm_subnet.main.id]      # only this subnet can connect
  }
}
 
resource "azurerm_key_vault_access_policy" "vm_policy" {
  key_vault_id = azurerm_key_vault.main.id

  tenant_id = data.azurerm_client_config.current.tenant_id
  object_id = azurerm_linux_virtual_machine.main.identity[0].principal_id

  secret_permissions = [
    "Get",
    "List"
  ]
}

resource "azurerm_key_vault_access_policy" "user_policy" {
  key_vault_id = azurerm_key_vault.main.id

  tenant_id = data.azurerm_client_config.current.tenant_id
  object_id = data.azurerm_client_config.current.object_id

  secret_permissions = [
    "Get",
    "List",
    "Set",
    "Delete",
    "Purge",
    "Recover"
  ]
}