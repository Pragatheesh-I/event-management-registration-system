variable "prefix" {
  default = "events"
}

variable "location" {
  default = "Central India"
}

variable "subscription_id" {
  default = "c6ac2517-bec2-4531-adb0-989c7a285da7"
}

variable "admin_username" {
  default = "azureuser"
}

variable "admin_password" {
  sensitive = true
}