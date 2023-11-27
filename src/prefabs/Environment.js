class Environment extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame){
        super(scene,x, y, texture, frame);
        this.currentTime = 0;
        this.day = 0;
        this.timerDisplay = scene.add.text(10, 10, "Press 'T' to advance time: " + this.currentTime);
        this.dayDisplay = scene.add.text(10, 30, "Day: " + this.day);
        this.plantDisplay = scene.add.text(10, 50, this.scene.player.plantInventory);
        scene.add.existing(this);
    }

    displayPlayerInventory(inventory) {
        let displayString = "Inventory:\n";
        for (let key in inventory) {
            displayString += key + ": " + inventory[key] + "\n";
        }
        this.plantDisplay.setText(displayString);    
    }

    update(){
        if (this.scene.keyT.isDown) {
            this.currentTime += 5;
            this.timerDisplay.setText("Time: " + this.currentTime);
            this.dayDisplay.setText("Day: " + this.day);
            if (this.currentTime >= 100) {
                this.currentTime = 0;
                this.day += 1;
                this.scene.events.emit('newDay', { day: this.day });
            }
        }
        this.displayPlayerInventory(this.scene.player.plantInventory);
    }
}