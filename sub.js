//グリッドのサイズ
let gridSize;

//モード
let gameMode = "START";
let switchMode = "OFF"

//時間
let time = 50;
let switchTimer = 300;

//イメージ
let showImage;
let blockImage;
let bgImage;
let playerImage;
let playerLeftImage;
let playerLeftJumpImage;
let playerRightJumpImage;
let enemyImage;
let coinImage;
let switchImage;

//アニメーション
let playerRightMoveAnimation;

// グループ
let fixedBlockGroup;
let allBlockGroup;
let enemyGroup;
let coinGroup;

//サウンド
let bgm;
let jumpSound;
let clearSound;
let coinSound;

//フォント
let ft;

//画像
let isSaving = false;

function preload() {
    showImage = loadImage("assets/showImage.png")
    blockImage = loadImage("assets/block.png");
    bgImage = loadImage("assets/background.png");
    playerImage = loadImage("assets/player.png");
    playerLeftImage = loadImage("assets/playerLeft.png");
    playerRightJumpImage = loadImage("assets/playerJumpRight.png");
    playerLeftJumpImage = loadImage("assets/playerJumpLeft.png");
    enemyImage = loadImage("assets/enemy.png");
    coinImage = loadImage("assets/coin.png");
    switchImage = loadImage("assets/switch.png");

    playerRightMoveAnimation = loadAnimation('assets/playerRightMoveAnimation/playerMoveAnimation00.png', 'assets/playerRightMoveAnimation/playerMoveAnimation18.png');

    bgm = loadSound("assets/bgm.mp3");
    jumpSound = loadSound("assets/jump.mp3");
    clearSound = loadSound("assets/clear.mp3");
    coinSound = loadSound("assets/get.ogg")

    ft = loadFont("font/BestTen-CRT.otf")
}

function setup() {
    gridSize = floor(windowHeight / 130) * 10;
    createCanvas(gridSize * 22, gridSize * 13);

    //フォント
    textFont(ft);

    //画像のリサイズ
    imageResize(gridSize);

    gameSetup(gridSize);

    jumpSound.setVolume(0.25);
    coinSound.setVolume(0.25);

    bgm.setVolume(0.2);
    bgm.loop();
}

function draw() {
    background(0);

    //背景を表示
    for (var i = 0; i < 10; i++) {
        image(bgImage, i * bgImage.width - width / 4 + player.position.x * 0.7, 0);
    }

    // カメラがプレイヤーに着いてくる
    camera.position.x = player.position.x + width / 3;


    //全てのスプライトを描画
    drawSprites();

    if (gameMode == "START") {
        startModeDrawing();
        if (keyDown("SPACE")) {
            // ゲームの初期化
            gameMode = "PLAYING";
        }
    }

    if (gameMode == "PLAYING") {
        playing();
        if (player.position.y > height) {
            gameMode = "CLEAR"
        }
    }

    if (gameMode == "GAMEOVER") {
        gameOverModeDrawing();
    }

    if (gameMode == "CLEAR") {
        gameClearModeDrawing();
    }
}

function playing() {
    if (switchMode == "ON") {
        for (let i = 0; i < coinGroup.length; i++) {
            // レンガを作る
            let block = createSprite(coinGroup[i].position.x, coinGroup[i].position.y, gridSize, gridSize);
            block.addImage(blockImage);
            block.immovable = true;
            block.setCollider('rectangle', 0, 0, gridSize, gridSize);
            allBlockGroup.add(block);

            coinGroup[i].remove();
        }
        switchMode = "OFF"
    }

    // プレイヤーとブロックの当たり判定
    player.collide(allBlockGroup);
    enemyGroup.collide(allBlockGroup);

    // プレイヤーを動かす
    playerControl();

    //時間とコインの表示
    if (frameCount % 30 == 29) {
        time--;
    }

    if (time < 0) {
        gameMode = "GAMEOVER";
    }
    if (0 < time && time < 10) {
        fill(240, 100);
        textAlign(CENTER);
        textSize(width / 3);
        text(time, camera.position.x, camera.position.y + width/12);
    }

    drawingTimeCoin();
}



