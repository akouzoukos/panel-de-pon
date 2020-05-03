function preload() {//Preload sounds
  soundFormats('mp3');
  swap = loadSound('assets/swap');
  drop = loadSound('assets/drop2');
  clears = loadSound('assets/clear');
  move = loadSound('assets/move');
  db = loadJSON('score.json');
}

function setup() {
  createCanvas(width, height);
  createList();
  masterVolume(0.5);

  loadTextures();

  swapping = new Swap();

  swapper = new Swapper(3, 4);

  newLine();
  for (let i = 0; i < 6; i++) {
    up();
    newLine();
  }
  
  for(let i = 0; i < 2; i++)
    counters[i] = 0;
  console.log(db.test[0]);
  db.test[0] = 1;
  console.log(db.test[0]);
}

function draw() {
  background(50);

  grid();//draw
  check();//check for clear
  swapper.show();//draw swapper
  gravity();//gravity

  endTest();//Tests and displays end screen
  
  timers();
  numbers();//Draw combo/clear numbers
  showScore();

  if (helpTimer > 0)
    showHelp();
}

function createList() {//Creates 2d Array for blocks
  for (let i = 0; i < y + 1; i++) {
    list[i] = new Array(x);
    for (let j = 0; j < x; j++) {
      list[i][j] = new Square();
    }
  }
}

function grid() { //Draw all grid
  let skip = 0;
  for (let i = 0; i < y + 1; i++) {
    for (let j = 0; j < x; j++) {
      let x = j * scl;
      let y = i * scl - lift;

      if (skip) {
        skip = 0;
        continue;
      }

      if (i === swapping.y && j === swapping.x && sCounter > 0) {//SWAP
        skip = 1;
        fill(colors[0].r, colors[0].g, colors[0].b);
        noStroke();
        rect(x+xoffset, y, 2 * scl, scl);
        if (list[i][j + 1].color != 0) // DRAW IF FULL
          blockTexture( x - (5 - sCounter) * scl / 4 + scl, y,i,j+1);
        if (list[i][j].color != 0)//DRAW IF FULL
          blockTexture( x + (5 - sCounter) * scl / 4, y,i,j);
        if (sCounter === 1) {
          let sx = swapping.x;
          let sy = swapping.y;
          
          for(let k = sy; k > 0; k--)
            for(let l = 0; l < 2; l++)
              list[k][sx+l].swapped = 1;     
          
          let temp = list[sy][sx];
          list[sy][sx] = list[sy][sx + 1];
          list[sy][sx + 1] = temp;

          for(let n = 0; n < 2; n++)
            if(list[sy+1][sx+n].color === 0)
              list[sy][sx+n].looney = maxLooney;
          stopTimer = maxLooney;
        }
        sCounter--;
      } else if (list[i][j].color === 0) {// DRAW IF EMPTY
        fill(colors[list[i][j].color].r, colors[list[i][j].color].g, colors[list[i][j].color].b);
        noStroke();
        rect(x+xoffset,y, scl, scl);
      } else { // DRAW IF FULL
        blockTexture(x,y,i,j);
        count(j,i);
      }
    }
  }
  fill(10, 150);
  noStroke();
  rect(0+xoffset, y * scl - lift, x * scl, lift);

  fill(50);
  noStroke();
  rect(0+xoffset, y * scl, x * scl, scl);

  fill(50);
  noStroke();
  rect(0+xoffset, -scl, x * scl, scl);
}

function up() {//Pushes all blocks up
  for (let i = 0; i < y; i++) {
    for (let j = 0; j < x; j++) {
      list[i][j].color = list[i + 1][j].color;
    }
  }
  swapping.y--;
}

function newLine() {//Sets colors for the next line of blocks
  for (let i = 0; i < x; i++) {
    let choice = random(choices);
    while ((i > 1 && list[y][i - 1].color === choice && list[y][i - 2].color === choice) || (list[y - 1][i].color === choice && list[y - 2][i].color === choice))
      choice = random(choices);
    list[y][i].color = choice;
  }
}

