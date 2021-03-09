terraform {
  required_version = "~> 0.14"
  required_providers {
    aws = "~> 3.27"
  }
  backend "s3" {
    key     = "terraform.tfstate"
    region  = "eu-west-1"
    encrypt = true
  }
}

provider "aws" {
  region = var.region
}
