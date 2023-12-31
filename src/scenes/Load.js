import { h, w } from "../main.js";

export default class Load extends Phaser.Scene {
	constructor() {
		super("loadScene");
	}

	preload() {
		this.load.path = "assets/";
		this.load.image("farmer", "farmer.png");
		this.load.image("grid", "redGrid.png");
		this.load.image("carrot", "carrot.png");
		this.load.image("potato", "potato.png");
		this.load.image("tomato", "tomato.png");
		this.load.image("grassbg", "grass_bg.png");
		this.load.image("banana", "banana.png");

		// loading bar
		// See: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/loader/
		let loadingBar = this.add.graphics();
		this.load.on("progress", (value) => {
			loadingBar.clear(); // reset fill/line style
			loadingBar.fillStyle(0xffffff, 1); // (color, alpha)
			loadingBar.fillRect(0, h / 2, w * value, 5); // (x, y, w, h)
		});
		this.load.on("complete", () => {
			loadingBar.destroy();
		});

		this.load.text("yamlData", "../src/scenarios.yaml");
	}

	create() {
		this.scene.start("playScene");
	}
}
