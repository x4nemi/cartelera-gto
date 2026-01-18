#!/bin/bash
# This script runs at Azure App Service startup to inject environment variables

CONFIG_FILE="/home/site/wwwroot/config.js"

if [ -f "$CONFIG_FILE" ]; then
    # Replace placeholder with actual environment variable
    sed -i "s|%%GOOGLE_MAPS_API_KEY%%|${GOOGLE_MAPS_API_KEY}|g" "$CONFIG_FILE"
    echo "Config file updated with environment variables"
fi
