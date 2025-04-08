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
const editMenu = document.getElementById("editMenu")

const editMenuButton = document.getElementById("editMenuButton");
const closeEditMenuButton = document.getElementById("closeEditMenuButton");

const newPlaylistButton = document.getElementById("newPlaylistButton");

const addMusicButton = document.getElementById("addMusicButton");
const editPlaylistsButton = document.getElementById("editPlaylistsButton");
const creatNewPlaylistButton = document.getElementById("creatNewPlaylistButton");
const onloadPlaylistButton = document.getElementById("onloadPlaylistButton");

const playButton = document.getElementById("playButton");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const miniPlayerButton = document.getElementById("miniPlayerButton");

const musicName = document.getElementById("musicName");

const timeRangeSlider  = document.getElementById("timeRange");
const indicatorMusicTime = document.getElementById("indicatorMusicTime");

const volumeRangeSlider = document.getElementById("volumeRange");
const indicatorVolumeMusic = document.getElementById("indicatorVolume");



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
    }/*
    playlistsContainer.querySelector(".selected")?.classList.remove("selected");
    playlistsContainer.querySelectorAll(".playlist")?.forEach((node) => {
        if(node.dataset.namePlaylist === "namePlaylist") node.classList.add("selected")
    })*/
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
        //event.target.classList.add("selected");
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
        playButton.querySelector("img").src = "icons/play_button.png"
    } else {
        audio.src = audioData.currentMusic || audioData.currentPlaylist[0];
        audio.currentTime = audioData.currentMusicTime;
        audio.play()
        playButton.querySelector("img").src = "icons/pause_button.png"

        musicName.innerHTML = default_audio[audioData.currentMusic || audioData.currentPlaylist[0]].name
    }
    audioData.isPlay = !audioData.isPlay
}
function onSpacePress(event) {
    if(event.code === "Space") {
        event.preventDefault();
        playMusic();
    }
}

/*
function nextMusic() {
    //
}

function previousMusic() {
    //
}
*/



// Часть когда ответственная за отображение времени и его изменения с помощью слайдера
// перевод секунд в часы:минуты:секунды, возвращает строку
function formatTime(sec) {
    let hours = Math.round(sec / 3600)
    let minutes = sec >= 3600 ? `0${Math.round(sec % 3600 / 60)}` : Math.round(sec % 3600 / 60)
    let seconds = sec % 60 < 10 ? `0${Math.round(sec % 60)}` : Math.round(sec % 60);
    return sec >= 3600 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
}
// обновление отображения текущего времени / всего времени и позиции ползунка
function updateTimeRangeSlider() {
    indicatorMusicTime.innerHTML = formatTime(audio.currentTime) + " / " + (audio.duration ? formatTime(audio.duration) : "0:00");
    timeRangeSlider.value = audio.currentTime / audio.duration * 100 || 0;
}
setInterval(updateTimeRangeSlider, 500);

function changeTimeRange() {
    if(audio.src) {
        audioData.currentMusicTime = audio.currentTime = timeRangeSlider.value * audio.duration / 100;
        updateTimeRangeSlider();
    }
}
function onArrowLeftPress(event) {
    if(event.code === "ArrowLeft") {
        event.preventDefault();
        audio.currentTime -= 5;
        updateTimeRangeSlider();
    }
}
function onArrowRightPress(event) {
    if(event.code === "ArrowRight") {
        event.preventDefault();
        audio.currentTime += 5;
        updateTimeRangeSlider();
    }
}

// Часть кода ответственная за изменение и отображение громкости

function changeVolumeRange() {
    indicatorVolumeMusic.innerHTML = `${Math.round(volumeRangeSlider.value * 100)}%`;
    audio.volume = volumeRangeSlider.value;
}
function onArrowUpPress(event) {
    if(event.code === "ArrowUp") {
        event.preventDefault();
        audio.volume += 0.05;
        volumeRangeSlider.value = audio.volume;
        indicatorVolumeMusic.innerHTML = `${Math.round(volumeRangeSlider.value * 100)}%`;
    }
}
function onArrowDownPress(event) {
    if(event.code === "ArrowDown") {
        event.preventDefault();
        audio.volume -= 0.05;
        volumeRangeSlider.value = audio.volume;
        indicatorVolumeMusic.innerHTML = `${Math.round(volumeRangeSlider.value * 100)}%`;
    }
}



