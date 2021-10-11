variable "public_key" {
  description = "The public key used to SSH into the EC2 instance."
  type        = string
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
