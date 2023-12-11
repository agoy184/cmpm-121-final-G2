class PlantFunctions {
	static growPlant(nearCells, plantType, scene, dataView) {//still need to like actually add the functionality for
		console.log(dataView);
		if (plantType == 1) this.growCarrot(nearCells, scene, dataView);
		if (plantType == 2) this.growTomato(nearCells, scene, dataView);
		if (plantType == 3) this.growPotato(nearCells, scene, dataView);
	}

	// we will probably need to rewrite these for like f2 or f3
	static growCarrot(nearCells, scene, dataView) {
		if (
			dataView.getUint8(nearCells[0] + GRID_WATER_OFFSET) > 0 &&
			dataView.getUint8(nearCells[0] + GRID_SUN_OFFSET) > 0
		) {
			for (let i = 1; i < nearCells.length; i++) {
				if (dataView.getUint8(nearCells[i] + GRID_TYPE_OFFSET) != 0) {
					return;
				}
			}
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
	static growTomato(nearCells, scene, dataView) {
		if (
			dataView.getUint8(nearCells[0] + GRID_WATER_OFFSET) > 25 &&
			dataView.getUint8(nearCells[0] + GRID_SUN_OFFSET) > 4
		) {
			for (let i = 1; i < nearCells.length; i++) {
				if (dataView.getUint8(nearCells[i] + GRID_TYPE_OFFSET) != 0) {
					let growthLevel = dataView.getUint8(
						nearCells[0] + GRID_GROWTH_OFFSET
					);
					if (growthLevel < 3) {
						dataView.setUint8(
							nearCells[0] + GRID_GROWTH_OFFSET,
							growthLevel + 1
						);
						growthLevel = dataView.getUint8(
							nearCells[0] + GRID_GROWTH_OFFSET
						);
						const plantX = dataView.getUint8(
							nearCells[0] + GRID_X_OFFSET
						);
						const plantY = dataView.getUint8(
							nearCells[0] + GRID_Y_OFFSET
						);
						scene.plantSpriteArray[
							`${(plantX * 5 + plantY) * Cell.numBytes}`
						].setScale(growthLevel * 0.05);
						return;
					}
				}
			}
		}
	}
	static growPotato(nearCells, scene, dataView) {
		if (
			dataView.getUint8(nearCells[0] + GRID_WATER_OFFSET) > 10 &&
			dataView.getUint8(nearCells[0] + GRID_SUN_OFFSET) < 5
		) {
			for (let i = 1; i < nearCells.length; i++) {
				if (
					dataView.getUint8(nearCells[i] + GRID_TYPE_OFFSET) == 0 ||
					dataView.getUint8(nearCells[i] + GRID_TYPE_OFFSET) == 2
				) {
					let growthLevel = dataView.getUint8(
						nearCells[0] + GRID_GROWTH_OFFSET
					);
					if (growthLevel < 3) {
						dataView.setUint8(
							nearCells[0] + GRID_GROWTH_OFFSET,
							growthLevel + 1
						);
						growthLevel = dataView.getUint8(
							nearCells[0] + GRID_GROWTH_OFFSET
						);
						const plantX = dataView.getUint8(
							nearCells[0] + GRID_X_OFFSET
						);
						const plantY = dataView.getUint8(
							nearCells[0] + GRID_Y_OFFSET
						);
						scene.plantSpriteArray[
							`${(plantX * 5 + plantY) * Cell.numBytes}`
						].setScale(growthLevel * 0.05);
						return;
					}
				}
			}
		}
	}
}

class Plant extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, internalPlantType) {
		let gridPoint = scene.grid.getPoint(x, y);
		const nameIndex = names.indexOf(name) + 1;
		super(scene, gridPoint[0], gridPoint[1], internalPlantType.image);
		this.gridX = x;
		this.gridY = y;
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
