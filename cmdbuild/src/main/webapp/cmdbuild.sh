#!/bin/bash

warDir="$(dirname "$0")"

exec java -Xmx6G -cp "$warDir" 'org.cmdbuild.webapp.cli.Main' 'CM_START_FROM_WEBAPP_DIR' "$warDir" "$@"

