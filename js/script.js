let content = document.getElementById("content"),
  contentDetails = document.getElementById("content-details"),
  displayContent = document.querySelector(".header i"),
  back = document.querySelector("#content i"),
  cd = document.querySelector("#cd i"),
  indexDetails = document.getElementById("index"),
  trackName = document.getElementById("track-name"),
  trackArtist = document.getElementById("track-artist"),
  currentLength = document.getElementById("current-length"),
  allLength = document.getElementById("all-length"),
  lengthRange = document.getElementById("length"),
  muteVolume = document.getElementById("mute"),
  volumeRange = document.getElementById("volume"),
  volumeValue = document.getElementById("volume-value"),
  shuffle = document.getElementById("shuffle"),
  prev = document.getElementById("prev"),
  play = document.getElementById("play"),
  next = document.getElementById("next"),
  autoReplay = document.getElementById("replay"),
  audio = document.getElementById("audio");

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
  let number = document.createElement("span");
  let numberText = document.createTextNode(i + 1);
  number.append(numberText);
  let trackName = document.createElement("p");
  let trackArtist = document.createElement("p");
  let trackNameText = document.createTextNode(data[i].name);
  let trackArtistText = document.createTextNode(data[i].art);
  trackName.append(trackNameText);
  trackArtist.append(trackArtistText);
  trackName.classList.add("content-name");
  trackArtist.classList.add("content-artist");
  trackName.style.marginBottom = "5px";
  trackArtist.style.opacity = "0.8";
  let duration = document.createElement("p");
  let durationText = document.createTextNode(data[i].len);
  duration.classList.add("content-duration");
  duration.append(durationText);
  childDiv.append(trackName, trackArtist);
  div.append(number, childDiv, duration);
  div.classList.add("track-details");
  contentDetails.append(div);
  if (i < data.length - 1) {
    contentDetails.append(document.createElement("hr"));
  }
}
displayContent.addEventListener("click", () => {
  content.style.marginLeft = "0";
});
function backContent() {
  content.style.marginLeft = "-100%";
}
back.addEventListener("click", backContent);

let index = 0,
  isPlaying = false,
  isAutoReplay = false,
  isMute = false,
  isShuffling = false,
  random,
  volumeRangeValue,
  playList = document.querySelectorAll("#content-details > div"),
  loop = document.createAttribute("loop");

if (localStorage.getItem("Current Audio")) {
  index = parseInt(localStorage.getItem("Current Audio"));
  load(index);
}
if (localStorage.getItem("Mute")) {
  isMute = localStorage.getItem("Mute") === "true" ? true : false;
}
if (localStorage.getItem("Volume range value")) {
  volumeRangeValue = parseInt(localStorage.getItem("Volume range value"));
}
if (localStorage.getItem("Volume value")) {
  audio.volume = parseFloat(localStorage.getItem("Volume value"));
  volumeRange.value = Math.trunc(
    parseFloat(localStorage.getItem("Volume value")) * 100
  );
  volumeValue.textContent = Math.trunc(volumeRange.value);
  if (audio.volume == 0) {
    muteVolume.setAttribute("class", "fa-solid fa-volume-mute");
  }
}
if (localStorage.getItem("Audio Length")) {
  audio.currentTime = parseFloat(localStorage.getItem("Audio Length"));
  lengthRange.value = Math.trunc(
    parseFloat(localStorage.getItem("Audio Length"))
  );
  updateTime(parseFloat(localStorage.getItem("Audio Length")));
}
if (localStorage.getItem("Auto Replay")) {
  if (localStorage.getItem("Auto Replay") === "true") {
    autoReplayTrack();
  } else {
    doNotAutoReplayTrack();
  }
}
if (localStorage.getItem("Shuffle")) {
  if (localStorage.getItem("Shuffle") === "true") {
    shuffleTrack();
  } else {
    doNotShuffle();
  }
}

