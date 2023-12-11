class Cell {
	static numBytes = 6;

	constructor(dataView, scene) {
		this.dataView = dataView;
		this.scene = scene;
	}
	
	growPlants(nearCellsIndex, plantType) {
		// PlantFunctions.dataView = this.dataView;
		// PlantFunctions.scene = this.scene;
		console.log(this.dataView);
		PlantFunctions.growPlant(
			nearCellsIndex,
			plantType,
			this.scene,
			this.dataView
		);
	}
}
