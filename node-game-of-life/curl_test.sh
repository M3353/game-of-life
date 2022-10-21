#!/bin/bash
BOARD=-2

# create board if board val not yet created
curl -X POST localhost:5432/admin/-1

curl -X PUT localhost:5431/boards/-1 -H 'Content-Type: application/json' -d '{"board": [[1,1,0,0,0],[0,1,1,0,0],[0,0,1,1,0],[0,0,0,1,1],[0,0,0,0,0]], "occupied": [1]}'

curl localhost:5431/boards
