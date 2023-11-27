class Cell {
    constructor(waterlvl, sunlvl, plant = null){
        this.waterLevel = waterlvl;
        this.sunlightLevel = sunlvl;
        this.plant = plant;
    }

    setWaterLevel(level) {
        this.waterLevel = level;
    }

    setSunlightLevel(level) {
        this.sunlightLevel = level;
    }

    addPlant(plant){
        this.plant = plant;
    }
}