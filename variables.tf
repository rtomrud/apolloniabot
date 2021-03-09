variable "region" {
  description = "The AWS region."
  type        = string
}

variable "tags" {
  description = "The AWS tags common to all resources."
  type        = map(string)
  default     = {}
}
