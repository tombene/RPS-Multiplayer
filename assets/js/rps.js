
// Initialize Firebase
var config = {
	apiKey: "AIzaSyBqLZCZ5Mv0WvLY5LFf5YWKgcg0Rs5Y5z4",
	authDomain: "games-ca11c.firebaseapp.com",
	databaseURL: "https://games-ca11c.firebaseio.com",
	projectId: "games-ca11c",
	storageBucket: "games-ca11c.appspot.com",
	messagingSenderId: "175548280767"
};

firebase.initializeApp(config);

var database = firebase.database();
var player = 1;
var rps = ['rock', 'paper', 'scissors'];
var currentPlayer;
var currentPlayerKey;
var whoIsPlaying = 0;

//build the option buttons for user to select
//Decided to not make this dynamic to prevent on click problems
// function buildRPSImages(thePlayer) {
// 	var optionsDisplay = $("<div>");
// 	for (var i = 0; i < rps.length; i++) {
// 		optionsDisplay.append('<img class="rps-images" src="assets/images/' + rps[i] + '.jpg" id="' + rps[i] + '" alt="' + rps[i] + '">');
// 	}
// 	return optionsDisplay;
// }

$('#enter-game').on('click', function () {

	console.log($('#user-name').val() + ' ' + player);

	//make sure no more than two players can join the game

	currentPlayerKey = database.ref().push({
		playerName: $('#user-name').val(),
		playerNumber: player,
		wins: 0,
		losses: 0,
		choice: '',
		activelyPlaying: true,
		uid: ''
	}).key;
	database.ref(currentPlayerKey + '/uid/').set(currentPlayer);
	$('#user-name-group').attr('class', 'input-group hidden');
	if (player === 2) {
		$('.welcome').attr('class', 'row welcome');
		$('.status').attr('class', 'row status');
	}
	$('#user-name').val('');
});

// database.ref().on("value", function(snapshot) {
// 	var playerNum = snapshot.val().playerNumber;
// 	if(snapshot.val().activelyPlaying){
// 		$('#player-'+playerNum).remove();
// 		$('#player-'+playerNum).append('<h1>'+snapshot.val().playerName+'</h1>');
// 		$('#player-'+playerNum).append(buildRPSImages());
// 	}

//   console.log('value: ' + snapshot.val());
// }, function (errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });

database.ref().on("child_added", function (childSnapshot) {
	whoIsPlaying = childSnapshot.val().playerNumber;
	
	if (parseInt(whoIsPlaying) < 3) {
		player++;
		// $('#player-' + whoIsPlaying).empty();
		console.log('name' + childSnapshot.val().playerName);
		$('#player-' + whoIsPlaying + '-name').text(childSnapshot.val().playerName);

		$('.rps-image-container-' + whoIsPlaying).attr('class', 'rps-image-container-' + whoIsPlaying);

	} else {
		console.log('Game Full');
		$('#user-name-group').attr('class', 'input-group hidden');
	}
});

$(document).on('click', ".rps-images", function () {
	console.log($(this).attr('data-choice'));
	selection = $(this).attr('data-choice');
	console.log(currentPlayer);
	database.ref(currentPlayer + '/choice/').set(selection);

	console.log(whoIsPlaying);
	switch (selection) {
		case 'rock':
			$('#scissors' + whoIsPlaying).attr('class', 'rps-images hidden');
			$('#paper' + whoIsPlaying).attr('class', 'rps-images hidden');
			break;
		case 'paper':
			$('#rock' + whoIsPlaying).attr('class', 'rps-images hidden');
			$('#paper' + whoIsPlaying).attr('class', 'rps-images hidden');
			break;
		case 'scissors':
			$('#rock' + whoIsPlaying).attr('class', 'rps-images hidden');
			$('#paper' + whoIsPlaying).attr('class', 'rps-images hidden');
			break;
	}
});

function chooseWinner(compare) {
	switch (compare) {
		case 'rockpaper':
			return '2';
			break;
		case 'rockscissors':
			return '1';
			break;
		case 'paperrock':
			return '1';
			break;
		case 'papercissors':
			return '2';
			break;
		case 'scissorsrock':
			return '2';
			break;
		case 'scissorspaper':
			return '1';
			break;
		default:
			return '0';
			break;
	}
}