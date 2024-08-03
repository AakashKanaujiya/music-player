console.log("Aakash");
let currentSong = new Audio();
let songs;
let crrfolder;

function secondsToMinutesSeconds(seconds) {
    if(isNaN(seconds)|| seconds < 0)
    {
       return  "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    // Format minutes and seconds as two-digit strings
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    
    // Return the formatted time string
    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder){
    crrfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUl.innerHTML = "";
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li> 
        
        <img class="musicImage" src="music.svg" alt="">
                            <div class="info">
                               <div>${song.replaceAll("%20"," ")} </div>
                               <div>Artist Name</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert songbutton1" src="playBtn.svg" alt="">
                            </div>
        </li>`
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })
    return songs;
}

const playMusic = (track,pause=false)=>{
    currentSong.src = `/${crrfolder}/` + track;
    if(!pause){
      currentSong.play();
      play.src = "pauseBtn.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    console.log(div)

    let anchors = div.getElementsByTagName("a");
    
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
      for(let index = 0; index < array.length; index++){
        const e =array[index];

        if(e.href.includes("/songs/")){
            let folder = e.href.split("/songs/").slice(-1)[0];
            console.log(folder)
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
                    <div class="play">
                        <img src="play.svg" alt="">
                    </div>
                    <img src="/songs/${folder}/cover.jpeg" alt="">
                    <h2>${response.tittle}</h2>
                    <p>${response.description}</p>
                </div>`
       }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs =await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        })
    })
}

async function main(){
    await getSongs("songs/Love");
    playMusic(songs[0],true);
    displayAlbums();
    
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "pauseBtn.svg"
        }
        else{
            currentSong.pause();
            play.src = "playBtn.svg"
        }
    })

    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)* percent)/100;
    })

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0";
    })

    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-100%";
    })

    document.querySelector(".spotifyPlaylist").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-100%";
    })

    previous.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index-1) >= 0){
            playMusic(songs[index-1]);
        }
    })

    next.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index+1) < songs.length){
            playMusic(songs[index+1]);
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume = parseInt(e.target.value)/100;

        document.querySelector(".volume>img").src= "volume.svg";

    })
    
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .30;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 30;
        }

    })

    // document.getElementsByClassName("card").addEventListener("click",()=>{
    //     document.querySelector(".left").style.left = "0";
    // })

}

main();