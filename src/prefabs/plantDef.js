class PlantRules {
    constructor() {
        this.sunLevel;
        this.waterLevel;
        this.nearDiffPlants;
        this.nearSamePlants;
    }
}

class InternalPlantType {
    constructor() {
        this.name;
        this.type;
        this.image;
        this.rulesDisplay;
        this.nextLevel = (rules) => rules.plant.level;
    }
}

const allPlantDefs = [//this is what you change to add/remove/change plants
    function carrot($) {
        $.name("Carrot");
        $.type(1);
        $.image("carrot");
        $.rulesDisplay("Carrot growing rules:\n- if water level is positive\n- and the sunlight level is greater than 0\n- and there are no nearby plants");
        $.growsWhen(rules => {
            if (rules.sunLevel <= 0) return false;
            if (rules.waterLevel <= 0) return false;
            if (rules.nearDiffPlants > 0 || rules.nearSamePlants > 0) return false;
            return true;
        });
    },

    function tomato($) {
        $.name("Tomato");
        $.type(2);
        $.image("tomato");
        $.rulesDisplay("Tomato growing rules:\n- if water level is greater than 25\n- and the sunlight level is greater than 4\n- and there is at least one nearby plant");
        $.growsWhen((rules) => {
            if (rules.sunLevel <= 4) return false;
            if (rules.waterLevel <= 25) return false;
            if (rules.nearDiffPlants <= 0 && rules.nearSamePlants <= 0) return false;
            return true;
        });
    },

    function potato($) {
        $.name("Potato");
        $.type(3);
        $.image("potato");
        $.rulesDisplay("Potato growing rules:\n- if water level is greater than 10\n- and the sunlight level is less than 5\n- and there are no nearby plants (except for Potato)");
        $.growsWhen((rules) => {
            if (rules.sunLevel >= 5) return false;
            if (rules.waterLevel <= 10) return false;
            if (rules.nearDiffPlants > 0) return false;
            return true;
        });
    },

    function banana($) {
        $.name("Banana");
        $.type(4);
        $.image("banana");
        $.rulesDisplay("Banana growing rules:\n- if water level is greater than 10\n- and the sunlight level is less than 5\n- and there is at least one nearby plant");
        $.growsWhen((rules) => {
            console.log(rules.sunLevel);
            if (rules.sunLevel >= 5) return false;
            if (rules.waterLevel <= 10) return false;
            if (rules.nearDiffPlants <= 0 && rules.nearSamePlants <= 0) return false;
            return true;
        });
    }
];
