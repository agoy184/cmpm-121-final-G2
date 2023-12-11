class PlantFunctions {
	static growPlant(nearCells, plantType, scene, dataView) {
		const plant = internalPlantTypeCompiler(allPlantDefs[plantType - 1])
		console.log(allPlantDefs);
		console.log(plantType);
		console.log(plant.rulesDisplay);
		if (plant.nextLevel(plant.rulesDisplay)) {
			console.log("growing: " + plantType);
			let growthLevel = dataView.getUint8(
				nearCells[0] + GRID_GROWTH_OFFSET
			);
			if (growthLevel < 3) {
				dataView.setUint8(
					nearCells[0] + GRID_GROWTH_OFFSET,
					growthLevel + 1
				);
				// update growthLevel since it was increased in the dataview
				// without this the plant size wouldn't update along with the growth level
				growthLevel = dataView.getUint8(
					nearCells[0] + GRID_GROWTH_OFFSET
				);
				const plantX = dataView.getUint8(nearCells[0] + GRID_X_OFFSET);
				const plantY = dataView.getUint8(nearCells[0] + GRID_Y_OFFSET);
				scene.plantSpriteArray[
					`${(plantX * 5 + plantY) * Cell.numBytes}`
				].setScale(growthLevel * 0.05);
			}
		}
	}
}

class Plant extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, internalPlantType) {
		let gridPoint = scene.grid.getPoint(x, y);;
		super(scene, gridPoint[0], gridPoint[1], internalPlantType.image);
		this.gridX = x;
		this.gridY = y;
		console.log(internalPlantType);
		this.name = internalPlantType.name;
		this.type = internalPlantType.type;
		this.rules = internalPlantType.rulesDisplay;
		this.level = 1;
		this.setScale(0.05);
		scene.add.existing(this);
	}



	nextLevel = (rules) => false;

	levelUp(rules) {
		if (this.nextLevel(rules)) this.level++;
	}

	saveData() {
		return {
			x: this.gridX,
			y: this.gridY,
			name: this.name,
			growthLevel: this.level,
		};
	}

	loadData(data) {
		this.gridX = data.x;
		this.gridY = data.y;
		this.name = data.name;
		this.level = data.growthLevel;
		if (this.level == 1) this.setScale(0.1);
		else this.setScale(this.level * 0.07);
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
}

function internalPlantTypeCompiler(program) {
	const internalPlantType = new InternalPlantType();
	const dsl = {
		name(name) {
			internalPlantType.name = name;
		},
		type(type) {
			internalPlantType.type = type;
		},
		image(image) {
			internalPlantType.image = image;
		},
		rulesDisplay(rulesDisplay) {
			internalPlantType.rulesDisplay = rulesDisplay;
		},
		growsWhen(growsWhen) {
			internalPlantType.nextLevel = (rules) => {
				return growsWhen(rules);
			};
		},
	};
	program(dsl);
	return internalPlantType;
}
