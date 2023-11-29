class Environment extends Phaser.GameObjects.GameObject {
    constructor(scene, x, y){
        super(scene,x, y);
        this.currentTime = 0;
        this.day = 0;
        this.timerDisplay = scene.add.text(10, 10, "Press 'T' to advance time: " + this.currentTime);
        this.dayDisplay = scene.add.text(10, 30, "Day: " + this.day);
        this.plantDisplay = scene.add.text(10, 50, this.scene.player.plantInventory);
        this.controlsDisplay = scene.add.text(w - 140, 10, "Press 'R'\nfor controls");
        scene.add.existing(this);
    }

    displayPlayerInventory(inventory) {
        let displayString = "Inventory:\n";
        for (let key in inventory) {
            displayString += key + ": " + inventory[key] + "\n";
        }
        this.plantDisplay.setText(displayString);    
    }

    update() {
        if (keys.T.isDown) {
            this.currentTime += 1;
            this.timerDisplay.setText("Time: " + this.currentTime);
            this.dayDisplay.setText("Day: " + this.day);
            if (this.currentTime >= 100) {
                this.currentTime = 0;
                this.day += 1;
                this.scene.events.emit("newDay", { day: this.day });
            }
        }
        this.displayPlayerInventory(this.scene.player.plantInventory);
    }
}