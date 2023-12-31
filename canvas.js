import platform from './img/platform.png';
import hills from './img/hills.png';
import background from './img/background.png';
import platformSmallTall from './img/platformSmallTall.png';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const gravity = 1; //"9"
//set the canvas to be the full width and height of the screen
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

//set the canvas to a set width and height
canvas.width = 1024;
canvas.height = 576;
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
		this.speed = 5;
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
		} //else {
		// 	//otherwise, set the change in y position to zero, and set the position to be the height of the canvas minus the height of the object.
		// 	this.velocity.y = 0;
		// 	this.position.y = canvas.height - this.height;
		// }
	}
}

/******Platform class ********/
class Platform {
	constructor(x, y, image) {
		this.image = image;
		this.width = image.width;
		this.height = image.height;

		this.position = {
			x: x,
			y: y,
		};
	}

	draw() {
		// c.fillStyle = 'blue';
		// c.fillRect(this.position.x, this.position.y, this.width, this.height);
		c.drawImage(this.image, this.position.x, this.position.y); //this takes an image, x-value, and y-value
	}
}

/******Generic Object class ********/
class GenericObject {
	constructor(x, y, image) {
		this.image = image;
		this.width = image.width;
		this.height = image.height;

		this.position = {
			x: x,
			y: y,
		};
	}

	draw() {
		// c.fillStyle = 'blue';
		// c.fillRect(this.position.x, this.position.y, this.width, this.height);
		c.drawImage(this.image, this.position.x, this.position.y); //this takes an image, x-value, and y-value
	}
}

//these variables store the image objects
let platformImage = createImage(platform);
let backgroundImage = createImage(background);
let hillsImage = createImage(hills);
let platformSmallTallImage = createImage(platformSmallTall);

let player = new Player();

//create a variable to store 1 platform
//const platform = new Platform();

//this function creates and returns the image objects
function createImage(imageSrc) {
	let image = new Image();
	image.src = imageSrc;
	return image;
}

//create a variable to store multiple platforms as an array. The platform constructor accepts an x and y value for the platform anchor, and the image source
let platforms = [];

let genericObjects = []; //screate a variable to store multiple generic objects as an array.

const keys = {
	right: {
		pressed: false,
	},
	left: {
		pressed: false,
	},
};

//this variable will track the players change in canvas x-position from its original position
let scrollOffset = 0;

//this function will reset the game stats
function init() {
	//these variables store the image objects
	platformImage = createImage(platform);
	backgroundImage = createImage(background);
	hillsImage = createImage(hills);

	player = new Player();

	//create a variable to store 1 platform
	//const platform = new Platform();

	//this function creates and returns the image objects
	function createImage(imageSrc) {
		let image = new Image();
		image.src = imageSrc;
		return image;
	}

	//create a variable to store multiple platforms as an array. The platform constructor accepts an x and y value for the platform anchor, and the image source
	platforms = [
		new Platform(platformImage.width * 4 + 300 - 2 + platformImage.width - platformSmallTallImage.width, 270, platformSmallTallImage), //
		new Platform(-1, 470, platformImage), // first standing platform
		new Platform(platformImage.width - 3, 470, platformImage), // 2nd platform with x-positiion set 1 platform width away from the origin
		new Platform(platformImage.width * 2 + 100, 470, platformImage), // 3rd platform with x-position set 2 platform widths + 100 px away from the origin to create a death pit
		new Platform(platformImage.width * 3 + 300, 470, platformImage), // 3rd platform with x-position set 3 platform widths + 300 px away from the origin
		new Platform(platformImage.width * 4 + 300 - 2, 470, platformImage), // 4th platform with x-position set 4 platform widths + 300 px away from the origin
		new Platform(platformImage.width * 5 + 700 - 2, 470, platformImage), // 4th platform with x-position set 4 platform widths + 300 px away from the origin
	];

	genericObjects = [new GenericObject(-1, -1, backgroundImage), new GenericObject(-1, -1, hillsImage)]; //setting the x and y to -1 gets rid of the white edges

	//this variable will track the players change in canvas x-position from its original position
	scrollOffset = 0;
}

function animate() {
	//"3"
	window.requestAnimationFrame(animate); // "4" this is a JavaScript function that caues code to repeat over n over
	// console.log('go'); //"5"
	// c.clearRect(0, 0, canvas.width, canvas.height); // "8" this clears the whole canvas

	//instead of clearing the canvas, we're now filling it with the color white
	c.fillStyle = 'white';
	c.fillRect(0, 0, canvas.width, canvas.height);

	genericObjects.forEach((genericObject) => {
		genericObject.draw();
	});

	//loop through each platform array item and call the draw method
	platforms.forEach((platform) => {
		platform.draw();
	});

	player.update(); //"7"
	/*************lateral movement and platform scrolling **************/
	// if the right arrow key is pressed and the player x-position is less than 400 px, make the player x-velocity (change in position) +5
	// otherwise if the left key is pressed and the player x-position is greater than 100 px, make the player x-velocity (change in position) -5
	// otherwise...
	//don't move the player
	//if the right key is pressed, subtract 5 from the platform x-position value
	//if the left key is pressed, add 5 to the platform x-position value
	if (keys.right.pressed == true && player.position.x < 400) {
		player.velocity.x = player.speed;
	} else if ((keys.left.pressed == true && player.position.x > 100) || (keys.left.pressed == true && scrollOffset == 0 && player.position.x > 0)) {
		player.velocity.x = -player.speed;
	} else {
		player.velocity.x = 0;
		if (keys.right.pressed == true) {
			scrollOffset += player.speed;
			platforms.forEach((platform) => {
				platform.position.x -= player.speed;
			});

			genericObjects.forEach((genericObject) => {
				genericObject.position.x -= player.speed * 0.66; // move the background hills a little slower than everything else
			});
		} else if (keys.left.pressed == true && scrollOffset > 0) {
			scrollOffset -= player.speed;
			platforms.forEach((platform) => {
				platform.position.x += player.speed;
			});

			genericObjects.forEach((genericObject) => {
				genericObject.position.x += player.speed * 0.66; // move the background hills a little slower than everything else
			});
		}

		//win scenario
		if ((scrollOffset > platformImage.width * 5 + 400 - 2, 470)) {
			console.log('you win');
		}

		//lose scenario
		if (player.position.y > canvas.height) {
			console.log('you lose');
			init(); // reset player stats
		}
	}
	console.log('scroll offset', scrollOffset);
	/**********detect platform collision from top*********/
	//check to see if:
	//the player above the platform by seeing if the player y anchor value plus its height value is less than the platform anchor point value
	//the player's next change in position (velocity) is below the top of the platform by seeing if the player's y anchor value plus its height value plus its next change in position is greater than the anchor position of the platform
	//there is platform to the right of the player by seeing if the player's x anchor value plus its width value is greater than x anchor value of the platform
	//and there is platform to the left of the player by seeing if the player's x anchor value is less than the platforms x anchor value plus its width
	platforms.forEach((platform) => {
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
		/*	//check to see if:
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
		}*/
	});
}

init();
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
