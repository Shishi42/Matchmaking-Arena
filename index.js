const Discord = require("discord.js")

const bot = new Discord.Client()
const config = require("./config.json")
const fs = require("fs")
const jsonfile = require ("jsonfile")

var leadGO = {}
var leadCS = {}
var leadGX = {}
var leadSTR = {}

if(fs.existsSync("./LEADS/GO.json")){
  leadGO = jsonfile.readFileSync("./LEADS/GO.json")
}

if(fs.existsSync("./LEADS/CS.json")){
  leadCS = jsonfile.readFileSync("./LEADS/CS.json")
}

if(fs.existsSync("./LEADS/GX.json")){
  leadGX= jsonfile.readFileSync("./LEADS/GX.json")
}

if(fs.existsSync("./LEADS/STR.json")){
  leadSTR = jsonfile.readFileSync("./LEADS/STR.json")
}

bot.on("ready", async () => {

  console.log(`Connecté en tant que ${bot.user.tag}!`)

 // bot.channels.cache.get(config.chan_dev).send('Matchmaking Arena est connecté.')

  let statuses = [
    "Inazuma Eleven",
    "Inazuma Eleven 2",
    "Inazuma Eleven 3",
    "Inazuma Eleven GO",
    "Inazuma Eleven GO Chrono Stones",
    "Inazuma Eleven GO Galaxy",
    "Inazuma Eleven Strikers",
    "Inazuma Eleven GO Strikers 2013",
    "Inazuma Eleven SD",
    "Inazuma Eleven Eiyū-tachi no Great Road",
    "Inazuma Eleven Anime",
    "Inazuma Eleven Movie"
  ]

  setInterval(function(){
    let status = statuses[Math.floor(Math.random() * statuses.length)]
    var type
    if(status === "Inazuma Eleven Anime" || status === "Inazuma Eleven Movie") type = "WATCHING"
    else type = "PLAYING"
    bot.user.setPresence({status : 'dnd', activity: { name: status, type: type }})
  }, Math.floor(Math.random() * 60000))

})

bot.on("message", async message => {
  if(!message.content.startsWith(config.prefix) || !message.member.hasPermission('ADMINISTRATOR') || message.author.bot || message.channel.type === "dm") return

  content = message.content.split(" ").filter(word => word != '')

  if(content[0] === "$addmatch") fs.appendFile('logs.txt', `${getCurrentDate()} - ${message.author.tag} (${message.author.id}) executed : ${message.content} (${getName(toDiscordId(content[2]))} et ${getName(toDiscordId(content[3]))})\n`, function (err){});

  fs.appendFile('logs.txt', `${getCurrentDate()} - ${message.author.tag} (${message.author.id}) executed : ${message.content}\n`, function (err){});
  /*f(content[0] === "$add"){
    if(content[1] === "GO" || content[1] === "CS" || content[1] === "STR" || content[1] === "GX"){
        addPlayer(content[1], content[2], content[3], content[4], content[5], content[6])
        message.reply(`Adding ${content[2]} on ${content[1]} with ${content[3]} pts ${content[4]}/${content[5]} and ${content[6]} matchs`).then(msg => {
          msg.delete({timeout: 5000})
        });
        message.delete()
    }else{
      message.reply("Wrong game.").then(msg => {
        msg.delete({timeout: 3000})
      });
      message.delete()
    }
  }*/

  if(content[0] === "$addmatch"){
    if(content[1] === "GO" || content[1] === "CS" || content[1] === "STR" || content[1] === "GX"){
      if(content[2] != content[3]){
        addMatch(content[1], toDiscordId(content[2]), toDiscordId(content[3]), content[4], content[5], content[6], content[7])
        message.reply(`Adding new match on ${content[1]} with <@${toDiscordId(content[2])}> vs <@${toDiscordId(content[3])}> and with a score of ${content[4]}/${content[5]}`).then(msg => {
          msg.delete({timeout: 5000})
        });
        message.delete()
      }else{
        message.reply("Same players.").then(msg => {
          msg.delete({timeout: 3000})
        });
        message.delete()
      }
    }else{
      message.reply("Wrong game.").then(msg => {
        msg.delete({timeout: 3000})
      });
      message.delete()
    }
  }

  if(content[0] === "$clearleads"){
    if(content[1] === "GO" || content[1] === "CS" || content[1] === "STR" || content[1] === "GX" || content[1] === "all"){
      clearLeads(content[1])
      message.reply(`Clearing Leaderboard for ${content[1]}`).then(msg => {
        msg.delete({timeout: 5000})
      });
      message.delete()
    }else{
      message.reply("Wrong game.").then(msg => {
        msg.delete({timeout: 3000})
      });
      message.delete()
    }
  }

  if(content[0] === "$clearplayer"){
    if(content[1] === "GO" || content[1] === "CS" || content[1] === "STR" || content[1] === "GX" || content[1] === "all"){
      clearPlayer(content[1], toDiscordId(content[2]))
      message.reply(`Clearing Leaderboard for ${content[2]} on ${content[1]}`).then(msg => {
        msg.delete({timeout: 5000})
      });
      message.delete()
    }else{
      message.reply("Wrong game.").then(msg => {
        msg.delete({timeout: 3000})
      });
      message.delete()
    }
  }

  if(content[0] === "$setdisplay"){
    afficherStatsSet(message.channel)
    message.delete()
  }

  /*if(content[0] === "$display"){
    afficherStats(message.channel)
    message.delete()
  }*/

  if(content[0] === "$roles"){
    embedRoles(message.channel)
    message.delete()
  }

})

