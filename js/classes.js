class Background {
	constructor({
		position,
		imageSrc,
		scale = 1,
		framesMax = 1,
		offset = { x: 0, y: 0 },
	}) {
		this.position = position;
		this.width = 50;
		this.height = 150;
		this.image = new Image();
		this.image.src = imageSrc;
		this.scale = scale;
		this.framesMax = framesMax;
		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 6;
		this.offset = offset;
	}

	render() {
		c.drawImage(
			this.image,
			this.framesCurrent * (this.image.width / this.framesMax),
			0,
			this.image.width / this.framesMax,
			this.image.height,
			this.position.x - this.offset.x,
			this.position.y - this.offset.y,
			(this.image.width / this.framesMax) * this.scale,
			this.image.height * this.scale
		);
	}

	animate() {
		this.framesElapsed++;

		if (this.framesElapsed % this.framesHold === 0) {
			if (this.framesCurrent < this.framesMax - 1) {
				this.framesCurrent++;
			} else {
				this.framesCurrent = 0;
			}
		}
	}

	update() {
		this.render();
		this.animate();
	}
}

class Person extends Background {
	constructor({
		position,
		velocity,
		color = "red",
		imageSrc,
		scale = 1,
		framesMax = 1,
		offset = { x: 0, y: 0 },
		sprites,
		weapon = { offset: {}, width: undefined, height: undefined },
	}) {
		super({ position, imageSrc, scale, framesMax, offset });

		this.velocity = velocity;
		this.width = 50;
		this.height = 150;
		this.lastKey;
		this.weapon = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			offset: weapon.offset,
			width: weapon.width,
			height: weapon.height,
		};
		this.color = color;
		this.isAttacking;
		this.health = 100;
		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 6;
		this.sprites = sprites;
		this.dead = false;

		for (const sprite in this.sprites) {
			sprites[sprite].image = new Image();
			sprites[sprite].image.src = sprites[sprite].imageSrc;
		}

		console.log(this.sprites);
	}

	update() {
		this.render();
		if (!this.dead) this.animate();

		this.weapon.position.x = this.position.x + this.weapon.offset.x;
		this.weapon.position.y = this.position.y + this.weapon.offset.y;

		// draw attack box
		// c.fillRect(
		// 	this.weapon.position.x,
		// 	this.weapon.position.y,
		// 	this.weapon.width,
		// 	this.weapon.height
		// );

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		// gravity
		if (this.position.y + this.height + this.velocity.y >= canvas.height - 94) {
			this.velocity.y = 0;
			this.position.y = 332;
		} else {
			this.velocity.y += gravity;
		}
	}

	attack() {
		this.switchSprite("attack1");
		this.isAttacking = true;
	}

	takeHit() {
		this.health -= 20;

		if (this.health < 1) {
			this.switchSprite("death");
		} else {
			this.switchSprite("takeHit");
		}
	}

	switchSprite(sprite) {
		if (this.image === this.sprites.death.image) {
			if (this.framesCurrent === this.sprites.death.framesMax - 1) {
				this.dead = true;
			}

			return;
		}

		if (
			this.image === this.sprites.attack1.image &&
			this.framesCurrent < this.sprites.attack1.framesMax - 1
		)
			return;

		if (
			this.image === this.sprites.takeHit.image &&
			this.framesCurrent < this.sprites.takeHit.framesMax - 1
		)
			return;

		switch (sprite) {
			case "idle":
				if (this.image !== this.sprites.idle.image) {
					this.image = this.sprites.idle.image;
					this.framesMax = this.sprites.idle.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case "run":
				if (this.image !== this.sprites.run.image) {
					this.image = this.sprites.run.image;
					this.framesMax = this.sprites.run.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case "jump":
				if (this.image !== this.sprites.jump.image) {
					this.image = this.sprites.jump.image;
					this.framesMax = this.sprites.jump.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case "fall":
				if (this.image !== this.sprites.fall.image) {
					this.image = this.sprites.fall.image;
					this.framesMax = this.sprites.fall.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case "attack1":
				if (this.image !== this.sprites.attack1.image) {
					this.image = this.sprites.attack1.image;
					this.framesMax = this.sprites.attack1.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case "takeHit":
				if (this.image !== this.sprites.takeHit.image) {
					this.image = this.sprites.takeHit.image;
					this.framesMax = this.sprites.takeHit.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case "death":
				if (this.image !== this.sprites.death.image) {
					this.image = this.sprites.death.image;
					this.framesMax = this.sprites.death.framesMax;
					this.framesCurrent = 0;
				}
				break;
		}
	}
}
