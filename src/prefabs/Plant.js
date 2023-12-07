class PlantData {
	numBytes = 4;
	constructor(scene, dataView) {}

	get plantType() {
		return this.dataView.getUint8(0);
	}

	set plantType(plantType) {
		this.dataView.setUint8(0, plantType);
	}

	get x() {
		return this.dataView.getUint8(1);
	}

	set x(x) {
		this.dataView.setUint8(1, x);
	}

	get y() {
		return this.dataView.getUint8(2);
	}

	set y(y) {
		this.dataView.setUint8(2, y);
	}

	get growthLevel() {
		return this.dataView.getUint8(3);
	}

	set growthLevel(growthLevel) {
		this.dataView.setUint8(3, growthLevel);
	}
}

class Plant extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, texture, frame, name, plantData) {
		let gridPoint = scene.grid.getPoint(x, y);
		super(scene, gridPoint[0], gridPoint[1], texture, frame);
		this.gridX = x;
		this.gridY = y;
		this.name = name;
		this.growthLevel = 1;
		this.rules = "";
		this.plantData = plantData;
		scene.add.existing(this);
	}

	saveData() {
		return {
			x: this.gridX,
			y: this.gridY,
			name: this.name,
			growthLevel: this.growthLevel,
		};
	}

	loadData(data) {
		this.gridX = data.x;
		this.gridY = data.y;
		this.name = data.name;
		this.growthLevel = data.growthLevel;
		if (this.name != "Potato") this.setScale(this.growthLevel * 0.05);
		else if (this.growthLevel == 1) this.setScale(0.1);
		else this.setScale(this.growthLevel * 0.07);
		let gridPoint = this.scene.grid.getPoint(this.gridX, this.gridY);
		this.x = gridPoint[0];
		this.y = gridPoint[1];
	}

	toString() {
		return this.name + " at (" + this.gridX + ", " + this.gridY + ")";
	}

	deletePlant() {
		this.destroy();
	}

	examplefunction() {
		let count = 2;
		count++;
		count += 12;
	}

	growPlant(nearCells) {}

	update() {}
}

class Carrot extends Plant {
	constructor(scene, x, y, plantData) {
		super(scene, x, y, "carrot", 0, "Carrot");
		this.setScale(0.05);
		this.rules =
			"Carrot growing rules:\n- if water level is positive\n- and the sunlight level is greater than 0\n- and there are no nearby plants";
	}

	/*
    Carrot growing rules:
    - if water level is positive
    - and the sunlight level is greater than 0
    - and there are no nearby plants
    */
	growPlant(nearCells) {
		if (nearCells[0].waterLevel > 0 && nearCells[0].sunlightLevel > 0) {
			for (let i = 1; i < nearCells.length; i++) {
				if (nearCells[i] instanceof Cell && nearCells[i].plant) {
					return;
				}
			}
			if (this.growthLevel < 3) {
				this.growthLevel += 1;
				this.setScale(this.growthLevel * 0.05);
			}
		}
	}
}

class Tomato extends Plant {
	constructor(scene, x, y, plantData) {
		super(scene, x, y, "tomato", 0, "Tomato");
		this.setScale(0.05);
		this.rules =
			"Tomato growing rules:\n- if water level is greater than 25\n- and the sunlight level is greater than 4\n- and there is at least one nearby plant";
	}

	/*
    Tomato growing rules:
    - if water level is greater than 25
    - and the sunlight level is greater than 4
    - and there is at least one nearby plant
    */
	growPlant(nearCells) {
		if (nearCells[0].waterLevel > 25 && nearCells[0].sunlightLevel > 4) {
			for (let i = 1; i < nearCells.length; i++) {
				if (nearCells[i] instanceof Cell && nearCells[i].plant) {
					if (this.growthLevel < 3) {
						this.growthLevel += 1;
						this.setScale(this.growthLevel * 0.05);
					}
				}
			}
		}
	}
}

class Potato extends Plant {
	constructor(scene, x, y) {
		super(scene, x, y, "potato", 0, "Potato");
		this.setScale(0.1);
		this.rules =
			"Potato growing rules:\n- if water level is greater than 10\n- and the sunlight level is less than 5\n- and there are no nearby plants (except for Potato)";
	}

	/*
    Potato growing rules:
    - if water level is greater than 10
    - and the sunlight level is less than 5
    - and there are no nearby plants (except for Potato)
    */
	growPlant(nearCells) {
		if (nearCells[0].waterLevel > 10 && nearCells[0].sunlightLevel < 5) {
			for (let i = 1; i < nearCells.length; i++) {
				if (
					nearCells[i] instanceof Cell &&
					(!nearCells[i].plant ||
						!nearCells[i].plant instanceof Potato)
				) {
					if (this.growthLevel < 3) {
						this.growthLevel += 1;
						this.setScale(this.growthLevel * 0.07);
					}
				}
			}
		}
	}
}
