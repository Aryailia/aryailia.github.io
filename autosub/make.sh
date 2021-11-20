#!/bin/sh

my_dir="$( dirname "${0}"; printf a )"; my_dir="${my_dir%?a}"
my_dir="$( realpath -P "${my_dir}"; printf a )"; my_dir="${my_dir%?a}"

my_make() {
  case "${1}"
    in all)
      "${my_dir}/make/get-model.sh" 0.9.3
      docker build -t autosub:0.9.3 "${my_dir}/make"
  esac
}
