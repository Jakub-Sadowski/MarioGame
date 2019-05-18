var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var map;
var player;
var cursors;
var groundLayer, coinLayer;
var text;
var score = 0;
var bottle;
var winText;
var LoseText;
function preload() {
    this.load.tilemapTiledJSON('map', 'map.json');
    this.load.spritesheet('tiles', 'tiles.png', {frameWidth: 70, frameHeight: 70});
    this.load.image('coin', 'coinGold.png');
    this.load.atlas('player', 'player.png', 'player.json');
    this.load.image('bottle','bottle-1.png');
}

function create() {
    map = this.make.tilemap({key: 'map'});

    var groundTiles = map.addTilesetImage('tiles');
    groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
    groundLayer.setCollisionByExclusion([-1]);
   
    var coinTiles = map.addTilesetImage('coin');
    coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    player = this.physics.add.sprite(200, 200, 'player');
    player.setBounce(0.2); 
    player.setCollideWorldBounds(true);    
    
    player.body.setSize(player.width, player.height-8);
    
    this.physics.add.collider(groundLayer, player);   
    coinLayer.setTileIndexCallback(17, collectCoin, this);    
    this.physics.add.overlap(player, coinLayer);

    
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle',
        frames: [{key: 'player', frame: 'p1_stand'}],
        frameRate: 10,
    });
   

    cursors = this.input.keyboard.createCursorKeys();

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    // set background color, so the sky is not black    
    this.cameras.main.setBackgroundColor('#ccccff');

    // this text will show the score
    text = this.add.text(20, 570, '0', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    }


function collectCoin(sprite, tile) {
    coinLayer.removeTileAt(tile.x, tile.y); 
    score++; 
    text.setText(score); 
    if(score==18)
    {
        wintext = this.add.text(player.x-50, 270, 'WYGRALES! ', {
            fontSize: '60px',
            fill: '#ffffff',
            
        });
        this.physics.pause();
        gameOver = true;
}


    return false;
}
function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}

function update(time, delta) {
  
    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-200);
        player.anims.play('walk', true); // walk left
        player.flipX = true; // flip the sprite to the left
       
        
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(200);
        player.anims.play('walk', true);
        player.flipX = false; // use the original sprite looking to the right

    } else {
        player.body.setVelocityX(0);
        player.anims.play('idle', true);
    }
    // jump 
    if (cursors.up.isDown && player.body.onFloor())
    {
        player.body.setVelocityY(-500);   
        var odleglosc=Math.floor(Math.random() * 200) + 20;

       
        bottle = this.physics.add.sprite(player.x+odleglosc,player.y-400, 'bottle');   
        bottle.body.setSize(bottle.width*0.4, bottle.height*0.4);
        bottle.setCollideWorldBounds(true);
        
       bottle.body.immovable=true;  
       this.physics.add.collider(player, bottle, hitBomb, null, this);
       
    }
   function hitBomb (player, bottle)
{
    if(player.body.onFloor()){
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('idle');
    Losetext = this.add.text(player.x-50, 270, 'GAME OVER! ', {
        fontSize: '60px',
        fill: '#ffffff',
        
    });
    gameOver = true;
    }
}
}
