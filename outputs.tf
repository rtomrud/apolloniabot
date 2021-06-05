output "this_aws_instance_public_ip" {
  description = "The public ip of this AWS instance."
  value = "${aws_instance.this.public_ip}"
}
