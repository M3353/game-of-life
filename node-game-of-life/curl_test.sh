#!/bin/bash
# create board if board val not yet created
curl -X POST localhost:5431/admin/-2 -H 'Content-Type: application/json' -d '{"id": -2, "name": "test1", "height": 5, "width": 5, "board": [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]], "occupied": [0]}'
echo $'\n'

# edit board
curl -X PUT localhost:5431/boards/-2 -H 'Content-Type: application/json' -d '{"board": [[1,1,0,0,0],[0,1,1,0,0],[0,0,1,1,0],[0,0,0,1,1],[0,0,0,0,0]], "occupied": [1]}'
echo $'\n'

# get edited borrd
curl localhost:5431/boards/-2
echo $'\n'

# delete board
curl -X DELETE localhost:5431/admin/-2
