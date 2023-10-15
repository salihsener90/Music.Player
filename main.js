// elementlere ulaşma

const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audioButton = document.getElementById("audio");
const songImageButton = document.getElementById("song-image");
const songNameButton = document.getElementById("song-name");
const songArtistButton = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playListButton = document.getElementById("playlist");

const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");

const progressBar = document.getElementById("progress-bar");
const playListContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playListSong = document.getElementById("playlist-songs");

const currentProgress = document.getElementById("current-progress");

// indis  her bir şarkının sırasını tutmak için gerekli işlemler

let index;

// tekrarı
let loop;

// decode veya parse

const songsList = [
  {
    name: "Gelo Ew Ki Bu",
    link: "assets/gelo-ew-ki-bu.mp3",
    artist: "Aram Tigran",
    image: "assets/aram-tigran.jpeg",
  },
  {
    name: "Gitme Kal",
    link: "assets/yara-bere-icindeyim.mp3",
    artist: "Hira-i Zerdust",
    image: "assets/hirai.jpeg",
  },
  {
    name: "Aramam",
    link: "assets/aramam.mp3",
    artist: "Ibrahim Tatlises",
    image: "assets/ibrahim-tatlises.jpeg",
  },
  {
    name: "Ax Eman",
    link: "assets/ax-eman.mp3",
    artist: "Rewsan Celiker",
    image: "assets/rewsan-celiker.jpeg",
  },
  {
    name: "Dinle",
    link: "assets/dinle.mp3",
    artist: "Mahsun Kirmizigul",
    image: "assets/mahsun.jpeg",
  },
];

// olaylar objesi
let events = {
  // clilck fare ile tıklama
  mouse: {
    click: "click",
  },

  // touch dokunma özelliği
  touch: {
    click: "touchstart",
  },
};

let deviceType = "";

const isTouchDevice = () => {
  try {
    document.ceateEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (error) {
    deviceType = "mouse";
    return false;
  }
};

// zaman formatlama
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return ` ${minute} : ${second}`;
};

// set song sarkı atama
const setSong = (arrayIndex) => {
  // tüm özellikler
  console.log(arrayIndex);
  let { name, link, artist, image } = songsList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image;

  // süreyi göster
  audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration);
  };

  playListContainer.classList.add("hide");
  playAudio();
};

// şarkıyı oynat
const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide"); //pause butonu görun
  playButton.classList.add("hide"); // kaybol
};

// şarkıyı tekrar et

repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
    console.log("tekrar kapatildi");
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
    console.log("tekrar acik");
  }
});
//  sonraki şarkıya git

const nextSong = () => {
  //eğer dögü acık oluyorsa
  if (loop) {
    if (index == songsList.length - 1) {
      //sondaysa basa sar
      index = 0;
    } else {
      index += 1;
    }
    setSong(index);
  } else {
    let randIndex = Math.floor(Math.random() * songsList.length);
    console.log(randIndex);
    setSong(randIndex);
  }
  playAudio();
};

//şarkıyı durdur
const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};
//onceki şarkı
const previousSong = () => {
  if (index > 0) {
    pauseAudio();
    index -= 1;
  } else {
    index = song.length - 1;
  }
  setSong(index);
  playAudio();
};
//sıradakine gec
audio.onended = () => {
  nextSong();
};

//karıştırma
shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    loop = true;
    console.log("karıstırma kapalı");
  } else {
    shuffleButton.classList.add("active");
    loop = false;
    console.log("kariştirma acık");
  }
});

//play button
playButton.addEventListener("click", playAudio);
//nect button
nextButton.addEventListener("click", nextSong);
//pause button
pauseButton.addEventListener("click", pauseAudio);
//prev button önceki yani
prevButton.addEventListener("click", previousSong);

isTouchDevice();
progressBar.addEventListener(events[deviceType].click, (event) => {
  //progres barı baslat
  let coordStart = progressBar.getBoundingClientRect().left;
  //fare ile dokunma
  let coorEnd = !isTouchDevice() ? event.clientX : event.touches[0];
  progress = (coordEnd - coordStart) / progressBar.offsetWidth;
  //genşliği ata
  currentProgress.style.width = progress * 100 + "%";
  //zamanı ata
  audio.currentTime = progress * audio.duration;
  //oynatma kısmı
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

// zaman aktıkca guncelle
setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);

//zaman güncellemesi
audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});

window.onload = () => {
  index = 0;
  setSong(index);
  initPlaylist();
};

const initPlaylist = () => {
  for (let i in songsList) {
    playListSong.innerHTML += `<li class="playListSong"  
     onclick="setSong(${i})">
     <div class=playlist-image-container">
     <img src="${songsList[i].image}"/>
     </div>
     <div class="playlist-song-details">
     <span id="playlist-song-name">
     ${songsList[i].name}
     </span>
     <span id="playlist-song-album">
     ${songsList[i].artist}
     </span>

     </div>
     </li>
     `
  }
}

//şarkı listesi

playListButton.addEventListener('click',()=>{
    playListContainer.classList.remove('hide')
})

//sarkı listesini kapat
closeButton.addEventListener('click',()=>{
    playListContainer.classList.add('hide')
})
