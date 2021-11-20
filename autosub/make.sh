#!/bin/sh

my_dir="$( dirname "${0}"; printf a )"; my_dir="${my_dir%?a}"
my_dir="$( realpath -P "${my_dir}"; printf a )"; my_dir="${my_dir%?a}"
project="${my_dir}/project"

version="0.9.3"
model="deepspeech-${version}-models.pbmm"
scorer="deepspeech-${version}-models.scorer"
model_url="https://github.com/mozilla/DeepSpeech/releases/download/v${version}/${model}"
scorer_url="https://github.com/mozilla/DeepSpeech/releases/download/v${version}/${scorer}"

my_make() {
  case "${1}"
    in all)
      if docker images "autosub" --format "{{.Repository}}" | grep -qF "autosub"; then
        printf %s\\n "The docker image 'autosub' has already been built" >&2
      else
        [ -e "${project}/${model}" ] \
          || curl -L "${model_url}" -o "${project}/${model}"
        [ -e "${project}/${scorer}" ] \
          || curl -L "${scorer_url}" -o "${project}/${scorer}"
        docker build -t "autosub:${version}" "${project}"
      fi
  esac
}



my_make "$@"
