terraform {
  required_version = "~> 1.2"

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
  region = var.aws_region

  default_tags {
    tags = var.aws_tags
  }
}

resource "aws_appautoscaling_target" "this" {
  max_capacity       = 2
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.this.name}/${aws_ecs_service.this.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "this" {
  name               = "cpu-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.this.resource_id
  scalable_dimension = aws_appautoscaling_target.this.scalable_dimension
  service_namespace  = aws_appautoscaling_target.this.service_namespace

  target_tracking_scaling_policy_configuration {
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
    target_value       = 80

    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
  }
}

resource "aws_cloudwatch_log_group" "this" {
  name = var.cluster

  # lifecycle {
  #   prevent_destroy = true
  # }
}

resource "aws_ecs_cluster" "this" {
  name = var.cluster
}

resource "aws_ecs_service" "this" {
  cluster         = aws_ecs_cluster.this.id
  desired_count   = 1
  launch_type     = "FARGATE"
  name            = var.service
  task_definition = aws_ecs_task_definition.this.arn

  network_configuration {
    assign_public_ip = true
    security_groups  = [aws_security_group.this.id]
    subnets          = aws_subnet.this.*.id
  }

  lifecycle {
    ignore_changes = [desired_count, task_definition]
  }
}

resource "aws_ecs_task_definition" "this" {
  container_definitions = jsonencode([
    {
      image = var.image
      name  = "app"
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.this.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
      secrets = [
        {
          name      = "TOKEN"
          valueFrom = aws_ssm_parameter.token.arn
        }
      ]
    }
  ])
  cpu                      = "256"
  execution_role_arn       = aws_iam_role.task_execution.arn
  family                   = var.service
  memory                   = "512"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  runtime_platform {
    cpu_architecture        = "ARM64"
    operating_system_family = "LINUX"
  }
}

data "aws_iam_policy" "amazon_ecs_task_execution_role_policy" {
  name = "AmazonECSTaskExecutionRolePolicy"
}

data "aws_kms_alias" "ssm" {
  name = "alias/aws/ssm"
}

resource "aws_iam_role" "task_execution" {
  assume_role_policy = jsonencode({
    Statement = {
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }
    Version = "2012-10-17"
  })
  managed_policy_arns = [
    data.aws_iam_policy.amazon_ecs_task_execution_role_policy.arn
  ]
  name_prefix = "${var.service}-task-execution"

  inline_policy {
    name = "${var.service}-task-execution"
    policy = jsonencode({
      Statement = [
        {
          Action   = "kms:Decrypt"
          Effect   = "Allow"
          Resource = data.aws_kms_alias.ssm.arn
        },
        {
          Action   = "ssm:GetParameters"
          Effect   = "Allow"
          Resource = aws_ssm_parameter.token.arn
        }
      ]
      Version = "2012-10-17"
    })
  }
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
}

resource "aws_main_route_table_association" "this" {
  route_table_id = aws_route_table.this.id
  vpc_id         = aws_vpc.this.id
}

resource "aws_route_table" "this" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }

  route {
    gateway_id      = aws_internet_gateway.this.id
    ipv6_cidr_block = "::/0"
  }
}

resource "aws_route_table_association" "this" {
  count = length(aws_subnet.this.*)

  route_table_id = aws_route_table.this.id
  subnet_id      = aws_subnet.this[count.index].id
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
}

resource "aws_ssm_parameter" "token" {
  name  = "/discord/token"
  type  = "SecureString"
  value = var.token
}

data "aws_availability_zones" "this" {}

resource "aws_subnet" "this" {
  count = length(data.aws_availability_zones.this.names)

  assign_ipv6_address_on_creation = true
  availability_zone               = data.aws_availability_zones.this.names[count.index]
  cidr_block                      = cidrsubnet(aws_vpc.this.cidr_block, 4, count.index)
  ipv6_cidr_block                 = cidrsubnet(aws_vpc.this.ipv6_cidr_block, 8, count.index)
  vpc_id                          = aws_vpc.this.id
}

resource "aws_vpc" "this" {
  assign_generated_ipv6_cidr_block = true
  cidr_block                       = "10.0.0.0/16"
  enable_dns_hostnames             = true
  enable_dns_support               = true
}
