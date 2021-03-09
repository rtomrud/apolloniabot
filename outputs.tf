output "this_lightsail_instance_id" {
  description = "The id of this Lightsail instance."
  value       = aws_lightsail_instance.this.id
}

output "this_lightsail_instance_arn" {
  description = "The ARN of this Lightsail instance."
  value       = aws_lightsail_instance.this.arn
}
