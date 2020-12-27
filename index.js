const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const moment = require('moment');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('database/database.json');
const db = low(adapter);
const cooldowns = new Map();

function log(text) {
  return console.log(`[${moment().format("DD/MM/YYYY HH:mm:ss")}] ${text}`);
};

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

client.on('ready', async () => {
  log('Ready!');
});

client.on('message', async (message) => {
  if (message.author.bot || message.channel.type == 'dm' || !message.guild || message.content.startsWith(config.bot.prefix)) return;

  console.log("\nGot a message!");
  let randomize = randomNumber(15, 20);

  let xpdata = db.get('guild').find({ id: message.member.id }).value();
  if (!xpdata) {
    console.log(`We found that ${message.author.tag} doesnt have any data, so we created for him!`);
    return db.get('guild')
      .push({id: message.member.id, level: 1, xp: randomize, totalxp: randomize, xpmsg: 1, totalmsg: 1})
      .write();
  };

  db.get('guild').find({ id: message.member.id }).update('totalmsg', n => n + 1).write();

  const cooldown = cooldowns.get(message.author.id);
  if (cooldown) {
    console.log("In cooldown!");
    console.log(`Total Message for ${message.author.tag} [${xpdata.totalmsg - 1} => ${xpdata.totalmsg}]`);
    return console.log(`User ${message.author.tag} is on XP cooldown. Returning.`);
  };

  if (!cooldown) console.log("No cooldown!");

  cooldowns.set(message.author.id, Date.now() + 1000 * randomize);
  setTimeout(() => cooldowns.delete(message.member.id), 1000 * 60);

  console.log(`Just set a XP cooldown for ${message.author.tag} for 1 minute because we will give him ${randomize} XP!`);

  if (xpdata) {
    console.log(`We found that ${message.author.tag} has a XP data, so we will update for him!`);
    
    let oldxp = xpdata.xp;
    db.get('guild').find({ id: message.member.id }).update('xpmsg', n => n + 1).write();
    db.get('guild').find({ id: message.member.id }).update('xp', n => n + randomize).write();
    db.get('guild').find({ id: message.member.id }).update('totalxp', n => n + randomize).write();

    let xp = xpdata.xp;
    let total = xpdata.xpmsg;
    let level = xpdata.level;

    console.log(`New update for ${message.author.tag}: \nXP [${oldxp} => ${xp}] \nXP Message [${total - 1} => ${total}]`);

    if (xp > 5 * (Math.pow(level, 2)) + 50 * level + 100) {
      db.get('guild').find({ id: message.member.id }).update('level', n => n + 1).write();
      console.log(`\nNew update for ${message.author.tag}: \nLevel [${level} => ${level + 1}] with ${xp} XP!`);

      db.get('guild').find({ id: message.member.id }).set('xp', 0).write();
      let channelid = db.get('xpchannel').value();
      let xpresponse = new Discord.MessageEmbed()
        .setDescription(`**${message.author.tag}** adlı kişi, **${level + 1}** level oldu!`)
        .setColor(message.guild.me.roles.highest.color || "RANDOM");
      
      client.channels.cache.get(channelid).send(xpresponse).catch(() => {
        message.author.send(xpresponse).catch(() => {
          log("Level mesajları için kanal ayarlanmadığı için gönderilemedi!");
        });
      });
    };
  };
});

client.on('message', async (message) => {
  const prefix = config.bot.prefix;

  if (!message.guild || message.author.bot || !message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command == "level") {
    let searchuser;

    if (!args[0]) searchuser = message.member;
    if (args[0]) {
      let m = message.mentions.members.first();
      try {
        searchuser = m ? m : await message.guild.members.fetch(args[0]);
      } catch (e) {
        if (e.message.includes('Unknown User')) return message.channel.send("Belirtilen kişi bulunamadı!");
      };
    };

    let xpdata = db.get('guild').find({ id: searchuser.id }).value();

    if (!xpdata) {
      return message.channel.send('Belirtilen kişinin XP datası bulunamadı.');
    };

    if (xpdata) {
      let xp = xpdata.xp;
      let xpmsg = xpdata.xpmsg;
      let total = xpdata.totalmsg;
      let level = xpdata.level.toString().padStart(3, '0');
    
      let xpresponse = new Discord.MessageEmbed()
        .setAuthor(searchuser.user.tag, searchuser.user.displayAvatarURL({dynamic: true, size: 2048}))
        .addField(`LVL`, `**\`${level}\`**`, true)
        .addField(`XP`, `**\`${xp}/${5 * (Math.pow(level, 2)) + 50 * level + 100}\`** with **\`${xpmsg}/${total}\`** messages!`, true)
        .setColor(message.guild.me.roles.highest.color || "RANDOM");

      message.channel.send(xpresponse);
    };
  };

  if (command == "leaderboard") {
    let sorted = db.get('guild').value().sort(function (a, b) {
      var aLevel = a.level;
      var bLevel = b.level;
      var aXP = a.xp;
      var bXP = b.xp;

      if (aLevel == bLevel) {
        return (aXP > bXP) ? -1 : (aXP < bXP) ? 1 : 0;
      } else {
        return (aLevel > bLevel) ? -1 : 1;
      };
    });

    let responseArray = [];
    sorted.slice(0, 10).forEach((obj) => {
      responseArray.push(`<@${obj.id}> adlı kişi, **\`${obj.xpmsg}/${obj.totalmsg}\`** mesajla **\`${obj.level}\`** level!`);
    });

    let response = new Discord.MessageEmbed()
      .setDescription(responseArray.join("\n"))
      .setColor(message.guild.me.roles.highest.color || "RANDOM");

    message.channel.send(response);
  };
});

client.login(config.bot.token);
