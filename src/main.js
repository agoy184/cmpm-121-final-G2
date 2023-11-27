let config = {
    type: Phaser.WEBGL,
    width: 960,
    height: 540,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            fps: 60
        }
    },
    scene: [ Play ]
}

let game = new Phaser.Game(config);
    
let keyW, keyA, keyS, keyD, keyR;