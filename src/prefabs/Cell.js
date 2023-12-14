import { PlantFunctions } from "./Plant.js";

export default class Cell {
	static numBytes = 6;

	constructor(dataView, scene) {
		this.dataView = dataView;
		this.scene = scene;
	}

	growPlants(nearCellsIndex, plantType) {
		PlantFunctions.growPlant(
			nearCellsIndex,
			plantType,
			this.scene,
			this.dataView
		);
	}
}
