#!/bin/sh

WD="$( dirname "$0"; printf a )"; WD="${WD%?a}"
cd "${WD}" || { printf "Could not cd to directory of '%s'" "$0" >&2; exit 1; }

git clone --branch main --depth 1 \
  git@github.com:Aryailia/aryailia.github.io \
  temp \
  || exit "$?"
mkdir temp/u

# Copy the github actions because push events only work when the action in
# on the branch being pushed to
cp -r ../.github temp/u
date +%s >temp/u/date
git -C temp add u
git -C temp commit -m "Update $( date +"%Y-%m-%d" )"
git -C temp subtree split --prefix u --branch update
git -C temp checkout update
git -C temp push --force origin update
rm -rf temp


