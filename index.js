let sprites = ['cherry', 'grape', 'melon', 'peach', 'pear', 'strawberry', 'watermelon'];

// p5party
let me;
let participants;
let shared;

let mySpriteName;
const spriteSize = 32;
let partySprites = {};

let canvasSize = 400;


function preload() {
    partyConnect("wss://p5-party-server-tt.herokuapp.com", "cursors", "main1");
    shared = partyLoadShared("shared");
    me = partyLoadMyShared();
    participants = partyLoadParticipantShareds();
}

function setup() {
    let p5canvas = createCanvas(canvasSize, canvasSize);
    p5canvas.parent('myCanvas');

    noStroke();

    if (partyIsHost()) {
        // if partyIsHost is true, this client is the first one in the room
        // console.log("Participants.length should be 1:", participants.length === 1);
        // console.log("me should equal participants[0]", me === participants[0]);
        me.x = random(0, canvasSize);
        me.y = random(0, canvasSize);
        mySpriteName = getRandomSpriteName();;
        me.sprite = mySpriteName;
    } else {
        // console.log("Participants.length should be > 1: ", participants.length > 1);
        // console.log(
        //     "participants[0].x should be defined",
        //     typeof participants[0].x !== "undefined"
        // );
        me.x = random(0, canvasSize);
        me.y = random(0, canvasSize);
        mySpriteName = getRandomSpriteName();
        me.sprite = mySpriteName;
    }
    // preload images
    for (const p of participants) {
        loadSpriteImage(p.sprite);
    }

    console.log("me", JSON.stringify(me));
    console.log("participants", JSON.stringify(participants));
}

function draw() {
    background("#d3ebff");
    imageMode(CENTER);

    for (const p of participants) {
        if (typeof p.x !== "undefined") {
            tint(255, 128);
            if(!partySprites[p.sprite]){
                loadSpriteImage(p.sprite);
            }else{
                image(partySprites[p.sprite], p.x, p.y, spriteSize, spriteSize);
            }
        }
    }
    document.getElementById('partyCount').innerHTML = `${participants.length} ${pluralize('people', participants.length)} at this party!`
    
    fill("#ffffff");
    // draw me!
    tint(255, 255);
    
    image(partySprites[me.sprite], me.x, me.y, spriteSize, spriteSize);

}

function keyPressed(){
    if(keyCode == LEFT_ARROW){
        me.x -= 5;
    }else if(keyCode == RIGHT_ARROW){
        me.x += 5;
    }else if(keyCode == UP_ARROW){
        me.y -= 5;
    }else if(keyCode == DOWN_ARROW){
        me.y +=5;
    }
}

function loadSpriteImage(imageName) {
    let imgPath = `sprites/${imageName}.png`;
    partySprites[imageName] = loadImage(imgPath);
}

function getRandomSpriteName() {
    return sprites[round(random(0, sprites.length - 1))];
}