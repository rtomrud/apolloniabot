terraform {
  required_version = "~> 0.15"
  required_providers {
    aws = "~> 3.42"
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
    values = ["ubuntu/images/hvm-ssd/ubuntu-hirsute-21.04-arm64-server-*"]
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
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC/aaEqAq2Xrz9ptch1vEWhL2a/erYpbI41aYnM5OoP2sus1x+fEaakzmxaIwzGiXFeUOYJJkwZ/eWrr83wgSvSW74DQK7Axj9YA+ElNRSyJ0bUKlux4lBvCMT5jhEB8fVkBJtlZjBWK/4H0u5yad8E5ssC5A5K46dcqB8pas78J4wC6Qi0rXbS6yH9aopq9VMeIwGKm29e62/n1thVCWSEe1e0UUWBeoOW06GiGZreZBKNJCF32qpUSjG7pEQX9YIwYIsIDDqgIkaeU0CbcdAvOCcLPzLO6lou080zevGcKaYvWyvEUgemHbuxS/oj+WYDE6Ho3fn6vflqOJTQQ1NgEuEKfpFS1JTPvYMkKZbaoeoSxVQrfF0CR7s7nH2Te88uwfY2eyEH4opxiWb8+AoXnbGwvJA80FbI7h0MR+vpJ0Nk5zl2Cp8k/ybmymw6EV1mjMitGNVVEe2mZA9kCnz1Y/t2dXFhElwVmOk6stactfcUqnFUQMj8tEnosKIuRqM= dev@desktop"
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
apt install -y ffmpeg
apt install -y build-essential
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
nvm install --lts
EOF
  vpc_security_group_ids = [aws_security_group.this.id]
  tags                   = var.tags
}
