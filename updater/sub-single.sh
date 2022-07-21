#!/bin/sh

# This is for when the VM runs out of memory to sub a file, so we sub the file
# on our local computer

#run: sh % "https://youtube.com/watch?v=35E7z5ExftI" "temp"

WD="$( dirname "$0"; printf a )"; WD="${WD%?a}"
cd "${WD}" || { printf "Could not cd to directory of '%s'" "$0" >&2; exit 1; }

die() { printf %s "${1}: " >&2; shift 1; printf %s\\n "$@" >&2; exit "${1}"; }

[ -d "${2}" ] || die FATAL "Arg two '${2}' must be a (empty) directory"

../yt-archive/archive.sh download-metadata "${1}" "${2}" "/dev/null"
../yt-archive/archive.sh add-missing-subs   "${2}" "${2}" "${2}"

