import Load from "./scenes/Load.js";
import Play from "./scenes/Play.js";

let config = {
	type: Phaser.WEBGL,
	width: 960,
	height: 540,
	pixelArt: true,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER,
	},
	physics: {
		default: "arcade",
		arcade: {
			debug: false,
			fps: 60,
		},
	},
	scene: [Load, Play],
};

let game = new Phaser.Game(config);

let w = game.config.width;
let h = game.config.height;

export { w, h };
