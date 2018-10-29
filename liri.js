// Allow the use of the .env file

require("dotenv").config();

// Import of files/NPM

var fs = require('fs');
var request = require('request');
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var moment = require('moment');

// Pull out arguments for Node

var command = process.argv[2];
var query = process.argv.slice(3).join(" ");

var getTweets = function(name) {

	if(name === undefined) {
		name = "NASA";
	}
	
	var client = new Twitter(keys.twitter);

	var params = {screen_name: name, count: 5};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			console.log(error);
			return;
		} else {

			// Create an output variable that we can grab all the data in to console.log and append it to the log.txt file

			var output = '\n' + params.screen_name + ' Tweets: \n \n';

			for (var i = 0; i < tweets.length; i++) {
				output += 'Created on: ' + tweets[i].created_at + '\n' + 
							 'Tweet content: ' + tweets[i].text + '\n' +
							 '\n';
			}
			
			console.log(output);
			logIt(output);
			
		}
	});
}
 
var spotifySearch = function(trackQuery) {
	
	if(trackQuery === undefined) {
		trackQuery = "Avalanche";
	}

	var spotify = new Spotify(keys.spotify);

	// Spotify API request

	spotify.search({ type: 'track', query: trackQuery }, function(error, data) {

	    if(error) { 

			console.log('Error occurred: ' + error);
			
	    } else { 
			
			var songInfo = data.tracks.items[0];

			for(var i = 0; i < songInfo.artists.length; i++) {
				if(i === 0) {
					var output = ("\nArtist(s):    " + songInfo.artists[i].name);
				} else {
					var output = ("              " + songInfo.artists[i].name);
				}
			}
			output += ("\nSong:         " + songInfo.name);
			output += ("\nPreview Link: " + songInfo.preview_url);
			output += ("\nAlbum:        " + songInfo.album.name + '\n');

			console.log(output);
			logIt(output);
	    }
	});
}

var movieSearch = function(movieQuery) {

	if(movieQuery === undefined) {
		movieQuery = "shrek";
	}

	request("https://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
	  if (!error && response.statusCode === 200) {
	    var output = "\nTitle:            " + JSON.parse(body).Title;
	    output += "\nYear:             " + JSON.parse(body).Year;
	    output += "\nIMDB Rating:      " + JSON.parse(body).imdbRating;
	    output += "\nCountry produced: " + JSON.parse(body).Country;
	    output += "\nLanguage:         " + JSON.parse(body).Language;
	    output += "\nPlot:             " + JSON.parse(body).Plot;
	    output += "\nActors:           " + JSON.parse(body).Actors;

	    for(var i = 0; i < JSON.parse(body).Ratings.length; i++) {
	    	if(JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
	    		output += "\nRotten Tomatoes:  " + JSON.parse(body).Ratings[i].Value;
	    		if(JSON.parse(body).Ratings[i].Website !== undefined) {
	    			output += "\nRotten Tomatoes URL:        " + JSON.parse(body).Ratings[i].Website;
	    		}
	    	}
		}
		
		console.log(output);
		logIt(output);
	  }
	});
}

var bandSearch = function(artist) {

	if(artist === undefined) {
		artist = "Ariana Grande";
	}

	request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function(error, response, body) {
		if (!error && response.statusCode === 200) {

			var data = JSON.parse(body);

			var output = "";

        	data.forEach(function(item){

				var event = [

					"\nVenue:     " + item.venue.name,
					"Location:  " + item.venue.city,
					"Date:      " + moment(item.datetime,'YYYY-MM-DD').format('MM/DD/YYYY'),
					
					"--------------------------------------"].join('\n');
					
				output += event;
			
			});
			
			console.log(output);
			logIt(output);
		}
	});
}

var doIt = function() {

	fs.readFile('random.txt', 'utf8', function (error, data) {
		if (error) {
			console.log(error);
			return;
		} else {
			
			var cmdString = data.split(',');
			var command = cmdString[0].trim();
			var query = cmdString[1].trim();

			switch(command) {
				case 'twitter-this':
					getTweets(query); 
					break;

				case 'spotify-this-song':
					spotifySearch(query);
					break;

				case 'movie-this':
					movieSearch(query);
					break;

				case 'concert-this':
					bandSearch(query);
					break;
			}
		}
	});
}

// Function that logs the user's input and the data retrieved

var logIt = function(response) {
	fs.appendFile('./log.txt', 'User Command: ' + command + ' ' + query + '\n' + response + '\n--------------------------------------------------------------------------------------------------------------- \n', (err) => {
		if (err) throw err;
	});
}

// Link commands with the functions

if (command === "concert-this") {

	bandSearch(query);
} 

else if (command === "spotify-this-song") {

	spotifySearch(query);
}

else if (command === "movie-this") {

	movieSearch(query);
}

else if (command === "twitter-this") {

	getTweets(query);
}

else if (command === "do-what-it-says") {

	doIt();
}

// Offer the user choices on what commands they can use

else {

	console.log("\nThis is not a recognized command. Please use one of the following in addition to a search query:\n \n" +
	" concert-this\n spotify-this-song\n movie-this\n twitter-this\n do-what-it-says\n \nExample: node liri spotify-this-song Take Me Home, Country Roads \n");
}