function embedRoles(channel){
  /*const language = new Discord.MessageEmbed()
    .setColor('#E1002C')
    .setDescription('__**Languages Setup**__\nReact with an emoji to get a role !')
    .addField('Roles :',':flag_fr: -> Français\n:globe_with_meridians: -> International')
    .setFooter('PEGASUS INAZUMA', 'https://i.imgur.com/8aZqZ9D.jpg')

  const notif = new Discord.MessageEmbed()
    .setColor('#E1002C')
    .setDescription('__**Notifications Setup**__\nReact with an emoji to get a role !')
    .addField('Roles :',':trophy: -> Tournois / Tournaments\n:bell: -> Réseaux Sociaux / Social Media')
    .setFooter('PEGASUS INAZUMA', 'https://i.imgur.com/8aZqZ9D.jpg')*/

  const match = new Discord.MessageEmbed()
    .setColor('#E1002C')
    .setDescription('__**Matchmaking Arena Setup**__\nReact with an emoji to get a role !')
    .addField('Roles :',':smiling_imp: -> Matchmaking GO\n:timer: -> Matchmaking CS\n:alien: -> Matchmaking Galaxy\n:soccer: -> Matchmaking Strikers 2013')
    .setFooter('PEGASUS INAZUMA', 'https://i.imgur.com/8aZqZ9D.jpg')

  //channel.send(language)
  //channel.send(notif)
  channel.send(match)
}

function addPlayer(jeu, id, points, goalScored, goalConceded, nbMatch){
  if(jeu === "GO"){
    leadGO[id] = {
      pts: points,
      goalScored: goalScored,
      goalConceded:  goalConceded,
      nbMatch: nbMatch,
      lastPos: 1000,
      lastPosIcon: "",
      lastName: ""
    };
  }else if(jeu === "CS"){
    leadCS[id] = {
      pts: points,
      goalScored: goalScored,
      goalConceded:  goalConceded,
      nbMatch: nbMatch,
      lastPos: 1000,
      lastPosIcon: "",
      lastName: ""
    };
  }else if(jeu === "GX"){
    leadGX[id] = {
      pts: points,
      goalScored: goalScored,
      goalConceded:  goalConceded,
      nbMatch: nbMatch,
      lastPos: 1000,
      lastPosIcon: "",
      lastName: ""
    };
  }else if(jeu === "STR"){
    leadSTR[id] = {
      pts: points,
      goalScored: goalScored,
      goalConceded:  goalConceded,
      nbMatch: nbMatch,
      lastPos: 1000,
      lastPosIcon: "",
      lastName: ""
    };
  }
  saveStats()
}

