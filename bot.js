 // Require Discord Libraries
var Discordie = require('discordie');

 // Require log4js for logging to files
var log4js = require('log4js');

// require custom settings
var config = require('./config.json');

// Configure log4js
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/console.log', category: 'console'},
    { type: 'file', filename: 'logs/activeusers.log', category: 'activeusers'},
    { type: 'file', filename: 'logs/channels.log', category: 'channels'}
  ]
});

// set constant log4js variables
const logcon = log4js.getLogger('console');
const actcon = log4js.getLogger('activeusers');
const chancon = log4js.getLogger('channels');

// begin discord bot
const Events = Discordie.Events;
const client = new Discordie();

// issue connect to discord using the bot_token in config.json
client.connect({
  token: config.bot_token
});

// once connected
client.Dispatcher.on(Events.GATEWAY_READY, e => {
    // acknoledge connection to console logs
    logcon.info('Connected as: ' + client.User.username);
    // check for the number of active users every 30 seconds and log to the active users logs
    setInterval(function() {
      client.Users.fetchMembers(config.guild_id);
      actcon.info(config.guild_name + " Active Users: " + client.Users.onlineMembersForGuild(config.guild_id).length);}, 30000)
});

// when messages are created
client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
  // log the guild name, the channel name, the username, and the message to the channels log
  chancon.info(e.message.guild.name + ":" + " #" + e.message.channel.name + ": " + "<" + e.message.displayUsername + ">: "+ e.message.content);
});

// if connection is lost to Discord, issue a reconnect.

client.Dispatcher.on(Events.DISCONNECTED, e => {
  // force disconnection to Discord
  client.disconnect();
  logcon.info('Disconnected from server ...');

  // reconnect to Discord
  logcon.info('Reconnecting to Discord ... ');
  client.connect({
    token: config.bot_token
  });
});

// also, reconnect the bot hourly.

setInterval(function() {
  logcon.info('Reconnecting to server per timeout of ' + config.reconnect + 'ms.');
  client.disconnect();
  client.connect({
    token: config.bot_token
  });
}, config.reconnect);
