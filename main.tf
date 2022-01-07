terraform {
  required_version = "~> 1.1.2"

  backend "s3" {
    encrypt = true
    key     = "terraform.tfstate"
    region  = "eu-west-1"
  }

  required_providers {
    aws = "~> 3.47"
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = var.tags
  }
}

data "aws_ami" "this" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-impish-21.10-arm64-server-20211211"]
  }
}

resource "aws_iam_role" "this" {
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "this" {
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
  role       = aws_iam_role.this.name
}

resource "aws_iam_instance_profile" "this" {
  role = aws_iam_role.this.name
}

resource "aws_instance" "this" {
  ami                         = data.aws_ami.this.id
  associate_public_ip_address = true
  iam_instance_profile        = aws_iam_instance_profile.this.name
  instance_type               = "t4g.nano"
  key_name                    = aws_key_pair.this.id
  subnet_id                   = aws_subnet.this.id
  user_data                   = file("user_data.sh")
  vpc_security_group_ids      = [aws_security_group.this.id]

  credit_specification {
    cpu_credits = "standard"
  }

  root_block_device {
    encrypted   = false
    volume_size = 8
    volume_type = "gp3"
  }
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
}

resource "aws_key_pair" "this" {
  public_key = var.public_key
}

resource "aws_route_table" "this" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }
}

resource "aws_route_table_association" "this" {
  route_table_id = aws_route_table.this.id
  subnet_id      = aws_subnet.this.id
}

resource "aws_security_group" "this" {
  vpc_id = aws_vpc.this.id

  egress {
    cidr_blocks      = ["0.0.0.0/0"]
    from_port        = 0
    ipv6_cidr_blocks = ["::/0"]
    protocol         = "-1"
    to_port          = 0
  }

  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 22
    protocol    = "tcp"
    to_port     = 22
  }
}

resource "aws_subnet" "this" {
  availability_zone = "${var.region}a"
  cidr_block        = "172.31.0.0/20"
  vpc_id            = aws_vpc.this.id
}

resource "aws_vpc" "this" {
  cidr_block = "172.31.0.0/16"
}
