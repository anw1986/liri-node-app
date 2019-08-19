var axios = require("axios");

var nodeArgs = process.argv;

var movieName = "";

for (var i = 2; i < nodeArgs.length; i++) {

  if (i > 2 && i < nodeArgs.length) {
    movieName = movieName + "+" + nodeArgs[i];
  } else {
    movieName += nodeArgs[i];

  }
}

// Then run a request with axios to the OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=f2f0c1f6";

// This line is just to help us debug against the actual URL.
console.log(queryUrl);

axios.get(queryUrl).then(
  function(response) {
    console.log("* Title of the movie: " + response.data.Title);  
    console.log("* Year the movie came out: " + response.data.Year);
    console.log("* IMDB Rating of the movie: " + response.data.imdbRating)
    console.log("* Rotten Tomatoes Rating of the movie: " + response.data.Ratings[1].Value)
    console.log("* Country where the movie was produced: " + response.data.Country)
    console.log("* Language of the movie: " + response.data.Language)
    console.log("* Plot of the movie: " + response.data.Plot)
    console.log("* Actors in the movie: " + response.data.Actors)
  })
  .catch(function(error) {
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