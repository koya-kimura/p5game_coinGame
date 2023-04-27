let player;
let playerDirection = "right";
let jumpMode = "NOJUMP";
let jumpSpeed = -20;

let coinCount = 0;

let switchSp;

function playerControl() {
    //＝＝＝＝＝＝＝＝ 移動中 ＝＝＝＝＝＝＝＝
    // 移動と向き
    if (keyDown('RIGHT')) {
        // 右に移動
        player.velocity.x = 6;
        // 右向きという情報
        playerDirection = 'right';
    } else if (keyDown('LEFT')) {
        // 左に移動
        player.velocity.x = -6;
        // 左向きという情報
        playerDirection = 'left';
    } else {
        // 左右キーが押されていなければ横移動なし
        player.velocity.x = 0;
    }

    //1番左だけ処理しとく
    if (player.position.x < 280) {
        player.position.x = 300;
    }

    //＝＝＝＝＝＝＝＝ 重力 ＝＝＝＝＝＝＝＝
    player.velocity.y += 1;

    // 着地している時
    if (player.touching.bottom) {
        if (keyDown('UP')) {
            // 上キーが押され、速度が下向きの時に
            if (player.velocity.y > 0) {
                // 速度を上向きにする
                jumpSound.play();
                player.velocity.y = jumpSpeed;
            }
        } else {
            // 着地中は縦の速度ゼロ
            player.velocity.y = 0;
        }
    }

    if (!player.touching.bottom && player.velocity.y < 0) {
        jumpMode = "JUMP"
    } else {
        jumpMode = "NOJUMP"
    }

    if (playerDirection == 'right') {
        if (jumpMode == "JUMP") {
            player.changeImage('jumpRight');
        } else {
            player.changeImage('moveRight');
        }
    } else if (playerDirection == 'left') {
        if (jumpMode == "JUMP") {
            player.changeImage('jumpLeft');
        } else {
            player.changeImage('moveLeft');
        }
    }

    player.overlap(enemyGroup, enemyConflict);

    player.overlap(switchSp, switchOn);

    player.overlap(coinGroup, pickupCoin);
}

function enemyConflict(player, enemy) {
    let vec = createVector(player.position.x - enemy.position.x, player.position.y - enemy.position.y);
    vec.normalize();

    if (vec.y < -0.1) {
        enemy.remove();
    } else {
        player.remove();
        gameMode = "GAMEOVER";
    }
}

function switchOn(player, switchSp) {
    let vec = createVector(player.position.x - switchSp.position.x, player.position.y - switchSp.position.y);
    vec.normalize();
    if (vec.y < -0.6) {
        switchSp.remove();
        switchMode = "ON";
    }
}

function pickupCoin(player, coin){
    coin.remove();
    coinCount ++;

    coinSound.play();
}