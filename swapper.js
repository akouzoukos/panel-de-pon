class Swapper{
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
  
  show(){    
    let yd = this.y*scl-lift;
    if(this.y*scl-lift < 0)
      yd = 0;
    
    if(twitch > 0)
      twitch--;
    
    if(twitch === 0)
      twitch = mt;
    
    let offset = scl/32;

    let sx = this.x*scl + xoffset;
    let sy = yd; 

    if(twitch > mt/2){
      image(cursorTexture,sx,sy,scl,scl);
      image(cursorTexture,sx+scl,sy,scl,scl);
    }else{
      image(cursorTexture,sx-offset,sy-offset,scl+2*offset,scl+2*offset);
      image(cursorTexture,(sx+scl)-offset,sy-offset,scl+2*offset,scl+2*offset);  
    }
  }  
  
  swap(){
    for(let i = 0; i < 2; i++)
      if(list[this.y][this.x+i].land > 0 || list[this.y][this.x+i].dropping > 0 || list[this.y][this.x+i].cleared > clearSpeed/7 || sCounter > 0 || end === 1 || list[this.y][this.x+i].looney > 0)
        return;//if blocks are dropping cleared or swapping
    if(list[this.y][this.x].color === 0 && list[this.y][this.x+1].color === 0)
      return;//If both squares are empty don't swap
    sCounter = 4;//swapping animation
    swapping.set(this.x,this.y);//set block anchor for swappign
    swap.play();//Sound
  }
  
  move(dir){
    if(end)//End game freeze
      return;
    move.play();//Sound
    switch(dir){// Move swapper
      case 0:
        if(this.y > 0)
          this.y--;
        return;
      case 1:
        if(this.x < x-2)
          this.x++;
        return;
      case 2:
        if(this.y < y-1)
          this.y++;
        return;
      case 3:
        if(this.x > 0)
          this.x--;
        return;
    }
  }
}

function keyPressed(){
  if(keyIsDown(38)){
    swapper.move(0);
  }
  if(keyIsDown(39)){
    swapper.move(1);
  }
  if(keyIsDown(40)){
    swapper.move(2);
  }
  if(keyIsDown(37)){
    swapper.move(3);
  }
  if(keyIsDown(67)){//Swap
    swapper.swap();
  }
  if(keyIsDown(88)){//Skip up
    if (clearing === 0 && end === 0){
      up();
      newLine();
      score++;
    }
  }
}