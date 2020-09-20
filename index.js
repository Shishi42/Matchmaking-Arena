const Discord = require("discord.js");

const bot = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");
const jsonfile = require ("jsonfile");

var statSD = {}
var statCS = {}
var statGS = {}

var configID = {}

if(fs.existsSync("configID.json")){
  configID = jsonfile.readFileSync("configID.json");
}

if(fs.existsSync("statSD.json")){
  statSD = jsonfile.readFileSync("statSD.json");
}

if(fs.existsSync("statCS.json")){
  statCS = jsonfile.readFileSync("statCS.json");
}

if(fs.existsSync("statGS.json")){
  statGS = jsonfile.readFileSync("statGS.json");
}

bot.on("ready", async () => {
  console.log(`Connecté en tant que ${bot.user.tag}!`);
  //bot.channels.cache.get(config.chan_dev).send('Matchmaking Arena est connecté.');
  bot.channels.cache.get(config.chan_dev).send('------------------------------------------------');
})

bot.on("message", async message => {
  if((message.author != config.bot_owner || message.author != config.bot_owner2)|| message.author.bot || message.channel.type === "dm" || !message.content.startsWith(config.prefix)) return;

  content = message.content.split(" ");

  if(content[0] === "$add"){
    if(content[1] === "SD" || content[1] === "CS" || content[1] === "GS"){
        addInStat(content[1], content[2], content[3], content[4], content[5], content[6], content[7], content[8]);
        message.delete();
    }else{
      message.reply("Mauvais jeu.").then(msg => {
        msg.delete({timeout: 3000})
      });
      message.delete();
    }
  }
  /*if(content[0] === "$update"){
    if(content[1] === "SD" || content[1] === "CS" || content[1] === "GS"){
        addInStat(content[1], content[2], content[3], content[4], content[5], content[6], content[7], content[8]);
        message.delete()
    }else message.reply("Mauvais Jeu");
  }
  if(content[0] === "$clear"){
    clearStats();
    message.delete()
  }
  if(content[0] === "$clearJoueur"){
    clearJoueur(content[1], content[2]);
    message.delete()
  }*/
  if(content[0] === "$afficherset"){
    afficherStatsSet(message.channel);
    message.delete()
  }

})

function addInStat(jeu, id, w, d, l, goalScored, goalConceded, nbMatch){
  if(jeu === "SD"){
    statSD[id] = {
      win: w,
      draw: d,
      lose:  l,
      goalScored: goalScored,
      goalConceded:  goalConceded,
      nbMatch: nbMatch
    };
    sortStat("SD");
  }else if(jeu === "CS"){
    statCS[id] = {
      win: w,
      draw: d,
      lose:  l,
      goalScored: goalScored,
      goalConceded:  goalConceded,
      nbMatch: nbMatch
    };
    sortStat("CS");
    jsonfile.writeFileSync("statCS.json", statCS);
  }else{
    statGS[id] = {
      win: w,
      draw: d,
      lose:  l,
      goalScored: goalScored,
      goalConceded:  goalConceded,
      nbMatch: nbMatch
    };
    sortStat("GS");
    jsonfile.writeFileSync("statGS.json", statGS);
  }
  saveStats();
  updateMsg();
}

function saveStats(){
  fs.writeFile("statSD.json", JSON.stringify(statSD, null, 4), function(err) {});
  fs.writeFile("statCS.json", JSON.stringify(statCS, null, 4), function(err) {});
  fs.writeFile("statGS.json", JSON.stringify(statGS, null, 4), function(err) {});
}

function updateStat(jeu, id, w, d, l, goalScored, goalConceded, nbMatch){
  /*if(jeu === "SD"){
    if(message.author.id in statSD === false){
      addInStat("SD", id, w, d, l, goalScored, goalConceded, nbMatch);
    }else{
      statSD[id] = {
        win: w,
        draw: d,
        lose:  l,
        goalScored: goalScored,
        goalConceded:  goalConceded,
        nbMatch: nbMatch
      };
  }
  sortStat("SD");
  jsonfile.writeFileSync("statSD.json", statSD);

  }else if(jeu === "CS"){
    if(message.author.id in statCS === false){
      addInStat("CS", id, w, d, l, goalScored, goalConceded, nbMatch);
    }else{
      statCS[id] = {
        win: w,
        draw: d,
        lose:  l,
        goalScored: goalScored,
        goalConceded:  goalConceded,
        nbMatch: nbMatch
      };
    }
  sortStat("SD");
  jsonfile.writeFileSync("statCS.json", statCS);

  }else{
    if(message.author.id in statGS === false){
      addInStat("GS", id, w, d, l, goalScored, goalConceded, nbMatch);
    }else{
      statGS[id] = {
        win: w,
        draw: d,
        lose:  l,
        goalScored: goalScored,
        goalConceded:  goalConceded,
        nbMatch: nbMatch
      };
    }
  sortStat("GS");
  jsonfile.writeFileSync("statGS.json", statGS);
  }
  updateMsg();*/
}

