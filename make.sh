#!/bin/sh

show_help() {
  printf %s\\n "SYNOPSIS" >&2
  printf %s\\n "  ${NAME} <JOB> [<arg> ...]" >&2


  printf %s\\n "" "JOBS" >&2
  <"${0}" awk '
    /^my_make/ { run = 1; }
    /^\}/ { run = 0; }
    run && /^    in|^    ;;/ {
      sub(/^ *in /, "  ", $0);
      sub(/^ *;; /, "  ", $0);
      sub(/\) *#/, "\t", $0);
      sub(/\).*/, "", $0);
      print $0;
    }
  ' >&2

  exit 1
}

# Change to the directory holding this script file
my_dir="$( dirname "${0}"; printf a )"; my_dir="${my_dir%?a}"
cd "${my_dir}" || { printf %s\\n "Could not cd into project dir" >&2; exit 1; }
my_dir="$( pwd -P; printf a )"; my_dir="${my_dir%?a}"


PROJECTS="\
alll,ablc-main,git clone -b main https://github.com/Aryailia/a-bas-le-ciel ablc-main

cicd,ablc-compiled,git clone -b compiled https://github.com/Aryailia/a-bas-le-ciel ablc-compiled
host,ablc-data,    git clone -b data     https://github.com/Aryailia/a-bas-le-ciel ablc-data
mypc,ablc-compiled,git clone -b compiled https://github.com/Aryailia/a-bas-le-ciel ablc-compiled

host,autosub/project,git clone https://github.com/Aryailia/AutoSub autosub/project; autosub/make.sh all
mypc,autosub/project,git clone https://github.com/Aryailia/AutoSub autosub/project

"

PROJECTS_CICD="$( printf %s\\n "${PROJECTS}" | grep '^alll,\|^cicd,' )"
PROJECTS_HOST="$( printf %s\\n "${PROJECTS}" | grep '^alll,\|^host,' )"
PROJECTS_MYPC="$( printf %s\\n "${PROJECTS}" | grep '^alll,\|^mypc,' )"


#run: sh % init

my_make() {
  case "${1}"
    in clean)  rm -r "./public"; rm -r "./ablc-main/static"
    ;; all-cicd)  # For GitHub Actions
      my_make "init-cicd" || exit "$?"
      my_make "root" || exit "$?"
      ./ablc-main/make.sh copy-to-frontend || exit "$?"
      ./ablc-main/make.sh build-frontend "${my_dir}/public/a-bas-le-ciel" || exit "$?"

    ;; all-host)  # For the downloader
      my_make "init-host" || exit "$?"
      my_make "root" || exit "$?"
      ./autosub/make.sh "all" || exit "$?"
      # Do not copy to frontend on host
      # Do not build frontend on host

    ;; all-local)  # For local development
      my_make "init-local" || exit "$?"
      my_make "root" || exit "$?"
      ./autosub/make.sh "all" || exit "$?"
      ./ablc-data/make.sh sample-to-frontend || exit "$?"
      ./ablc-data/make.sh build-frontend-local "${my_dir}/public/a-bas-le-ciel" || exit "$?"

    ;; root)
      write_dir="${my_dir}/public/"
      errln "Buildling 'root' -> '${write_dir}' ..."
      compile_base "${my_dir}/root" "${write_dir}" "/"

    ;; init-cicd)   printf %s\\n "${PROJECTS_CICD}" | execute_third_col
    ;; init-host)   printf %s\\n "${PROJECTS_HOST}" | execute_third_col
    ;; init-local)  printf %s\\n "${PROJECTS_MYPC}" | execute_third_col

    ;; write-gitignore)
      {
        printf %s\\n "${PROJECTS}" | cut -d ',' -f 2
        printf %s\\n "public"
      } | sed '/^$/d' | sort | uniq >./.gitignore
    ;; update)
      #for dir in $( printf %s\\n "${PROJECTS_MYPC}" | cut -d ',' -f 2 ); do
      #  "${dir}/make.sh" "update"
      #done

    ;; help|*) errln "Invalid command '${1}'"; show_help
  esac
}

execute_third_col() {
  errln "Setting up git sub projects"
  <&0 awk -v FS=',' '
    length($0) == 0 { next; }
    { printf "[ -d \"%s\" ] || %s\n",  $2, $3; }
  ' | sh -s
}

# TODO: make this do recursive
compile_base() {
  # $1: read path
  # $2: write directory
  # $3: domain

  mkdir -p "${2}" || exit "$?"
  [ -d "${1}" ] && [ -d "${2}" ] \
    || die DEV 1 "'compile_base' only accepts directories" \
      "\$ compile_base '${1}' '${2}' '${3}'"

  #for child in "${1}"/*; do
  for child in "${1}"/* "${1}"/.[!.]* "${1}"/..?*; do
    [ -e "${child}" ] || continue
    filename="${child##*/}"
    extension="${filename##*.}"
    filestem="${filename%".${extension}"}"

    case "${extension}"
      in sh)  "${child}" "${3}" >"${2}/${filestem}.html"
      ;; xml|txt|html)
        cp "${child}" "${2}/${filename}"
      ;; *)     die FATAL 1 \
        "The extension '${extension}' in '${child}' is not supported"
    esac || die FATAL 1 "Error processing the file '${child}'"
  done
}

errln() { printf %s\\n "$@" >&2; }

my_make "$@"
