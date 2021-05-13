const thepoliceMembers = [
    {name:"Sting",
    description:`Gordon Matthew Thomas Sumner (Wallsend, Tyneside del Norte, Inglaterra, 2 de octubre de 1951), conocido artísticamente como Sting, es un músico británico que se desempeñó inicialmente como bajista, y más tarde como cantante y bajista del grupo musical The Police, formando luego su propia banda.

    Como miembro de The Police y como solista, Sting ha vendido más de cien millones de discos,1​ ha recibido dieciséis Premios Grammy por su trabajo, recibiendo el primero por «mejor interpretación de rock instrumental» en 1981, y obtuvo una nominación a los premios Óscar por «mejor canción».2​3​`,
    img:"sting.jpeg"},
    {name:"Andy Summers",
    description:`Andrew James Summers (Poulton-le-Fylde, Lancashire, 31 de diciembre de 1942), más conocido como Andy Summers, es un músico, compositor y multiinstrumentista británico, conocido por ser el guitarrista de la banda The Police. Fue ubicado en el puesto N°85 de la Lista de los 100 guitarristas más grandes de todos los tiempos según la revista Rolling Stone`,
    img:"andySummers.jpeg"},
    {name:"Stewart Armstrong ",
    description:`Stewart Armstrong Copeland (Alexandria, Virginia; 16 de julio de 1952) es un músico, compositor y multiinstrumentista estadounidense, conocido por ser uno de los miembros originales del power trio de rock británico The Police.

    Es ampliamente considerado como uno de los mejores y más influyentes bateristas de la era del rock de todos los tiempos. Su manera de ejecución en el instrumento influyó en afamados y diversos bateristas, tales como Dave Lombardo, Joey Jordison, Igor Cavalera, Travis Barker, Chad Smith, José Pasillas, Taylor Hawkins, Danny Carey, Marco Minnemann, Alex González, Charly Alberti, entre otros.
    
    A pesar de ser zurdo, Copeland toca la batería como un baterista diestro. Durante sus años con The Police, se hizo conocido por ser pionero de los tambores octoban.
    `,
    img:"stewart.jpeg"}]



const thePoliceAlbums=[
    {nombre:"Every Breath you take",
    img:'album1.png'},
    {nombre:"Synchronicity",
    img:'Police-album-synchronicity.jpeg'},
    {nombre:"The Police",
    img:'The_Police_(album).jpeg'},
    {nombre:"Every Breath you take",
    img:'verybest.jpeg'}]



    /*Members*/
    $membersDiv = document.getElementById('members')
    $templateMembers = document.getElementById('members-template').content
    $fragmentMembers = document.createDocumentFragment()


thepoliceMembers.forEach(el=>{
    $templateMembers.querySelector("img").setAttribute("src",`./assets/img/thepolice/members/${el.img}`)
    $templateMembers.querySelector(".member-name").innerHTML = el.name
    $templateMembers.querySelector(".members-card-content").innerHTML =el.description
let $clone = document.importNode($templateMembers,true)
$fragmentMembers.appendChild($clone)
})
$membersDiv.appendChild($fragmentMembers)


/*ALBUMS*/
$albumsDiv = document.getElementById('albums')
$templateAlbums = document.getElementById('albums-template').content
$fragmentAlbums = document.createDocumentFragment()


thePoliceAlbums.forEach(el=>{
$templateAlbums.querySelector("img").setAttribute("src",`./assets/img/thepolice/albums/${el.img}`)
$templateAlbums.querySelector(".albums-card-content").innerHTML =el.nombre
let $clone = document.importNode($templateAlbums,true)
$fragmentAlbums.appendChild($clone)
})

$albumsDiv.appendChild($fragmentAlbums)