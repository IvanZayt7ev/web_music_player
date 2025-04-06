const default_audio = {
    "audioFiles/Beethoven - Silence - Piano.webm": {
        "name": "Silence",
        "autor": "Beethoven",
    },
    "audioFiles/G Minor Bach (Arr. Luo Ni).webm": {
        "name": "G Minor",
        "autor": "Bach",
    },
    "audioFiles/Mozart - Fantasia in d minor, K.397.webm": {
        "name": "Fantasia in d minor",
        "autor": "Mozart",
    },
    "audioFiles/Tchaikovsky - Piano Concerto No. 1.webm": {
        "name": "Piano Concerto No. 1 in B Flat Minor",
        "autor": "Tchaikovsky",
    },
    "audioFiles/Tchaikovsky - Waltz of the Flowers (The Nutcracker Suite).webm": {
        "name": "Waltz of the Flowers",
        "autor": "Tchaikovsky",
    },
}



const playlistsContainer = document.getElementById("playlistsContainer").querySelector("div");
const musicContainer = document.getElementById("musicContainer").querySelector("div");

const playButton = document.getElementById("playButton");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const timeRange  = document.getElementById("timeRange");
const volumeRange = document.getElementById("volumeRange");
const miniPlayerButton = document.getElementById("miniPlayerButton");


let audio = new Audio();
let audioData = {
    currentPlaylist: null,
    currentMusic: null,
    currentMusicTime: 0,
    isPlay: false,
    isLoop: false,
};

let playerData = {
    playlists: {
        "basic playlist": Object.keys(default_audio),
        "Tchaikovsky": [
            "audioFiles/Tchaikovsky - Piano Concerto No. 1.webm",
            "audioFiles/Tchaikovsky - Waltz of the Flowers (The Nutcracker Suite).webm",
        ],
    },
    selectedPlaylist: null,
}

function showPlaylistUI() {
    playlistsContainer.querySelectorAll(".playlist").forEach(playlist => playlist.remove())

    for(let [playlist, arrayMusic] of Object.entries(playerData.playlists)) {
        let playlistDIV = document.createElement("div");
        playlistDIV.className = "playlist";
        playlistDIV.innerHTML = playlist;
        playlistDIV.dataset.NameAndArrayMusic = JSON.stringify([playlist, arrayMusic]);
        playlistDIV.dataset.namePlaylist = playlist;

        playlistsContainer.append(playlistDIV);
    }
}

function showSelectedPlaylistUI() {
    musicContainer.querySelectorAll(".music").forEach(music => music.remove())

    let [namePlaylist, arrayMusic] = playerData.selectedPlaylist
    for(let music of arrayMusic) {
        let musicDIV = document.createElement("div");
        musicDIV.className = "music";
        musicDIV.innerHTML = default_audio[music].name;
        musicDIV.dataset.srcMusic = music;
        musicDIV.dataset.fromPlaylist = namePlaylist;

        musicContainer.append(musicDIV);
    }
}

function selectPlaylistUI(event) {
    if(event.target.className === "playlist") {
        playerData.selectedPlaylist = JSON.parse(event.target.dataset.NameAndArrayMusic);
        showSelectedPlaylistUI();
    }
}

function selectMusicUI(event) {
    if(event.target.className === "music") {
        audioData.currentPlaylist = event.target.dataset.fromPlaylist;
        audioData.currentMusic = event.target.dataset.srcMusic;
        audioData.currentMusicTime = 0;
        audioData.isPlay = false;

        playMusic();
    }
}

function playMusic() {
    if(audioData.isPlay) {
        audioData.currentMusicTime = audio.currentTime;
        audio.pause()
    } else {
        audio.src = audioData.currentMusic || audioData.currentPlaylist[0];
        audio.currentTime = audioData.currentMusicTime;
        audio.play()
    }
    audioData.isPlay = !audioData.isPlay
}



audioData.currentPlaylist = playerData.playlists["Tchaikovsky"]
playerData.selectedPlaylist = ["Tchaikovsky", playerData.playlists["Tchaikovsky"]]
showSelectedPlaylistUI();
showPlaylistUI();



playlistsContainer.addEventListener("click", selectPlaylistUI)
musicContainer.addEventListener("click", selectMusicUI)

playButton.addEventListener("click", playMusic)
