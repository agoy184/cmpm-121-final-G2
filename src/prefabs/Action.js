import { MOVE, TIME, PLANT } from "../scenes/Play.js";

class Action {
	constructor() {
		this.type;
	}
}

export default class MoveAction extends Action {
	constructor(x, y) {
		super();
		this.type = MOVE;
		this.x = x;
		this.y = y;
	}
}

export class TimeAction extends Action {
	constructor(dayChange = false) {
		super();
		this.type = TIME;
		this.dayChange = dayChange;
	}
}

export class PlantAction extends Action {
	constructor(inventory, grid) {
		super();
		this.type = PLANT;
		this.inventory = inventory;
		this.gridData = grid.saveData();
	}
}