function addMatch(jeu, j1, j2, g1, g2, param, param2){

  var name1 = getName(j1)
  var name2 = getName(j2)

  var win
  var bonus

  if(param != undefined){
    if(param.includes("win")) win = param.split(":")[1]
    if(param.includes("bonus")) bonus = param.split(":")[1]
  }

  if(param2 != undefined){
    if(param2.includes("win")) win = param2.split(":")[1]
    if(param2.includes("bonus")) bonus = param2.split(":")[1]
  }

  if(bonus == undefined) bonus = 1

  if(jeu === "GO"){
    if(leadGO[j1] == undefined) addPlayer("GO", j1, 0, 0, 0, 0)
    if(leadGO[j2] == undefined) addPlayer("GO", j2, 0, 0, 0, 0)

    if(Number(g1) > Number(g2)){
      leadGO[j1].pts += 4*bonus
      leadGO[j2].pts += 1*bonus
    }else if(Number(g1) == Number(g2)){
      if(win == 1){
        leadGO[j1].pts += 4*bonus
        leadGO[j2].pts += 1*bonus
      }
      else if(win == 2){
        leadGO[j1].pts += 1*bonus
        leadGO[j2].pts += 4*bonus
      }else{
        leadGO[j1].pts += 2*bonus
        leadGO[j2].pts += 2*bonus
      }
    }else if(Number(g1) < Number(g2)){
      leadGO[j1].pts += 1*bonus
      leadGO[j2].pts += 4*bonus
    }

    leadGO[j1].goalScored += Number(g1)
    leadGO[j2].goalScored += Number(g2)
    leadGO[j1].goalConceded += Number(g2)
    leadGO[j2].goalConceded += Number(g1)

    leadGO[j1].nbMatch += 1
    leadGO[j2].nbMatch += 1

    leadGO[j1].lastName = name1
    leadGO[j2].lastName = name2

  }else if(jeu === "CS"){

    if(leadCS[j1] == undefined) addPlayer("CS", j1, 0, 0, 0, 0)
    if(leadCS[j2] == undefined) addPlayer("CS", j2, 0, 0, 0, 0)

    if(Number(g1) > Number(g2)){
      leadCS[j1].pts += 4*bonus
      leadCS[j2].pts += 1*bonus
    }else if(Number(g1) == Number(g2)){
      if(win == 1){
        leadCS[j1].pts += 4*bonus
        leadCS[j2].pts += 1*bonus
      }
      else if(win == 2){
        leadCS[j1].pts += 1*bonus
        leadCS[j2].pts += 4*bonus
      }else{
        leadCS[j1].pts += 2*bonus
        leadCS[j2].pts += 2*bonus
      }
    }else if(Number(g1) < Number(g2)){
      leadCS[j1].pts += 1*bonus
      leadCS[j2].pts += 4*bonus
    }

    leadCS[j1].goalScored += Number(g1)
    leadCS[j2].goalScored += Number(g2)
    leadCS[j1].goalConceded += Number(g2)
    leadCS[j2].goalConceded += Number(g1)

    leadCS[j1].nbMatch += 1
    leadCS[j2].nbMatch += 1

    leadCS[j1].lastName = name1
    leadCS[j2].lastName = name2

  }else if(jeu === "GX"){

    if(leadGX[j1] == undefined) addPlayer("GX", j1, 0, 0, 0, 0)
    if(leadGX[j2] == undefined) addPlayer("GX", j2, 0, 0, 0, 0)

    if(Number(g1) > Number(g2)){
      leadGX[j1].pts += 4*bonus
      leadGX[j2].pts += 1*bonus
    }else if(Number(g1) == Number(g2)){
      if(win == 1){
        leadGX[j1].pts += 4*bonus
        leadGX[j2].pts += 1*bonus
      }
      else if(win == 2){
        leadGX[j1].pts += 1*bonus
        leadGX[j2].pts += 4*bonus
      }else{
        leadGX[j1].pts += 2*bonus
        leadGX[j2].pts += 2*bonus
      }
    }else if(Number(g1) < Number(g2)){
      leadGX[j1].pts += 1*bonus
      leadGX[j2].pts += 4*bonus
    }

    leadGX[j1].goalScored += Number(g1)
    leadGX[j2].goalScored += Number(g2)
    leadGX[j1].goalConceded += Number(g2)
    leadGX[j2].goalConceded += Number(g1)

    leadGX[j1].nbMatch += 1
    leadGX[j2].nbMatch += 1

    leadGX[j1].lastName = name1
    leadGX[j2].lastName = name2
  }else if(jeu === "STR"){

    if(leadSTR[j1] == undefined) addPlayer("STR", j1, 0, 0, 0, 0)
    if(leadSTR[j2] == undefined) addPlayer("STR", j2, 0, 0, 0, 0)

    if(Number(g1) > Number(g2)){
      leadSTR[j1].pts += 4*bonus
      leadSTR[j2].pts += 1*bonus
    }else if(Number(g1) == Number(g2)){
      leadSTR[j1].pts += 2*bonus
      leadSTR[j2].pts += 2*bonus
    }else if(Number(g1) < Number(g2)){
      leadSTR[j1].pts += 1*bonus
      leadSTR[j2].pts += 4*bonus
    }

    leadSTR[j1].goalScored += Number(g1)
    leadSTR[j2].goalScored += Number(g2)
    leadSTR[j1].goalConceded += Number(g2)
    leadSTR[j2].goalConceded += Number(g1)

    leadSTR[j1].nbMatch += 1
    leadSTR[j2].nbMatch += 1

    leadSTR[j1].lastName = name1
    leadSTR[j2].lastName = name2

  }

  saveStats()
  updateMsg()
}

