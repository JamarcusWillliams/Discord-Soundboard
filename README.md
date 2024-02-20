# Discord Soundboard

## Introduction
Discord Soundboard is a custom Discord bot designed to play sound clips in voice channels. With the ability to respond to slash commands and button interactions, users can easily play their favorite sounds from a pre-defined list directly into their voice channels.

## Features
- Plays custom sound clips in Discord voice channels.
- Dynamic slash command creation for as many souunds as you want.
- Button interactions for easy sound clip selection.

## Setup
### Prerequisites
- Node.js v16 or newer.
- A Discord Bot Token. 
- Install the required dependencies including `discord.js`, `@discordjs/voice`, `ffmpeg`, and `libsodium-wrappers`. To do so, navigate to the directory folder through your terminal and type 'npm' install. 

### Configuration
- Place your `.mp3` sound files in the `sounds` directory.
- Ensure your bot has the necessary permissions in your Discord server (Connect, Speak, and Send Messages permissions are required).

## Usage
Once the bot is running and invited to your server:
- Use `/playsoundX` commands to display buttons corresponding to sound clips.
- Click a button to play the associated sound clip in your current voice channel.

## Docker Usage
To containerize and run the Discord Soundboard using Docker, Edit the `Dockerfile` in the root of your project.

