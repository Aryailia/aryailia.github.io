#!/bin/sh

WD="$( dirname "$0"; printf a )"; WD="${WD%?a}"
cd "${WD}" || { printf "Could not cd to directory of '%s'" "$0" >&2; exit 1; }

[ -d "../ablc-data" ] || { printf %s\\n "'ablc-data' does not exist"; exit 1; }

../ablc-data/make.sh update-by-rss
if ../ablc-data/make.sh save-update; then
  ./trigger-update.sh
fi

