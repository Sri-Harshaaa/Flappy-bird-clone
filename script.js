// Get the canvas an its context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width=480;
canvas.height=680;

// Game control variables
let frames=0;
let staggerFrames=10;

// Load sprites and audio
const sprite = new Image();
sprite.src = "Images/Sprite.png";

const sprite1 = new Image();
sprite1.src = "Images/Sprite1.png";

const fg1 = new Image();
fg1.src = "Images/fg.png";

const score_s = new Audio();
score_s.src = "Sounds/sfx_point.wav";

const hit_s = new Audio();
hit_s.src = "Sounds/sfx_hit.wav";

const die_s = new Audio();
die_s.src = "Sounds/sfx_die.wav";

const swooshing_s = new Audio();
swooshing_s.src = "Sounds/sfx_swooshing.wav";

const wing_s = new Audio();
wing_s.src = "Sounds/sfx_wing.wav";

// Game states
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    gameOver : 2
};

// HAndling canvas click for state change and interactions
canvas.addEventListener("click" , (event) => {
    switch(state.current) {
        case state.getReady:
            state.current = state.game;
            swooshing_s.play();
            break;
        case state.game:
            bird.flap();
            wing_s.play();
            break;
        case state.gameOver:
            let rect = canvas.getBoundingClientRect();
            let ClickX = event.clientX - rect.left;
            let ClickY = event.clientY - rect.top;
            if(ClickX >= start.dX && ClickX <= start.dX + start.dW
                && ClickY >= start.dY && ClickY <= start.dY + start.dH) {
                    pipes.reset();
                    bird.speedReset();
                    score.reset();
                    state.current = state.getReady;
                }
            break;
    }
});

// Handle spacebar click for state change and interactions
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        switch (state.current) {
            case state.getReady:
                state.current = state.game;
                swooshing_s.play();
                break;
            case state.game:
                bird.flap();
                wing_s.play();
                break;
        }
    }
});

// Background object
const bg = {
    sX : 0,
    sY : 0,
    sW : 145,
    sH : 256,
    dX : 0,
    dY : 0,
    dW : canvas.width+3,
    dH : canvas.height,

    draw: function() {
    ctx.drawImage(
        sprite,
        this.sX,this.sY,this.sW,this.sH,
        this.dX,this.dY,this.dW,this.dH
        );
    }
};

// Foreground object
const fg = {
    sX : 0,
    sY : 0,
    sW : 306,
    sH : 111,
    dX : 0,
    dY : canvas.height-153,
    dW : 306,
    dH : 153,
    speed : 2,

    draw: function() {
    ctx.drawImage(
        fg1,
        this.sX,this.sY,this.sW,this.sH,
        this.dX,this.dY,this.dW,this.dH
        );
    ctx.drawImage(
        fg1,
        this.sX,this.sY,this.sW,this.sH,
        this.dX+306,this.dY,this.dW,this.dH
        );  
    ctx.drawImage(
        fg1,
        this.sX,this.sY,this.sW,this.sH,
        this.dX+this.dW+this.dW,this.dY,this.dW,this.dH
        ); 
    }, 

    update: function() {
        if(state.current == state.game) {
            this.dX = (this.dX-this.speed)%(this.dW) ; 
        }
    }
};

