import Cell from "../prefabs/Cell.js";
import Plant, { internalPlantTypeCompiler } from "../prefabs/Plant.js";
import { allPlantDefs } from "../prefabs/plantDef.js";
import { language } from "../scenes/Play.js";
import {
	levelText,
	hasText,
	sunlightAndText,
	waterText,
	emptyPlotText,
	plantNamesText,
} from "../translations.js";

export const GRID_WATER_OFFSET = 0;
export const GRID_SUN_OFFSET = 1;
export const GRID_TYPE_OFFSET = 2;
export const GRID_X_OFFSET = 3;
export const GRID_Y_OFFSET = 4;
export const GRID_GROWTH_OFFSET = 5;

export default class Grid extends Phaser.GameObjects.Grid {
	constructor(scene, x, y, width, height, dimension) {
		super(
			scene,
			x,
			y,
			width,
			height,
			width / dimension,
			height / dimension,
			0xaa11aa,
			0.1,
			0xffffff,
			0.5
		);
		this.dimension = dimension;
		const arraySize = dimension * dimension * Cell.numBytes;
		const plantGridCells = new ArrayBuffer(arraySize);
		this.dataView = new DataView(plantGridCells);
		this.cellFuncs = new Cell(this.dataView, scene);
		this.names = [
			plantNamesText["Carrot"][language],
			plantNamesText["Tomato"][language],
			plantNamesText["Potato"][language],
			plantNamesText["Banana"][language],
			null,
		];

		this.initializeGrid();
		scene.events.on("newDay", (event) => {
			this.initializeGrid();
			//console.log("day " + event.day);
		});
		scene.add.existing(this);
	}

	updateNames() {
		this.names = [
			plantNamesText["Carrot"][language],
			plantNamesText["Tomato"][language],
			plantNamesText["Potato"][language],
			plantNamesText["Banana"][language],
			null,
		];
	}

	saveData() {
		// store all of the plant data from the dataview
		const plantData = {};

		for (let i = 0; i < this.dataView.byteLength; i += Cell.numBytes) {
			const plantType = this.dataView.getUint8(i + GRID_TYPE_OFFSET);
			plantData[i] = {};

			if (plantType != 0) {
				plantData[i].plant = {};
				plantData[i].plant.name = this.names[plantType - 1];
				plantData[i].plant.location = [
					this.dataView.getUint8(i + GRID_X_OFFSET),
					this.dataView.getUint8(i + GRID_Y_OFFSET),
				];
				plantData[i].plant.level = this.dataView.getUint8(
					i + GRID_GROWTH_OFFSET
				);
			}
		}

		return plantData;
	}

	loadData(data) {
		for (let i = 0; i < this.dimension; i++) {
			for (let j = 0; j < this.dimension; j++) {
				const index = (i * this.dimension + j) * Cell.numBytes;
				const plantType = this.dataView.getUint8(index + 2);
				//load back all the values from each cell in the dataview (use math to determine the right index)
				if (plantType !== 0) {
					const loadedPlant = this.createPlant(
						i,
						j,
						this.names[plantType - 1]
					);
					loadedPlant.level = this.dataView.getUint8(index + 5);
					this.addPlant(loadedPlant);
				} else if (plantType == 0) {
					this.removePlant(i, j);
				}
			}
		}

		// load plant data from the data object into their respective cells
		for (let index in data) {
			const plant = data[index].plant;
			if (plant) {
				if (plant.name == null || plant.location == null) {
					continue;
				}
				const loadedPlant = this.createPlant(
					plant.location,
					plant.name
				);
				loadedPlant.level = plant.level;
				loadedPlant.setScale(loadedPlant.level * 0.05);
				this.addPlant(loadedPlant);
			} else {
				let x = Math.floor(index / (this.dimension * Cell.numBytes));
				let y = Math.floor((index / Cell.numBytes) % this.dimension);
				this.removePlant(x, y);
			}
		}
	}

