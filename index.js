const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const gravity = 1; //"9"
//set the canvas to be the full width and height of the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(c);

/*****Player class ******/
class Player {
	constructor() {
		//the player properties
		this.position = {
			x: 100,
			y: 350,
		};
		this.velocity = {
			//"1"
			x: 0,
			y: 0,
		};
		this.width = 30;
		this.height = 30;
	}

	//the player methods
	draw() {
		c.fillStyle = 'red';
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

	update() {
		//"2"
		this.draw();

		/**position update***/
		//update the x and y-position for the next frame to be itself plus the evergrowing value of the velocity due to gravity.
		this.position.y += this.velocity.y;
		this.position.x += this.velocity.x;

		//Falling: if the object still has canvas room to fall, increase the value of the changing y-direction (increase the velocity).
		if (this.position.y + this.height + this.velocity.y <= canvas.height) {
			this.velocity.y += gravity; //"10"
		} else {
			//otherwise, set the change in y position to zero, and set the position to be the height of the canvas minus the height of the object.
			this.velocity.y = 0;
			this.position.y = canvas.height - this.height;
		}

		// 	/*****x-direction movement****/
		// 	//Moving right: if the object still has room to its right, set the upcoming change in x-direction (x-velocity) to increase by 20.
		// 	if (this.position.x + this.width + this.velocity.x <= canvas.width * 2) {
		// 		this.position.x = this.velocity.x;
		// 	} else {
		// 		//otherwise, set the position equal to the width of the canvas minus the width of the object
		// 		this.velocity.x = canvas.width - this.width;
		// 		this.position.x = this.velocity.x;
		// 	}
	}
}

/******Platform class ********/
class Platform {
	constructor() {
		this.width = 200;
		this.height = 20;

		this.position = {
			x: 150,
			y: canvas.height - 75,
		};
	}

	draw() {
		c.fillStyle = 'blue';
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}
}

const player = new Player();
// player.draw();
//player.update(); //"2"

const platform = new Platform();

const keys = {
	right: {
		pressed: false,
	},
	left: {
		pressed: false,
	},
};

function animate() {
	//"3"
	window.requestAnimationFrame(animate); // "4" this is a JavaScript function that caues code to repeat over n over
	// console.log('go'); //"5"
	c.clearRect(0, 0, canvas.width, canvas.height); // "8" this clears the whole canvas
	player.update(); //"7"

	platform.draw();

	//lateral movement
	if (keys.right.pressed == true) {
		player.velocity.x = 5;
	} else if (keys.left.pressed == true) {
		player.velocity.x = -5;
	} else {
		player.velocity.x = 0;
	}

	/**********detect platform collision from top*********/
	//check to see if:
	//the player above the platform by seeing if the player y anchor value plus its height value is less than the platform anchor point value
	//the player's next change in position (velocity) is below the top of the platform by seeing if the player's y anchor value plus its height value plus its next change in position is greater than the anchor position of the platform
	//there is platform to the right of the player by seeing if the player's x anchor value plus its width value is greater than x anchor value of the platform
	//and there is platform to the left of the player by seeing if the player's x anchor value is less than the platforms x anchor value plus its width
	if (
		player.position.y + player.height <= platform.position.y &&
		player.position.y + player.height + player.velocity.y >= platform.position.y &&
		player.position.x + player.width >= platform.position.x &&
		player.position.x <= platform.position.x + platform.width
	) {
		player.velocity.y = 0;
		player.position.y = platform.position.y - player.height;
	}

	/**********detect platform collision from bottom*********/
	//check to see if:
	//the player below the platform by seeing if the player y anchor value is greater than the platform anchor point value plus its height
	//the player's next change in position (velocity) is above the bottom of the platform by seeing if the player's y anchor value plus its next change in position is less than the platform y-anchor position + its height
	//there is platform to the right of the player by seeing if the player's x anchor value plus its width value is greater than x anchor value of the platform
	//and there is platform to the left of the player by seeing if the player's x anchor value is less than the platforms x anchor value plus its width
	if (
		player.position.y >= platform.position.y + platform.height &&
		player.position.y + player.velocity.y <= platform.position.y + platform.height &&
		player.position.x + player.width >= platform.position.x &&
		player.position.x <= platform.position.x + platform.width
	) {
		player.velocity.y = 0;
		player.position.y = platform.position.y + platform.height;
	}
}

animate(); //"6"

// add event listeners for the keys. specify as a string what event is getting called
window.addEventListener('keydown', (event) => {
	console.log(event);
	switch (event.key) {
		case 'ArrowUp':
			console.log('up');
			player.velocity.y -= 20;
			break;

		case 'ArrowDown':
			console.log('duck');
			break;

		case 'ArrowLeft':
			console.log('left');
			keys.left.pressed = true;
			// player.velocity.x = -5;
			break;

		case 'ArrowRight':
			console.log('right');
			keys.right.pressed = true;
			// player.velocity.x = 5;
			break;
	}
	console.log(keys.right.pressed);
});

window.addEventListener('keyup', (event) => {
	console.log(event);
	switch (event.key) {
		case 'ArrowUp':
			console.log('up');
			player.velocity.y = 0;
			break;

		case 'ArrowDown':
			console.log('duck');
			break;

		case 'ArrowLeft':
			console.log('left');
			keys.left.pressed = false;
			// player.velocity.x = 0;
			break;

		case 'ArrowRight':
			console.log('right');
			keys.right.pressed = false;
			// player.velocity.x = 0;
			break;
	}
	console.log(keys.right.pressed);
});