function check() {// Checks for blocks that should clear
  let sum = 0;
  let clear = 0;
  let combo = 0;
  let com1 = 0;
  for (let i = 0; i < y; i++) {
    for (let j = 0; j < x; j++) {
      if (i === 0 && list[i][j].color != 0)
        end = 1;
      if(i < 2){
        if(list[i][j].color != 0)
          danger[j] = 1;
        else
          danger[j] = 0;
      }

      if (list[i][j].color === 0)
        continue;

      for (let p = 0; p < 2; p++){//Switch between horizontal and vertical checking
        let cl = list[i][j].color;
        let counter = 0;
        let double = 0;
        let block,i1,i2;
        if(p){ i1 = j; i2 = x; } else { i1 = i; i2 = y;}

        for (let k = i1; k < i2; k++) {
          if(p) block = list[i][k]; else block = list[k][j];
          if (block.color === cl && block.land < 2 * landAnimation / 3 && block.dropping === 0 && block.looney === 0 && (block.cleared === 0 || block.cleared === clearSpeed)) {
            if (block.dir === 0)
              double++;
            if(block.combo === 1)
              com1 = 1;
            counter++;
          } else break;
        }
        if (counter > 2) {
          if(p) index = j; else index = i;
          for (let k = i1; k < counter + i1; k++) {            
            if(p)
              block = list[i][k];
            else
              block = list[k][j];
            block.cleared = clearSpeed;
            block.dir = 0;
          }
          clear = 1;
          sum += counter - double;
          if (counter > 3)
            sum -= counter - 1;
        }else
          com1 = 0;
        
        if(com1)
          combo = 1;
      }     
    }
  }

  for(let j = 0; j < x; j++){//Make blocks above cleared elligible for combos
    let com = 0;
    for(let i = y; i > 0; i--){
      if(list[i][j].cleared > 0){
        com = 1;
      }else{
        if(list[i][j].color === 0)
          break;
        if(com)
          list[i][j].combo = 1;
      }      
    }
  }

  if (clear) {
    clearing = 1;
    timer = clearSpeed + 1;
  }
  if (sum > 3)
    stop = 2*max/5;
  if (sum > 2){
    counters[0] = new Combo(width / 4, height / 2, sum,0);
    score += db.combo[sum-3];
    if (combo > 0){
      score += db.chain[combo-1];
      counters[1] = new Combo(width / 3-scl*3,height/2-3*scl/16,combo+chain,1);
      stop = max;
      chain++;
    }else
      chain = 0;
  }
}

function gravity() {//Find blocks that should be dropping
  let dropped = 0;
  for (let i = 1; i < y; i++) {
    for (let j = 0; j < x; j++) {
      if (list[i][j].color === 0 && list[i - 1][j].color != 0) {
        for (let l = i; l > 0; l--) {
          if(list[l - 1][j].cleared != 0)
            break;
          if (list[l][j].color != 0 && list[l][j].dropping === 0 && list[l][j].looney < 2){
            list[l][j].dropping = dropMax;
            land = 1;
          }

          if (list[l][j].dropping > dropSpeed)
            list[l][j].dropping -= dropSpeed;
          
          if (list[l][j].dropping === dropSpeed){
            list[l][j].dropping -= dropSpeed;
            let temp = list[l+1][j];
            list[l+1][j] = list[l][j];
            list[l][j] = temp;
            if(list[l+2][j].color != 0){
              if(l+3 < y){
                if(list[l+3][j].color != 0){
                  list[l+1][j].land = landAnimation;
                  dropped = 1; 
                }
              }else{
                list[l+1][j].land = landAnimation;
                dropped = 1;  
              }
            }
          }
        }        
      }
    }
  }
  if (dropped && dropSoundCD === 0){
    dropSoundCD = dSCDMax;
    drop.play();
  }
}

