// THIS IS FOR THE RADIO PAGE
// Copy and Paste old code from another song, change values.

const trackCover = document.querySelector("#track_cover");
const trackArtist = document.querySelector("#track_artist");
const trackTitle = document.querySelector("#track_title");
const currentMins = document.querySelector("#current_time_mins");
const currentSecs = document.querySelector("#current_time_secs");
const trackmins = document.querySelector("#track_mins");
const tracksecs = document.querySelector("#track_secs");
const prevBtn = document.querySelector("#prev");
const playPause = document.querySelector("#play_pause");
const nextBtn = document.querySelector("#next");
const trackRange = document.querySelector("#range");
const vol = document.querySelector("#vol");
const currentTrack = document.createElement("audio");
const container = document.querySelector("#container");

const songs = [
  {
    artistName: "IMAAD, pootytang",
    songName: "222",
    img: "music/covers/222cover.jpg",
    music: "music/songs/222.mp3"
  },
  {
    artistName: "sizzle, zugz",
    songName: "wonder",
    img: "music/covers/wondercover.jpg",
    music: "music/songs/wonder.mp3"
  },
  {
    artistName: "zugz, IMAAD",
    songName: "leaveYa",
    img: "music/covers/leaveYacover.jpg",
    music: "music/songs/leaveYa.mp3"
  },
  {
    artistName: "sizzle",
    songName: "undeniable",
    img: "music/covers/undeniablecover.jpg",
    music: "music/songs/undeniable.wav"
  },
  {
    artistName: "IMAAD",
    songName: "a step",
    img: "music/covers/astepcover.jpg",
    music: "music/songs/astep.mp3"
  },
  {
    artistName: "maarruu",
    songName: "pole",
    img: "music/covers/polecover.jpg",
    music: "music/songs/pole.mp3"
  },
  {
    artistName: "zugz, Ahk Sair",
    songName: "forHer",
    img: "music/covers/forHercover.jpg",
    music: "music/songs/forHer.mp3"
  },
  {
    artistName: "maarruu, Aly",
    songName: "Melancholy ",
    img: "music/covers/melancholycover.jpg",
    music: "music/songs/melancholy.mp3"
  },
  {
    artistName: "IMAAD",
    songName: "tranCed ",
    img: "music/covers/tranCed.jpg",
    music: "music/songs/tranCed.mp3"
  },
  {
    artistName: "maarruu",
    songName: "AURA",
    img: "music/covers/auracover.jpg",
    music: "music/songs/aura.mp3"
  },
  {
    artistName: "maarruu",
    songName: "Poison",
    img: "music/covers/melancholycover.jpg",
    music: "music/songs/poison.mp3"
  },
  {
    artistName: "sizzle",
    songName: "hold on for hope",
    img: "music/covers/theWorldneedsYou.png",
    music: "music/songs/holdOnforHope.mp3"
  },

  {
    artistName: "sizzle",
    songName: "out of reach",
    img: "music/covers/theWorldneedsYou.png",
    music: "music/songs/outOfreach.mp3"
  },

  {
    artistName: "sizzle, T!M",
    songName: "pain of war",
    img: "music/covers/theWorldneedsYou.png",
    music: "music/songs/painOfwar.mp3"
  },
  
];

let isPlaying = false;
let trackIndex = 0;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffle(songs);

loadTrack(trackIndex);
setInterval(fulltime, 1000);


function loadTrack(trackIndex) {
  currentTrack.src = songs[trackIndex].music;
  currentTrack.load();

  trackCover.src = songs[trackIndex].img;
  trackArtist.textContent = songs[trackIndex].artistName;
  trackTitle.textContent = songs[trackIndex].songName;

};
function next() {
  if (trackIndex >= songs.length - 1) {
    trackIndex = 0;
  } else {
    trackIndex++
  }
  loadTrack(trackIndex);
  play();
};
function prev() {
  if (trackIndex <= 0) {
    trackIndex = songs.length - 1;
  } else {
    trackIndex--
  }
  loadTrack(trackIndex);
  play();
};
function play_pause() {
  isPlaying ? pause() : play();
};
function play() {
  isPlaying = true;
  currentTrack.play();
  playPause.classList.remove("bi-play-fill");
  playPause.classList.add("bi-pause-fill");
};
function pause() {
  isPlaying = false;
  currentTrack.pause();
  playPause.classList.remove("bi-pause-fill");
  playPause.classList.add("bi-play-fill");
};
function fulltime() {
  const mins = String(Math.floor((currentTrack.duration) / 60)).padStart(2, "0");
  const secs = String(Math.floor(currentTrack.duration - (mins * 60))).padStart(2, "0");

  const currMins = String(Math.floor((currentTrack.currentTime) / 60)).padStart(2, "0");
  const currSecs = String(Math.abs(Math.floor((currMins * 60) - currentTrack.currentTime))).padStart(2, "0");

  trackmins.textContent = mins;
  tracksecs.textContent = secs;
  currentMins.textContent = currMins;
  currentSecs.textContent = currSecs;



  trackRange.value = currentTrack.currentTime;
  trackRange.max = currentTrack.duration;


  if (currentTrack.ended) {
    next();
  };
};
function volume() {
  currentTrack.volume = vol.value / 11;
};
function seek() {
  currentTrack.currentTime = trackRange.value;
};

// Get the Start button element
const startButton = document.querySelector('.start-button');

// Update the Start button text with the current time
function updateStartTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  startButton.textContent = `${hours}:${minutes}:${seconds}`;
}

// Update the Start button text initially
updateStartTime();

// Update the Start button text every second
setInterval(updateStartTime, 1000);
