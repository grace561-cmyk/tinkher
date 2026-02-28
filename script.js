function login(){
  localStorage.setItem("user",document.getElementById("name").value);
  window.location="quiz.html";
}

function selectCareer(c){
  localStorage.setItem("career",c);
  window.location="jobs.html";
}

if(document.getElementById("jobs")){
  let c=localStorage.getItem("career");
  let jobs={
    digital:["Data Entry","Support Agent"],
    teaching:["Online Tutor","Trainer"],
    creative:["Writer","Social Media Assistant"]
  };
  let html="";
  jobs[c].forEach(j=>html+=`<button onclick="chooseJob('${j}')">${j}</button><br>`);
  document.getElementById("jobs").innerHTML=html;
}

function chooseJob(j){
  localStorage.setItem("job",j);
  window.location="jobdetail.html";
}

if(document.getElementById("jobTitle")){
  document.getElementById("jobTitle").innerText=localStorage.getItem("job");
}

function goToSkills(){window.location="skills.html";}

function advance(){
  let p=Number(localStorage.getItem("courseProgress")||0);
  p+=20;if(p>100)p=100;
  localStorage.setItem("courseProgress",p);
  updateBar();
}

function updateBar(){
  if(document.getElementById("bar")){
    let p=localStorage.getItem("courseProgress")||0;
    document.getElementById("bar").style.width=p+"%";
    document.getElementById("percent").innerText=p+"% completed";
  }
}
updateBar();

function skill(l){
  document.getElementById("result").innerText="You are "+l+" level.";
}

function addPost(){
  let posts=JSON.parse(localStorage.getItem("posts"))||[];
  posts.push(document.getElementById("post").value);
  localStorage.setItem("posts",JSON.stringify(posts));
  showPosts();
}

function showPosts(){
  if(document.getElementById("feed")){
    let posts=JSON.parse(localStorage.getItem("posts"))||[];
    document.getElementById("feed").innerHTML=posts.map(p=>"👩 "+p).join("<br>");
  }
}
showPosts();

function improve(){
  document.getElementById("output").innerText=
  "Add achievements, skills, and positive career-gap explanation.";
}

/* SKILL QUIZ LOGIC */
let skillScore = 0;

function score(v){
  skillScore += v;
}

function showLevel(){
  let level="Beginner";

  if(skillScore>=3) level="Intermediate";
  if(skillScore==4) level="Advanced";

  document.getElementById("result").innerText=
  "Your skill level is: "+level;

  localStorage.setItem("skillLevel",level);
}

/* YOUTUBE PLAYER + PROGRESS TRACKING */

let player;
let duration = 0;

function onYouTubeIframeAPIReady() {
  if(document.getElementById("player")){
    player = new YT.Player('player', {
      height: '200',
      width: '300',
      videoId: '3qBXWUpoPHo', // digital skills video
      events: {
        'onReady': onPlayerReady
      }
    });
  }
}

function onPlayerReady(){
  setInterval(updateProgress, 1000);
}

function updateProgress(){
  if(player && player.getCurrentTime){
    let watched = player.getCurrentTime();
    duration = player.getDuration();

    if(duration>0){
      let percent = Math.floor((watched/duration)*100);

      document.getElementById("bar").style.width = percent+"%";
      document.getElementById("percent").innerText = percent+"% completed";

      localStorage.setItem("courseProgress", percent);
    }
  }
}
async function aiImprove(){
  let text = document.getElementById("resumeText").value;

  let response = await fetch("https://api.openai.com/v1/chat/completions",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer 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"
    },
    body: JSON.stringify({
      model:"gpt-4.1-mini",
      messages:[
        {role:"system",content:"You are a career coach helping women restart careers."},
        {role:"user",content:text}
      ]
    })
  });

  let data = await response.json();
  document.getElementById("aiOutput").innerText =
    data.choices[0].message.content;
}