function getStringMsg(){
  var SD = "Leaderboard SD :\n"
  var CS = "Leaderboard CS :\n"
  var GS = "Leaderboard GS :\n"

  var i = -1;

  for(var item in statSD){
    i += 1;
    pts = statSD[item].win*3 + statSD[item].draw*2 + statSD[item].lose*1;
    SD += (`\n${i+1} - ${item}   ${pts}   ${statSD[item].goalScored}/${statSD[item].goalConceded}   ${statSD[item].goalScored-statSD[item].goalConceded}   ${statSD[item].nbMatch}`);
  }

  i = -1
  for(var item in statCS){
    i += 1;
    pts = statCS[item].win*3 + statCS[item].draw*2 + statCS[item].lose*1;
    SD += (`\n${i+1} - ${item}   ${pts}   ${statCS[item].goalScored}/${statCS[item].goalConceded}   ${statCS[item].goalScored-statCS[item].goalConceded}   ${statCS[item].nbMatch}`);
  }

  i = -1
  for(var item in statGS){
    i += 1;
    pts = statGS[item].win*3 + statGS[item].draw*2 + statGS[item].lose*1;
    SD += (`\n${i+1} - ${item}   ${pts}   ${statGS[item].goalScored}/${statGS[item].goalConceded}   ${statGS[item].goalScored-statGS[item].goalConceded}   ${statGS[item].nbMatch}`);
  }

  var msg = {}

  msg["SD"] = SD;
  msg["CS"] = CS;
  msg["GS"] = GS;

  return msg;
}

function afficherStatsSet(channel){

  var msg = getStringMsg();

  channel.send(msg["SD"]).then(m => {
    configID["IDmsgSD"] = m;
    fs.writeFile("configID.json", JSON.stringify(configID, null, 4), function(err) {});
  });
  channel.send(msg["CS"]).then(m => {
    configID["IDmsgCS"] = m;
    fs.writeFile("configID.json", JSON.stringify(configID, null, 4), function(err) {});
  });
  channel.send(msg["GS"]).then(m => {
    configID["IDmsgGS"] = m;
    fs.writeFile("configID.json", JSON.stringify(configID, null, 4), function(err) {});
  });

  if(fs.existsSync("configID.json")){
    configID = jsonfile.readFileSync("configID.json");
  }

}

function updateMsg(){

  var msg = getStringMsg();

  if(configID["IDmsgSD"]){
    configID["IDmsgSD"].edit(msg["SD"]);
  }

  if(configID["IDmsgCS"]){
    configID["IDmsgCS"].edit(msg["CS"]);
  }

  if(configID["IDmsgGS"]){
    configID["IDmsgGS"].edit(msg["GS"]);
  }
}

function comparerJoueur(a, b){
  /*var ptsA = a.win*3 + a.draw*2 + a.lose*1;
  var ptsB = a.win*3 + a.draw*2 + a.lose*1;

  if(ptsA > ptsB) return 1;
  else if(ptsA < ptsB) return -1;
  else{

    if(a.nbMatch < b.nbMatch) return 1;
    else if(a.nbMatch > b.nbMatch) return -1;
    else{

      var diffButA = a.goalScored - a.goalConceded;
      var diffButB = b.goalScored - b.goalScored;

      if(diffButA > diffButB) return 1;
      if(diffButA < diffButB) return -1;
      else{

        return 1;
      }
    }
  }*/
}

function sortStat(jeu){
  /*if(jeu === "SD") [].slice.call(statSD).sort(comparerJoueur);
  else if(jeu === "CS") statCS.sort(comparerJoueur);
  else statGS.sort(comparerJoueur);*/
}

function clearStats(){
  /*statSD = {};
  statCS = {};
  statGS = {};*/
}

function clearJoueur(id, jeu){
  /*if(jeu === "all"){
    clearJoueurAll(id);
  }
  if(jeu === "SD"){
    statSD[id] = {}
    sortStat("SD");
    jsonfile.writeFileSync("statSD.json", statSD);
  }else if(jeu === "CS"){
    statCS[id] = {}
    sortStat("CS");
    jsonfile.writeFileSync("statCS.json", statCS);
  }else{
    statGS[id] = {}
    sortStat("GS");
    jsonfile.writeFileSync("statGS.json", statGS);
  }*/
}

function clearJoueurAll(id){
  /*clearJoueur("SD", id);
  clearJoueur("CS", id);
  clearJoueur("GS", id);*/
}

bot.login(config.token);
