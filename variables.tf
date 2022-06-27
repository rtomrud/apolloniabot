variable "app" {
  description = "The name of the app."
  type        = string
  default     = "apolloniabot"
}

variable "image" {
  description = "The Docker image of the app."
  type        = string
  default     = "rtomrud/apolloniabot:latest"
}

variable "region" {
  description = "The AWS region."
  type        = string
}

variable "tags" {
  description = "The AWS tags common to all resources."
  type        = map(string)
  default     = {}
}

variable "token" {
  description = "The token of the Discord bot."
  type        = string
  sensitive   = true
}
