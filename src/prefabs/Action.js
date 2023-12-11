/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
class Action {
	constructor() {
		this.type;
	}
}

class MoveAction extends Action {
	constructor(x, y) {
		super();
		this.type = MOVE;
		this.x = x;
		this.y = y;
	}
}

class TimeAction extends Action {
	constructor(dayChange = false) {
		super();
		this.type = TIME;
		this.dayChange = dayChange;
	}
}

class PlantAction extends Action {
	constructor(inventory, grid) {
		super();
		this.type = PLANT;
		this.inventory = inventory;
		this.gridData = grid.saveData();
	}
}
