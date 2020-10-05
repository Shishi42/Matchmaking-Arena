const Discord = require("discord.js")

const bot = new Discord.Client()
const config = require("./config.json")
const fs = require("fs")
const jsonfile = require ("jsonfile")

var leadSD = {}
var leadCS = {}
var leadGS = {}

if(fs.existsSync("./LEADS/SD.json")){
  leadSD = jsonfile.readFileSync("./LEADS/SD.json")
}

if(fs.existsSync("./LEADS/CS.json")){
  leadCS = jsonfile.readFileSync("./LEADS/CS.json")
}

if(fs.existsSync("./LEADS/GS.json")){
  leadGS = jsonfile.readFileSync("./LEADS/GS.json")
}

bot.on("ready", async () => {

  console.log(`Connecté en tant que ${bot.user.tag}!`)

  bot.channels.cache.get(config.chan_dev).send('Matchmaking Arena est connecté.').then(msg => {
    msg.delete({timeout: 3000})
  });

  //bot.channels.cache.get(config.chan_dev).send('------------------------------------------------')

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
  if((message.author.id != config.bot_owner && message.author.id != config.bot_owner2) || message.author.bot || message.channel.type === "dm" || !message.content.startsWith(config.prefix)) return

  fs.appendFile('logs.txt', `${getCurrentDate()} - ${message.author.tag} (${message.author.id}) executed : ${message.content}\n`, function (err){});

  content = message.content.split(" ")

  /*f(content[0] === "$add"){
    if(content[1] === "SD" || content[1] === "CS" || content[1] === "GS"){
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

  if(content[0] === "$addMatch"){
    if(content[1] === "SD" || content[1] === "CS" || content[1] === "GS"){
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

  if(content[0] === "$clearLeads"){
    if(content[1] === "SD" || content[1] === "CS" || content[1] === "GS"|| content[1] === "all"){
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

  if(content[0] === "$clearPlayer"){
    if(content[1] === "SD" || content[1] === "CS" || content[1] === "GS"|| content[1] === "all"){
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
  }else if(jeu === "GS"){
    leadGS[id] = {
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
      leadCS[j1].pts += 3
      leadCS[j2].pts += 1
    }else if(Number(g1) == Number(g2)){
      leadCS[j1].pts += 2
      leadCS[j2].pts += 2
    }else if(Number(g1) < Number(g2)){
      leadCS[j1].pts += 1
      leadCS[j2].pts += 3
    }

    leadCS[j1].goalScored += Number(g1)
    leadCS[j2].goalScored += Number(g2)
    leadCS[j1].goalConceded += Number(g2)
    leadCS[j2].goalConceded += Number(g1)

    leadCS[j1].nbMatch ++
    leadCS[j2].nbMatch ++

  }else if(jeu === "GS"){

    if(leadGS[j1] == undefined) addPlayer("GS", j1, 0, 0, 0, 0)
    if(leadGS[j2] == undefined) addPlayer("GS", j2, 0, 0, 0, 0)

    if(Number(g1) > Number(g2)){
      leadGS[j1].pts += 3
      leadGS[j2].pts += 1
    }else if(Number(g1) == Number(g2)){
      leadGS[j1].pts += 2
      leadGS[j2].pts += 2
    }else if(Number(g1) < Number(g2)){
      leadGS[j1].pts += 1
      leadGS[j2].pts += 3
    }

    leadGS[j1].goalScored += Number(g1)
    leadGS[j2].goalScored += Number(g2)
    leadGS[j1].goalConceded += Number(g2)
    leadGS[j2].goalConceded += Number(g1)

    leadGS[j1].nbMatch ++
    leadGS[j2].nbMatch ++

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
  }else if(jeu === "GS"){
    delete leadGS[id]
  }
  saveStats()
  updateMsg()
}

function clearPlayerAll(id){
  delete leadSD[id]
  delete leadCS[id]
  delete leadGS[id]

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
  }else if(jeu === "GS"){
    for(var id in leadGS) delete leadGS[id]
  }
  saveStats()
  updateMsg()
}

function clearLeadsAll(){
  for(var id in leadSD) delete leadSD[id]
  for(var id in leadCS) delete leadCS[id]
  for(var id in leadGS) delete leadGS[id]

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
  var CS = "------------------------------------------------\nLeaderboard CS :\n"
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

function getStringMsgGS(){
  var GS = "------------------------------------------------\nLeaderboard GS :\n"
  var i = -1

  var max = {
    pts: 0,
    goalScored: 0,
    goalConceded:  0,
    nbMatch: 0
  };

  var maxKey
  var maxKeys = []

  GS += "\nX.           NOM           |    PTS    |    BUTS    |    DIFF BUTS    |    NB MATCHS   "

  for(var x in leadGS){
    for(var item in leadGS){
      if(!maxKeys.includes(item) && comparePlayer(max, leadGS[item]) == -1){
        max = leadGS[item]
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
      if(leadGS[maxKey].lastPos == 1000) leadGS[maxKey].lastPosIcon = " | :new:"
      else if(leadGS[maxKey].lastPos > i+1) leadGS[maxKey].lastPosIcon = " | :arrow_double_up:"
      else if(leadGS[maxKey].lastPos < i+1) leadGS[maxKey].lastPosIcon = " | :arrow_double_down:"
      GS += (`\n${i+1} - ${maxKey}   ${leadGS[maxKey].pts}   ${leadGS[maxKey].goalScored}/${leadGS[maxKey].goalConceded}   ${leadGS[maxKey].goalScored-leadGS[maxKey].goalConceded}   ${leadGS[maxKey].nbMatch} matchs ${leadGS[maxKey].lastPosIcon}`)

      leadGS[maxKey].lastPos = i+1

      saveStats()
    }
  }

  return GS
}

function getStringMsg(){
  var SD = getStringMsgSD()
  var CS = getStringMsgCS()
  var GS = getStringMsgGS()

  var msg = {}

  msg["SD"] = SD
  msg["CS"] = CS
  msg["GS"] = GS

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
  channel.send(msg["GS"]).then(m => {
    fs.writeFileSync("./ID/GS", m.id)
  });
  channel.send(`------------------------------------------------\nLast Updated ${getCurrentDate()}.`).then(m => {
    fs.writeFileSync("./ID/TIME", m.id);
  });

}

function updateMsg(){

  var msg = getStringMsg()

  var sd = fs.readFileSync('./ID/SD', "utf8")
  var cs = fs.readFileSync('./ID/CS', "utf8")
  var gs = fs.readFileSync('./ID/GS', "utf8")
  var time = fs.readFileSync('./ID/TIME', "utf8")

  bot.channels.cache.get(config.chan_dev).messages.fetch(sd)
    .then(message => message.edit(msg["SD"]))

  bot.channels.cache.get(config.chan_dev).messages.fetch(cs)
    .then(message => message.edit(msg["CS"]))

  bot.channels.cache.get(config.chan_dev).messages.fetch(gs)
    .then(message => message.edit(msg["GS"]))

  bot.channels.cache.get(config.chan_dev).messages.fetch(time)
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
  fs.writeFile("./LEADS/GS.json", JSON.stringify(leadGS, null, 4), function(err) {})
}


bot.login(config.token)
