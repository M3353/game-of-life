## game-of-life

CPAR 491/ART 496
Created by Jack Li

## Overview

Conway’s game of life is an algorithm that simulates life's immensity, versatility, and beauty. Wikipedia describes the parameters of the game as follows:

The Game of Life is undecidable. Some configurations result in sublime combinations of everlasting stills and cyclic patterns while others die out in just a few iterations.

I propose an expansion of Conway’s game of life. In Yale’s Game of Life (working title), a group of players influences the initial configuration responsible for generating dynamic artworks that morph and grow indefinitely. 

Through a web app, players will create a small n x n artwork of live and dead cells. Players then place their configurations on a larger game of life board, and once a certain threshold of pieces is passed, the game starts. 

The current configuration of the game of life will serve as input for a dynamic, computer-generated artwork that mirrors the state of the game. Due to the nature of the game of life, some games will fade into nothingness while others mature into intricate and living artworks.

There will be multiple games of life simultaneously evolving, and each corresponding artwork will be generated with different algorithms. These game-of-life artworks will be presented in one of three ways:

A large projector will display each game of life piece in a gallery in a public space. A QR code will be near the projection, and players can select which game of life they want to contribute to. 
A series of smaller projectors will be spread across campus and each displays a single game of life artwork. A QR code will be placed near each projector that corresponds to its game of life.
If this project cannot be displayed in a public space, a series of projectors will display them in a gallery

Although the finished piece can successfully be displayed in a gallery, Yale’s game of life reads as a public-facing installation. The artwork should be controlled by as many and as diverse a player base as possible, where its perpetual evolution and dynamic beauty mirror the group of players that created it.

## technologies

the current app runs on a postgres database, node/express backend and react frontend, and uses pixijs to render graphics in realtime. 

# database

game of life runs on a relational postgresql database with one table defined as "boards". A board has 7 fields:

name    |   board   |   occupied    |   id   |    rows    |   columns  |  ready
string  |   int[][] |   int[][]     |   int  |    int     |    int     |  boolean

name: name of the board
board: state of the board
occupied: which spaces on the board have been occupied
id: a unique integer id associated with the board
rows: number of rows
columns: number of columns
ready: flag indicating if the start condition has been met

# backend

game of life runs on a node/express server. CRUD 

CORS is used to allow data transfer between clients and the server. 

Websockets are used to establish an effecient two way interactive communication session between clients and the server. Every second, the server send a message to the client containing an incremented board, and the client rerenders the board if the ready state is true.

JOI is used to validate all data sent to the backend.

# Frontend

game of life runs on a next/react framework. 

## Workflow

Over the course of the semester I completed a e2e working model of game of life. The largest challenge I faced was implementing a way of updating data at a constant time frame automatically. I considered many options(ex. polling) but settled on the highly effecient web socket.

## Future

In future semesters, I hope to create a better design for the site, and add more algorithms to generate art.

## Demo


https://user-images.githubusercontent.com/55003556/209017722-ffc391c2-f949-4710-af27-8ee7b3978064.mov

