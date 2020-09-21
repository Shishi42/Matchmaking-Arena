const Discord = require("discord.js");

const bot = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");
const jsonfile = require ("jsonfile");

var statsSD = {}
var statsCS = {}
var statsGS = {}

if(fs.existsSync("./STATS/SD.json")){
  statsSD = jsonfile.readFileSync("./STATS/SD.json");
}

if(fs.existsSync("./STATS/CS.json")){
  statsCS = jsonfile.readFileSync("./STATS/CS.json");
}

if(fs.existsSync("./STATS/GS.json")){
  statsGS = jsonfile.readFileSync("./STATS/GS.json");
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
  /*if(content[0] === "$clear"){
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
    statsSD[id] = {
      win: w,
      draw: d,
      lose:  l,
      pts: w*3 + d*2 + l,
      goalScored: goalScored,
      goalConceded:  goalConceded,
      nbMatch: nbMatch
    };
  }else if(jeu === "CS"){
    statsCS[id] = {
      win: w,
      draw: d,
      lose:  l,
      pts: w*3 + d*2 + l,
      goalScored: goalScored,
      goalConceded:  goalConceded,
      nbMatch: nbMatch
    };
  }else{
    statsGS[id] = {
      win: w,
      draw: d,
      lose:  l,
      pts: w*3 + d*2 + l,
      goalScored: goalScored,
      goalConceded:  goalConceded,
      nbMatch: nbMatch
    };
  }
  saveStats();
  updateMsg();
}

function clearJoueur(id, jeu){
  /*if(jeu === "all"){
    clearJoueurAll(id);
  }
  if(jeu === "SD"){
    statsSD[id] = {}
    sortStat("SD");
    jsonfile.writeFileSync("SD.json", statsSD);
  }else if(jeu === "CS"){
    statsCS[id] = {}
    sortStat("CS");
    jsonfile.writeFileSync("CS.json", statsCS);
  }else{
    statsGS[id] = {}
    sortStat("GS");
    jsonfile.writeFileSync("GS.json", statsGS);
  }
  updateMsg();
  */
}

function clearJoueurAll(id){
  /*clearJoueur("SD", id);
  clearJoueur("CS", id);
  clearJoueur("GS", id);*/
}

function clearAll(){
  if(fs.existsSync("./STATS/SD.json")){
    fs.unlinkSync(path)
  }
  if(fs.existsSync("./STATS/CS.json")){
    fs.unlinkSync(path)
  }
  if(fs.existsSync("./STATS/GS.json")){
    fs.unlinkSync(path)
  }
}

function getStringMsg(){
  var SD = "Leaderboard SD :\n"
  var CS = "Leaderboard CS :\n"
  var GS = "Leaderboard GS :\n"

  var i = -1;

  var max = {
    win: 0,
    draw: 0,
    lose:  0,
    pts: 0,
    goalScored: 0,
    goalConceded:  0,
    nbMatch: 0
  };

  var maxKey;
  var maxKeys = [];

  for(var x in statsSD){
    for(var item in statsSD){
      if((!maxKeys.includes(item)) && max.pts < Number(statsSD[item].pts)){
        console.log(max.pts)
        console.log(statsSD[item].pts)
        max = statsSD[item];
        maxKey = item;
      }
    }
    max = {
      win: 0,
      draw: 0,
      lose:  0,
      pts: 0,
      goalScored: 0,
      goalConceded:  0,
      nbMatch: 0
    };
    maxKeys.push(maxKey)

    i += 1;
    SD += (`\n${i+1} - ${maxKey}   ${statsSD[maxKey].pts}   ${statsSD[maxKey].goalScored}/${statsSD[maxKey].goalConceded}   ${statsSD[maxKey].goalScored-statsSD[maxKey].goalConceded}   ${statsSD[maxKey].nbMatch}`);
  }

  i = -1
  for(var x in statsCS){
    for(var item in statsCS){
      if((!maxKeys.includes(item)) && max.pts < Number(statsCS[item].pts)){
        console.log(max.pts)
        console.log(statsCS[item].pts)
        max = statsCS[item];
        maxKey = item;
      }
    }
    max = {
      win: 0,
      draw: 0,
      lose:  0,
      pts: 0,
      goalScored: 0,
      goalConceded:  0,
      nbMatch: 0
    };
    maxKeys.push(maxKey)

    i += 1;
    CS += (`\n${i+1} - ${maxKey}   ${statsCS[maxKey].pts}   ${statsCS[maxKey].goalScored}/${statsCS[maxKey].goalConceded}   ${statsCS[maxKey].goalScored-statsCS[maxKey].goalConceded}   ${statsCS[maxKey].nbMatch}`);
  }

  i = -1
  for(var x in statsGS){
    for(var item in statsGS){
      if((!maxKeys.includes(item)) && max.pts < Number(statsGS[item].pts)){
        console.log(max.pts)
        console.log(statsGS[item].pts)
        max = statsGS[item];
        maxKey = item;
      }
    }
    max = {
      win: 0,
      draw: 0,
      lose:  0,
      pts: 0,
      goalScored: 0,
      goalConceded:  0,
      nbMatch: 0
    };
    maxKeys.push(maxKey)

    i += 1;
    GS += (`\n${i+1} - ${maxKey}   ${statsGS[maxKey].pts}   ${statsGS[maxKey].goalScored}/${statsGS[maxKey].goalConceded}   ${statsGS[maxKey].goalScored-statsGS[maxKey].goalConceded}   ${statsGS[maxKey].nbMatch}`);
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
    fs.writeFileSync("./ID/SD", m.id);
  });
  channel.send(msg["CS"]).then(m => {
    fs.writeFileSync("./ID/CS", m.id);
  });
  channel.send(msg["GS"]).then(m => {
    fs.writeFileSync("./ID/GS", m.id);
  });

}

function updateMsg(){

  var msg = getStringMsg();

  var sd = fs.readFileSync('./ID/SD', "utf8");
  var cs = fs.readFileSync('./ID/CS', "utf8");
  var gs = fs.readFileSync('./ID/GS', "utf8");

  bot.channels.cache.get(config.chan_dev).messages.fetch(sd)
    .then(message => message.edit(msg["SD"]))

  bot.channels.cache.get(config.chan_dev).messages.fetch(cs)
    .then(message => message.edit(msg["CS"]))

  bot.channels.cache.get(config.chan_dev).messages.fetch(gs)
    .then(message => message.edit(msg["CS"]))
}

function comparerJoueur(a, b){

  if(Number(a.pts) > Number(b.pts)) return 1;
  else if(Number(a.pts) < Number(b.pts)) return -1;
  else{

    if(Number(a.nbMatch) < Number(b.nbMatch)) return 1;
    else if(Number(a.nbMatch) > Number(b.nbMatch)) return -1;
    else{

      var diffButA = Number(a.goalScored) - Number(a.goalConceded);
      var diffButB = Number(b.goalScored) - Number(b.goalScored);

      if(diffButA > diffButB) return 1;
      if(diffButA < diffButB) return -1;
      else{

        return 1;
      }
    }
  }
}

function saveStats(){
  fs.writeFile("./STATS/SD.json", JSON.stringify(statsSD, null, 4), function(err) {});
  fs.writeFile("./STATS/CS.json", JSON.stringify(statsCS, null, 4), function(err) {});
  fs.writeFile("./STATS/GS.json", JSON.stringify(statsGS, null, 4), function(err) {});
}


bot.login(config.token);
