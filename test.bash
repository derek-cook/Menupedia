#!/bin/bash

cd ./Menupedia

if ! node_modules/.bin/gulp lint ; then
    echo 'There are code style problems in the javascript code.'
    echo 'Run `gulp` for details.'
    exit 1
fi

DIFF_BEFORE=$(git diff)
node_modules/.bin/gulp format-css
DIFF_AFTER=$(git diff)

if [[ "$DIFF_BEFORE" != "$DIFF_AFTER" ]] ; then
    echo 'There are style problems in the CSS code.'
    echo 'Run `gulp` to fix css style.'
    exit 1
fi