function clearPlayer(jeu, id){
  if(jeu === "all"){
    clearPlayerAll(id)
  }
  if(jeu === "GO"){
    delete leadGO[id]
  }else if(jeu === "CS"){
    delete leadCS[id]
  }else if(jeu === "GX"){
    delete leadGX[id]
  }else if(jeu === "STR"){
    delete leadSTR[id]
  }
  saveStats()
  updateMsg()
}

function clearPlayerAll(id){
  delete leadGO[id]
  delete leadCS[id]
  delete leadGX[id]
  delete leadSTR[id]

  saveStats()
  updateMsg()
}

function clearLeads(jeu){
  if(jeu === "all"){
    clearLeadsAll()
  }
  if(jeu === "GO"){
    for(var id in leadGO) delete leadGO[id]
  }else if(jeu === "CS"){
    for(var id in leadCS) delete leadCS[id]
  }else if(jeu === "GX"){
    for(var id in leadGX) delete leadGX[id]
  }else if(jeu === "STR"){
    for(var id in leadSTR) delete leadSTR[id]
  }

  saveStats()
  updateMsg()
}

function clearLeadsAll(){
  for(var id in leadGO) delete leadGO[id]
  for(var id in leadCS) delete leadCS[id]
  for(var id in leadGX) delete leadGX[id]
  for(var id in leadSTR) delete leadSTR[id]

  saveStats()
  updateMsg()
}

