# Fireplace

_Hey Siri, turn on the fireplace!_

![Siri demo](https://i.imgur.com/aD7LcDW.gif)

This repo contains the source for the [HomeKit adapter for a Heat & Glo fireplace](https://imgur.com/a/CZCnx) I built for myself based on the [HAP-Node JS](https://github.com/KhaosT/HAP-NodeJS) project. 

It's a custom HAP-Node JS Accessory that exposes three characteristics
* Power on/off
* Fan power  (0 to 3)
* Flame height (0 to 3)

# Hardware

The code runs on a Raspberry Pi Zero W with a custom circuit I designed attached to it

![Circuit](https://i.imgur.com/YSO4GKb.jpg)

It hijacks singnals from a hacked remove control to send RF commands to the fireplace. 

Since it is a write only interface, it has to maintain its own state machine that hopefully matches that of the fireplace.

# Development and testing
For convenience a Docker container is provided for developing. To start an interactive shell do

`> docker-compose run devel`

Most of the time you just want to run the linter and the tests, which you can do straight from the host using

`>  docker-compose run test`

or inside the container 

`> npm test`
