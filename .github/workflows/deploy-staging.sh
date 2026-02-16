#!/bin/bash

set -euo pipefail

IMAGE_NAME="akhileshrawat7/rolaface-erp-frontend:staging"
CONTAINER_NAME="rolaface-erp-frontend-staging"
PORT_MAPPING="3006:3003"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

check_health() {
    log "🩺 Performing health check..."
    sleep 5 
    
    if [ "$(docker inspect -f '{{.State.Running}}' $CONTAINER_NAME 2>/dev/null)" = "true" ]; then
        log "✅ Health check passed. Container is running."
    else
        log "❌ Health check FAILED. Container is not running."
        log "📋 Fetching last 20 lines of logs:"
        docker logs --tail 20 $CONTAINER_NAME
        exit 1
    fi
}

log "🚀 Starting deployment for $CONTAINER_NAME"

log "⬇️  Pulling latest image..."
docker pull "$IMAGE_NAME" > /dev/null

if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    log "🛑 Stopping existing container..."
    docker stop "$CONTAINER_NAME" > /dev/null
    docker rm "$CONTAINER_NAME" > /dev/null
fi

log "▶️  Starting new container..."
docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p "$PORT_MAPPING" \
  "$IMAGE_NAME" > /dev/null

check_health

log "🧹 Cleaning up old artifacts..."
docker image prune -f --filter "dangling=true" > /dev/null

log "✨ Deployment successfully completed."