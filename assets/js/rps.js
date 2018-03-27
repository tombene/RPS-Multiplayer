
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
	whoIsPlaying = 0,
	waitTime = 2,
	playerRef = database.ref('player/'),
	messageRef = database.ref('/messages'),
	rounds = 3;

var player1 = {
	playerKey: '',
	playerChoice: '',
	wins: 0,
	losses: 0,
	name: '',
	ref: database.ref()
}

var player2 = {
	playerKey: '',
	playerChoice: '',
	wins: 0,
	losses: 0,
	name,
	ref: database.ref()
}

//When a player types in their name and enters the game push them into firebase
$('#enter-game').on('click', function (event) {
	event.preventDefault(event);

	console.log($('#user-name').val() + ' ' + player);

	currentPlayerKey = database.ref().child('player').push({
		playerName: $('#user-name').val(),
		playerNumber: player,
		wins: 0,
		losses: 0,
		choice: ''
	}).key;

	console.log('hide me' + currentPlayerKey);

	$('#user-name-group').attr('class', 'input-group hidden');

	$('.welcome').attr('class', 'row welcome');
	$('.status').attr('class', 'row status');

	$('#user-name').val('');
});

// playerRef.on("child_added", function (childSnapshot) {
// 	whoIsPlaying = parseInt(childSnapshot.val().playerNumber);
// 	updateLocalPlayerValues(childSnapshot);
// 	console.log(player1);
// 	console.log(player2);
// 	$('#wins1').text('Wins: ' + player1.wins);
// 	$('#losses1').text('Losses: ' + player1.losses);
// 	$('#wins2').text('Wins: ' + player2.wins);
// 	$('#losses2').text('Losses: ' + player2.losses);
// 	// currentPlayer = childSnapshot.val().key;
// 	console.log(currentPlayer);
// 	if (parseInt(whoIsPlaying) < 3) {
// 		player++;
// 		// $('#player-' + whoIsPlaying).empty();
// 		console.log('name' + childSnapshot.val().playerName);
// 		$('#player-' + whoIsPlaying + '-name').text(childSnapshot.val().playerName);

// 		$('.rps-image-container-' + whoIsPlaying).attr('class', 'rps-image-container-' + whoIsPlaying);

// 	} else {
// 		console.log('Game Full');
// 		$('#user-name-group').attr('class', 'input-group hidden');
// 	}
// 	//when both players have made a choice

// 	if (player1.playerChoice !== '' && player2.playerChoice !== '') {
// 		$('#game-message').text(player1.name + ' : ' + player2.name);
// 		var result = computeWinner(player1.playerChoice + player2.playerChoice);
// 		setRPSResults(result);
// 		showHands();
// 	}

// });

playerRef.on("value", function (valueSnapShot) {
	// updateLocalPlayerValues(valueSnapShot);
	// console.log(player1);
	// console.log(player2);
	// if (player1.playerChoice !== '' && player2.playerChoice !== '') {
	// 	$('#game-message').text(player1.name + ' : ' + player2.name);
	// 	var result = computeWinner(player1.playerChoice + player2.playerChoice);
	// 	setRPSResults(result);
	// 	showHands();
	// }
	valueSnapShot.forEach(function (childSnapshot) {
		// console.log(childSnapshot.key);
		// console.log(childSnapshot.val());
		whoIsPlaying = parseInt(childSnapshot.val().playerNumber);
		console.log(player1);
		console.log(player2);
		updateLocalPlayerValues(childSnapshot);
		console.log(player1);
		console.log(player2);
		$('#wins1').text('Wins: ' + player1.wins);
		$('#losses1').text('Losses: ' + player1.losses);
		$('#wins2').text('Wins: ' + player2.wins);
		$('#losses2').text('Losses: ' + player2.losses);
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
		//when both players have made a choice

		if (player1.playerChoice !== '' && player2.playerChoice !== '') {
			// $('#game-message').text(player1.name + ' : ' + player2.name);
			var result = computeWinner(player1.playerChoice + player2.playerChoice);
			setRPSResults(result);
			showHands();
		}
	});
});

function setRPSResults(winner) {
	var divGame = $('<div>');
	//clear their choice so we don't get caught into an infinate loop
	player1.playerChoice = '';
	player2.playerChoice = '';
	console.log('winner ' + winner);
	if (winner === 0) {
		divGame.text("it's a tie, try again");
	} else if (winner === 1) {
		player1.wins++;
		player2.losses++;
		
		database.ref('player/' + player1.playerKey).update({ choice: '', wins: player1.wins});
		database.ref('player/' + player2.playerKey).update({ losses: player2.losses });
		
		divGame.text(player1.name + ' wins!');
		$('#wins1').text('Wins: ' + player1.wins);
		$('#losses1').text('Losses: ' + player1.losses);
		
	} else {
		player2.wins++;
		player1.losses++;
		
		database.ref('player/' + player2.playerKey).update({ choice: '', wins: player2.wins});
		database.ref('player/' + player1.playerKey).update({ losses: player1.losses });
		
		divGame.text(player2.name + ' wins!');
		$('#wins2').text('Wins: ' + player2.wins);
		$('#losses2').text('Losses: ' + player2.losses);
	}
	
	// console.log(database.ref('player/' + player2.playerKey ).update({wins: player1.wins++}));
	$('#results').append(divGame);
	//playerRef.off("value");
	// rounds--;
	// if (rounds < 0) {
	// 	startOver();
	// }

}

