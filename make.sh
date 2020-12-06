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

  [ -z "${args}" ] && { show_help; exit 1; }
  eval "set -- ${args}"

  m_make "$@"
}

#run: sh % clean all
m_make() {
  if "${FORCE}"
    then force='--force'
    else force=''
  fi

  while [ "$#" -gt 0 ]; do
    case "${1}"
      in clean)      rm -r "${MAKE_DIR}/public"
      ;; all)        m_make base eisel
      ;; all-local)  "${MAKE_DIR}/${NAME}" all "${force}" -l

      ;; eisel)
        # ̀a is too annoying to 'cd' into so source is named eisel
        write_path="${MAKE_DIR}/public/̀à-bas-le-ciel"
        errln "Buildling 'eisel' -> '${write_path}' ..."

        mkdir -p "${write_path}"
        if "${LOCAL}"
          then input="sample.json"; domain="${write_path}"
          else input="final.json";  domain='/̀à-bas-le-ciel'
        fi

        cd "${MAKE_DIR}/eisel" || "$?"

        node build.mjs \
          "${MAKE_DIR}/eisel/${input}" \
          "${write_path}" \
          "${domain}" \
          ${force} || exit "$?"

      ;; base)
        write_path="${MAKE_DIR}/public/"
        errln "Buildling 'base' -> '${write_path}' ..."
        mkdir -p "${write_path}"
        cp "${MAKE_DIR}/base/index.html" "${write_path}"

      ;; *) die FATAL 1 "\`${NAME} '${1}'\` is an invalid subcommand."
    esac
    shift 1
  done
}

# Helpers
errln() { printf %s\\n "$@" >&2; }
outln() { printf %s\\n "$@"; }
die() { printf %s "${1}: " >&2; shift 1; printf %s\\n "$@" >&2; exit "${1}"; }
eval_escape() { <&0 sed "s/'/'\\\\''/g;1s/^/'/;\$s/\$/'/"; }

<&1 main "$@"
