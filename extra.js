

// App functionality due to user input
if(command === "my-tweets") {
	myTweets();
} else if(command === "spotify-this-song") {
	spotifySearch(query);
} else if(command === "movie-this") {
	movieThis(query);
} else if(command === "do-what-it-says") {
	// App functionality from file read / loads fs npm package
	var fs = require("fs");

	fs.readFile("random.txt", "utf-8", function(error, data) {
		var command;
		var query;

		// If there is a comma, then we will split the string from file in order to differentiate between the command and query
		// 	--> if there is no comma, then only the command is considered (my-tweets)
		if(data.indexOf(",") !== -1) {
			var dataArr = data.split(",");
			command = dataArr[0];
			query = dataArr[1];
		} else {
			command = data;
		}

		// After reading the command from the file, decides which app function to run
		if(command === "my-tweets") {
			myTweets();
		} else if(command === "spotify-this-song") {
			spotifySearch(query);
		} else if(command === "movie-this") {
			movieThis(query);
		} else { // Use case where the command is not recognized
			console.log("Command from file is not a valid command! Please try again.")
		}
	});
} else if(command === undefined) { // use case where no command is given
	console.log("Please enter a command to run LIRI.")
} else { // use case where command is given but not recognized
	console.log("Command not recognized! Please try again.")
}