class Cell {
	static numBytes = 6;

	constructor(dataView, scene) {
		this.dataView = dataView;
		this.scene = scene;
	}
	
	growPlants(nearCellsIndex, plantType) {
		console.log(this.dataView);
		PlantFunctions.growPlant(
			nearCellsIndex,
			plantType,
			this.scene,
			this.dataView
		);
	}
}
