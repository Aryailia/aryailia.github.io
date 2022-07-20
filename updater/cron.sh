#!/bin/sh

WD="$( dirname "$0"; printf a )"; WD="${WD%?a}"
cd "${WD}" || { printf "Could not cd to directory of '%s'" "$0" >&2; exit 1; }

../ablc-data/make.sh download-rss
../ablc-data/make.sh archive-meta-and-subs
../ablc-data/make.sh download-missing-subs
../ablc-data/make.sh archive-missing-subs
../ablc-data/make.sh compile
./trigger-update.sh