function startOver() {
	player = 1,
		rps = ['rock', 'paper', 'scissors'],
		currentPlayer = '',
		currentPlayerKey = '',
		battleReady = 0,
		whoIsPlaying = 0,
		waitTime = 2,
		playerRef = database.ref('player/'),
		messageRef = database.ref('messages/'),
		rounds = 3;

	player1 = {
		playerKey: '',
		playerChoice: '',
		wins: 0,
		losses: 0,
		name: '',
		ref: database.ref()
	}

	player2 = {
		playerKey: '',
		playerChoice: '',
		wins: 0,
		losses: 0,
		name,
		ref: database.ref()
	}

	$('#game-messages').empty();
}

//when a user clicks on an image and makes a choice
$(document).on('click', ".rps-images", function () {
	console.log($(this).attr('data-choice'));
	selection = $(this).attr('data-choice');
	var selectionId = $(this).attr('id').replace(selection, '');
	hideHands(selection, selectionId);

	console.log(currentPlayerKey + ' selection ' + selection);
	database.ref('player/' + currentPlayerKey).update({ choice: selection });
});

function hideHands(selection, selectionId) {
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

function showHands() {
	intervalId = setInterval(function () {
		waitTime--;
		if (waitTime < 0) {
			$('#rock1').attr('class', 'rps-images');
			$('#paper1').attr('class', 'rps-images');
			$('#scissors1').attr('class', 'rps-images');

			$('#rock2').attr('class', 'rps-images');
			$('#paper2').attr('class', 'rps-images');
			$('#scissors2').attr('class', 'rps-images');

			player1.choice = '';
			player2.choice = '';
			database.ref('player/' + player1.playerKey).update({ choice: '' });
			database.ref('player/' + player2.playerKey + '/choice/').set('');
			clearInterval(intervalId);
			waitTime = 3;
		}
	}, 1000);
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

function updateLocalPlayerValues(theSnapShot) {
	var whoIsPlaying = parseInt(theSnapShot.val().playerNumber);
	console.log(whoIsPlaying + " player ", theSnapShot);
	if (whoIsPlaying === 1) {
		player1.playerKey = theSnapShot.key;
		player1.playerChoice = theSnapShot.val().choice;
		player1.wins = theSnapShot.val().wins;
		player1.losses = theSnapShot.val().losses;
		player1.name = theSnapShot.val().playerName;
		player1.ref = database.ref('player/' + theSnapShot.key);
		// $('#game-message').text('Waiting for player 2');
	} else {
		player2.playerKey = theSnapShot.key;
		player2.playerChoice = theSnapShot.val().choice;
		player2.wins = theSnapShot.val().wins;
		player2.losses = theSnapShot.val().losses;
		player2.name = theSnapShot.val().playerName;
		player2.ref = database.ref('player/' + theSnapShot.key);
		// $('#game-message').text('Waiting for player 1');
	}
}

//****************** Start Of Messaging ***************************/

$('#sling-message').on('click', function (event) {
	event.preventDefault(event);
	var theMessage = $('#say-something').val();
	console.log('message');
	console.log(currentPlayerKey + ' ' + player1.playerKey);
	if (currentPlayerKey === player1.playerKey) {
		messageRef.push({ 
			name: player1.name,
      message: theMessage,
      time: firebase.database.ServerValue.TIMESTAMP,
      idNum: 1
		});
	} else if (currentPlayerKey === player2.playerKey) {
		messageRef.push({ 
			name: player2.name,
      message: theMessage,
      time: firebase.database.ServerValue.TIMESTAMP,
      idNum: 2
		 });
	} else {
		//display warning if they are not an active player
		warningId = setInterval(function () {
			waitTime--;
			if (waitTime < 0) {
				$('#game-message').empty();
				clearInterval(warningId);
				waitTime = 3;
			} else {
				$('#game-message').text('Sign In First');
			}
		}, 1000);

	}
	$('#say-something').val('');
})

messageRef.orderByChild('date').on('child_added', function (snapShot) {
	$('#comment').append('<p>' + snapShot.val().name + ': ' + snapShot.val().message + '</p>');
});

