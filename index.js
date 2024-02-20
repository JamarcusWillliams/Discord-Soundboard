const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');
const token = ''; //Add token

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});


//soecify path containing sounds
const soundsDirectory = './sounds';

//Loads .mp3 files from the directory. Currently only checks for the first 30.
const sounds = fs.readdirSync(soundsDirectory).filter(file => file.endsWith('.mp3')).slice(0, 30); 

//prints ready to console when the bot is succefully on
client.once('ready', async () => {
  console.log('Ready!');

  const commands = [];

  //Dynamically creates slash commands (playsounds1, playsound2.....playsound6). Each command creates 5 buttons
  for (let i = 1; i <= 6; i++) {
    commands.push(
      new SlashCommandBuilder()
        .setName(`playsound${i}`)
        .setDescription(`Play sounds ${1 + (i - 1) * 5}-${i * 5}`)
        .toJSON()
    );
  }

  //Using discords REST API to update slash commands on server 
  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log('Started refreshing application (/) commands.');

    //update slash commands for each server
    await Promise.all(client.guilds.cache.map(guild => 
      rest.put(
        Routes.applicationGuildCommands(client.user.id, guild.id),
        { body: commands }
      )
    ));

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

//Map of voice connections
const voiceConnections = new Map();

//event listener for interaction creation and handling commands and button presses
client.on('interactionCreate', async interaction => {
  if (interaction.isCommand() && interaction.commandName.startsWith('playsound')) {
    const groupNumber = parseInt(interaction.commandName.replace('playsound', ''), 10);
    const soundStartIndex = (groupNumber - 1) * 5;
    const soundEndIndex = groupNumber * 5;
    const soundGroup = sounds.slice(soundStartIndex, soundEndIndex);

    //create row of buttons
    const actionRow = new ActionRowBuilder();

    soundGroup.forEach((sound) => {
      actionRow.addComponents(
        new ButtonBuilder()
          .setCustomId(`play_${sound}`)
          .setLabel(`${sound.replace('.mp3', '')}`)
          .setStyle(ButtonStyle.Primary),
      );
    });

    //reply to the interaction with the buttons for sound playback
    await interaction.reply({ components: [actionRow] });
  } else if (interaction.isButton()) {
    //defer update to prevent a response
    await interaction.deferUpdate(); 

    //get voice channel of the user who clicked the button
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      console.log('User not in a voice channel.');
      return;
    }

    //prepare sound for playback
    const soundFile = interaction.customId.replace('play_', '');
    const filePath = path.join(soundsDirectory, soundFile);

    //join voice channel if not already connection
    let connection = voiceConnections.get(interaction.guildId);
    if (!connection) {
      connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      voiceConnections.set(interaction.guildId, connection);
    }

    ///create audio player,audio resource and play sound
    const player = createAudioPlayer();
    const resource = createAudioResource(filePath);
    player.play(resource);
    connection.subscribe(player);

   
    player.on(AudioPlayerStatus.Idle, () => {
      //incomplete
    });
  }
});

client.login(token);