// Часть когда ответственная за добавления плейлиста, отдельной песни или за создание нового плейлиста из уже существующих
let editorMenuData = {
    selectedSectionMenu: null,
}

function openEditMenuUI() {
    modalEditMenu.style.display = "block"
}

function closeEditMenu() {
    modalEditMenu.style.display = "none"
}
function onEscPress(event) {
    if(event.code === "Escape") {
        event.preventDefault();
        closeEditMenu()
    }
}

function selectMenuEdit(id) {
    if(editorMenuData.selectedSectionMenu !== null) {
        editorMenuData.selectedSectionMenu.style.display = "none";
    }
    editorMenuData.selectedSectionMenu = id;
    id.style.display = "block"
}

// Секция кода по созданию нового плейлиста
function showSelectionList() {
    selectionInNewPlaylist.querySelectorAll(".selectionMusic").forEach(music => music.remove())

    for(let music of playerData.playlists["basic playlist"]) {
        let musicDIV = document.createElement("div");
        musicDIV.className = "selectionMusic music";
        musicDIV.innerHTML = default_audio[music].name
        musicDIV.dataset.src = music;

        selectionInNewPlaylist.append(musicDIV)
    }
}
function selectMusicFromListUI(event) {
    if(event.target.classList.contains("selectionMusic")) {
        let etcl = event.target.classList
        etcl.contains("selected") ? etcl.remove("selected") : etcl.add("selected")
    }
}

function createNewPlaylist() {
    let arrNewPlaylist = []
    let nameNewPlaylist = inputNamePlaylist.value;

    for(let node of selectionInNewPlaylist.querySelectorAll(".selected")) {
        arrNewPlaylist.push(node.dataset.src);
    }
    if(nameNewPlaylist in playerData.playlists) {
        alert("пожалуйста, введите другое название плейлиста");
    } else {
        playerData.playlists[nameNewPlaylist] = arrNewPlaylist;
        selectionInNewPlaylist.querySelectorAll(".selected").forEach((node) => {node.classList.remove("selected")})
        showPlaylistUI()
    }
}



audioData.currentPlaylist = playerData.playlists["Tchaikovsky"];
playerData.selectedPlaylist = ["Tchaikovsky", playerData.playlists["Tchaikovsky"]];
showSelectedPlaylistUI();
showPlaylistUI();
changeVolumeRange()



playlistsContainer.addEventListener("click", selectPlaylistUI);
musicContainer.addEventListener("click", selectMusicUI);

timeRangeSlider.addEventListener("change", changeTimeRange);
volumeRangeSlider.addEventListener("change", changeVolumeRange);

playButton.addEventListener("click", playMusic);
document.addEventListener("keydown", onSpacePress);
document.addEventListener("keydown", onArrowLeftPress);
document.addEventListener("keydown", onArrowRightPress);
document.addEventListener("keydown", onArrowUpPress);
document.addEventListener("keydown", onArrowDownPress);
document.addEventListener("keydown", onEscPress);

editMenuButton.addEventListener("click", openEditMenuUI);
closeEditMenuButton.addEventListener("click", closeEditMenu)
window.addEventListener("click", event => {if(event.target.id === "modalEditMenu") closeEditMenu()})

addMusicButton.addEventListener("click", function() {selectMenuEdit(menuAdd);})
editPlaylistsButton.addEventListener("click", function() {selectMenuEdit(menuEditPL)})
creatNewPlaylistButton.addEventListener("click", function() {selectMenuEdit(menuCreatePL)})
newPlaylistButton.addEventListener("click", createNewPlaylist)

onloadPlaylistButton.addEventListener("click", function() {selectMenuEdit(menuOnloadPL)})

selectionInNewPlaylist.addEventListener("click", selectMusicFromListUI)
selectMenuEdit(menuOnloadPL)
showSelectionList()
