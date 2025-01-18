
musics = [
    {id: "eminem-rap-god", title: "Rap God - Eminem"},
    {id: "despacito", title: "Despacito - Luis Fonzi"}
]

function addMusicOption(music) {
    const option = document.createElement("option")
    option.value = music.id
    option.innerText = music.title
    selector.appendChild(option)
}

for (const music of musics) {
    addMusicOption(music)
}

