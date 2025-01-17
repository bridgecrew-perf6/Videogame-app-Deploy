const { Router } = require('express');
const axios= require('axios');
const {Genre,Videogame}=require('../db');

require('dotenv').config();
const { API_KEY } = process.env;

const router = Router();

router.get('/apidb',async(req,res)=>{

  var infoUrl;
  var myGame;
  
  for(let i=1;i<=1;i++){
    infoUrl=await axios.get(`https://api.rawg.io/api/games?page=${i}&&key=${API_KEY}`) 

    await infoUrl.data.results.map(async (el)=>{

      let idToString=el.id.toString();
      myGame=await axios.get(`https://api.rawg.io/api/games/${idToString}?key=${API_KEY}`)


      let insertedVideogame = await Videogame.create({
        
            name:el.name,
            description:myGame.data.description_raw,
            platforms:el.platforms.map(el=>el.platform.name),
            img:el.background_image,
            released:el.released,
            source:'api',
        
        
          })
      let genres= await el.genres.map(el=>el.name)


      genres.map(el=>{

         Genre.findOrCreate({ 
          where:{name:el} 
        });
      })
        
      let genreDb=await Genre.findAll({
        where: {name:genres}
      })

      insertedVideogame.addGenre(genreDb);

      });

  }

  res.status(200).send("videojuegos de la api pasados a la base de datos");
  
})

const infoFromDb=async()=>{
  return await Videogame.findAll({
    include:{ //incluime el modelo género. 
      model:Genre,
      attributes:['name'], //traeme este atributo mediante attributes
      through:{ //
        attributes: [],
      },

    }
  })
}

const getAllCharacters=async()=>{
  //await infoFromApi();
  const dbInfo=await infoFromDb();
  //const infoTotal=apiInfo.concat(dbInfo);
  return dbInfo;
}

router.get('/videogames',async(req,res)=>{
  //const name=req.query.name
  let videogamesList=await getAllCharacters();
  //let videogamesList=await infoFromApi();
  res.status(200).send(videogamesList);
  
})

router.get('/platforms',async(req,res)=>{
  let platformsName=[
   "PC",
   "PlayStation 5",
   "Xbox One",
   "PlayStation 4",
   "Xbox Series S/X",
   "Nintendo Switch",
   "iOS",
   "Android",
   "Nintendo 3DS",
   "Nintendo DS",
   "Nintendo DSi",
   "macOS",
   "Linux",
   "Xbox 360",
   "Xbox",
   "PlayStation 3",
   "PlayStation 2",
   "PlayStation",
   "PS Vita",
   "PSP",
   "Wii U",
   "Wii",
   "GameCube",
   "Nintendo 64",
   "Game Boy Advance",
   "Game Boy Color",
   "Game Boy",
   "SNES",
   "NES",
   "Classic Macintosh",
   "Apple II",
   "Commodore / Amiga",
   "Atari 7800",
   "Atari 5200",
   "Atari 2600",
   "Atari Flashback",
   "Atari 8-bit",
   "Atari ST",
   "Atari Lynx",
   "Atari XEGS",
   "Genesis",
   "SEGA Saturn",
   "SEGA CD",
   "SEGA 32X",
   "SEGA Master System",
   "Dreamcast",
   "3DO",
   "Jaguar",
   "Game Gear",
   "Neo Geo",
  ]

  res.status(200).send(platformsName)
})

router.get('/genres',async (req,res)=> {
    let genreNames=[
     "Action",
     "Indie",
     "Adventure",
     "RPG",
     "Strategy",
     "Shooter",
     "Casual",
     "Simulation",
     "Puzzle",
     "Arcade",
     "Platformer",
     "Racing",
     "Massively Multiplayer",
     "Sports",
     "Fighting",
     "Family",
     "Board Games",
     "Educational",
     "Card",
    ]
    res.status(200).send(genreNames);
})

router.get('/genresFromDb',async (req,res)=> {

    const allGenres=await Genre.findAll();
    res.status(200).send(allGenres);
})

