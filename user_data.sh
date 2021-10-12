#!/bin/bash
apt update
apt upgrade -y
apt install -y ffmpeg
apt install -y build-essential
apt install -y libtool
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt install -y nodejs
ln -s /usr/bin/python3.* /usr/bin/python
