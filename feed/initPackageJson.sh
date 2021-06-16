#!/bin/bash
#
# The required npm modules.
#
# This is only used to populate package.json so we get the current versions.
# It's easier this way but is used only once. It's kept so I can do a bulk
# update quickly rather than messing around with the json

# dependencies
npm install --save \
  "amqplib" \
  "lightstreamer-client"

# devDependencies
npm install --save-dev \
  "@babel/core" \
  "@babel/cli" \
  "@babel/polyfill" \
  "@babel/preset-env" \
  "@babel/plugin-transform-modules-umd" \
  "@babel/plugin-proposal-class-properties" \
  "@babel/plugin-syntax-dynamic-import" \
  "@babel/plugin-syntax-import-meta" \
  "@babel/plugin-proposal-json-strings" \
  "@babel/plugin-proposal-decorators" \
  "@babel/plugin-proposal-function-sent" \
  "@babel/plugin-proposal-export-namespace-from" \
  "@babel/plugin-proposal-numeric-separator" \
  "@babel/plugin-proposal-throw-expressions" \
  "@babel/plugin-proposal-export-default-from" \
  "@babel/plugin-proposal-logical-assignment-operators" \
  "@babel/plugin-proposal-optional-chaining" \
  "@babel/plugin-proposal-pipeline-operator" \
  "@babel/plugin-proposal-nullish-coalescing-operator" \
  "@babel/plugin-proposal-do-expressions" \
  "@babel/plugin-proposal-function-bind"
