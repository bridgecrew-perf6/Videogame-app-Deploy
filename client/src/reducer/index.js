
const initialState = {
    videogames:[],
    allVideogames: [],
    genres: [],
    genresFromApi: [],
    details: [],
    platforms: [],
    pageNumber:0,
    initialPageNumber:1,
    backPageNumber:false,
    videogamesPlatforms: [],
    searchName:"",
    notModifiedPageNumber:1,
};


function rootReducer(state = initialState, action) {

    switch(action.type){
    	case "GET_VIDEOGAMES":

    		return{
    			...state,
    			videogames:action.payload,
    			allVideogames:action.payload,

    		}

        case 'GET_NAME_VIDEOGAMES':
              var myVideogamess = state.allVideogames
              var searchName=action.payload;
              var searchbarGames;

              var videogameName=[];
              var joinWords;
              var separateWords;
              var numberOfWords;
              var checkElement;

              myVideogamess.map(el=>{
                  joinWords=[];
                  separateWords=el.name.split(" ");
                  numberOfWords=separateWords.length;
                  checkElement=false;
                  let separateDate=el.released.split("-")

                  for (let i=0; i<numberOfWords; i++) {
                    joinWords.push(separateWords.join(" "))
                    separateWords.shift();
                    if(joinWords[i].toLowerCase().startsWith(searchName.toLowerCase())&&!checkElement){     
                      videogameName.push(el)
                      checkElement=true;
                    }
                  }

                  el.platforms.map(platform=>{
                    if(platform.toLowerCase()===searchName.toLowerCase()&&!checkElement){
                      videogameName.push(el)
                    }
                  })  

                  if(separateDate[0]===searchName&&!checkElement){
                    videogameName.push(el)
                  }   
                })

              videogameName.length ?
              searchbarGames=videogameName:
              searchbarGames=[];

            return{
                ...state, 
                videogames:searchbarGames,
                searchName:action.payload 
            }

        case "POST_VIDEOGAME":
            return{
                  ...state,                                  
            }    

        case "GET_GENRES":
            const myGenresFrom=action.payload;
            /*const myGenres= myGenresFrom.map((el)=>{
                return el.name;
            })*/

            return{
                ...state,
                genresFromApi:myGenresFrom,

            } 

        case "GET_GENRES_FROM_DB":
            const myGenresFromDB=action.payload;
            const myGenres= myGenresFromDB.map((el)=>{
                return el.name;
            })

            return{
                ...state,
                genres:myGenres,

            }    
             
        case "FILTER_BY_GENRE":

                    const myVideogames = state.allVideogames

                    const videogamesFiltered= action.payload === 'all' ? myVideogames : myVideogames.filter(el=> (el.genres.map(el=>{return el.name})).includes(action.payload))

                    return {                                        
                        ...state,
                        videogames: videogamesFiltered,
                        searchName:"genre", 

                    }

        
        case "FILTER_CREATED":
                        //const orderCreated = action.payload === 'created' ? state.allVideogames.filter(el => !el.img||!el.img.includes('https://media.rawg.io/media/games')) : state.allVideogames.filter(el => )
                        const orderCreated = action.payload === 'created' ? state.allVideogames.filter(el => el.source===null) : state.allVideogames.filter(el => el.source==='api')
                        return {                                                                              
                            ...state,
                            videogames: action.payload === 'all' ? state.allVideogames : orderCreated,
                            searchName:"created",
                            
                        }
        case "GET_DETAILS":
                return{
                    ...state,
                    details:action.payload

                }

        case "GET_PLATFORMS":
            const myPlatformsFrom=action.payload;

            return{
                ...state,
                platforms:myPlatformsFrom,

            }  

        case 'GET_PAGE_NUMBER':
            return{
                ...state, 
                pageNumber:action.payload, 
            }

        case 'GET_INITIAL_PAGE_NUMBER':
            return{
                ...state, 
                initialPageNumber:action.payload, 
            } 

        case 'GET_BACK_PAGE_NUMBER':
            return{
                ...state, 
                backPageNumber:action.payload, 
            }    

        case 'GET_ORDER':
            return{
                ...state, 
                videogames:action.payload, 
            }  
        case "GET_VIDEOGAMES_PLATFORMS":
            const platformsNames=action.payload;

            return{
                ...state,
                videogamesPlatforms:platformsNames,

            }  
        case "GET_FILTERED_PLATFORMS":
            const filteredPlatforms=action.payload;

            return{
                ...state,
                videogames:filteredPlatforms,
                searchName:"platform",

            } 
        case 'GET_NOT_MODIFIED_PAGE_NUMBER':
            return{
                ...state, 
                notModifiedPageNumber:action.payload, 
            }                         

    	default:
    		return state;
        }
}

export default rootReducer;