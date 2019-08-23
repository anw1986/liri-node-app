console.log('API keys loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.omdb={
    key:process.env.omdb_key
}

exports.bandsinTown={
    key:process.env.bands_key
}