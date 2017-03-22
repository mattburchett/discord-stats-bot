var Discordie = require('discordie'); // Requite Discord Libraries
var log4js = require('log4js'); // Require log4js for logging to files
var config = require('./config.json'); // require custom settings

// Configure log4js
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/console.log', category: 'console'},
    { type: 'file', filename: 'logs/activeusers.log', category: 'activeusers'},
    { type: 'file', filename: 'logs/channels.log', category: 'channels'}
  ]
});

const Events = Discordie.Events;
const client = new Discordie();

client.connect({
  token: config.bot_token
});

client.Dispatcher.on(Events.GATEWAY_READY, e => {
    var logcon = log4js.getLogger('console');
    var actcon = log4js.getLogger('activeusers');
    logcon.info('Connected as: ' + client.User.username);
    setInterval(function() {actcon.info(config.guild_name + " Active Users: " + client.Users.onlineMembersForGuild(config.guild_id).length);}, 30000)
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
  var chancon = log4js.getLogger('channels');
  chancon.info(e.message.guild.name + ":" + " #" + e.message.channel.name + ": " + "<" + e.message.displayUsername + ">: "+ e.message.content);
});
