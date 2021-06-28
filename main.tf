terraform {
  required_version = "~> 1.0.0"
  required_providers {
    aws = "~> 3.47"
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

data "aws_ami" "this" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-hirsute-21.04-arm64-server-20210622.1"]
  }
  owners = ["099720109477"] # Canonical
}

resource "aws_vpc" "this" {
  cidr_block = "172.31.0.0/16"
  tags       = var.tags
}

resource "aws_subnet" "this" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "172.31.0.0/20"
  availability_zone = "${var.region}a"
  tags              = var.tags
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
}

resource "aws_route_table" "this" {
  vpc_id = aws_vpc.this.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }
}

resource "aws_route_table_association" "this" {
  subnet_id      = aws_subnet.this.id
  route_table_id = aws_route_table.this.id
}

resource "aws_security_group" "this" {
  egress {
    from_port        = 0
    to_port          = 0
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
    protocol         = "-1"
  }
  ingress {
    from_port   = 22
    to_port     = 22
    cidr_blocks = ["0.0.0.0/0"]
    protocol    = "tcp"
  }
  vpc_id = aws_vpc.this.id
}

resource "aws_key_pair" "this" {
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCnyZ+jDRfHk7M4s61n+kPAfc5+LmNWD8yxdV0bWEs4yy6csprLph18TRr2T4zwoJG7B/HxBUdoBvuycLPksh9VGvmTPcQlDMDb8HHCInsYpF9HjyqkND+GYmJma5YlO2XXo5fXDJedtBMdDJMk0e2uM7D8qM1Z6hVy0vZF8GJ4Ar2V0/8M+dM8c/UINx03aTSk7eU/w/vC22mB4CZVrSlM3NoQUESKfjWFaXnMpldqxHKgUIeKFdo9HpfP0HUc5ortfJU7DLEhy56FTTaWcnDBqgXLq5B8382HrK+5tBWe6hjz2YWVJN1CGIHruG2JOKJEAmtH2Qpeal20o1h8sA0R6s4z4ibncEkEwj4hvRU/wuzhE40/y6neBH3Hmu0P467lRHRa26879PlBqZqrwUfdA7mM9U4hVT/8fKjswvVkZOY5GBU8rPsRNL6KvwLa738XXDuypA49hawUGF0Qt3So2FQpya6ZqQFiTi+hTgsKjTtUvUrx1mWUUUfBGQcKduU= dev@desktop"
}

resource "aws_instance" "this" {
  ami                         = data.aws_ami.this.id
  associate_public_ip_address = true
  credit_specification { cpu_credits = "standard" }
  instance_type          = "t4g.micro"
  key_name               = aws_key_pair.this.id
  subnet_id              = aws_subnet.this.id
  user_data              = <<EOF
#!/bin/bash
apt update
apt upgrade -y
apt install -y ffmpeg
apt install -y build-essential
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt install -y nodejs
EOF
  vpc_security_group_ids = [aws_security_group.this.id]
  tags                   = var.tags
}
