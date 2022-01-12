#!/bin/bash
apt update
apt upgrade -y
apt install -y ffmpeg
apt install -y build-essential
apt install -y libtool
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt install -y nodejs
npm install -g npm
ln -s /usr/bin/python3.* /usr/bin/python
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/arm64/latest/amazon-cloudwatch-agent.deb
dpkg -i -E ./amazon-cloudwatch-agent.deb
rm amazon-cloudwatch-agent.deb
mkdir -p /opt/aws/amazon-cloudwatch-agent/etc/
cat <<EOF > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/home/ubuntu/.pm2/logs/index-error.log",
            "log_group_name": "apolloniabot-err.log"
          },
          {
            "file_path": "/home/ubuntu/.pm2/logs/index-out.log",
            "log_group_name": "apolloniabot-out.log"
          }
        ]
      }
    }
  }
}
EOF
systemctl restart amazon-cloudwatch-agent
