let content = document.getElementById("content");
let displayContent = document.querySelector(".header i");
let back = document.querySelector("#content i");
let cd = document.querySelector("#cd i");
let indexDetails = document.getElementById("index");
let trackName = document.getElementById("track-name");
let trackArtist = document.getElementById("track-artist");
let currentLength = document.getElementById("current-length");
let allLength = document.getElementById("all-length");
let lengthRange = document.getElementById("length");
let muteVolume = document.getElementById("mute");
let volumeRange = document.getElementById("volume");
let volumeValue = document.getElementById("volume-value");
let shuffle = document.getElementById("shuffle");
let prev = document.getElementById("prev");
let play = document.getElementById("play");
let next = document.getElementById("next");
let autoReplay = document.getElementById("replay");
let audio = document.getElementById("audio");

let data = [
  {
    src: "audios/001.mp3",
    name: "Al-Fatihah",
    art: "Mishary Alafasi",
    len: "00:51",
  },
  {
    src: "audios/018.mp3",
    name: "Al-Kahf",
    art: "Maher Al Meaqli",
    len: "23:13",
  },
  {
    src: "audios/019.mp3",
    name: "Maryam",
    art: "Saad Al-Ghamdi",
    len: "17:38",
  },
  {
    src: "audios/020.mp3",
    name: "Ta­Ha",
    art: "Al-Minshawi",
    len: "27:06",
  },
  {
    src: "audios/053.mp3",
    name: "An-Najm",
    art: "Abdulrahman Alsudaes",
    len: "06:18",
  },
  {
    src: "audios/055.mp3",
    name: "Ar-Rahman",
    art: "Ali Albanna",
    len: "08:34",
  },
  {
    src: "audios/056.mp3",
    name: "Al-Waqi'ah",
    art: "Fares Abbad",
    len: "08:01",
  },
  {
    src: "audios/067.mp3",
    name: "Al-Mulk",
    art: "Mahmoud Al-Hussary",
    len: "11:13",
  },
  {
    src: "audios/109.mp3",
    name: "Al-Kafirun",
    art: "Yasser Al-Dosari",
    len: "00:35",
  },
  {
    src: "audios/110.mp3",
    name: "An-Nasr",
    art: "Mansour Al-Salemi",
    len: "00:30",
  },
  {
    src: "audios/111.mp3",
    name: "Al-Masad",
    art: "Khaled Al-Qahtani",
    len: "00:28",
  },
  {
    src: "audios/112.mp3",
    name: "Al-Ikhlas",
    art: "Abdulbasit Abdulsamad",
    len: "00:41",
  },
  {
    src: "audios/113.mp3",
    name: "Al-Falaq",
    art: "Abdulrahman Alsudaes",
    len: "00:23",
  },
  {
    src: "audios/114.mp3",
    name: "An-Nas",
    art: "Al-Tab'laaway",
    len: "01:00",
  },
];

for (let i = 0; i < data.length; i++) {
  let div = document.createElement("div");
  div.setAttribute("data-index", i);
  let childDiv = document.createElement("div");
  div.append(childDiv);
  let trackName = document.createElement("p");
  let trackArtist = document.createElement("p");
  let trackNameText = document.createTextNode(data[i].name);
  let trackArtistText = document.createTextNode(data[i].art);
  trackName.append(trackNameText);
  trackArtist.append(trackArtistText);
  trackName.classList.add("content-name");
  trackArtist.classList.add("content-artist");
  trackName.style.marginBottom = "5px";
  trackArtist.style.opacity = "0.9";
  let duration = document.createElement("p");
  let durationText = document.createTextNode(data[i].len);
  trackArtist.classList.add("content-duration");
  duration.append(durationText);
  childDiv.append(trackName, trackArtist);
  div.append(childDiv, duration);
  content.append(div);
  if (i < data.length - 1) {
    content.append(document.createElement("hr"));
  }
}

displayContent.addEventListener("click", () => {
  content.style.marginLeft = "0";
});
function backContent() {
  content.style.marginLeft = "-100%";
}
back.addEventListener("click", backContent);

let index = 0;
let isPlaying = false;
let isAutoReplay = false;
let isMute = false;
let isShuffling = false;
let random;

let playList = document.querySelectorAll("#content > div");
playList.forEach((track) => {
  track.addEventListener("click", () => {
    index = track.getAttribute("data-index");
    backContent();
    load(index);
    playTrack();
  });
});

