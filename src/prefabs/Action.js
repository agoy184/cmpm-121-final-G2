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
    constructor(type, plant, gridX, gridY) {
        super();
        this.type = type;
        this.plant = plant;
        this.growthLevel = plant.growthLevel;
        this.gridX = gridX;
        this.gridY = gridY;
    }
}