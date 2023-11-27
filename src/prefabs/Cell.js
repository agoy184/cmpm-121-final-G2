class Cell {
    constructor(waterlvl, sunlvl, plant = null){
        this.waterLevel = waterlvl;
        this.sunlightLevel = sunlvl;
        this.plant = plant;
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

    addPlant(plant){
        this.removePlant();
        this.plant = plant;
    }

    removePlant(){
        if (!this.plant) {
            return null;
        }
        let removedPlantData = [this.plant.name, this.plant.growthLevel];
        this.plant.deletePlant();
        this.plant = null;
        return removedPlantData;
    }
}