variable "aws_region" {
  description = "The AWS region."
  type        = string
}

variable "aws_tags" {
  description = "The AWS tags common to all resources."
  type        = map(string)
  default     = {}
}

variable "cluster" {
  description = "The name of the ECS cluster."
  type        = string
  default     = "apolloniabot"
}

variable "image" {
  description = "The Docker image."
  type        = string
  default     = "rtomrud/apolloniabot"
}

variable "service" {
  description = "The name of the ECS service."
  type        = string
  default     = "apolloniabot"
}

variable "token" {
  description = "The token of the Discord bot."
  type        = string
  sensitive   = true
}
