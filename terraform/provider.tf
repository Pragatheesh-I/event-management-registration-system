terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.1"
    }
  }

  backend "azurerm" {
    key                  = "terraform.tfstate"
    container_name       = "event-container"
    storage_account_name = "stateterrastore"
    resource_group_name  = "terra_blob"
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}