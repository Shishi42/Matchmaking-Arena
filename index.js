const Discord = require("discord.js");

const bot = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");
const jsonfile = require ("jsonfile");

var statSD = {}
var statCS = {}
var statGS = {}

if(fs.existsSync("stats/statSD.json")){
  statSD = jsonfile.readFileSync("stats/statSD.json");
}

if(fs.existsSync("stats/statCS.json")){
  statCS = jsonfile.readFileSync("stats/statCS.json");
}

if(fs.existsSync("stats/statGS.json")){
  statGS = jsonfile.readFileSync("stats/statGS.json");
}

bot.on("ready", async () => {
  console.log(`Connecté en tant que ${bot.user.tag}!`);
  //bot.channels.cache.get(config.chan_dev).send('Matchmaking Arena est connecté.');
})

bot.on("message", async message => {
  if((message.author != config.bot_owner || message.author != config.bot_owner2)|| message.author.bot || message.channel.type === "dm" || !message.content.startsWith(config.prefix)) return;

  content = message.content.split(" ");

  if(content[0] === "$add"){
    addInStat();
    message.delete()
  }
  if(content[0] === "$update"){
    updateStat();
    message.delete()
  }
  if(content[0] === "$clear"){
    clearStat();
    message.delete()
  }
  if(content[0] === "$afficher"){
    afficherStats();
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
    jsonfile.writeFileSync("statSD.json", statSD);
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
}

function updateStat(jeu, id, w, d, l, goalScored, goalConceded, nbMatch){
  if(jeu === "SD"){
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
}

function comparerJoueur(a, b){
  var ptsA = a.win*3 + a*draw*2 + a.lose*1;
  var ptsB = a.win*3 + a*draw*2 + a.lose*1;

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
  }
}

function sortStat(jeu){
  if(jeu === "SD") statSD.sort(comparerJoueur)
  else if(jeu === "CS") statCS.sort(comparerJoueur)
  else statGS.sort(comparerJoueur)
}

function clearStats(){
  statSD = {}
  statCS = {}
  statGS = {}
}

function afficherStats(channel){
  var SD = "Leaderboard SD :"
  for(var i = 0; i < statSD.lenght; i++){
    SD += "\n"+(i+1)+" - "+<@&statSD[i].id>+"     "+pts+"   "+statSD[i].goalScored+"/"+statSD[i].goalConceded+"   "+statSD[i].goalScored-statSD[i].goalConceded+"  "+statSD[i].nbMatch;
  }
  bot.channels.cache.get(channel).send(SD);
}

bot.login(config.token);
