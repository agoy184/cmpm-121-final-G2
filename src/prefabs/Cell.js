class Cell {
	constructor(waterlvl, sunlvl, plant = null) {
		this.waterLevel = waterlvl;
		this.sunlightLevel = sunlvl;
		this.plant = plant;
	}

	saveData() {
		let data = {};
		if (this.plant) {
			data.plant = this.plant.saveData();
		}
		data.waterLevel = this.waterLevel;
		data.sunlightLevel = this.sunlightLevel;
		return data;
	}

	loadData(data) {
		this.waterLevel = data.waterLevel;
		this.sunlightLevel = data.sunlightLevel;
	}

	setWaterLevel(level) {
		this.waterLevel = level;
	}

	addWaterLevel(level) {
		this.waterLevel += level;
	}

	setSunlightLevel(level) {
		this.sunlightLevel = level;
	}

	addPlant(plant) {
		this.removePlant();
		this.plant = plant;
	}

	removePlant() {
		if (!this.plant) {
			return null;
		}
		let removedPlantData = [this.plant.name, this.plant.growthLevel];
		this.plant.deletePlant();
		this.plant = null;
		return removedPlantData;
	}
}
