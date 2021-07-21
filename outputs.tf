output "this_instance_public_ip" {
  description = "The public ip of this instance."
  value = "${aws_instance.this.public_ip}"
}
