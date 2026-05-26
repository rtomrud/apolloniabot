FROM denoland/deno:debian-2.8.0
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates ffmpeg python3 wget && rm -rf /var/lib/apt/lists/* && \
    wget -O /usr/local/bin/yt-dlp https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp
WORKDIR /usr/src/app
COPY deno.json deno.lock* ./
RUN deno install
COPY . .
CMD ["deno", "run", "--allow-env", "--allow-ffi", "--allow-net", "--allow-read", "--allow-run", "--allow-sys", "src/index.ts"]