function checkPlay() {
  isPlaying ? pauseTrack() : playTrack();
}
function turnLengthIntoSeconds(length) {
  let sep = length.split(":");
  let min = parseInt(sep[0]);
  let sec = parseInt(sep[1]);
  return min * 60 + sec;
}
function updateLengthRange() {
  setInterval(() => {
    lengthRange.value = audio.currentTime;
  }, 1000);
}
function updateTime(currentTime) {
  let sec = Math.trunc(currentTime % 60);
  let min = Math.trunc(currentTime / 60);
  currentLength.textContent = `${min < 10 ? `0${min}` : min}:${
    sec < 10 ? `0${sec}` : sec
  }`;
}
function playTrack() {
  isPlaying = true;
  audio.play();
  play.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  updateLengthRange();
  setInterval(() => {
    updateTime(audio.currentTime);
  }, 1000);
  cd.style.cssText = "animation-play-state: running;";
}
function pauseTrack() {
  isPlaying = false;
  audio.pause();
  play.innerHTML = `<i class="fa-solid fa-play"></i>`;
  cd.style.cssText = "animation-play-state: paused;";
}
function load(index) {
  audio.setAttribute("src", data[index].src);
  trackName.textContent = data[index].name;
  trackArtist.textContent = data[index].art;
  allLength.textContent = data[index].len;
  lengthRange.setAttribute("max", turnLengthIntoSeconds(data[index].len));
  indexDetails.textContent = `Audio #${index + 1} of ${data.length}`;
  audio.load();
}
load(index);
play.addEventListener("click", checkPlay);
function checkMute() {
  isMute ? unMute() : mute();
}

volumeValue.textContent = audio.volume * 100;
let volumeRangeValue;
function mute() {
  muteVolume.setAttribute("class", "fa-solid fa-volume-mute");
  volumeRangeValue = volumeRange.value;
  volumeRange.value = 0;
  volumeValue.textContent = volumeRange.value;
  audio.volume = 0;
  isMute = true;
}
function unMute() {
  muteVolume.setAttribute("class", "fa-solid fa-volume-high");
  volumeRange.value = volumeRangeValue;
  audio.volume = volumeRangeValue / 100;
  volumeValue.textContent = volumeRange.value;
  isMute = false;
}
muteVolume.addEventListener("click", checkMute);
volumeRange.addEventListener("input", () => {
  muteVolume.setAttribute("class", "fa-solid fa-volume-high");
  audio.volume = volumeRange.value / 100;
  volumeValue.textContent = Math.trunc(audio.volume * 100);
});
lengthRange.addEventListener("input", () => {
  audio.currentTime = lengthRange.value;
  playTrack();
  audio.addEventListener("ended", () => {
    return 0;
  });
});

function nextTrack() {
  if (random) {
    randomNumber();
    console.log(random - 1);
    index = random - 1;
  } else {
    if (index === data.length - 1) {
      index = 0;
    } else {
      ++index;
    }
  }
  load(index);
  if (isPlaying) playTrack();
}
next.addEventListener("click", nextTrack);

function previousTrack() {
  if (index === 0) {
    index = data.length - 1;
  } else {
    --index;
  }
  load(index);
}
prev.addEventListener("click", previousTrack);

audio.addEventListener("ended", nextTrack);
function checkAutoReplay() {
  isAutoReplay ? doNotAutoReplayTrack() : autoReplayTrack();
}
let loop = document.createAttribute("loop");
function autoReplayTrack() {
  isAutoReplay = true;
  autoReplay.classList.add("active", "rotate360");
  audio.setAttributeNode(loop);
}
function doNotAutoReplayTrack() {
  isAutoReplay = false;
  autoReplay.classList.remove("active");
  audio.removeAttributeNode(loop);
}
autoReplay.addEventListener("click", checkAutoReplay);

function checkShuffle() {
  isShuffling ? doNotShuffle() : shuffleTrack();
}
function shuffleTrack() {
  isShuffling = true;
  shuffle.classList.add("active");
  randomNumber();
}
function doNotShuffle() {
  isShuffling = false;
  shuffle.classList.remove("active");
  random = undefined;
}
function randomNumber() {
  random = Math.ceil(Math.random() * data.length);
  if (random === index + 1) randomNumber();
  return random;
}
shuffle.addEventListener("click", checkShuffle);