function blockTexture(x,y,i,j){//Drawing function of blocks

  let c = list[i][j].color;
  let land = list[i][j].land ;
  let cleared = list[i][j].cleared;
  let combo = list[i][j].combo;
  x += xoffset;
  
  if (cleared > 3 * clearSpeed / 7) {//DRAW BACKGROUND
    if (cleared % 2 === 0) {
      fill(255);
      noStroke();
      rect(x, y, scl, scl);
    } else {
      image(colors[c][0], x, y, scl, scl);
    }
  } else if (cleared > clearSpeed / 7) {
    fill(255);
    noStroke();
    rect(x, y, scl, scl);
  } else if (cleared > 0) {
    fill(colors[0].r);
    noStroke();
    rect(x, y, scl, scl);

    fill(255);
    noStroke();
    rect(x + ((clearSpeed / 7) - cleared) * scl / 16, y, scl - 2 * ((clearSpeed / 7) - cleared) * scl / 16, scl);
  } else
    image(colors[c][0], x, y, scl, scl);

  if (land > 2 * landAnimation / 3 || (danger[j] === 1 && dangerTimer > 2 * dangerTimerMax / 3))//DRAW SHAPE
    image(colors[c][1], x, y + scl / 2, scl, scl / 2);
  else if (land > landAnimation / 3 || (danger[j] === 1 && dangerTimer >  dangerTimerMax / 3))
    image(colors[c][1], x, y - 2 * scl / 17, scl, scl);
  else if (land > 0 || (danger[j] === 1 && dangerTimer > 0))
    image(colors[c][1], x, y - 1 * scl / 17, scl, scl);
  else if (cleared < clearSpeed / 7 && cleared > 0);
  else image(colors[c][1], x, y, scl, scl);
}

function count(cx,cy){//Per block timers

  if (list[cy][cx].land > 1)
    list[cy][cx].land--;

  if (list[cy][cx].land === 1){
    list[cy][cx].land--;
    list[cy][cx].swapped = 0;    
    list[cy][cx].combo = 0;
  }

  if (list[cy][cx].cleared > 1)
    list[cy][cx].cleared--;

  if (list[cy][cx].cleared === 1) {
    score+= 10;
    list[cy][cx].cleared = 0;
    list[cy][cx].color = 0;
    list[cy][cx].dir = -1;
  }

  if(list[cy][cx].looney > 0)
    list[cy][cx].looney--;
}

function timers(){
  if (clearing === 0 && stop === 0 && stopTimer === 0)//if not clearing or stopped count to up
    counter++;

  if (stop > 0 && clearing === 0)//decrease stop if not clearing
    stop--;

  if (counter === speed) {//Lifts after counter reaches Speed variable
    if (lift + 1 >= scl) {
      lift += 1 - scl;
      up();
      if (swapper.y != 0)
        swapper.y--;
      newLine();
    } else
      lift++;
    counter = 0;
  }

  if(dropSoundCD > 0)
    dropSoundCD--;

  if(stopTimer > 0)
    stopTimer--;


  if (clearing === 1 && timer > 0)
    timer--;

  if (timer === 0) {
    timer = clearSpeed;
    clearing = 0;
    clears.play();
  }

  if(dangerTimer > 0 && stop === 0)
    dangerTimer--;
  if(dangerTimer === 0)
    dangerTimer = dangerTimerMax;
}

function loadTextures(){
  colors[0] = new Colour(bg, bg, bg);

  colors[1] = new Array(2);
  colors[1][0] = loadImage('assets/red1.png');
  colors[1][1] = loadImage('assets/red2.png');

  colors[2] = new Array(2);
  colors[2][0] = loadImage('assets/green1.png');
  colors[2][1] = loadImage('assets/green2.png');

  colors[3] = new Array(2);
  colors[3][0] = loadImage('assets/blue1.png');
  colors[3][1] = loadImage('assets/blue2.png');

  colors[4] = new Array(2);
  colors[4][0] = loadImage('assets/yellow1.png');
  colors[4][1] = loadImage('assets/yellow2.png');

  colors[5] = new Array(2);
  colors[5][0] = loadImage('assets/purple1.png');
  colors[5][1] = loadImage('assets/purple2.png');

  cursorTexture = loadImage('assets/cursor.png');
}

function numbers(){//Draw combo/clear numbers
  for(let i = 0; i < 2; i++){
    if(counters[i] != 0){
      counters[i].show();
      if (counters[i].life > 0)
        counters[i].life--;
      if (counters[i].life === 0)
        counters[i] = 0;
    }
  }    
}

function endTest(){
  if (end) {//End Screen
    stroke(10);
    strokeWeight(7);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text('You Lost', width / 2, height / 2);
    stop = 1;
  }
}

function showScore(){
  noStroke();
  fill(255, 75);
  textAlign(CENTER, CENTER);
  textSize(scl);
  text(score,width/4, 2*scl);
}

function showHelp(){
  helpTimer--;
  strokeWeight(2);
  stroke(0);
  fill(255);
  textAlign(CENTER,CENTER);
  textSize(scl/2);
  text('Move with Arrow Keys\n Swap with C\nSkip up with X',width/4,(y-1)*scl);
}