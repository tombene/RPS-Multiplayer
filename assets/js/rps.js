
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

var database = firebase.database(),
	player = 1,
	rps = ['rock', 'paper', 'scissors'],
	currentPlayer = '',
	currentPlayerKey = '',
	battleReady = 0,
	whoIsPlaying = 0;

var player1 = {
	playerKey: '',
	playerChoice: '',
	wins: 0,
	losses: 0,
	name
}

var player2 = {
	playerKey: '',
	playerChoice: '',
	wins: 0,
	losses: 0,
	name
}

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

	currentPlayerKey = database.ref().child('player').push({
		playerName: $('#user-name').val(),
		playerNumber: player,
		wins: 0,
		losses: 0,
		choice: ''
	}).key;
	// database.ref('player/' + currentPlayerKey + '/uid/').set(currentPlayerKey);
	console.log('hide me' + currentPlayerKey);

	$('#user-name-group').attr('class', 'input-group hidden');
	// if (player === 2) {
	$('.welcome').attr('class', 'row welcome');
	$('.status').attr('class', 'row status');
	// }
	$('#user-name').val('');
});

database.ref('player/').on("child_added", function (childSnapshot) {

	whoIsPlaying = childSnapshot.val().playerNumber;
	if (whoIsPlaying === 1) {
		player1.playerKey = childSnapshot.key;
		player1.playerChoice = childSnapshot.val().choice;
		player1.wins = childSnapshot.val().wins;
		player1.losses = childSnapshot.val().losses;
	} else {
		player2.playerKey = childSnapshot.key;
		player2.playerChoice = childSnapshot.val().choice;
		player2.wins = childSnapshot.val().wins;
		player2.losses = childSnapshot.val().losses;
	}
	// currentPlayer = childSnapshot.val().key;
	console.log(currentPlayer);
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

// database.ref().once("value", function (data) {
// 	whoIsPlaying = data.val().playerNumber;
// 	console.log(data.val() + 'stuff is here');
// 	if (whoIsPlaying === 1) {
// 		player1.playerKey = data.key;
// 		player1.playerChoice = data.val().choice;
// 		player1.wins = data.val().wins;
// 		player1.losses = data.val().losses;
// 	} else {
// 		player2.playerKey = data.key;
// 		player2.playerChoice = data.val().choice;
// 		player2.wins = data.val().wins;
// 		player2.losses = data.val().losses;
// 	}
// 	if (parseInt(whoIsPlaying) < 3) {
// 		player++;
// 		// $('#player-' + whoIsPlaying).empty();
// 		console.log('name' + data.val().playerName);
// 		$('#player-' + whoIsPlaying + '-name').text(data.val().playerName);

// 		$('.rps-image-container-' + whoIsPlaying).attr('class', 'rps-image-container-' + whoIsPlaying);

// 	} else {
// 		console.log('Game Full');
// 		$('#user-name-group').attr('class', 'input-group hidden');
// 	}
// 	if(data.val().choice !== ''){
// 		console.log(data.val().choice);
// 		hideHands(data.val().choice);
// 	}
	
// });

function setRPSResults(winner) {
	var divGame = $('<div>');
	if (winner === 0) {
		divGame.text("it's a tie, try again");
	} else if (winner === 1) {
		database.ref('player/' + player1.playerKey + '/wins/').set(player1.wins++);
		divGame.text(player1.name + ' wins!');
	} else {
		database.ref('player/' + player2.playerKey + '/wins/').set(player1.wins++);
		divGame.text(player2.name + ' wins!');
	}
	console.log(player1);
	console.log(player2);
	console.log(database.ref('player/' + player2.playerKey + '/wins/').set(player1.wins++));
	$('#results').append(divGame);
	showHands();
}

$(document).on('click', ".rps-images", function () {
	console.log($(this).attr('data-choice'));
	selection = $(this).attr('data-choice');
	var selectionId = $(this).attr('id').replace(selection, '');
	// database.ref(currentPlayer);
	console.log(currentPlayerKey);
	database.ref('player/' + currentPlayerKey + '/choice/').set(selection);

	//when a choice happens do the following:
	database.ref('player/').on('child_added', function (snapShot) {

		var playerNumber = parseInt(snapShot.val().playerNumber);
		if (playerNumber === 1) {
			player1.playerKey = snapShot.key;
			player1.playerChoice = snapShot.val().choice;
			player1.wins = snapShot.val().wins;
			player1.losses = snapShot.val().losses;
		} else {
			player2.playerKey = snapShot.key;
			player2.playerChoice = snapShot.val().choice;
			player2.wins = snapShot.val().wins;
			player2.losses = snapShot.val().losses;
		}
		if (playerNumber === 1) {
			player1.playerChoice = snapShot.val().choice;
		} else {
			player2.playerChoice = snapShot.val().choice;
		}
	});

	console.log(player1.playerChoice + ' ' + player2.playerChoice);
	if (player1.playerChoice !== '' && player2.playerChoice !== '') {
		var result = computeWinner(player1.playerChoice + player2.playerChoice);
		setRPSResults(result);
	}

	hideHands(selection,selectionId);
});

function hideHands(selection,selectionId){
	switch (selection) {
		case 'rock':
			$('#scissors' + selectionId).attr('class', 'rps-images hidden');
			$('#paper' + selectionId).attr('class', 'rps-images hidden');
			break;
		case 'paper':
			$('#rock' + selectionId).attr('class', 'rps-images hidden');
			$('#scissors' + selectionId).attr('class', 'rps-images hidden');
			break;
		case 'scissors':
			$('#rock' + selectionId).attr('class', 'rps-images hidden');
			$('#paper' + selectionId).attr('class', 'rps-images hidden');
			break;
	}
}

function showHands(){
	console.log('showhands');
	$('#rock1').attr('class', 'rps-images');
	$('#paper1').attr('class', 'rps-images');
	$('#scissors1').attr('class', 'rps-images');
	
	$('#rock2').attr('class', 'rps-images');
	$('#paper2').attr('class', 'rps-images');
	$('#scissors2').attr('class', 'rps-images');
}

function computeWinner(compare) {
	switch (compare) {
		case 'rockpaper':
			return 2;
			break;
		case 'rockscissors':
			return 1;
			break;
		case 'paperrock':
			return 1;
			break;
		case 'papercissors':
			return 2;
			break;
		case 'scissorsrock':
			return 2;
			break;
		case 'scissorspaper':
			return 1;
			break;
		default:
			return 0;
			break;
	}
}