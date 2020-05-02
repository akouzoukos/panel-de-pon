
class Colour {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

class Square {
  constructor() {
    this.color = 0;
    this.cleared = 0;
    this.land = 0;
    this.looney = 0;//Float in the air before dropping
    this.dropping = 0;
    this.dir = -1;
    this.swapped = 0;
    this.combo = 0;
  }
}

class Swap {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Combo {
  constructor(x, y, n,sel) {
    this.x = x;
    this.y = y;
    this.n = n+sel;
    this.sel = sel;
    this.life = clearSpeed;
  }

  show() {
    noStroke();
    fill(255, 75);
    textAlign(CENTER, CENTER);
    if(this.sel){
      textSize(2 * scl);
      text('x'+ this.n, this.x, this.y);
    }else{
      textSize(5 * scl);
      text(this.n, this.x, this.y);
    }
    
  }
}