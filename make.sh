#!/bin/sh

NAME="$( basename "${0}"; printf a )"; NAME="${NAME%?a}"

show_help() {
  <<EOF cat - >&2
SYNOPSIS
  ${NAME}

DESCRIPTION
  

OPTIONS
  -
    Special argument that says read from STDIN

  --
    Special argument that prevents all following arguments from being
    intepreted as options.
EOF
}

main() {
  MAKE_DIR="$( dirname "${0}"; printf a )"; MAKE_DIR="${MAKE_DIR%?a}"
  cd "${MAKE_DIR}" || exit "$?"
  MAKE_DIR="$( pwd -P; printf a )"; MAKE_DIR="${MAKE_DIR%?a}"

  # Flags
  LOCAL='false'
  FORCE='false'

  # Options processing
  args=''; literal='false'
  for a in "$@"; do
    "${literal}" || case "${a}"
      in --)          literal='true'; continue
      ;; -h|--help)   show_help; exit 0
      ;; -f|--force)  FORCE='true'
      ;; -l|--local)  LOCAL='true'

      ;; -*) die FATAL 1 "Invalid option '${a}'. See \`${NAME} -h\` for help"
      ;; *)  args="${args} $( outln "${a}" | eval_escape )"
    esac
    "${literal}" && args="${args} $( outln "${a}" | eval_escape )"
  done

  ! "${LOCAL}" && errln "Environment \${DOMAIN} is set to '${DOMAIN}'"


  [ -z "${args}" ] && { show_help; exit 1; }
  eval "set -- ${args}"

  m_make "$@"
}

#run: sh % root
m_make() {
  if "${FORCE}"
    then force='--force'
    else force=''
  fi

  while [ "$#" -gt 0 ]; do
    case "${1}"
      in clean)      rm -r "${MAKE_DIR}/public"
      ;; all)        m_make root a-bas-le-ciel
      ;; all-local)  "${MAKE_DIR}/${NAME}" all "${force}" -l

      ;; eisel|a-bas-le-ciel)
        write_dir="${MAKE_DIR}/public/a-bas-le-ciel"
        errln "Buildling 'a-bas-le-ciel' -> '${write_dir}' ..."

        mkdir -p "${write_dir}"
        if "${LOCAL}"
          then input="sample.json"; domain="${write_dir}"
          else input="final.json";  domain="${DOMAIN}/a-bas-le-ciel"
        fi

        cd "${MAKE_DIR}/a-bas-le-ciel" || "$?"

        node build.mjs \
          "${MAKE_DIR}/a-bas-le-ciel/${input}" \
          "${write_dir}" \
          "${domain}" \
          ${force} || exit "$?"

      ;; root)
        write_dir="${MAKE_DIR}/public/"
        errln "Buildling 'root' -> '${write_dir}' ..."
        compile_base "${MAKE_DIR}/root" "${write_dir}" "/"

      ;; *)
        die FATAL 1 "\`${NAME} '${1}'\` is an invalid subcommand."

    esac
    shift 1
  done
}

compile_base() {
  # $1: read path
  # $2: write directory
  # $3: domain

  mkdir -p "${2}" || exit "$?"
  [ -d "${1}" ] && [ -d "${2}" ] \
    || die DEV 1 "\`compile_base\` only accepts directories" \
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

# Helpers
errln() { printf %s\\n "$@" >&2; }
outln() { printf %s\\n "$@"; }
die() { printf %s "${1}: " >&2; shift 1; printf %s\\n "$@" >&2; exit "${1}"; }
eval_escape() { <&0 sed "s/'/'\\\\''/g;1s/^/'/;\$s/\$/'/"; }

<&1 main "$@"