function drawingTimeCoin() {
    fill(240, 230);
    textSize(width / 30);
    text("TIME." + time, camera.position.x + width * 0.34, height * 0.1);
    text("COIN." + coinCount, camera.position.x - width * 0.45, height * 0.1);
}

function startModeDrawing() {
    fill(240, 230);
    textSize(width / 10);
    textAlign(CENTER);
    textSize(width / 10);
    text("PRESS SPACE KEY", camera.position.x, height / 2 - height * 0.13);
    textSize(width / 20);
    text("すてーじからおちたらくりあ", camera.position.x, height / 2 + height * 0.1);
}

function gameOverModeDrawing() {
    fill(240, 230);
    textAlign(CENTER);
    textSize(width / 10);
    text("GAME OVER", camera.position.x, height / 2 - height * 0.1);
    textSize(width / 20);
    text("ぶらうざをりろーどしてりとらい", camera.position.x, height / 2 + height * 0.1);
}

function gameClearModeDrawing() {
    player.velocity.x = 0;

    fill(240, 230);
    textAlign(CENTER);
    textSize(width / 10);
    text("GAME CLEAR", camera.position.x + width / 8, height / 2 - height * 0.1);
    textSize(width / 20);
    text("こんぐらっちゅれいしょん", camera.position.x + width / 8, height / 2 + height * 0.1);

    showImage.resize(width / 5, 0);
    imageMode(CENTER);
    image(showImage, camera.position.x - width / 3, height / 2 - height / 20);

    if (!isSaving) {
        clearSound.play();
        saveCanvas('clear', 'jpeg');
        isSaving = true;
    }
}

function gameSetup(_gridSize) {

    allBlockGroup = createGroup();
    enemyGroup = createGroup();
    coinGroup = createGroup();

    for (y = 0; y < stageLayout.length; y++) {
        for (x = 0; x < stageLayout[y].length; x++) {
            if (stageLayout[y][x] == 1) {
                // レンガを作る
                let block = createSprite(x * _gridSize + _gridSize * 0.5, y * _gridSize + _gridSize * 0.5, _gridSize, _gridSize);
                block.addImage(blockImage);
                block.immovable = true;
                allBlockGroup.add(block);
            } else if (stageLayout[y][x] == 2) {
                player = createSprite(x * _gridSize + _gridSize * 0.5, y * _gridSize + _gridSize * 0.5, _gridSize, _gridSize);
                player.addImage('moveRight', playerImage);
                player.addImage('moveLeft', playerLeftImage);
                player.addImage('jumpRight', playerRightJumpImage);
                player.addImage('jumpLeft', playerLeftJumpImage);
                player.setCollider('rectangle', 0, 0, _gridSize * 1.2, _gridSize * 1.2);
            } else if (stageLayout[y][x] == 3) {
                let enemy = createSprite(x * _gridSize + _gridSize * 0.5, y * _gridSize + _gridSize * 0.5, _gridSize, _gridSize);
                enemy.addImage(enemyImage);
                enemy.setCollider('rectangle', 0, 0, _gridSize, _gridSize);
                enemy.velocity.x = -0.5;
                enemyGroup.add(enemy);
            } else if (stageLayout[y][x] == 4) {
                let coin = createSprite(x * _gridSize + _gridSize * 0.5, y * _gridSize + _gridSize * 0.5, _gridSize, _gridSize);
                coin.addImage('coin', coinImage);
                coinGroup.add(coin);
            } else if (stageLayout[y][x] == 5) {
                switchSp = createSprite(x * _gridSize + _gridSize * 0.5, y * _gridSize + _gridSize * 0.5, _gridSize, _gridSize);
                switchSp.addImage(switchImage);
            }
        }
    }
}

function imageResize(_gridSize) {
    bgImage.resize(0, height);

    blockImage.resize(_gridSize, 0);
    playerImage.resize(_gridSize, 0);
    enemyImage.resize(_gridSize, 0);
    playerLeftImage.resize(_gridSize, 0);
    playerRightJumpImage.resize(_gridSize, 0);
    playerLeftJumpImage.resize(_gridSize, 0);
    coinImage.resize(_gridSize * 0.8, 0);
    switchImage.resize(_gridSize, 0);
}