// Bird object
const bird = {
    animation : [
        {sX : 0, sY : 487},
        {sX : 28, sY : 487},
        {sX : 56, sY : 487},
        {sX : 28, sY : 487},
    ],
    sW : 24,
    sH : 21,
    dX : 50,
    dY : 155,
    dW : 80,
    dH : 70,
    cX : 0,
    cY : 0,
    radius : 21,

    frame : 0,
    velocity : 0,
    gravity : 0.25 ,
    jump : 4.6,
    
    draw: function() {
        let temp = this.animation[this.frame];
        ctx.drawImage(
        sprite,
        temp.sX,temp.sY,this.sW,this.sH,
        this.dX,this.dY,this.dW,this.dH
        );
    },

    flap: function() {
        this.velocity= -this.jump;
    },

    update: function() {
        if(state.current==state.game) staggerFrames = 4 ;
        if(frames%staggerFrames == 0) {
            this.frame++;
            if(this.frame==4) this.frame=0;
        }
        if(state.current == state.getReady) this.dY = 155;
        else {
            this.velocity+=this.gravity;
            this.dY+=this.velocity;

            if(this.dY+this.dH>canvas.height-fg.dH) {
                this.dY = canvas.height-fg.dH-this.dH+16; 
                this.frame=0;
                if(state.current == state.game) {
                    state.current = state.gameOver;
                    hit_s.play();
                    die_s.play();
                }
            }
            if(this.dY<0) {
                this.dY = -5; 
                this.frame=0;
                if(state.current == state.game) {
                    state.current = state.gameOver;
                    hit_s.play();
                }
            }
        }
    },

    speedReset: function() {
        this.velocity = 0;
    }
};

// Title screen
const title = {      
    sX : 348,
    sY : 88,
    sW : 95,
    sH : 29,
    dX : canvas.width/7,
    dY : 20,
    dW : 360,
    dH : 90,
    
    draw: function() {
        if(state.current==state.getReady) {
            ctx.drawImage(
            sprite,
            this.sX,this.sY,this.sW,this.sH,
            this.dX,this.dY,this.dW,this.dH
          );
        }
    }
};

// Tap instruction image
const tap = {
    sX : 291,
    sY : 90,
    sW : 59,
    sH : 51,
    dX : canvas.width/3-5,
    dY : 150,
    dW : 176,
    dH : 150,

    draw: function() {
     if(state.current==state.getReady) {
            ctx.drawImage(
            sprite,
            this.sX,this.sY,this.sW,this.sH,
            this.dX,this.dY,this.dW,this.dH
          );
        }
     }
};

//"Get Ready" banner
const getReady = {
    sX : 145,
    sY : 220,
    sW : 90,
    sH : 24,
    dX : canvas.width/4-3,
    dY : 340,
    dW : 240,
    dH : 64,

    draw: function() {
     if(state.current==state.getReady) {
            ctx.drawImage(
            sprite1,
            this.sX,this.sY,this.sW,this.sH,
            this.dX,this.dY,this.dW,this.dH
          );
        }
    }
};

// Score board shown after game over
const scoreBoard = {
    sX : 3,
    sY : 258,
    sW : 114,
    sH : 59,
    dX : canvas.width/8-3,
    dY : 200,
    dW : 370,
    dH : 194.74,

    draw: function() {
     if(state.current==state.gameOver) {
            ctx.drawImage(
            sprite,
            this.sX,this.sY,this.sW,this.sH,
            this.dX,this.dY,this.dW,this.dH
          );
        }
     }
};

// "Game over" text
const gameOver = {
    sX : 145,
    sY : 198,
    sW : 96,
    sH : 21,
    dX : canvas.width/5,
    dY : 134,
    dW : 300,
    dH : 65.64,

    draw: function() {
     if(state.current==state.gameOver) {
            ctx.drawImage(
            sprite1,
            this.sX,this.sY,this.sW,this.sH,
            this.dX,this.dY,this.dW,this.dH
          );
        }
     }
};

// "Start" button
const start = {
    sX : 242,
    sY : 212,
    sW : 41,
    sH : 16,
    dX : canvas.width/3,
    dY : 400,
    dW : 150,
    dH : 60.73,

    draw: function() {
     if(state.current==state.gameOver) {
            ctx.drawImage(
            sprite1,
            this.sX,this.sY,this.sW,this.sH,
            this.dX,this.dY,this.dW,this.dH
          );
        }
     }
};

