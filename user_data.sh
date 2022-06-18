#!/bin/bash
dnf update -y
dnf install -y gcc-c++ libtool make nodejs npm

curl -fsSLO https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-static.tar.xz
curl -fsSLO https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-static.tar.xz.md5
md5sum -c ffmpeg-release-arm64-static.tar.xz.md5 && tar -xf ffmpeg-release-arm64-static.tar.xz -C /usr/local/bin --strip-components 1 --wildcards '*/ffmpeg' --wildcards '*/ffprobe'
chown root:root /usr/local/bin/ffmpeg /usr/local/bin/ffprobe
rm ffmpeg-release-arm64-static.tar.xz ffmpeg-release-arm64-static.tar.xz.md5

curl -fsSL https://s3.amazonaws.com/amazoncloudwatch-agent/assets/amazon-cloudwatch-agent.gpg | gpg --import
curl -fsSLO https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/arm64/latest/amazon-cloudwatch-agent.rpm.sig
curl -fsSLO https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/arm64/latest/amazon-cloudwatch-agent.rpm
gpg --fingerprint 937616F3450B7D806CBD9725D58167303B789C72 && \
gpg --verify amazon-cloudwatch-agent.rpm.sig amazon-cloudwatch-agent.rpm && \
rpm -U ./amazon-cloudwatch-agent.rpm
gpg --batch --delete-keys 937616F3450B7D806CBD9725D58167303B789C72
rm amazon-cloudwatch-agent.rpm amazon-cloudwatch-agent.rpm.sig
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
