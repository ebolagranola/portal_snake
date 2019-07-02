var s;
var scl = 20;
var size = 20;
var foodSize = 15;
var cornerRadius = 5;
var cornerRadius2 = 10;
var pause = false;
var showOnScreen = false;
var stop = 'STOP';
var gameOver = false;
var currentDir = 3;
var reset = false;
var start;

var food;

function setup() {
    angleMode(DEGREES);
    frameRate(12);
    createCanvas(640, 640);
    start = millis();
    s = new Snake();
    foodLocation();
}

function draw() {
    smooth();
    background(50);

    push();
    noStroke();
    fill(255, 100, 100);
    rect(160, 460, 160, 20, cornerRadius2, cornerRadius2, cornerRadius2, cornerRadius2);
    rect(320, 160, 160, 20, cornerRadius2, cornerRadius2, cornerRadius2, cornerRadius2);
    fill(100, 100, 255);
    rect(460, 320, 20, 160, cornerRadius2, cornerRadius2, cornerRadius2, cornerRadius2);
    rect(160, 160, 20, 160, cornerRadius2, cornerRadius2, cornerRadius2, cornerRadius2);
    pop();

    push();
    noStroke();
    fill(random(100, 200), random(200, 255), random(200, 255));
    //rect(food.x + (size - foodSize)/2, food.y + (size - foodSize)/2, foodSize, foodSize);
    circle(food.x + size/2, food.y + size/2, foodSize/2);
    pop();

    s.timer();
    s.score();
    s.update();
    s.show();
    
    if (s.eat(food)) {
        this.clock = 5.0;
        foodLocation();
    }
    
    if (showOnScreen === true) {
        push();
        textSize(200);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        stop = 'STOP';
        fill(255, 75, 75);
        text(stop, width/2, width/2);
        pop();
    } else if (showOnScreen === false) {
        push();
        textSize(200);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        fill(255, 75, 75);
        stop = '';
        text(stop, width/2, width/2);
        pop();
    }
    
    s.dead();
}

function foodLocation() {
    var cols = floor(width/size);
    var rows = floor(height/size);
    food = createVector(floor(random(cols)), floor(random(rows)));
    food.mult(size);
    ranColor = round(random(0, 2));
}

function mousePressed() {
    s.total++;
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        if (currentDir == 1 || currentDir == 3) {
            s.dir(0, -1);
            currentDir = 2;
        }
    } else if (keyCode === DOWN_ARROW) {
        if (currentDir == 1 || currentDir == 3) {
            s.dir(0, 1);
            currentDir = 0;
        }
    } else if (keyCode === LEFT_ARROW) {
        if (currentDir == 0 || currentDir == 2) {
            s.dir(-1, 0);
            currentDir = 1;
        }
    } else if (keyCode === RIGHT_ARROW) {
        if (currentDir == 0 || currentDir == 2) {
            s.dir(1, 0);
            currentDir = 3;
        }
    } else if (keyCode === ESCAPE) {
        pause = !pause;
        if (this.pause === true) {
            showOnScreen = true;
            noLoop();
        } else {
            pause = false;
            showOnScreen = false;
            loop();
            textSize(200);
            fill(75, 255, 75);
            textStyle(BOLD);
            textAlign(CENTER, CENTER);
            text('GO', width/2, width/2);
        }
    } else if (gameOver === true) {
        if (key == ' ') {
            reset = true;
            currentDir = 3;
            this.total = 0;
            this.tail = [];
            this.clock = 5.00;
            gameOver = false;
            redraw();
            loop();
        }
    }
}

function gameOverRed() {
    textSize(20);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    fill(255, 75, 75);
    text('GAME', width/2, height/2.06);
    text('OVER', width/2, height/1.94);
    fill(50);
    noStroke();
    rect(220, 565, 200, 20, cornerRadius, cornerRadius, cornerRadius, cornerRadius);
    textStyle(NORMAL);
    textSize(15);
    fill(255);
    text('press SPACE to play again', width/2, height*0.9);
}

