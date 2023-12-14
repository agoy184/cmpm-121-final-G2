export default class InternalPlantType {
	constructor() {
		this.name;
		this.type;
		this.image;
		this.nextLevel = (rules) => rules.plant.level;
	}
}

export const allPlantDefs = [
	function carrot($) {
		$.name("Carrot");
		$.type(1);
		$.image("carrot");
		$.growsWhen((rules) => {
			if (rules.sunLevel <= 0) return false;
			if (rules.waterLevel <= 0) return false;
			if (rules.nearDiffPlants > 0 || rules.nearSamePlants > 0)
				return false;
			return true;
		});
	},

	function tomato($) {
		$.name("Tomato");
		$.type(2);
		$.image("tomato");
		$.growsWhen((rules) => {
			if (rules.sunLevel <= 4) return false;
			if (rules.waterLevel <= 25) return false;
			if (rules.nearDiffPlants <= 0 && rules.nearSamePlants <= 0)
				return false;
			return true;
		});
	},

	function potato($) {
		$.name("Potato");
		$.type(3);
		$.image("potato");
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
		$.growsWhen((rules) => {
			if (rules.sunLevel >= 5) return false;
			if (rules.waterLevel <= 10) return false;
			if (rules.nearDiffPlants <= 0 && rules.nearSamePlants <= 0)
				return false;
			return true;
		});
	},
];
