output "this_ecs_cluster_name" {
  description = "The name of this ECS cluster."
  value = "${aws_ecs_cluster.this.name}"
}

output "this_ecs_service_name" {
  description = "The name of this ECS service."
  value = "${aws_ecs_service.this.name}"
}