playList.forEach((track) => {
  track.addEventListener("click", () => {
    index = parseInt(track.getAttribute("data-index"));
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
  lengthRange.value = Math.trunc(audio.currentTime);
  localStorage.setItem("Audio Length", audio.currentTime);
}
function updateTime(currentTime) {
  let sec = Math.trunc(currentTime % 60);
  let min = Math.trunc(currentTime / 60);
  currentLength.textContent = `${min < 10 ? `0${min}` : min}:${
    sec < 10 ? `0${sec}` : sec
  }`;
  if (isPlaying && audio.currentTime == 0) {
    document.getElementById("loading").style.display = "flex";
    document.getElementById("copyright").style.display = "none";
    cd.style.cssText = "animation-play-state: paused;";
  } else {
    document.getElementById("loading").style.display = "none";
    document.getElementById("copyright").style.display = "block";
    if (isPlaying && audio.currentTime != 0) {
      cd.style.cssText = "animation-play-state: running;";
    }
  }
}
function playTrack() {
  isPlaying = true;
  audio.play();
  play.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  setInterval(() => {
    updateLengthRange();
    updateTime(audio.currentTime);
  }, 1000);
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
  localStorage.setItem("Current Audio", index);
}
load(index);
play.addEventListener("click", checkPlay);
function checkMute() {
  isMute ? unMute() : mute();
}

volumeValue.textContent = audio.volume * 100;
function mute() {
  muteVolume.setAttribute("class", "fa-solid fa-volume-mute");
  volumeRangeValue = volumeRange.value;
  volumeRange.value = 0;
  volumeValue.textContent = volumeRange.value;
  audio.volume = 0;
  isMute = true;
  localStorage.setItem("Volume value", audio.volume);
  localStorage.setItem("Volume range value", volumeRangeValue);
  localStorage.setItem("Mute", isMute);
}
function unMute() {
  muteVolume.setAttribute("class", "fa-solid fa-volume-high");
  volumeRange.value = volumeRangeValue;
  audio.volume = volumeRangeValue / 100;
  volumeValue.textContent = volumeRange.value;
  isMute = false;
  localStorage.setItem("Volume value", audio.volume);
  localStorage.setItem("Mute", isMute);
}
muteVolume.addEventListener("click", checkMute);
volumeRange.addEventListener("input", () => {
  muteVolume.setAttribute("class", "fa-solid fa-volume-high");
  audio.volume = volumeRange.value / 100;
  volumeValue.textContent = Math.trunc(audio.volume * 100);
  isMute = false;
  if (volumeRange.value == 0) {
    mute();
  }
  localStorage.setItem("Mute", isMute);
  localStorage.setItem("Volume value", audio.volume);
});
lengthRange.addEventListener("input", () => {
  audio.currentTime = lengthRange.value;
  localStorage.setItem("Audio Length", audio.currentTime);
  if (isPlaying) {
    playTrack();
  } else {
    updateTime(audio.currentTime);
  }
  audio.addEventListener("ended", () => {
    return 0;
  });
});

function resetTime() {
  audio.currentTime = 0;
  lengthRange.value = 0;
  currentLength.textContent = "00:00";
  localStorage.setItem("Audio Length", 0);
}
function nextTrack() {
  resetTime();
  if (isShuffling) {
    randomNumber();
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
  resetTime();
  if (isShuffling) {
    randomNumber();
    index = random - 1;
  } else {
    if (index === 0) {
      index = data.length - 1;
    } else {
      --index;
    }
  }
  load(index);
  if (isPlaying) playTrack();
}
prev.addEventListener("click", previousTrack);
audio.addEventListener("ended", nextTrack);

function checkAutoReplay() {
  isAutoReplay ? doNotAutoReplayTrack() : autoReplayTrack();
}
function autoReplayTrack() {
  isAutoReplay = true;
  autoReplay.classList.add("active", "rotate360");
  audio.setAttributeNode(loop);
  localStorage.setItem("Auto Replay", isAutoReplay);
}
function doNotAutoReplayTrack() {
  isAutoReplay = false;
  autoReplay.classList.remove("active");
  if (audio.hasAttribute("loop")) {
    audio.removeAttributeNode(loop);
  }
  localStorage.setItem("Auto Replay", isAutoReplay);
}
autoReplay.addEventListener("click", checkAutoReplay);

function checkShuffle() {
  isShuffling ? doNotShuffle() : shuffleTrack();
}
function shuffleTrack() {
  isShuffling = true;
  shuffle.classList.add("active");
  randomNumber();
  localStorage.setItem("Shuffle", isShuffling);
}
function doNotShuffle() {
  isShuffling = false;
  shuffle.classList.remove("active");
  random = undefined;
  localStorage.setItem("Shuffle", isShuffling);
}
function randomNumber() {
  random = Math.ceil(Math.random() * data.length);
  if (random === index + 1) randomNumber();
  return random;
}
shuffle.addEventListener("click", checkShuffle);
