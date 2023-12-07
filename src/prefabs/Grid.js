class Grid extends Phaser.GameObjects.Grid {
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
		// this.gridCells = {};
		const arraySize = dimension * dimension * Cell.numBytes;
		const plantGridCells = new ArrayBuffer(arraySize);
		this.dataView = new DataView(plantGridCells);

		this.initializeGrid();
		scene.events.on("newDay", (event) => {
			this.initializeGrid();
			console.log("day " + event.day);
		});
		scene.add.existing(this);
	}

	saveData() {
		return this.plantGridCells; //or maybe the dataview im not too sure
		/*let data = {};
		for (let key in this.gridCells) {
			data[key] = this.gridCells[key].saveData();
		}
		return data;*/
	}

	loadData(data) {
		for (let i = 0; i < this.dimension; i++) {
			for (let j = 0; j < this.dimension; j++) {
				//load back all the values from each cell in the dataview (use math to determine the right index)
				/*if (plantType !== 3) {
                    const loadedPlant = this.createPlant(i, j, plantType);
                    loadedPlant.growthLevel = this.dataView.getUint8(index + 1);
                    this.addPlant(loadedPlant);
                } else if (cell.plant) {
                    this.removePlant(i, j);
                }*/
			}
		}

		for (let key in data) {
			const cell = this.gridCells[key];
			const plantData = data[key].plant;

			cell.loadData(data[key]);

			if (plantData) {
				const loadedPlant = this.createPlant(
					plantData.x,
					plantData.y,
					plantData.name
				);
				loadedPlant.loadData(plantData);
				this.addPlant(loadedPlant);
			} else if (cell.plant) {
				// if there's no plant, but there used to be one, remove it from the scene
				this.removePlant(cell.plant.gridX, cell.plant.gridY);
			}
		}
	}

	initializeCell(x, y) {
		let randomWater = Math.floor(Math.random() * 10 - 3); //-3-6
		let randomSunlight = Math.floor(Math.random() * 10); // 0-9
		if (this.pointInBounds(x, y)) {
			this.dataView.setUint8(
				(x * this.dimension + y) * Cell.numBytes,
				randomWater
			);
			this.dataView.setUint8(
				(x * this.dimension + y) * Cell.numBytes + 1,
				randomSunlight
			);
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

	createPlant(x, y, name) {
		switch (name) {
			case "Tomato":
				return new Tomato(this.scene, x, y);
			case "Potato":
				return new Potato(this.scene, x, y);
			case "Carrot":
				return new Carrot(this.scene, x, y);
			default:
				return null;
		}
	}

	addPlant(plant) {
		const index = (plant.x * this.dimension + plant.y) * Cell.numBytes + 2;
		this.dataView.setUint8(index, plant.type);
		this.dataView.setUint8(index + 1, plant.x);
		this.dataView.setUint8(index + 2, plant.y);
		this.dataView.setUint8(index + 3, plant.growthLevel);

	}

	removePlant(x, y) { //similar idea to add plant in terms of the dataview
		let key = this.getKey(x, y);
		return this.gridCells[key].removePlant();
	}

	getPlant(x, y) { 
		let key = this.getKey(x, y);
		return this.gridCells[key].plant;
	}

	getCellInfo(x, y) {
		let key = this.getKey(x, y);
		let cell = this.gridCells[key];
		let sunlight = cell.sunlightLevel;
		let water = cell.waterLevel;
		if (cell.plant) {
			return (
				"Level " +
				cell.plant.growthLevel +
				" " +
				cell.plant +
				" has " +
				sunlight +
				" sunlight and " +
				water +
				" water"
			);
		}
		return (
			"empty plot has " + sunlight + " sunlight and " + water + " water"
		);
	}

	getNearCells(x, y) {
		let nearCells = [];
		const nearCellKeys = this.getNearCellKeys(x, y);
		nearCellKeys.forEach((key) => {
			nearCells.push(this.gridCells[key]);
		});
		return nearCells;
	}

	growCells() {
		//this function is kinda ugly but we can refactor later
		for (let key in this.gridCells) {
			if (this.gridCells[key].plant) {
				let [plantX, plantY] = key.split(",").map(Number);
				this.gridCells[key].plant.growPlant(
					this.getNearCells(plantX, plantY)
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

	getKey(x, y) {
		return x + "," + y;
	}

	getNearCellKeys(x, y) {
		const points = [
			{ x: x, y: y },
			{ x: x, y: y - 1 },
			{ x: x, y: y + 1 },
			{ x: x - 1, y: y },
			{ x: x + 1, y: y },
		];
		const keys = [];
		points.forEach((point) => {
			keys.push(this.getKey(point.x, point.y));
		});
		return keys;
	}

	pointInBounds(x, y) {
		return x >= 0 && x < this.dimension && y >= 0 && y < this.dimension;
	}

	update() {}
}
