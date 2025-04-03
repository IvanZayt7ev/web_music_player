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
const tchaikovsky_playlist = [
    "audioFiles/Tchaikovsky - Piano Concerto No. 1.webm",
    "audioFiles/Tchaikovsky - Waltz of the Flowers (The Nutcracker Suite).webm",
]
const all_tracks = Object.keys(default_audio);



// елементы пользовательского интерфейса
const currentSongMenu = document.getElementById("currentSong");
const currentPlaylistMenu = document.getElementById("currentPlaylist");
const playlistsMenu = document.getElementById("playlists");
const nameCurrentSong = document.getElementById("nameCurrentSong");
const autorCurrentSong = document.getElementById("autorCurrentSong");

// кнопки управления песнями
const buttonPlay = document.getElementById("buttonPlay");
const buttonPrevious = document.getElementById("buttonPrevious");
const buttonNext = document.getElementById("buttonNext");
const buttonLoop = document.getElementById("repeat");
let slider = document.getElementById("slider");
let timelineSong = document.getElementById("timelineSong");

let audio = new Audio();
let playerData = {
    currentPlaylist: null,
    currentSong: null,
    currentSongTime: 0,
    isPlay: false,
    isLoop: false,
};
let selectedPlaylist = null;

function createPlaylist(arrPlaylist, namePlaylist) {
    let playlist = document.createElement("div");
    playlist.className = "playlist";
    playlist.innerHTML = namePlaylist || "undefined name";
    playlist.dataset.songs = JSON.stringify(arrPlaylist);

    playlistsMenu.append(playlist);
}

function addNewPlaylist(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
        let newPlaylistArr = JSON.parse(reader.result);
        for(let newPlaylist of newPlaylistArr) {
            addPlaylistInBasic(newPlaylist);
            createPlaylist(newPlaylist, file.name.slice(0, file.name.lastIndexOf(".")));
        }
    }
}

function addPlaylistInBasic(arr) {
    arr.forEach(checkTrack => {
        if(!Object.keys(default_audio).includes(checkTrack)) {
            default_audio[checkTrack] = {};
            default_audio[checkTrack].name = checkTrack.slice(checkTrack.indexOf("/") + 1, checkTrack.lastIndexOf("."));
        };
    });
    playlistsMenu.children[0].dataset.songs = JSON.stringify(Object.keys(default_audio));
    if(playerData.currentPlaylist == all_tracks) {
        currentPlaylistMenu.querySelectorAll(".song").forEach(song => song.remove())
        selectPlaylist(Object.keys(default_audio))
    }
}

function getNameFromSrc(src) {
    return src.slice(src.indexOf("/") + 1, src.lastIndexOf("."));
}

function updateCurrentPlaylistMenu(event) {
    if(event.target.className === "playlist") {
        currentPlaylistMenu.querySelectorAll(".song").forEach(song => song.remove())

        selectedPlaylist = JSON.parse(event.target.dataset.songs);
        selectPlaylist(selectedPlaylist)
    }
}

function selectPlaylist(arr) {
    selectedPlaylist = arr;

    for(let src of arr) {
        let song = document.createElement("div");
        song.className = "song";
        song.innerHTML = default_audio[src]?.name || getNameFromSrc(src);
        song.dataset.src = src;

        currentPlaylistMenu.append(song);
    }
}

function setSong(event) {
    if(event.target.className === "song") {
        playerData.currentSong = event.target.dataset.src;
        playerData.currentPlaylist = selectedPlaylist;
        playerData.currentSongTime = 0;
        playerData.isPlay = false;

        playPauseSong();
    };
};

function playPauseSong() {
    if(playerData.isPlay) {
        playerData.currentSongTime = audio.currentTime;
        buttonPlay.querySelector("img").src = "icons/play_button.png";
        audio.pause();
    } else {
        if(playerData.currentSong !== null) {
            audio.src = playerData.currentSong;
            audio.currentTime = playerData.currentSongTime;
        } else {
            playerData.currentSong = audio.src = playerData.currentPlaylist[0];
        }
        buttonPlay.querySelector("img").src = "icons/pause_button.png";
        audio.play();
    };
    playerData.isPlay = !playerData.isPlay;

    nameCurrentSong.innerHTML = default_audio[playerData.currentSong]?.name;
    autorCurrentSong.innerHTML = default_audio[playerData.currentSong]?.autor;
};

function onSpacePress(event) {
    if(event.code == "Space") {
        event.preventDefault();
        playPauseSong();
    }
}

function playPreviousSong() {
    let indexSong = playerData.currentPlaylist.indexOf((playerData?.currentSong || playerData.currentPlaylist.at(-1)));
    if(indexSong != 0) {
        playerData.currentSong = playerData.currentPlaylist[indexSong - 1];
    } else {
        playerData.currentSong = playerData.currentPlaylist.at(-1);
    }
    playerData.currentTime = audio.currentTime = 0;
    playerData.isPlay = false;
    playPauseSong();
}

function playNextSong() {
    let indexSong = playerData.currentPlaylist.indexOf((playerData?.currentSong || playerData.currentPlaylist[0]));
    if(indexSong != playerData.currentPlaylist.length - 1) {
        playerData.currentSong = playerData.currentPlaylist[indexSong + 1];
    } else {
        playerData.currentSong = playerData.currentPlaylist[0];
    }
    playerData.currentTime = audio.currentTime = 0;
    playerData.isPlay = false;
    playPauseSong();
};

function playInLoop() {
    playerData.isLoop = !playerData.isLoop;
    if(playerData.isLoop) {
        buttonLoop.querySelector("img").src = "icons/repeat_on_button.png";
    } else {
        buttonLoop.querySelector("img").src = "icons/repeat_off_button.png";
    }
}

function playRepeatAgainSong() {
    playerData.isPlay = false;
    if(playerData.isLoop) {
        playerData.currentSongTime = 0;
        audio.playPauseSong();
    } else {
        playNextSong()
    }
}

setInterval(function() {
    slider.value = (audio.currentTime / audio.duration * 100) || 0;
}, 500);

function updateCurrentTime() {
    audio.currentTime = slider.value * audio.duration / 100;
}



playlistsMenu.addEventListener("click", updateCurrentPlaylistMenu);
currentPlaylistMenu.addEventListener("click", setSong);

buttonPlay.addEventListener("click", playPauseSong);
buttonPrevious.addEventListener("click", playPreviousSong);
buttonNext.addEventListener("click", playNextSong);
buttonLoop.addEventListener("click", playInLoop);

audio.addEventListener("ended", playRepeatAgainSong);

document.addEventListener("keydown", onSpacePress);

slider.addEventListener("change", updateCurrentTime);



// создаём несколько плейлистов для теста
createPlaylist(all_tracks, "all music");
createPlaylist(tchaikovsky_playlist, "Tchaikovsky");

selectPlaylist(all_tracks);
playerData.currentPlaylist = all_tracks;
