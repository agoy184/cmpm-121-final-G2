class Cell {
	static numBytes = 6;

	constructor(dataView) {}

	//Cell Byte Map
	/*
	 * First byte is the cell water level
	 * Next byte is the sunlight level
	 * Next 4 bytes are the plant data, check Plant.js for info on the plant data
	 * */

	get waterLevel() {
		return this.dataView.getUint8(0);
	}

	set waterLevel(i) {
		if (this.dataView) {
			this.dataView.setUint8(0, i);
		}
	}

	addWaterLevel(i) {
		if (this.dataView) {
			this.dataView.setUint8(0, this.dataView.getUint8(0) + i);
		}
	}

	get sunlightLevel() {
		return this.dataView.getUint8(1);
	}

	set sunlightLevel(i) {
		if (this.dataView) {
			this.dataView.setUint8(1, i);
		}
	}

	get type() {
		return this.dataView.getUint8(2);
	}

	set type(i) {
		if (this.dataView) {
			this.dataView.setUint8(2, i);
		}
	}

	get plantX() {
		return this.dataView.getUint8(3);
	}

	set plantX(i) {
		if (this.dataView) {
			this.dataView.setUint8(3, i);
		}
	}

	get plantY() {
		return this.dataView.getUint8(4);
	}

	set plantY(i) {
		if (this.dataView) {
			this.dataView.setUint8(4, i);
		}
	}

	get plantGrowthLevel() {
		return this.dataView.getUint8(5);
	}

	set plantGrowthLevel(i) {
		if (this.dataView) {
			this.dataView.setUint8(5, i);
			if (this.plantGrowthLevel > 3) {
				this.plantGrowthLevel = 3;
			}
		}
	}

	addPlant(plantType, plantX, plantY, plantGrowthLevel) {
		if (this.dataView) {
			this.removePlant();
			let plant = new Plant(
				this.scene,
				plantX,
				plantY,
				new DataView(dataView.buffer, 2, 4)
			);
			this.plantType = plantType;
			this.plantX = plantX;
			this.plantY = plantY;
			this.plantGrowthLevel = plantGrowthLevel;
		}
	}

	removePlant() {
		if (this.dataView) {
			if (this.plantType == 0) {
				//no plant
				return null;
			}
			let removedPlantData = [this.plantType, this.plantGrowthLevel];
			this.plantX = 0;
			this.plantY = 0;
			this.plantGrowthLevel = 0;
			this.plantType = 0;
			return removedPlantData;
		}
	}

	saveData() {
		if (this.dataView) {
			let data = {};
			if (this.plantGrowthLevel != 0) {
				//not null
				//data.plant = this.plant.saveData(); does not work since it cant actually call the plant
				data.plant = {
					x: this.plantX,
					y: this.plantY,
					type: this.plantType,
					growthLevel: this.plantGrowthLevel,
				};
			}
			data.waterLevel = this.waterLevel;
			data.sunlightLevel = this.sunlightLevel;
			return data;
		}
	}

	loadData(data) {
		if (this.dataView) {
			this.waterLevel = data.waterLevel;
			this.sunlightLevel = data.sunlightLevel;
			this.plantType = data.plant.type;
			this.plantX = data.plant.x;
			this.plantY = data.plant.y;
			this.plantGrowthLevel = data.plant.growthLevel;
			if (this.plant) {
				this.addPlant(
					this.plantType,
					this.plantX,
					this.plantY,
					this.plantGrowthLevel
				);
			}
		}
	}
}
