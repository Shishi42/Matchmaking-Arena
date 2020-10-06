const Discord = require("discord.js")

const bot = new Discord.Client()
const config = require("./config.json")
const fs = require("fs")
const jsonfile = require ("jsonfile")

var leadSD = {}
var leadCS = {}
var leadSTR = {}
var leadGX = {}

if(fs.existsSync("./LEADS/SD.json")){
  leadSD = jsonfile.readFileSync("./LEADS/SD.json")
}

if(fs.existsSync("./LEADS/CS.json")){
  leadCS = jsonfile.readFileSync("./LEADS/CS.json")
}

if(fs.existsSync("./LEADS/STR.json")){
  leadSTR = jsonfile.readFileSync("./LEADS/STR.json")
}

if(fs.existsSync("./LEADS/GX.json")){
  leadGX= jsonfile.readFileSync("./LEADS/GX.json")
}

bot.on("ready", async () => {

  console.log(`Connecté en tant que ${bot.user.tag}!`)

  bot.channels.cache.get(config.chan_dev).send('Matchmaking Arena est connecté.')

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

  fs.appendFile('logs.txt', `${getCurrentDate()} - ${message.author.tag} (${message.author.id}) executed : ${message.content}\n`, function (err){});

  content = message.content.split(" ").filter(word => word != '')

  /*f(content[0] === "$add"){
    if(content[1] === "SD" || content[1] === "CS" || content[1] === "STR" || content[1] === "GX"){
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
    if(content[1] === "SD" || content[1] === "CS" || content[1] === "STR" || content[1] === "GX"){
      if(content[2] != content[3]){
        addMatch(content[1], content[2], content[3], content[4], content[5], content[6])
        message.reply(`Adding new match on ${content[1]} with ${content[2]} vs ${content[3]} and with a score of ${content[4]}/${content[5]}`).then(msg => {
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
    if(content[1] === "SD" || content[1] === "CS" || content[1] === "STR" || content[1] === "GX" || content[1] === "all"){
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
    if(content[1] === "SD" || content[1] === "CS" || content[1] === "STR" || content[1] === "GX" || content[1] === "all"){
      clearPlayer(content[1], content[2])
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

})

function addPlayer(jeu, id, points, goalScored, goalConceded, nbMatch){
  if(jeu === "SD"){
    leadSD[id] = {
      pts: points,
      goalScored: goalScored,
      goalConceded:  goalConceded,
      nbMatch: nbMatch,
      lastPos: 1000,
      lastPosIcon: ""
    };
  }else if(jeu === "CS"){
    leadCS[id] = {
      pts: points,
      goalScored: goalScored,
      goalConceded:  goalConceded,
      nbMatch: nbMatch,
      lastPos: 1000,
      lastPosIcon: ""
    };
  }else if(jeu === "STR"){
    leadSTR[id] = {
      pts: points,
      goalScored: goalScored,
      goalConceded:  goalConceded,
      nbMatch: nbMatch,
      lastPos: 1000,
      lastPosIcon: ""
    };
  }else if(jeu === "GX"){
    leadGX[id] = {
      pts: points,
      goalScored: goalScored,
      goalConceded:  goalConceded,
      nbMatch: nbMatch,
      lastPos: 1000,
      lastPosIcon: ""
    };
  }
}

function addMatch(jeu, j1, j2, g1, g2){

  if(jeu === "SD"){

    if(leadSD[j1] == undefined) addPlayer("SD", j1, 0, 0, 0, 0)
    if(leadSD[j2] == undefined) addPlayer("SD", j2, 0, 0, 0, 0)

    if(Number(g1) > Number(g2)){
      leadSD[j1].pts += 3
      leadSD[j2].pts += 1
    }else if(Number(g1) == Number(g2)){
      leadSD[j1].pts += 2
      leadSD[j2].pts += 2
    }else if(Number(g1) < Number(g2)){
      leadSD[j1].pts += 1
      leadSD[j2].pts += 3
    }

    leadSD[j1].goalScored += Number(g1)
    leadSD[j2].goalScored += Number(g2)
    leadSD[j1].goalConceded += Number(g2)
    leadSD[j2].goalConceded += Number(g1)

    leadSD[j1].nbMatch ++
    leadSD[j2].nbMatch ++

  }else if(jeu === "CS"){

    if(leadCS[j1] == undefined) addPlayer("CS", j1, 0, 0, 0, 0)
    if(leadCS[j2] == undefined) addPlayer("CS", j2, 0, 0, 0, 0)

    if(Number(g1) > Number(g2)){
      leadCS[j1].pts += 4
      leadCS[j2].pts += 1
    }else if(Number(g1) == Number(g2)){
      leadCS[j1].pts += 2
      leadCS[j2].pts += 2
    }else if(Number(g1) < Number(g2)){
      leadCS[j1].pts += 1
      leadCS[j2].pts += 4
    }

    leadCS[j1].goalScored += Number(g1)
    leadCS[j2].goalScored += Number(g2)
    leadCS[j1].goalConceded += Number(g2)
    leadCS[j2].goalConceded += Number(g1)

    leadCS[j1].nbMatch ++
    leadCS[j2].nbMatch ++

  }else if(jeu === "STR"){

    if(leadSTR[j1] == undefined) addPlayer("STR", j1, 0, 0, 0, 0)
    if(leadSTR[j2] == undefined) addPlayer("STR", j2, 0, 0, 0, 0)

    if(Number(g1) > Number(g2)){
      leadSTR[j1].pts += 4
      leadSTR[j2].pts += 1
    }else if(Number(g1) == Number(g2)){
      leadSTR[j1].pts += 2
      leadSTR[j2].pts += 2
    }else if(Number(g1) < Number(g2)){
      leadSTR[j1].pts += 1
      leadSTR[j2].pts += 4
    }

    leadSTR[j1].goalScored += Number(g1)
    leadSTR[j2].goalScored += Number(g2)
    leadSTR[j1].goalConceded += Number(g2)
    leadSTR[j2].goalConceded += Number(g1)

    leadSTR[j1].nbMatch ++
    leadSTR[j2].nbMatch ++

  }else if(jeu === "GX"){

    if(leadGX[j1] == undefined) addPlayer("GX", j1, 0, 0, 0, 0)
    if(leadGX[j2] == undefined) addPlayer("GX", j2, 0, 0, 0, 0)

    if(Number(g1) > Number(g2)){
      leadGX[j1].pts += 4
      leadGX[j2].pts += 1
    }else if(Number(g1) == Number(g2)){
      leadGX[j1].pts += 2
      leadGX[j2].pts += 2
    }else if(Number(g1) < Number(g2)){
      leadGX[j1].pts += 1
      leadGX[j2].pts += 4
    }

    leadGX[j1].goalScored += Number(g1)
    leadGX[j2].goalScored += Number(g2)
    leadGX[j1].goalConceded += Number(g2)
    leadGX[j2].goalConceded += Number(g1)

    leadGX[j1].nbMatch ++
    leadGX[j2].nbMatch ++

  }

  saveStats()
  updateMsg()
}

function clearPlayer(jeu, id){
  if(jeu === "all"){
    clearPlayerAll(id)
  }
  if(jeu === "SD"){
    delete leadSD[id]
  }else if(jeu === "CS"){
    delete leadCS[id]
  }else if(jeu === "STR"){
    delete leadSTR[id]
  }else if(jeu === "GX"){
    delete leadGX[id]
  }
  saveStats()
  updateMsg()
}

function clearPlayerAll(id){
  delete leadSD[id]
  delete leadCS[id]
  delete leadSTR[id]
  delete leadGX[id]

  saveStats()
  updateMsg()
}

function clearLeads(jeu){
  if(jeu === "all"){
    clearLeadsAll()
  }
  if(jeu === "SD"){
    for(var id in leadSD) delete leadSD[id]
  }else if(jeu === "CS"){
    for(var id in leadCS) delete leadCS[id]
  }else if(jeu === "STR"){
    for(var id in leadSTR) delete leadSTR[id]
  }else if(jeu === "GX"){
    for(var id in leadGX) delete leadGX[id]
  }

  saveStats()
  updateMsg()
}

function clearLeadsAll(){
  for(var id in leadSD) delete leadSD[id]
  for(var id in leadCS) delete leadCS[id]
  for(var id in leadSTR) delete leadSTR[id]
  for(var id in leadGX) delete leadGX[id]

  saveStats()
  updateMsg()
}

function getStringMsgSD(){
  var SD = "------------------------------------------------\nLeaderboard SD :\n"
  var i = -1

  var max = {
    pts: 0,
    goalScored: 0,
    goalConceded:  0,
    nbMatch: 0
  };

  var maxKey
  var maxKeys = []

  SD += "\nX.           NOM           |    PTS    |    BUTS    |    DIFF BUTS    |    NB MATCHS   "

  for(var x in leadSD){
    for(var item in leadSD){
      if(!maxKeys.includes(item) && comparePlayer(max, leadSD[item]) == -1){
        max = leadSD[item]
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
      if(leadSD[maxKey].lastPos == 1000) leadSD[maxKey].lastPosIcon = " | :new:"
      else if(leadSD[maxKey].lastPos > i+1) leadSD[maxKey].lastPosIcon = " | :arrow_double_up:"
      else if(leadSD[maxKey].lastPos < i+1) leadSD[maxKey].lastPosIcon = " | :arrow_double_down:"
      SD += (`\n${i+1} - ${maxKey}   ${leadSD[maxKey].pts}   ${leadSD[maxKey].goalScored}/${leadSD[maxKey].goalConceded}   ${leadSD[maxKey].goalScored-leadSD[maxKey].goalConceded}   ${leadSD[maxKey].nbMatch} matchs ${leadSD[maxKey].lastPosIcon}`)

      leadSD[maxKey].lastPos = i+1

      saveStats()
    }
  }

  return SD
}

function getStringMsgCS(){
  var CS = "------------------------------------------------\nLeaderboard Chrono Stones :\n"
  var i = -1

  var max = {
    pts: 0,
    goalScored: 0,
    goalConceded:  0,
    nbMatch: 0
  };

  var maxKey
  var maxKeys = []

  CS += "\nX.           NOM           |    PTS    |    BUTS    |    DIFF BUTS    |    NB MATCHS   "

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
      if(leadCS[maxKey].lastPos == 1000) leadCS[maxKey].lastPosIcon = " | :new:"
      else if(leadCS[maxKey].lastPos > i+1) leadCS[maxKey].lastPosIcon = " | :arrow_double_up:"
      else if(leadCS[maxKey].lastPos < i+1) leadCS[maxKey].lastPosIcon = " | :arrow_double_down:"
      CS += (`\n${i+1} - ${maxKey}   ${leadCS[maxKey].pts}   ${leadCS[maxKey].goalScored}/${leadCS[maxKey].goalConceded}   ${leadCS[maxKey].goalScored-leadCS[maxKey].goalConceded}   ${leadCS[maxKey].nbMatch} matchs ${leadCS[maxKey].lastPosIcon}`)

      leadCS[maxKey].lastPos = i+1

      saveStats()
    }
  }

  return CS
}

function getStringMsgSTR(){
  var STR = "------------------------------------------------\nLeaderboard Strikers 2013 :\n"
  var i = -1

  var max = {
    pts: 0,
    goalScored: 0,
    goalConceded:  0,
    nbMatch: 0
  };

  var maxKey
  var maxKeys = []

  STR += "\nX.           NOM           |    PTS    |    BUTS    |    DIFF BUTS    |    NB MATCHS   "

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
      if(leadSTR[maxKey].lastPos == 1000) leadSTR[maxKey].lastPosIcon = " | :new:"
      else if(leadSTR[maxKey].lastPos > i+1) leadSTR[maxKey].lastPosIcon = " | :arrow_double_up:"
      else if(leadSTR[maxKey].lastPos < i+1) leadSTR[maxKey].lastPosIcon = " | :arrow_double_down:"
      STR += (`\n${i+1} - ${maxKey}   ${leadSTR[maxKey].pts}   ${leadSTR[maxKey].goalScored}/${leadSTR[maxKey].goalConceded}   ${leadSTR[maxKey].goalScored-leadSTR[maxKey].goalConceded}   ${leadSTR[maxKey].nbMatch} matchs ${leadSTR[maxKey].lastPosIcon}`)

      leadSTR[maxKey].lastPos = i+1

      saveStats()
    }
  }

  return STR
}

function getStringMsgGX(){
  var GX = "------------------------------------------------\nLeaderboard Galaxy :\n"
  var i = -1

  var max = {
    pts: 0,
    goalScored: 0,
    goalConceded:  0,
    nbMatch: 0
  };

  var maxKey
  var maxKeys = []

  GX += "\nX.           NOM           |    PTS    |    BUTS    |    DIFF BUTS    |    NB MATCHS   "

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
      if(leadGX[maxKey].lastPos == 1000) leadGX[maxKey].lastPosIcon = " | :new:"
      else if(leadGX[maxKey].lastPos > i+1) leadGX[maxKey].lastPosIcon = " | :arrow_double_up:"
      else if(leadGX[maxKey].lastPos < i+1) leadGX[maxKey].lastPosIcon = " | :arrow_double_down:"
      GX += (`\n${i+1} - ${maxKey}   ${leadGX[maxKey].pts}   ${leadGX[maxKey].goalScored}/${leadGX[maxKey].goalConceded}   ${leadGX[maxKey].goalScored-leadGX[maxKey].goalConceded}   ${leadGX[maxKey].nbMatch} matchs ${leadGX[maxKey].lastPosIcon}`)

      leadGX[maxKey].lastPos = i+1

      saveStats()
    }
  }

  return GX
}

function getStringMsg(){
  var SD = getStringMsgSD()
  var CS = getStringMsgCS()
  var STR = getStringMsgSTR()
  var GX = getStringMsgGX()

  var msg = {}

  msg["SD"] = SD
  msg["CS"] = CS
  msg["STR"] = STR
  msg["GX"] = GX

  return msg
}

function getCurrentDate(){
  var today = new Date()

  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
  var time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds()

  return date+' '+time
}

function afficherStatsSet(channel){

  var msg = getStringMsg()

  channel.send(msg["SD"]).then(m => {
    fs.writeFileSync("./ID/SD", m.id)
  });
  channel.send(msg["CS"]).then(m => {
    fs.writeFileSync("./ID/CS", m.id)
  });
  channel.send(msg["STR"]).then(m => {
    fs.writeFileSync("./ID/STR", m.id)
  });
  channel.send(msg["GX"]).then(m => {
    fs.writeFileSync("./ID/GX", m.id)
  });
  channel.send(`------------------------------------------------\nLast Updated ${getCurrentDate()}.`).then(m => {
    fs.writeFileSync("./ID/TIME", m.id);
  });

  fs.writeFileSync("./ID/CHAN", channel.id);

}

function updateMsg(){

  var msg = getStringMsg()

  var sd = fs.readFileSync('./ID/SD', "utf8")
  var cs = fs.readFileSync('./ID/CS', "utf8")
  var str = fs.readFileSync('./ID/STR', "utf8")
  var gx = fs.readFileSync('./ID/GX', "utf8")
  var time = fs.readFileSync('./ID/TIME', "utf8")
  var chan = fs.readFileSync('./ID/CHAN', "utf8")

  bot.channels.cache.get(chan).messages.fetch(sd)
    .then(message => message.edit(msg["SD"]))

  bot.channels.cache.get(chan).messages.fetch(cs)
    .then(message => message.edit(msg["CS"]))

  bot.channels.cache.get(chan).messages.fetch(str)
    .then(message => message.edit(msg["STR"]))

  bot.channels.cache.get(chan).messages.fetch(gx)
    .then(message => message.edit(msg["GX"]))

  bot.channels.cache.get(chan).messages.fetch(time)
    .then(message => message.edit(`------------------------------------------------\nLast Updated ${getCurrentDate()}.`))

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
  fs.writeFile("./LEADS/SD.json", JSON.stringify(leadSD, null, 4), function(err) {})
  fs.writeFile("./LEADS/CS.json", JSON.stringify(leadCS, null, 4), function(err) {})
  fs.writeFile("./LEADS/STR.json", JSON.stringify(leadSTR, null, 4), function(err) {})
  fs.writeFile("./LEADS/GX.json", JSON.stringify(leadGX, null, 4), function(err) {})
}


bot.login(config.token)
