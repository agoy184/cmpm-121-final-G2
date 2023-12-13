import InternalPlantType from "./plantDef.js";
import { allPlantDefs } from "./plantDef.js";
import {
	GRID_GROWTH_OFFSET,
	GRID_SUN_OFFSET,
	GRID_WATER_OFFSET,
	GRID_X_OFFSET,
	GRID_Y_OFFSET,
	GRID_TYPE_OFFSET,
} from "./Grid.js";
import Cell from "./Cell.js";
import { language } from "../scenes/Play.js";
import { plantNamesText, atText } from "../translations.js";

export class PlantFunctions {
	static growPlant(nearCells, plantType, scene, dataView) {
		const plant = internalPlantTypeCompiler(allPlantDefs[plantType - 1]);

		let samePlants = 0;
		let diffPlants = 0;

		for (let i = 1; i < nearCells.length; i++) {
			const nearPlantType = dataView.getUint8(
				nearCells[i] + GRID_TYPE_OFFSET
			);
			if (nearPlantType > 0) {
				if (plantType == nearPlantType) {
					samePlants++;
				} else {
					diffPlants++;
				}
			}
		}

		const data = {
			sunLevel: dataView.getUint8(nearCells[0] + GRID_SUN_OFFSET),
			waterLevel: dataView.getUint8(nearCells[0] + GRID_WATER_OFFSET),
			nearDiffPlants: diffPlants,
			nearSamePlants: samePlants,
		};

		if (plant.nextLevel(data)) {
			let growthLevel = dataView.getUint8(
				nearCells[0] + GRID_GROWTH_OFFSET
			);
			if (growthLevel < 3) {
				dataView.setUint8(
					nearCells[0] + GRID_GROWTH_OFFSET,
					growthLevel + 1
				);
				// update growthLevel since it was increased in the dataview
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

export default class Plant extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, internalPlantType) {
		let gridPoint = scene.grid.getPoint(x, y);
		super(scene, gridPoint[0], gridPoint[1], internalPlantType.image);
		this.gridX = x;
		this.gridY = y;
		this.name = internalPlantType.name;
		this.type = internalPlantType.type;
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
		this.setScale(this.level * 0.05);
		let gridPoint = this.scene.grid.getPoint(this.gridX, this.gridY);
		this.x = gridPoint[0];
		this.y = gridPoint[1];
	}

	toString() {
		return (
			plantNamesText[this.name][language] +
			atText[language] +
			this.gridX +
			", " +
			this.gridY +
			")"
		);
	}

	deletePlant() {
		this.destroy();
	}
}

export function internalPlantTypeCompiler(program) {
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
		growsWhen(growsWhen) {
			internalPlantType.nextLevel = (rules) => {
				return growsWhen(rules);
			};
		},
	};
	program(dsl);
	return internalPlantType;
}
