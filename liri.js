require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require('moment');
var inquirer = require("inquirer");
var Spotify = require('node-spotify-api')
var fs = require("fs")

var spotify = new Spotify(keys.spotify);
var omdbKey = keys.omdb.key
var bandsKey = keys.bandsinTown.key

// function to search bands in town
function artistSearch(artistname) {
    var queryUrl = `https://rest.bandsintown.com/artists/${artistname}/events?app_id=${bandsKey}`


    axios.get(queryUrl).then(
            function (response) {

                console.log(response.data.length)

                for (var j = 0; j < response.data.length; j++) {

                    var dateMoment = moment(response.data[j].datetime)

                    console.log("")
                    console.log("====================Event Details==============================")
                    console.log("* Name of the venue: " + response.data[j].venue.name);
                    console.log("* Venue location: " + response.data[j].venue.city + " " + "," + response.data[j].venue.region);
                    console.log("* Date of the Event: " + dateMoment.format("dddd, MMMM Do YYYY, h:mm a"))
                    console.log("===============================================================")
                }

            })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });

}

// function to search movie
function movieSearch(moviename) {
    var queryUrl = "http://www.omdbapi.com/?t=" + moviename + "&y=&plot=short&apikey=" + omdbKey;

    axios.get(queryUrl).then(
            function (response) {
                console.log("")
                console.log("====================Movie Details==============================")
                console.log("* Title of the movie: " + response.data.Title);
                console.log("* Year the movie came out: " + response.data.Year);
                console.log("* IMDB Rating of the movie: " + response.data.imdbRating)
                console.log("* Rotten Tomatoes Rating of the movie: " + response.data.Ratings[1].Value)
                console.log("* Country where the movie was produced: " + response.data.Country)
                console.log("* Language of the movie: " + response.data.Language)
                console.log("* Plot of the movie: " + response.data.Plot)
                console.log("* Actors in the movie: " + response.data.Actors)
                console.log("===============================================================")
            })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

// act a callback to the spotify API
function getArtistNames(artist) {
    return artist.name
}

// function to search songs on spotify
function songSearch(songname) {
    spotify
        .search({
            type: 'track',
            query: songname,
            // limit: 1
        })
        .then(function (response) {

            var songs = response.tracks.items

            console.log("")
            console.log("I have found these songs for you")

            for (var i = 0; i < songs.length; i++) {
                console.log("====================Song Details==============================")
                console.log(i)
                console.log("Artist(s):        " + songs[i].artists.map(getArtistNames))
                console.log("The songs's name: " + songs[i].name)
                console.log("Link to the song: " + songs[i].preview_url)
                console.log("Album:            " + songs[i].album.name)
                console.log("===============================================================")

            }

        })
        .catch(function (err) {
            console.log(err);
        });
}


inquirer
    .prompt([

        // Here we give the user a list to choose from.
        {
            type: "list",
            message: "What can I search for you?",
            choices: ["List of upcoming concert of your favourite band/artist", "Movie information", "Song on Spotify", "Search random"],
            name: "userSelection"
        }

    ])
    .then(function (inquirerResponse) {
        // If the inquirerResponse confirms, we displays the inquirerResponse
        
        // based on the users first answer the next questions are based on users previous response
        // the user is prompted questions based on previous response

        switch (inquirerResponse.userSelection) {

            case "List of upcoming concert of your favourite band/artist":

                inquirer
                    .prompt([

                        // request user input.
                        {
                            type: "input",
                            message: "Please enter band/artist concert you want to search?",
                            name: "artistInput"
                        }

                    ]).then(function (artistResponse) {
                        
                        artistSearch(artistResponse.artistInput)
                    })

                break;

            case "Movie information":

                inquirer
                    .prompt([

                        // request user input.
                        {
                            type: "input",
                            message: "Enter movie name you want to search?",
                            name: "movieInput"
                        }

                    ]).then(function (movieResponse) {

                        // check if the user entered a movie or not. default "Mr. Nobody"

                        if (movieResponse.movieInput === "") {
                            console.log("I guess you are feeling lucky and want to know about Mr. Nobody")
                            movieSearch("Mr. Nobody")
                        } else {

                            movieSearch(movieResponse.movieInput)
                        }

                    })

                break;

            case "Song on Spotify":
                inquirer
                    .prompt([

                        // request user input.
                        {
                            type: "input",
                            message: "Enter song you want to search on Spotify?",
                            name: "songInput"
                        }

                    ]).then(function (songResponse) {

                        if (songResponse.songInput === "") {
                            console.log("I went ahead and searched for The Sign by Ace of Base")
                            songSearch("The Sign by Ace of Base")
                        } else {

                            songSearch(songResponse.songInput)
                        }

                    })
                break;

                // If the "do-what-it-says/search random" option is selected, read the file
                // assuming that that the elements in random.txt file are always in order
                // that is the first element is the command followed tby the search string 
                // if there is command only then fall back to default values

            default:
                fs.readFile("./random.txt", "utf8", function (error, data) {
                    if (error) {
                        return console.log(error)
                    }
                   
                    console.log(data)
                    var dataArr = data.split(",")
                    if (dataArr.length === 2) {
                        switch (dataArr[0]) {
                            case "spotify-this-song":
                                songSearch(dataArr[1])
                                break;

                            case "concert-this":
                                artistSearch(dataArr[1])
                                break;

                            default:
                                movieSearch(dataArr[1])

                        }
                    } else {

                        switch (dataArr[0]) {
                            case "spotify-this-song":
                                songSearch("The Sign")
                                break;

                            case "concert-this":
                                artistSearch("Taylor Swift")
                                break;

                            default:
                                movieSearch("Mr. Nobody.")

                        }


                    }

                })


        }



    });