router.post('/videogame',async(req,res)=>{
  try{
    let {
    name,
    description,
    platforms,
    genre,
    img,
    released,

  }=req.body

  let insertedVideogame=await Videogame.create({
    name,
    description,
    platforms,
    img,
    released,
  })
  
  Array.isArray(genre)?
  genre.map(async (el)=>{
    await Genre.findOrCreate({ 
    where:{name:el} 
  });
  }):
  await Genre.findOrCreate({ 
    where:{name:genre} 
  });
  

  
  let genreDb=await Genre.findAll({
    where: {name:genre}
  })
  insertedVideogame.addGenre(genreDb);
  
  res.send('Videojuego creado');
  }catch(error){
    res.send(error);
  }
  
})


router.get('/videogame/:id',async(req,res)=>{
  const id=req.params.id;
  const videogamesList=await getAllCharacters();
  //const videogamesList=await infoFromApi();
  
    let videogameId=await videogamesList.filter(el=>el.id==id);
    videogameId.length?
    res.status(200).send(videogameId):
    res.status(404).send('No existe este videojuego');
  
})

router.get('/order/:name',async(req,res)=>{
  const name=req.params.name;
  const videogamesList=await getAllCharacters();
  var orderedGames;

  if(name.toLowerCase()==='asc'){
    orderedGames=videogamesList.sort(function (a, b) {
                        if (a.name > b.name) {
                            return 1;
                        }
                        if (b.name > a.name) {
                            return -1;
                        }
                        return 0;
                    })
  }else{
    orderedGames=videogamesList.sort(function (a, b) {
                        if (a.name > b.name) {
                            return -1;
                        }
                        if (b.name > a.name) {
                            return 1;
                        }
                        return 0;
                    })
  }
  
    orderedGames.length?
    res.status(200).send(orderedGames):
    res.status(404).send('No se pudo ordenar los videojuegos');
  
})

router.get('/videogamesPlatforms',async(req,res)=>{
  
const videogamesList=await getAllCharacters();
  var allPlatforms=[];
  var noRepeteadesPlatforms=[];
  
  videogamesList.map(el=>{
     el.platforms.map(platform=>{
      allPlatforms.push(platform)
    })
  })

    for(let i=0;i<allPlatforms.length;i++){
      if(noRepeteadesPlatforms.indexOf(allPlatforms[i])===-1){
        noRepeteadesPlatforms.push(allPlatforms[i])
      }
    }

  res.status(200).send(noRepeteadesPlatforms)
  
})

router.get('/filteredPlatform/:name',async(req,res)=>{
  const videogamesList=await getAllCharacters();
  const name=req.params.name;
  var filteredPlatforms=[];
  
  if(name==="all"){
    res.status(200).send(videogamesList)
  }else{

    videogamesList.map(el=>{
     el.platforms.map(platform=>{
      if(platform===name){
        filteredPlatforms.push(el)
      }
     })
  })
    res.status(200).send(filteredPlatforms)
  }
  
})


module.exports = router;

/*const infoFromApi=async()=>{

  var infoUrl;
  var apiInfo;
  //var apiInfoTotal=[];

  for(let i=1;i<=1;i++){ 

    infoUrl=await axios.get(`https://api.rawg.io/api/games?page=${i}&&key=${API_KEY}`)
    apiInfo=await infoUrl.data.results.map((el)=>{

      
      
          return{
            id: el.id,
            name: el.name,
            description:'sdasd',
            platforms: el.platforms.map(el=>el.platform.name),  
            img:el.background_image,
            genres: el.genres.map(el=>el.name),
            released:el.released,
            source:'api',
          }         
  });
    
    //apiInfoTotal=apiInfoTotal.concat(apiInfo);
  }

  return apiInfo;
};

const getAllCharacters=async()=>{
  const apiInfo=await infoFromApi();
  const dbInfo=await infoFromDb();
  const infoTotal=apiInfo.concat(dbInfo);
  return infoTotal;
}

(async function(){
  videogamesList=await getAllCharacters();
})();*/