// Pipes object handles drawing, updating and resetting of pipes in the game
const pipes = {
    top : {
        sX : 55,
        sY : 323,
    },
    bottom : {
        sX : 83,
        sY : 322, 
    },
    sW : 28,
    sH : 163,
    dW : 56,
    dH : 326,
    spawningRate : 110, // Horizontal gap between a pair of pipes
    gap : 140, // Vertical space between top and bottom pipe
    speed : 2, // Speed of the pipes
    position : [],

    draw: function() {
     if(state.current==state.game) {
        for(let i=0; i<this.position.length; i++) {
            let p = this.position[i];

            let topYPos = p.y;
            let bottomYPos = p.y+this.dH+this.gap;

            ctx.drawImage(
            sprite,
            this.top.sX,this.top.sY,this.sW,this.sH,
            p.x,topYPos,this.dW,this.dH
          );

            ctx.drawImage(
            sprite,
            this.bottom.sX,this.bottom.sY,this.sW,this.sH,
            p.x,bottomYPos,this.dW,this.dH
          );
        }
        }
     },

     update: function() {
        if(state.current != state.game) return;
        else {
            // Generates pair of pipes for every 110 frames
            if(frames%this.spawningRate == 0) {
                this.position.push({
                    x : canvas.width,
                    y : Math.floor(Math.random()*(-30+260+1)) + (-260)
                });
            }
        }

        for(let i=0; i<this.position.length; i++) {
            let p = this.position[i];

            p.x-=this.speed;

            let bottomYPos = p.y+this.dH+this.gap;

            bird.cX = bird.dX + (bird.dW/2);
            bird.cY = bird.dY + (bird.dH/2);

            // Collision detection
            if(bird.cX+bird.radius > p.x &&
               bird.cX-bird.radius < p.x+this.dW &&
               bird.cY+bird.radius > p.y &&
               bird.cY-bird.radius < p.y+this.dH) {
                    state.current = state.gameOver;
                    hit_s.play();
                }

            if(bird.cX+bird.radius > p.x && 
                bird.cX-bird.radius < p.x+this.dW && 
                bird.cY-bird.radius < bottomYPos + this.dH &&
                bird.cY+bird.radius > bottomYPos) {
                    state.current = state.gameOver;
                    hit_s.play();
                }

                // If the pipe moved completely left off screen
            if(p.x + this.dW <= 0) {
                this.position.shift(); // Deleting the pipe
                score.value++; // Increment score
                score_s.play();

                score.best = Math.max(score.value,score.best);
                localStorage.setItem("best", score.best);
            }
        }
     },

     reset: function() {
        this.position = [];
     }
};

// Score object handles current score and best score
const score = {
    value : 0,
    best : parseInt(localStorage.getItem("best")) || 0,

    draw: function() {
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";

        if(state.current == state.game) {
            ctx.lineWidth = 5
            ctx.font = "37px Teko";
            ctx.strokeText(this.value,canvas.width/2,50);
            ctx.fillText(this.value,canvas.width/2,50);
        }
        else if(state.current == state.gameOver) {
            ctx.strokeText(this.value,350,286);
            ctx.fillText(this.value,350,286);

            ctx.strokeText(this.best,350,354);
            ctx.fillText(this.best,350,354);
        }
    },

    reset: function() {
        this.value = 0;
    }
};

// Draw funtion renders all game elements onto the canvas
function draw() {
    canvas.style.background="#70c5ce";
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    title.draw();
    tap.draw();
    getReady.draw();
    scoreBoard.draw();
    gameOver.draw();
    start.draw();
    score.draw();
};

// Update function advances the game elements
function update() {
    bird.update();
    fg.update(); // Foreground scrolling
    pipes.update(); // Pipes movement,  spawning, and collision detection
};

// Main animate loop: updates the state and redraws everything
function animate() {
    update();
    draw();
    frames++; // Increments for every frame
    requestAnimationFrame(animate); // Request next frame (creates a loop)
};

// Start the animation/ game loop
animate();