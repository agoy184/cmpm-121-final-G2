// class PlantData {
// 	numBytes = 4;
// 	constructor(scene, dataView) {}

// 	get type() {
// 		return this.dataView.getUint8(0);
// 	}

// 	set type(plantType) {
// 		this.dataView.setUint8(0, plantType);
// 	}

// 	get x() {
// 		return this.dataView.getUint8(1);
// 	}

// 	set x(x) {
// 		this.dataView.setUint8(1, x);
// 	}

// 	get y() {
// 		return this.dataView.getUint8(2);
// 	}

// 	set y(y) {
// 		this.dataView.setUint8(2, y);
// 	}

// 	get growthLevel() {
// 		return this.dataView.getUint8(3);
// 	}

// 	set growthLevel(growthLevel) {
// 		this.dataView.setUint8(3, growthLevel);
// 	}
// }

class PlantFunctions {
	static growPlant(nearCells, plantType, scene, dataView) {
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
	constructor(scene, x, y, name) {
		let gridPoint = scene.grid.getPoint(x, y);
		const nameIndex = names.indexOf(name) + 1;
		super(scene, gridPoint[0], gridPoint[1], textures[nameIndex - 1]);
		this.gridX = x;
		this.gridY = y;
		this.name = name;
		this.type = nameIndex;
		this.growthLevel = 1;
		switch (name) {
			case "Carrot":
				this.rules =
					"Carrot growing rules:\n- if water level is positive\n- and the sunlight level is greater than 0\n- and there are no nearby plants";
				break;
			case "Tomato":
				this.rules =
					"Tomato growing rules:\n- if water level is greater than 25\n- and the sunlight level is greater than 4\n- and there is at least one nearby plant";
				break;
			case "Potato":
				this.rules =
					"Potato growing rules:\n- if water level is greater than 10\n- and the sunlight level is less than 5\n- and there are no nearby plants (except for Potato)";
				break;
			default:
				this.rules = "No rules";
				break;
		}
		if (nameIndex < 3) {
			this.setScale(0.05);
		} else {
			this.setScale(0.1);
		}
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
}

// class Carrot extends Plant {
// 	constructor(scene, x, y, plantData) {
// 		super(scene, x, y, "carrot", 0, "Carrot");
// 		this.setScale(0.05);
// 		this.rules =
// 			"Carrot growing rules:\n- if water level is positive\n- and the sunlight level is greater than 0\n- and there are no nearby plants";
// 	}

// 	/*
//     Carrot growing rules:
//     - if water level is positive
//     - and the sunlight level is greater than 0
//     - and there are no nearby plants
//     */
// 	growPlant(nearCells) {
// 		if (nearCells[0].waterLevel > 0 && nearCells[0].sunlightLevel > 0) {
// 			for (let i = 1; i < nearCells.length; i++) {
// 				if (nearCells[i] instanceof Cell && nearCells[i].plant) {
// 					return;
// 				}
// 			}
// 			if (this.growthLevel < 3) {
// 				this.growthLevel += 1;
// 				this.setScale(this.growthLevel * 0.05);
// 			}
// 		}
// 	}
// }

// class Tomato extends Plant {
// 	constructor(scene, x, y, plantData) {
// 		super(scene, x, y, "tomato", 0, "Tomato");
// 		this.setScale(0.05);
// 		this.rules =
// 			"Tomato growing rules:\n- if water level is greater than 25\n- and the sunlight level is greater than 4\n- and there is at least one nearby plant";
// 	}

// 	/*
//     Tomato growing rules:
//     - if water level is greater than 25
//     - and the sunlight level is greater than 4
//     - and there is at least one nearby plant
//     */
// 	growPlant(nearCells) {
// 		if (nearCells[0].waterLevel > 25 && nearCells[0].sunlightLevel > 4) {
// 			for (let i = 1; i < nearCells.length; i++) {
// 				if (nearCells[i] instanceof Cell && nearCells[i].plant) {
// 					if (this.growthLevel < 3) {
// 						this.growthLevel += 1;
// 						this.setScale(this.growthLevel * 0.05);
// 					}
// 				}
// 			}
// 		}
// 	}
// }

// class Potato extends Plant {
// 	constructor(scene, x, y) {
// 		super(scene, x, y, "potato", 0, "Potato");
// 		this.setScale(0.1);
// 		this.rules =
// 			"Potato growing rules:\n- if water level is greater than 10\n- and the sunlight level is less than 5\n- and there are no nearby plants (except for Potato)";
// 	}

// 	/*
//     Potato growing rules:
//     - if water level is greater than 10
//     - and the sunlight level is less than 5
//     - and there are no nearby plants (except for Potato)
//     */
// 	growPlant(nearCells) {
// 		if (nearCells[0].waterLevel > 10 && nearCells[0].sunlightLevel < 5) {
// 			for (let i = 1; i < nearCells.length; i++) {
// 				if (
// 					nearCells[i] instanceof Cell &&
// 					(!nearCells[i].plant ||
// 						!nearCells[i].plant instanceof Potato)
// 				) {
// 					if (this.growthLevel < 3) {
// 						this.growthLevel += 1;
// 						this.setScale(this.growthLevel * 0.07);
// 					}
// 				}
// 			}
// 		}
// 	}
// }
