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
<<<<<<< HEAD
        this.inventoryData = inventory;
=======
        this.inventory = inventory;
>>>>>>> cf3f9af35fcd61ba46b2e3ae6465f6c1bcc550a3
        this.gridData = grid.saveData();
    }
}