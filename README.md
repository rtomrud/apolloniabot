# lenabot

A music bot for [Discord](https://discord.com/)

## Installing

```bash
npm install
```

## Scripts

To build, run:

```bash
npm run build
```

To run the tests, run:

```bash
npm test
```

## Deploying

To deploy, run:

```bash
npm run deploy
```

_Note that to deploy you need:_

1. An [AWS account](https://portal.aws.amazon.com/billing/signup)
2. An [IAM user with administrator access](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html)
3. A [`credentials` file in a folder named `.aws` in your home directory](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) (`~/.aws/crentials` on Linux/macOS, or `%UserProfile%\.aws\crentials` on Windows), which must have:
   1. `aws_access_key_id` set to the access key of the admin user
   2. `aws_secret_access_key` set to the secret access key of the admin user
4. The [Terraform CLI](https://www.terraform.io/downloads.html).

## Building infrastructure

To build the infrastructure, run:

```bash
export TF_CLI_ARGS_init='-backend-config="bucket=<bucket_name>"'
terraform init
```

_Replace `<bucket_name>` with the name of an encrypted S3 bucket in which you have read and write permissions._

To destroy the infrastructure, run:

```bash
terraform destroy
```

_Note that to manage the infrastructure you need the [Terraform CLI](https://www.terraform.io/downloads.html)._