function getStringMsgGO(){
  var GO = "------------------------------------------------\nRanking Inazuma Eleven GO :\n"
  var i = -1
  var temp = ""
  var max = {
    pts: 0,
    goalScored: 0,
    goalConceded:  0,
    nbMatch: 0
  };

  var maxKey
  var maxKeys = []

  GO += "\nX.                 NOM                 |    PTS    |    BUTS    |    DIFF  BUTS    |    NB MATCHS    |     :repeat:"

  for(var x in leadGO){
    for(var item in leadGO){
      if(!maxKeys.includes(item) && comparePlayer(max, leadGO[item]) == -1){
        max = leadGO[item]
        maxKey = item
      }
    }
    max = {
      pts: 0,
      goalScored: 0,
      goalConceded:  0,
      nbMatch: 0
    };
    maxKeys.push(maxKey)

    if(maxKey != undefined){
      i += 1
      if(leadGO[maxKey].lastPos == 1000) leadGO[maxKey].lastPosIcon = " |    :new:"
      else if(leadGO[maxKey].lastPos > i+1) leadGO[maxKey].lastPosIcon = " |    :arrow_double_up:"
      else if(leadGO[maxKey].lastPos < i+1) leadGO[maxKey].lastPosIcon = " |    :arrow_double_down:"
      else if(leadGO[maxKey].lastPos == i+1) leadGO[maxKey].lastPosIcon = " |    :pause_button:"

      temp = (`\n${i+1} - <@${maxKey}>${getSpace(15-(leadGO[maxKey].lastName.length)+1)}=>   ${leadGO[maxKey].pts}pts    |   ${leadGO[maxKey].goalScored}/${leadGO[maxKey].goalConceded}   |     ${leadGO[maxKey].goalScored-leadGO[maxKey].goalConceded}     |   ${leadGO[maxKey].nbMatch} matchs  ${leadGO[maxKey].lastPosIcon}`)
      if((temp.length + GO.length)< 2000) GO += temp

      leadGO[maxKey].lastPos = i+1
    }
  }

  return GO
}

function getStringMsgCS(){
  var CS = "------------------------------------------------\nRanking Inazuma Eleven GO Chrono Stones :\n"
  var i = -1
  var temp = ""
  var max = {
    pts: 0,
    goalScored: 0,
    goalConceded:  0,
    nbMatch: 0
  };

  var maxKey
  var maxKeys = []

  CS += "\nX.                 NOM                 |    PTS    |    BUTS    |    DIFF  BUTS    |    NB MATCHS    |     :repeat:"

  for(var x in leadCS){
    for(var item in leadCS){
      if(!maxKeys.includes(item) && comparePlayer(max, leadCS[item]) == -1){
        max = leadCS[item]
        maxKey = item
      }
    }
    max = {
      pts: 0,
      goalScored: 0,
      goalConceded:  0,
      nbMatch: 0
    };
    maxKeys.push(maxKey)

    if(maxKey != undefined){
      i += 1
      if(leadCS[maxKey].lastPos == 1000) leadCS[maxKey].lastPosIcon = " |    :new:"
      else if(leadCS[maxKey].lastPos > i+1) leadCS[maxKey].lastPosIcon = " |    :arrow_double_up:"
      else if(leadCS[maxKey].lastPos < i+1) leadCS[maxKey].lastPosIcon = " |    :arrow_double_down:"
      else if(leadCS[maxKey].lastPos == i+1) leadCS[maxKey].lastPosIcon = " |    :pause_button:"

      temp = (`\n${i+1} - <@${maxKey}>${getSpace(15-(leadCS[maxKey].lastName.length)+1)}=>   ${leadCS[maxKey].pts}pts    |   ${leadCS[maxKey].goalScored}/${leadCS[maxKey].goalConceded}   |     ${leadCS[maxKey].goalScored-leadCS[maxKey].goalConceded}     |   ${leadCS[maxKey].nbMatch} matchs  ${leadCS[maxKey].lastPosIcon}`)
      if((temp.length + CS.length)< 2000) CS += temp

      leadCS[maxKey].lastPos = i+1
    }
  }

  return CS
}

