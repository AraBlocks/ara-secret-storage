#!/bin/bash

PKG=${PKG:-$(which pkg)}
BUILD=${BUILD:-build/}
TARGET=${TARGET:-bin/ass}

rm -rf $BUILD
mkdir -p $BUILD/{macos,linux,win}

build() {
  $PKG -t $1 -o $BUILD/$1/$(basename $TARGET) $TARGET
  local rc=$?
  echo "> build: $TARGET for $1"
  return $rc
}

(build 'linux') && (build 'macos') && (build 'win')
exit $?
