ShadowSIN 6e
============
Shadowrun 6th Edition character sheet manager

Setup
-----
Recommended to use RubyMine for development.
If you're on Windows it's recommended to clone the project into the WSL file system.

Requirements:
- Docker
- NodeJS (v16+)

After cloning, duplicate `.env.example` as `.env` and configure for your system. The dotenv file will be used for both
client and server.

Install client dependencies:
```bash
$ cd client
$ yarn install
```

### RubyMine, Docker, and WSL
Due to a bug in RubyMine, debugging Rails through Docker while files are in the Linux file system doesn't work as 
expected. For the time being, it's recommended to install Ruby and run the server outside of Docker. A special run 
configuration is provided to assist with setting up the application.

Run
---
If using RubyMine, use the provided "Start App" run configurations.

Start server:
```bash
$ docker-compose -up
```
Build and start client:
```bash
$ cd client
$ yarn start
```
