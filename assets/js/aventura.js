let globalAlbums = [];
let index = false;
let globalArtist = [];
let globalTracks = [];
const artist = "1qto4hHid1P71emI6Fd8xi";
const getToken = async() => {
    let requestOptions = {
        method: "GET",
        redirect: "follow",
    };
    let resp = await fetch(
        "https://spotfiy-token.herokuapp.com/spotify/",
        requestOptions
    );
    let bearrer = await resp.text();
    bearrer = JSON.parse(bearrer)["access_token"];
    localStorage.setItem("Bearrer", bearrer);
};

const preQuery = async(method) => {
    let myHeaders = new Headers();
    const bearrer = localStorage.getItem("Bearrer");
    myHeaders.append("Authorization", `Bearer ${bearrer}`);

    requestOptions = {
        method: method,
        headers: myHeaders,
        redirect: "follow",
    };
    return requestOptions;
};
const filterTracks = (search) => {

    const data = globalTracks.filter(track => track['name'].indexOf(search) !== -1);
    console.log(data);
    document.getElementById("tracks").innerHTML = '';
    data.forEach(track => {
        drawTracks(track);
    })

}
const preDrawTracks = async(prom) => {
    let song = await prom;
    let songs = song['items'];
    for (let i = 0; i < songs.length; i++) {
        drawTracks(songs[i]);
        globalTracks.push(songs[i]);
    }
}

const drawTracks = (data) => {
    let tracks = document.getElementById("tracks");

    let row = document.createElement('div');
    row.setAttribute('class', 'row mt-3 player');
    let col = document.createElement('div');
    col.setAttribute('class', 'col');
    let audio = document.createElement('audio');
    audio.setAttribute('controls', '');

    let source = document.createElement('source');
    source.setAttribute('src', data['preview_url']);
    source.setAttribute('type', 'audio/mp3');

    audio.appendChild(source);
    col.appendChild(audio);

    let colName = document.createElement('div');
    colName.setAttribute('class', 'col');
    let name = document.createElement('h3');
    name.setAttribute('class', 'nameSong');
    name.innerHTML = data['name'];
    colName.appendChild(name);

    row.appendChild(col);
    row.appendChild(colName);
    tracks.appendChild(row);

};
const drawBanner = () => {
    document.getElementById("imgBanner").src = globalArtist["images"][0]["url"];
    document.getElementById("groupName").innerHTML = globalArtist["name"];
    globalArtist["genres"].forEach((genre) => {
        document.getElementById("genres").innerHTML += `
        <li> ${genre}</li>
        `;
    });
};
const drawCarousel = () => {
    let carousel = document.getElementById("carousel");
    let carouselInd = document.getElementById('carouselInd');
    globalAlbums.forEach((album, idx) => {
        let div = document.createElement('div');
        let button = document.createElement('button');
        if (idx === 0) {
            div.setAttribute('class', 'carousel-item active');
            button.setAttribute('class', 'active');
            button.setAttribute('aria-current', '"true"');
        } else {
            div.setAttribute('class', 'carousel-item');
        }
        button.setAttribute('type', 'button');
        button.setAttribute('data-bs-target', '#carouselExampleDark');
        button.setAttribute('data-bs-target', '#carouselExampleDark');
        button.setAttribute('data-bs-slide-to', idx);
        button.setAttribute('aria-label', `Slide ${idx+1}`);

        div.setAttribute('data-bs-interval', '10000');
        let img = document.createElement('img');
        img.src = album['images'][0]['url'];
        img.setAttribute('class', 'd-block  w-100 ');

        let divCaption = document.createElement('div');
        divCaption.setAttribute('class', 'carousel-caption d-none d-md-block');

        let h5 = document.createElement('h5');
        h5.setAttribute('class', '.fs-4 white')
        h5.innerHTML = album['name'];

        let p = document.createElement('p');
        p.setAttribute('class', '.fs-4 white')
        p.innerHTML = `Release date: ${album['release_date']}`;

        divCaption.appendChild(h5);
        divCaption.appendChild(p);

        div.appendChild(img);
        div.appendChild(divCaption);

        carousel.appendChild(div);
        carouselInd.appendChild(button);
    });
};
const getArtist = async() => {
    console.log("get artist");

    const requestOptions = await preQuery("GET");
    const resp = await fetch(
        `https://api.spotify.com/v1/artists/${artist}`,
        requestOptions
    );
    if (resp.status == 401) {
        await getToken();
        getArtist();
    }
    let data = await resp.text();
    data = JSON.parse(data);
    return data;

};
const getAlbums = async() => {
    const requestOptions = await preQuery("GET");

    const resp = await fetch(
        `https://api.spotify.com/v1/artists/${artist}/albums`,
        requestOptions
    );
    if (resp.status == 401) {
        await getToken();
        getAlbums();
    }

    let data = await resp.text();
    data = JSON.parse(data);
    const albums = data["items"];
    return albums;
};
const getMusicByAlbum = async(id, requestOptions) => {
    const resp = await fetch(
        `https://api.spotify.com/v1/albums/${id}/tracks`,
        requestOptions
    );
    if (resp.status == 401) {
        await getToken();
        resp = await getMusicByAlbum(album['id'], requestOptions);
    }
    let data = await resp.text();
    data = JSON.parse(data);
    return data['items'];
}

const getTracks = async() => {
    const requestOptions = await preQuery("GET");
    let fetchs = [];
    for (let i = 0; i < globalAlbums.length; i++) {
        fetchs.push(fetch(
            `https://api.spotify.com/v1/albums/${globalAlbums[i]['id']}/tracks`,
            requestOptions
        ));
    }
    Promise.all(fetchs)
        .then(resps => {
            resps.forEach(albumTracks => {

                preDrawTracks(albumTracks.json());
            })

        }).catch(el => { console.error('error', el) });
};
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', () => {
    filterTracks(searchInput.value);
});

const main = async() => {
    globalArtist = await getArtist();
    globalAlbums = await getAlbums();

    await getTracks();
    drawBanner();
    drawCarousel();

}


main();