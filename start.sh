#!/bin/bash

set -e

ROOT=`pwd`
SCRIPT=`pwd`/$0
FILENAME=`basename $SCRIPT`
PATHNAME=`dirname $SCRIPT`
LICODEROOT=$ROOT
BUILD_DIR=$LICODEROOT/build
CURRENT_DIR=`pwd`

export PATH=$PATH:/usr/local/sbin

echo "Starting NuveAPI"
cd $LICODEROOT/nuve/nuveAPI
forever start nuve.js

echo "Waiting..."
sleep 5

echo "Starting ErizoController"
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LICODEROOT/erizo/build/erizo:$LICODEROOT/erizo:$LICODEROOT/build/libdeps/build/lib
export ERIZO_HOME=$LICODEROOT/erizo/

echo "Starting ErizoAgent"
cd $LICODEROOT/erizo_controller/erizoController
forever start erizoController.js

echo "Starting ErizoAgent"
cd $LICODEROOT/erizo_controller/erizoAgent
forever start erizoAgent.js

echo "[Done] Starting Licode agents"

echo "[Done]"

