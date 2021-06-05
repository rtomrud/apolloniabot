terraform {
  required_version = "~> 0.15"
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

resource "aws_lightsail_instance" "this" {
  name              = "${var.tags.project}-0"
  availability_zone = "${var.region}a"
  blueprint_id      = "ubuntu_20_04"
  bundle_id         = "nano_2_0"
  tags              = var.tags
}
