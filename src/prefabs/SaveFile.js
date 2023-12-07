class SaveFile {
    constructor(scene, x, y, label, style, fileName) {
        this.scene = scene;
        this.color = style.color;
        this.fileName = fileName;
        this.initialSize = parseInt(style.fontSize);
        this.saved = false;
        this.button = scene.add.text(x, y, label)
            .setOrigin(0.5)
            .setPadding(10)
            .setInteractive({ useHandCursor: true })
            .setStyle(style)
            .on('pointerdown', () => this.pointerDown())
            .on('pointerover', () => this.hoverOver())
            .on('pointerout',  () => this.pointerOut())
    }

    pointerDown() {
        this.pointerOut();
        if (!this.saved) {
            // prompt user for file name
            let promptName = prompt("Enter save file name: ", this.fileName);

            this.scene.saveFile(this.fileName);
            this.saved = true;
            this.button.setText("Load " + promptName);
        } else {
            this.scene.loadFile(this.fileName);
        }
    }

    pointerOut() {
        this.button.setStyle({ fill: this.color })
        this.button.setFontSize(this.initialSize);
    }

    hoverOver() {
        this.button.setStyle({ fill: '#F39C12' });
        this.button.setFontSize(this.initialSize * 1.1);
    }

    updateText(text) {
        this.button.setText(text);
    }

    destroy() {
        this.button.destroy();
    }
}