	initializeCell(x, y) {
		let randomWater = Math.floor(Math.random() * 10 - 2);
		let randomSunlight = Math.floor(Math.random() * 10);
		if (this.pointInBounds(x, y)) {
			const index = (x * this.dimension + y) * Cell.numBytes;
			const currentWater = this.dataView.getUint8(index);
			if (currentWater + randomWater <= 0) {
				randomWater = 0;
			} else if (currentWater + randomWater < 250) {
				this.dataView.setUint8(index, currentWater + randomWater);
			}
			this.dataView.setUint8(index + 1, randomSunlight);
		}
	}

	initializeGrid() {
		for (let i = 0; i < this.dimension; i++) {
			for (let j = 0; j < this.dimension; j++) {
				this.initializeCell(i, j);
			}
		}
		this.growCells();
	}

	createPlant(location, name) {
		switch (name) {
			case "Carrot":
				return this.newPlant(0, location);
			case "Tomato":
				return this.newPlant(1, location);
			case "Potato":
				return this.newPlant(2, location);
			case "Banana":
				return this.newPlant(3, location);
			default:
				return null;
		}
	}

	newPlant(num, location) {
		return new Plant(
			this.scene,
			location[0],
			location[1],
			internalPlantTypeCompiler(allPlantDefs[num])
		);
	}

	addPlant(plant) {
		this.removePlant(plant.gridX, plant.gridY);
		const index =
			(plant.gridX * this.dimension + plant.gridY) * Cell.numBytes;
		this.dataView.setUint8(index + GRID_TYPE_OFFSET, plant.type);
		this.dataView.setUint8(index + GRID_X_OFFSET, plant.gridX);
		this.dataView.setUint8(index + GRID_Y_OFFSET, plant.gridY);
		this.dataView.setUint8(index + GRID_GROWTH_OFFSET, plant.level);
		this.scene.plantSpriteArray[
			`${(plant.gridX * this.dimension + plant.gridY) * Cell.numBytes}`
		] = plant;
	}

	removePlant(x, y) {
		const index = (x * this.dimension + y) * Cell.numBytes;
		const plantType = this.dataView.getUint8(index + GRID_TYPE_OFFSET);
		const growthLevel = this.dataView.getUint8(index + GRID_GROWTH_OFFSET);
		if (plantType == 0) {
			return null;
		}
		let removedPlantData = [this.names[plantType - 1], growthLevel];
		this.dataView.setUint8(index + GRID_TYPE_OFFSET, 0);
		this.dataView.setUint8(index + GRID_X_OFFSET, 0);
		this.dataView.setUint8(index + GRID_Y_OFFSET, 0);
		this.dataView.setUint8(index + GRID_GROWTH_OFFSET, 0);
		this.scene.plantSpriteArray[
			`${(x * this.dimension + y) * Cell.numBytes}`
		].deletePlant();
		this.scene.plantSpriteArray[
			`${(x * this.dimension + y) * Cell.numBytes}`
		] = null;
		return removedPlantData;
	}

	getPlant(x, y) {
		// returns the plant object at the given coordinates
		const index = (x * this.dimension + y) * Cell.numBytes;
		const plantType = this.dataView.getUint8(index + GRID_TYPE_OFFSET);
		if (plantType == 0) {
			return null;
		}
		return this.scene.plantSpriteArray[
			`${(x * this.dimension + y) * Cell.numBytes}`
		];
	}

	getCellInfo(x, y) {
		const index = (x * this.dimension + y) * Cell.numBytes;
		const water = this.dataView.getUint8(index + GRID_WATER_OFFSET);
		const sunlight = this.dataView.getUint8(index + GRID_SUN_OFFSET);
		const plantType = this.dataView.getUint8(index + GRID_TYPE_OFFSET);
		const growthLevel = this.dataView.getUint8(index + GRID_GROWTH_OFFSET);
		if (growthLevel !== 0) {
			return (
				levelText[language] +
				growthLevel +
				" " +
				this.names[plantType - 1] +
				hasText[language] +
				sunlight +
				sunlightAndText[language] +
				water +
				waterText[language]
			);
		}
		return (
			emptyPlotText[language] +
			sunlight +
			sunlightAndText[language] +
			water +
			waterText[language]
		);
	}