function Snake() {
    this.x = round((random(width)/size)) * size;
    this.y = round((random(height)/size)) * size;
    this.xspeed = 1;
    this.yspeed = 0;
    this.total = 0;
    this.tail = [];
    this.clock = 5.0;

    this.eat = function (pos) {
        var d = dist(this.x, this.y, pos.x, pos.y);
        if (d < 1) {
            this.total++;
            this.clock = 5.0;
            return true;
        } else {
            return false;
        }
    };

    this.dir = function (x, y) {
        this.xspeed = x;
        this.yspeed = y;
    };

    this.dead = function () {
        for (var i = 0; i < this.tail.length; i++) {
            var pos = this.tail[i];
            var d = dist(this.x, this.y, pos.x, pos.y);
            if (d < 1) {
                gameOver = true;
                gameOverRed();
                  noLoop();
            }
        }
    };

    this.update = function () {
        for (var i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }
        if (this.total >= 1) {
            this.tail[this.total - 1] = createVector(this.x, this.y);
        }

        this.x = this.x + this.xspeed * scl;
        this.y = this.y + this.yspeed * scl;

        if (this.x > width - size) {
            this.x = 0;
        }
        if (this.x < 0) {
            this.x = width - size;
        }
        if (this.y > height - size) {
            this.y = 0;
        }
        if (this.y < 0) {
            this.y = height - size;
        }
        //----------------------------------------------------
        //Top Left Blue
        if (this.xspeed == -1 && this.x == 160) {
            if (this.y > 140 && this.y < 320) {
                this.x += 280;
                this.y += 160;
            }
        }
        if (this.xspeed == 1 && this.x == 160) {
            if (this.y > 140 && this.y < 320) {
                this.x += 320;
                this.y += 160;
            }
        }
        //-----------------------------------------------------
        //Bottom Right Blue
        if (this.xspeed == -1 && this.x == 460) {
            if (this.y > 300 && this.y < 480) {
                this.x -= 320;
                this.y -= 160;
            }
        }
        if (this.xspeed == 1 && this.x == 460) {
            if (this.y > 300 && this.y < 480) {
                this.x -= 280;
                this.y -= 160;
            }
        }
        //-----------------------------------------------------
        //Bottom Left Red
        if (this.yspeed == 1 && this.y == 460) {
            if (this.x > 140 && this.x < 320) {
                this.x += 160;
                this.y -= 280;
            }
        }
        if (this.yspeed == -1 && this.y == 460) {
            if (this.x > 140 && this.x < 320) {
                this.x += 160;
                this.y -= 320;
            }
        }
        //-----------------------------------------------------
        //Top Right Red
        if (this.yspeed == 1 && this.y == 160) {
            if (this.x > 300 && this.x < 480) {
                this.x -= 160;
                this.y += 320;
            }
        }
        if (this.yspeed == -1 && this.y == 160) {
            if (this.x > 300 && this.x < 480) {
                this.x -= 160;
                this.y += 280;
            }
        }        
    };
    
    this.score = function () {
        push();
        textSize(100);
        fill(80);
        textAlign(LEFT, BOTTOM);
        text(this.total, 5, height + 10);
        pop();
        
        push();
        textSize(30);
        fill(80);
        textAlign(RIGHT, TOP);
        text('t - ' + this.clock, width - 15, 10);
        pop();   
    };
    
    this.timer = function () {
        if (frameCount % 12 == 0) {
            this.clock --;
        } 
        if (this.clock == 0 || this.clock < 0) {
            this.clock = 0;
            gameOver = true;
            gameOverRed();
            noLoop();
        }
    };

    this.show = function () {
        if (reset == false) {
            push();
            strokeWeight(5);
            stroke(50);
            fill(random(200, 255), random(100, 200), random(200, 255));
            for (var i = 0; i < this.tail.length; i++) {
                rect(this.tail[i].x, this.tail[i].y, size, size, cornerRadius, cornerRadius, cornerRadius);
            }
            pop();
    
            push();
            noStroke();
            fill(255);
            rect(this.x, this.y, size, size, cornerRadius, cornerRadius, cornerRadius, cornerRadius);
            pop();
    
            push();
            noStroke();
            fill(50);
            circle(this.x + size/2, this.y + size/2, size/3);
            pop();
        } else if (reset == true) {
            currentDir = 3;
            this.tail.length = 0;
            this.x = round((random(width)/size)) * size;
            this.y = round((random(height)/size)) * size;
            this.xspeed = 1;
            this.yspeed = 0;
            this.clock = 5.0;
            this.total = 0;
            this.tail = [];
            gameOver = false;
            reset = false;
        }
    };
}
