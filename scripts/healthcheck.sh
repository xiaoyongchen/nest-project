#!/bin/bash
# scripts/healthcheck.sh

MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo "Application is healthy!"
        exit 0
    fi
    echo "Waiting for application to start... (attempt $((ATTEMPT+1))/$MAX_ATTEMPTS)"
    sleep 2
    ATTEMPT=$((ATTEMPT+1))
done

echo "Application failed to start within the expected time"
exit 1