	getNearCells(x, y) {
		const points = [
			{ x: x, y: y },
			{ x: x, y: y - 1 },
			{ x: x, y: y + 1 },
			{ x: x - 1, y: y },
			{ x: x + 1, y: y },
		];
		const nearCellsIndex = [];
		points.forEach((point) => {
			const index = (point.x * this.dimension + point.y) * Cell.numBytes;
			if (0 <= index && index < this.dataView.byteLength) {
				nearCellsIndex.push(index);
			}
		});
		return nearCellsIndex;
	}

	growCells() {
		for (let i = 0; i < this.dataView.byteLength; i += Cell.numBytes) {
			const plantType = this.dataView.getUint8(i + GRID_TYPE_OFFSET);
			if (plantType != 0) {
				const plantX = this.dataView.getUint8(i + GRID_X_OFFSET);
				const plantY = this.dataView.getUint8(i + GRID_Y_OFFSET);
				this.cellFuncs.growPlants(
					this.getNearCells(plantX, plantY),
					plantType
				);
			}
		}
	}

	getPoint(x, y) {
		// this part at the end "(this.dimension%2==0)*this.cellWidth/2" moves the point to the center of the cell if the dimension is even (if its not there, the point will be on the side of the cell instead)
		let leftMostX =
			this.x -
			this.cellWidth * Math.floor(this.dimension / 2) +
			((this.dimension % 2 == 0) * this.cellWidth) / 2;
		let topMostY =
			this.y -
			this.cellHeight * Math.floor(this.dimension / 2) +
			((this.dimension % 2 == 0) * this.cellHeight) / 2;
		return [leftMostX + x * this.cellWidth, topMostY + y * this.cellHeight];
	}

	pointInBounds(x, y) {
		return x >= 0 && x < this.dimension && y >= 0 && y < this.dimension;
	}

	destroyAllPlants() {
		let plants = this.returnAllExistingPlants();
		for (let i = 0; i < plants.length; i++) {
			plants[i].deletePlant();
		}
	}

	waterAllPlants() {
		let plants = this.returnAllExistingPlants();
		for (let i = 0; i < plants.length; i++) {
			// increase water level by random amount between 5 and 10
			const currentWater = this.dataView.getUint8(
				(plants[i].gridX * this.dimension + plants[i].gridY) *
					Cell.numBytes
			);
			if (currentWater + 10 < 250) {
				this.dataView.setUint8(
					(plants[i].gridX * this.dimension + plants[i].gridY) *
						Cell.numBytes,
					currentWater + 10
				);
			} else {
				this.dataView.setUint8(
					(plants[i].gridX * this.dimension + plants[i].gridY) *
						Cell.numBytes,
					250
				);
			}
		}
	}

	dryAllPlants() {
		let plants = this.returnAllExistingPlants();
		for (let i = 0; i < plants.length; i++) {
			// decrease water level by random amount between 5 and 10
			const currentWater = this.dataView.getUint8(
				(plants[i].gridX * this.dimension + plants[i].gridY) *
					Cell.numBytes
			);
			if (currentWater - 10 > 0) {
				this.dataView.setUint8(
					(plants[i].gridX * this.dimension + plants[i].gridY) *
						Cell.numBytes,
					currentWater - 10
				);
			} else {
				this.dataView.setUint8(
					(plants[i].gridX * this.dimension + plants[i].gridY) *
						Cell.numBytes,
					0
				);
			}
		}
	}

	returnAllExistingPlants() {
		let plants = [];
		for (let i = 0; i < this.dataView.byteLength; i += Cell.numBytes) {
			const plantType = this.dataView.getUint8(i + GRID_TYPE_OFFSET);
			if (plantType != 0) {
				const plantX = this.dataView.getUint8(i + GRID_X_OFFSET);
				const plantY = this.dataView.getUint8(i + GRID_Y_OFFSET);
				plants.push(this.getPlant(plantX, plantY));
			}
		}
		return plants;
	}
}
