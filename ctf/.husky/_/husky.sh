#!/bin/sh
# Husky shell helper with standard behavior: only skip when explicitly disabled.
if [ -z "$husky_skip_init" ]; then
  debug () {
    if [ "$HUSKY_DEBUG" = "1" ]; then
      echo "husky (debug) - $*"
    fi
    return 0
  }

  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name..."

  # Husky uses HUSKY=0 to disable hooks; unset is a normal state.
  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY=0, skipping $hook_name"
    exit 0
  fi
fi