function getStringMsgGX(){
  var GX = "------------------------------------------------\nRanking Inazuma Eleven GO Galaxy :\n"
  var i = -1
  var temp = ""
  var max = {
    pts: 0,
    goalScored: 0,
    goalConceded:  0,
    nbMatch: 0
  };

  var maxKey
  var maxKeys = []

  GX += "\nX.                 NOM                 |    PTS    |    BUTS    |    DIFF  BUTS    |    NB MATCHS    |     :repeat:"

  for(var x in leadGX){
    for(var item in leadGX){
      if(!maxKeys.includes(item) && comparePlayer(max, leadGX[item]) == -1){
        max = leadGX[item]
        maxKey = item
      }
    }
    max = {
      pts: 0,
      goalScored: 0,
      goalConceded:  0,
      nbMatch: 0
    };
    maxKeys.push(maxKey)

    if(maxKey != undefined){
      i += 1
      if(leadGX[maxKey].lastPos == 1000) leadGX[maxKey].lastPosIcon = " |    :new:"
      else if(leadGX[maxKey].lastPos > i+1) leadGX[maxKey].lastPosIcon = " |    :arrow_double_up:"
      else if(leadGX[maxKey].lastPos < i+1) leadGX[maxKey].lastPosIcon = " |    :arrow_double_down:"
      else if(leadGX[maxKey].lastPos == i+1) leadGX[maxKey].lastPosIcon = " |    :pause_button:"

      temp = (`\n${i+1} - <@${maxKey}>${getSpace(15-(leadGX[maxKey].lastName.length)+1)}=>   ${leadGX[maxKey].pts}pts    |   ${leadGX[maxKey].goalScored}/${leadGX[maxKey].goalConceded}   |     ${leadGX[maxKey].goalScored-leadGX[maxKey].goalConceded}     |   ${leadGX[maxKey].nbMatch} matchs  ${leadGX[maxKey].lastPosIcon}`)
      if((temp.length + GX.length)< 2000) v += temp

      leadGX[maxKey].lastPos = i+1
    }
  }

  return GX
}

function getStringMsgSTR(){
  var STR = "------------------------------------------------\nRanking Inazuma Eleven GO Strikers 2013 :\n"
  var i = -1
  var temp = ""
  var max = {
    pts: 0,
    goalScored: 0,
    goalConceded:  0,
    nbMatch: 0
  };

  var maxKey
  var maxKeys = []

  STR += "\nX.                 NOM                 |    PTS    |    BUTS    |    DIFF  BUTS    |    NB MATCHS    |     :repeat:"

  for(var x in leadSTR){
    for(var item in leadSTR){
      if(!maxKeys.includes(item) && comparePlayer(max, leadSTR[item]) == -1){
        max = leadSTR[item]
        maxKey = item
      }
    }
    max = {
      pts: 0,
      goalScored: 0,
      goalConceded:  0,
      nbMatch: 0
    };
    maxKeys.push(maxKey)

    if(maxKey != undefined){
      i += 1
      if(leadSTR[maxKey].lastPos == 1000) leadSTR[maxKey].lastPosIcon = " |    :new:"
      else if(leadSTR[maxKey].lastPos > i+1) leadSTR[maxKey].lastPosIcon = " |    :arrow_double_up:"
      else if(leadSTR[maxKey].lastPos < i+1) leadSTR[maxKey].lastPosIcon = " |    :arrow_double_down:"
      else if(leadSTR[maxKey].lastPos == i+1) leadSTR[maxKey].lastPosIcon = " |    :pause_button:"

      temp = (`\n${i+1} - <@${maxKey}>${getSpace(15-(leadSTR[maxKey].lastName.length)+1)}=>   ${leadSTR[maxKey].pts}pts    |   ${leadSTR[maxKey].goalScored}/${leadSTR[maxKey].goalConceded}   |     ${leadSTR[maxKey].goalScored-leadSTR[maxKey].goalConceded}     |   ${leadSTR[maxKey].nbMatch} matchs  ${leadSTR[maxKey].lastPosIcon}`)
      if((temp.length + STR.length)< 2000) STR += temp

      leadSTR[maxKey].lastPos = i+1
    }
  }

  return STR
}

function getStringMsg(){
  var GO = getStringMsgGO()
  var CS = getStringMsgCS()
  var GX = getStringMsgGX()
  var STR = getStringMsgSTR()

  var msg = {}

  msg["GO"] = GO
  msg["CS"] = CS
  msg["GX"] = GX
  msg["STR"] = STR

  saveStats()
  return msg
}

function getCurrentDate(){
  var today = new Date()

  var mois = (today.getMonth()+1)
  var jour = today.getDate()
  var heure = today.getHours()
  var minute = today.getMinutes()
  var seconde = today.getSeconds()

  if(mois < 10) mois = "0" + mois.toString()
  if(jour < 10) jour = "0" + jour.toString()
  if(heure < 10) heure = "0" + heure.toString()
  if(minute < 10) minute = "0" + minute.toString()
  if(seconde < 10) seconde = "0" + seconde.toString()

  var date = today.getFullYear()+'-'+mois+'-'+jour
  var time = heure+':'+minute+':'+seconde

  return date+' '+time
}

