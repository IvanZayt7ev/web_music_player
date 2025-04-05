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
        playlistDIV.dataset.arrayMusic = JSON.stringify(arrayMusic);
        //playlistDIV.dataset.namePlaylist = playlist;

        playlistsContainer.append(playlistDIV);
    }
}

function showSelectedPlaylistUI() {
    musicContainer.querySelectorAll(".music").forEach(music => music.remove())

    let arrayMusic = playerData.selectedPlaylist
    for(let music of arrayMusic) {
        let musicDIV = document.createElement("div");
        musicDIV.className = "music";
        musicDIV.innerHTML = default_audio[music].name;
        musicDIV.dataset.srcMusic = JSON.stringify(music);
        //musicDIV.dataset.fromPlaylist = namePlaylist;

        musicContainer.append(musicDIV);
    }
}

function selectPlaylistUI(event) {
    if(event.target.className == "playlist") {
        playerData.selectedPlaylist = JSON.parse(event.target.dataset.arrayMusic);
        showSelectedPlaylistUI();
    }
}

function selectMusicUI(event) {
    if(event.target.className == "music") {
        //audioData.currentPlaylist = event.target.fromPlaylist;
        audioData.currentMusic = JSON.parse(event.target.dataset);
    }
}



playerData.selectedPlaylist = playerData.playlists["Tchaikovsky"]
showSelectedPlaylistUI();
showPlaylistUI();



playlistsContainer.addEventListener("click", selectPlaylistUI)
musicContainer.addEventListener("click", selectMusicUI)
