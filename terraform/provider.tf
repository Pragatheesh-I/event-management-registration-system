terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=4.1.0"
    }
  }
  backend "azurerm" {
    key="terraform.tfstate"
    container_name="event-container"
    storage_account_name="stateterrastore"
    resource_group_name="terra_blob"
  }
}

provider "azurerm" {
features {}
subscription_id = "c6ac2517-bec2-4531-adb0-989c7a285da7"
}