function getName(id){
  var temp = bot.guilds.cache.get(config.serv).members.cache.get(id).nickname
  if(temp == null) temp = "null"
  return temp
}

function getSpace(nb){
  var temp = []
  for(i = 0; i < nb; i++){
    temp += " "
  }
  return temp
}

function afficherStatsSet(channel){

  var msg = getStringMsg()

  channel.send(msg["GO"]).then(m => {
    fs.writeFileSync("./ID/GO", m.id)
  });
  channel.send(msg["CS"]).then(m => {
    fs.writeFileSync("./ID/GO", m.id)
  });
  channel.send(msg["GX"]).then(m => {
    fs.writeFileSync("./ID/GX", m.id)
  });
  channel.send(msg["STR"]).then(m => {
    fs.writeFileSync("./ID/STR", m.id)
  });
  channel.send(`------------------------------------------------\nLast Updated ${getCurrentDate()}.`).then(m => {
    fs.writeFileSync("./ID/TIME", m.id);
  });

  fs.writeFileSync("./ID/CHAN", channel.id);

}

/*function afficherStats(channel){

  var msg = getStringMsg()

  channel.send(msg["GO"])
  channel.send(msg["CS"])
  channel.send(msg["GX"])
  channel.send(msg["STR"])
  channel.send(`------------------------------------------------\nLast Updated ${getCurrentDate()}.`)

}*/

function updateMsg(){

  var msg = getStringMsg()

  var go = fs.readFileSync('./ID/GO', "utf8")
  var cs = fs.readFileSync('./ID/CS', "utf8")
  var gx = fs.readFileSync('./ID/GX', "utf8")
  var str = fs.readFileSync('./ID/STR', "utf8")
  var time = fs.readFileSync('./ID/TIME', "utf8")
  var chan = fs.readFileSync('./ID/CHAN', "utf8")

  bot.channels.cache.get(chan).messages.fetch(go)
    .then(message => message.edit(msg["GO"]))

  bot.channels.cache.get(chan).messages.fetch(cs)
    .then(message => message.edit(msg["CS"]))

  bot.channels.cache.get(chan).messages.fetch(gx)
    .then(message => message.edit(msg["GX"]))

  bot.channels.cache.get(chan).messages.fetch(str)
    .then(message => message.edit(msg["STR"]))

  bot.channels.cache.get(chan).messages.fetch(time)
    .then(message => message.edit(`------------------------------------------------\nLast Updated ${getCurrentDate()}.`))

}

function toDiscordId(tag){
  if(tag.includes("!") || tag.includes("&")) return tag.slice(3,(tag.length)-1)
  else return tag.slice(2,(tag.length)-1)
}

function comparePlayer(a, b){

  if(Number(a.pts) > Number(b.pts)) return 1
  else if(Number(a.pts) < Number(b.pts)) return -1
  else{

    if(Number(a.nbMatch) < Number(b.nbMatch)) return 1
    else if(Number(a.nbMatch) > Number(b.nbMatch)) return -1
    else{

      var diffA = Number(a.goalScored) - Number(a.goalConceded)
      var diffB = Number(b.goalScored) - Number(b.goalConceded)

      if(diffA > diffB) return 1
      if(diffA < diffB) return -1
      else{

        return 1
      }
    }
  }
}

function saveStats(){
  fs.writeFile("./LEADS/GO.json", JSON.stringify(leadGO, null, 4), function(err) {})
  fs.writeFile("./LEADS/CS.json", JSON.stringify(leadCS, null, 4), function(err) {})
  fs.writeFile("./LEADS/GX.json", JSON.stringify(leadGX, null, 4), function(err) {})
  fs.writeFile("./LEADS/STR.json", JSON.stringify(leadSTR, null, 4), function(err) {})
}

bot.login(config.token)
