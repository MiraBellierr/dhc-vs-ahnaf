function collision({ player1, player2 }) {
	return (
		player1.weapon.position.x + player1.weapon.width >= player2.position.x &&
		player1.weapon.position.x <= player2.position.x + player2.width &&
		player1.weapon.position.y + player1.weapon.height >= player2.position.y &&
		player1.weapon.position.y <= player2.position.y + player2.height
	);
}

function determineWinner({ dhc, ahnaf, timerId }) {
	clearTimeout(timerId);
	if (dhc.health === ahnaf.health) {
		document.querySelector("#displayResult").innerHTML = "Tie";
	} else if (dhc.health > ahnaf.health) {
		document.querySelector("#displayResult").innerHTML = "DHC Wins";
	} else if (dhc.health < ahnaf.health) {
		document.querySelector("#displayResult").innerHTML = "Ahnaf Wins";
	}

	document.querySelector("#displayResult").style.display = "flex";
}

let count = 60;
let timerId;

function timer() {
	if (count > 0) {
		timerId = setTimeout(timer, 1000);
		count--;
		document.querySelector("#timer").innerHTML = count;
	}
	if (count === 0) {
		determineWinner({ dhc, ahnaf, timerId });
	}
}
