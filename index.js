const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Background({
	position: { x: 0, y: 0 },
	imageSrc: "./assets/background.png",
});

const shop = new Background({
	position: { x: 600, y: 128 },
	imageSrc: "./assets/shop.png",
	scale: 2.75,
	framesMax: 6,
});

const dhc = new Person({
	position: { x: 0, y: 0 },
	velocity: { x: 0, y: 0 },
	offset: { x: 0, y: 0 },
	imageSrc: "./assets/dhc/Idle.png",
	framesMax: 8,
	scale: 2.5,
	offset: { x: 215, y: 157 },
	sprites: {
		idle: {
			imageSrc: "./assets/dhc/Idle.png",
			framesMax: 8,
		},
		run: {
			imageSrc: "./assets/dhc/Run.png",
			framesMax: 8,
		},
		jump: {
			imageSrc: "./assets/dhc/Jump.png",
			framesMax: 2,
		},
		fall: {
			imageSrc: "./assets/dhc/Fall.png",
			framesMax: 2,
		},
		attack1: {
			imageSrc: "./assets/dhc/Attack1.png",
			framesMax: 6,
		},
		takeHit: {
			imageSrc: "./assets/dhc/Take Hit.png",
			framesMax: 4,
		},
		death: {
			imageSrc: "./assets/dhc/Death.png",
			framesMax: 6,
		},
	},
	weapon: {
		offset: { x: 95, y: 40 },
		width: 160,
		height: 50,
	},
});

dhc.render();

const ahnaf = new Person({
	position: { x: 400, y: 100 },
	velocity: { x: 0, y: 0 },
	color: "blue",
	offset: { x: -50, y: 0 },
	imageSrc: "./assets/ahnaf/Idle.png",
	framesMax: 4,
	scale: 2.5,
	offset: {
		x: 215,
		y: 170,
	},
	sprites: {
		idle: {
			imageSrc: "./assets/ahnaf/Idle.png",
			framesMax: 4,
		},
		run: {
			imageSrc: "./assets/ahnaf/Run.png",
			framesMax: 8,
		},
		jump: {
			imageSrc: "./assets/ahnaf/Jump.png",
			framesMax: 2,
		},
		fall: {
			imageSrc: "./assets/ahnaf/Fall.png",
			framesMax: 2,
		},
		attack1: {
			imageSrc: "./assets/ahnaf/Attack1.png",
			framesMax: 4,
		},
		takeHit: {
			imageSrc: "./assets/ahnaf/Take hit.png",
			framesMax: 3,
		},
		death: {
			imageSrc: "./assets/ahnaf/Death.png",
			framesMax: 7,
		},
	},
	weapon: {
		offset: { x: -170, y: 50 },
		width: 170,
		height: 50,
	},
});

ahnaf.render();

const keys = {
	a: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
	ArrowRight: {
		pressed: false,
	},
	ArrowLeft: {
		pressed: false,
	},
};

timer();

function animate() {
	window.requestAnimationFrame(animate);
	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);

	background.update();
	shop.update();

	c.fillStyle = "rgba(255, 255, 255, 0.15)";
	c.fillRect(0, 0, canvas.width, canvas.height);

	dhc.update();
	ahnaf.update();

	dhc.velocity.x = 0;
	ahnaf.velocity.x = 0;

	// dhc movement
	if (keys.a.pressed && dhc.lastKey === "a") {
		dhc.velocity.x = -5;
		dhc.switchSprite("run");
	} else if (keys.d.pressed && dhc.lastKey === "d") {
		dhc.velocity.x = 5;
		dhc.switchSprite("run");
	} else {
		dhc.switchSprite("idle");
	}

	// dhc jumping
	if (dhc.velocity.y < 0) {
		dhc.switchSprite("jump");
	} else if (dhc.velocity.y > 0) {
		dhc.switchSprite("fall");
	}

	// dhc attacking
	if (
		collision({ player1: dhc, player2: ahnaf }) &&
		dhc.isAttacking &&
		dhc.framesCurrent === 4
	) {
		ahnaf.takeHit();
		dhc.isAttacking = false;
		gsap.to("#ahnafHealth", {
			width: ahnaf.health + "%",
		});
	}

	// dhc misses
	if (dhc.isAttacking && dhc.framesCurrent === 4) {
		dhc.isAttacking = false;
	}

	// ahnaf movement
	if (keys.ArrowLeft.pressed && ahnaf.lastKey === "ArrowLeft") {
		ahnaf.velocity.x = -5;
		ahnaf.switchSprite("run");
	} else if (keys.ArrowRight.pressed && ahnaf.lastKey === "ArrowRight") {
		ahnaf.velocity.x = 5;
		ahnaf.switchSprite("run");
	} else {
		ahnaf.switchSprite("idle");
	}

	// ahnaf jumping
	if (ahnaf.velocity.y < 0) {
		ahnaf.switchSprite("jump");
	} else if (ahnaf.velocity.y > 0) {
		ahnaf.switchSprite("fall");
	}

	// ahnaf attacking
	if (
		collision({ player1: ahnaf, player2: dhc }) &&
		ahnaf.isAttacking &&
		ahnaf.framesCurrent === 2
	) {
		dhc.takeHit();
		ahnaf.isAttacking = false;
		gsap.to("#dhcHealth", {
			width: dhc.health + "%",
		});
	}

	// ahnaf misses
	if (ahnaf.isAttacking && ahnaf.framesCurrent === 2) {
		ahnaf.isAttacking = false;
	}

	// result determine
	if (dhc.health < 1 || ahnaf.health < 1) {
		determineWinner({ dhc, ahnaf, timerId });
	}
}

animate();

window.addEventListener("keydown", (event) => {
	if (!dhc.dead) {
		switch (event.key) {
			case "d":
				keys.d.pressed = true;
				dhc.lastKey = "d";
				break;
			case "a":
				keys.a.pressed = true;
				dhc.lastKey = "a";
				break;
			case "w":
				dhc.velocity.y = -20;
				break;
			case " ":
				dhc.attack();
				break;
		}
	}

	if (!ahnaf.dead) {
		switch (event.key) {
			case "ArrowRight":
				keys.ArrowRight.pressed = true;
				ahnaf.lastKey = "ArrowRight";
				break;
			case "ArrowLeft":
				keys.ArrowLeft.pressed = true;
				ahnaf.lastKey = "ArrowLeft";
				break;
			case "ArrowUp":
				ahnaf.velocity.y = -20;
				break;
			case "ArrowDown":
				ahnaf.attack();
				break;
		}
	}
});

window.addEventListener("keyup", (event) => {
	switch (event.key) {
		case "d":
			keys.d.pressed = false;
			break;
		case "a":
			keys.a.pressed = false;
			break;
		case "ArrowRight":
			keys.ArrowRight.pressed = false;
			break;
		case "ArrowLeft":
			keys.ArrowLeft.pressed = false;
			break;
	}
});
