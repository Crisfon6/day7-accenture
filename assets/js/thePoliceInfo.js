let globalAlbums = [];

/* GETTING TOKEN */
const artist = "5NGO30tJxFlKixkPSgXcFE";
const getToken = async () => {
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

/* PREQUERY TO REQUEST DE API*/
const preQuery = async (method) => {
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

/* getting albums*/
const getAlbums = async () => {
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

//gettins music by albums
const getMusicByAlbum = async (id, requestOptions) => {
  const resp = await fetch(
    `https://api.spotify.com/v1/albums/${id}/tracks`,
    requestOptions
  );
  if (resp.status == 401) {
    await getToken();
    resp = await getMusicByAlbum(album["id"], requestOptions);
  }
  let data = await resp.text();
  data = JSON.parse(data);
  return data["items"];
};

/* getting tracks*/
const getTracks = async (idAlbum) => {
  globalTracks = [];
  const requestOptions = await preQuery("GET");

  let music = await getMusicByAlbum(idAlbum, requestOptions);
  for (let i = 0; i < music.length; i++) {
    globalTracks.push(music[i]);
  }
};

/* MAIN FUNCTION TO CALL TO OTHER ASYN FUNCTIONS*/

const main = async () => {
  globalAlbums = await getAlbums();
  console.log(globalAlbums);
  drawAlbums(globalAlbums);
};

/* This function Create new modal with tracks by albym*/
const openTracks = async (evt) => {
  await getTracks(evt.target.children[0].innerHTML);

  let html = `
        <div class="modal">
        <div class="modal-container" id ="modal-container">
        <h3>Canciones </h3>
   
        <div>
        <div class="closeBtnModal" id="closeBtnModal" >X</div>
        </div>`;

  let $modalDiv = document.createElement("div");
  let $ulTracks = document.createElement("ul");
  $modalDiv.innerHTML = html;

  //creating a list of tracks
  let li = ``;
  globalTracks.forEach((el) => {
    li += `<li> <i class="fas fa-music"></i> ${el.name} </li>`;
  });
  $ulTracks.innerHTML = li;
  $modalDiv.querySelector("#modal-container").appendChild($ulTracks);

  document.body.appendChild($modalDiv);
  document.body.style.overflow = "hidden";

  //onclick event
  $modalDiv.querySelector("#closeBtnModal").onclick = () => {
    document.body.removeChild($modalDiv);
    document.body.style.overflow = "auto";
  };
};

//INFO ABOUT MEMBERS 
const thepoliceMembers = [
  {
    name: "Sting",
    description: `Gordon Matthew Thomas Sumner (Wallsend, Tyneside del Norte, Inglaterra, 2 de octubre de 1951), conocido artísticamente como Sting, es un músico británico que se desempeñó inicialmente como bajista, y más tarde como cantante y bajista del grupo musical The Police, formando luego su propia banda.

    Como miembro de The Police y como solista, Sting ha vendido más de cien millones de discos,1​ ha recibido dieciséis Premios Grammy por su trabajo, recibiendo el primero por «mejor interpretación de rock instrumental» en 1981, y obtuvo una nominación a los premios Óscar por «mejor canción».2​3​`,
    img: "sting.jpeg",
  },
  {
    name: "Andy Summers",
    description: `Andrew James Summers (Poulton-le-Fylde, Lancashire, 31 de diciembre de 1942), más conocido como Andy Summers, es un músico, compositor y multiinstrumentista británico, conocido por ser el guitarrista de la banda The Police. Fue ubicado en el puesto N°85 de la Lista de los 100 guitarristas más grandes de todos los tiempos según la revista Rolling Stone`,
    img: "andySummers.jpeg",
  },
  {
    name: "Stewart Armstrong ",
    description: `Stewart Armstrong Copeland (Alexandria, Virginia; 16 de julio de 1952) es un músico, compositor y multiinstrumentista estadounidense, conocido por ser uno de los miembros originales del power trio de rock británico The Police.

    Es ampliamente considerado como uno de los mejores y más influyentes bateristas de la era del rock de todos los tiempos. Su manera de ejecución en el instrumento influyó en afamados y diversos bateristas, tales como Dave Lombardo, Joey Jordison, Igor Cavalera, Travis Barker, Chad Smith, José Pasillas, Taylor Hawkins, Danny Carey, Marco Minnemann, Alex González, Charly Alberti, entre otros.
    
    A pesar de ser zurdo, Copeland toca la batería como un baterista diestro. Durante sus años con The Police, se hizo conocido por ser pionero de los tambores octoban.
    `,
    img: "stewart.jpeg",
  },
];

/* cREATING Members CARDS*/
$membersDiv = document.getElementById("members");
$templateMembers = document.getElementById("members-template").content;
$fragmentMembers = document.createDocumentFragment();

thepoliceMembers.forEach((el) => {
  $templateMembers
    .querySelector("img")
    .setAttribute("src", `./assets/img/thepolice/members/${el.img}`);
  $templateMembers.querySelector(".member-name").innerHTML = el.name;
  $templateMembers.querySelector(".members-card-content").innerHTML =
    el.description;
  let $clone = document.importNode($templateMembers, true);
  $fragmentMembers.appendChild($clone);
});
$membersDiv.appendChild($fragmentMembers);

/* CRETING ALBUMS CARD*/

const drawAlbums = (globalAlbums) => {
  $albumsDiv = document.getElementById("albums");
  $templateAlbums = document.getElementById("albums-template").content;
  $fragmentAlbums = document.createDocumentFragment();

  globalAlbums.forEach((el) => {
    $templateAlbums
      .querySelector("img")
      .setAttribute("src", `${el.images[0].url}`);
    $templateAlbums.querySelector(".albums-card-content").innerHTML = el.name;
    $templateAlbums.querySelector("#idAlbum").innerHTML = el.id;
    $templateAlbums.onclick = (evt) => openTracks(evt);
    let $clone = document.importNode($templateAlbums, true);
    $fragmentAlbums.appendChild($clone);
  });

  $albumsDiv.appendChild($fragmentAlbums);

  /* onlick event to open tracks to each album*/
  document.getElementsByName("watch-songs").forEach((el) => {
    el.onclick = (evt) => openTracks(evt);
  });
};



//calling main function
main();
