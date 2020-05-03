let scl = 17 * 3;//Scale of blocks, multiples of 17 since block textures are 17x17

let x = 6;
let y = 12;

let xoffset = scl * 6;

let width = scl * x + xoffset;
let height = scl * y;

var list = new Array(y + 1);//2D array that holds all blocks
var choices = new Array(1, 2, 3, 4, 5);//Color choice Array

let speed = 12;//Speed of lift
let lift = 0;//lift Variable, gets added to y to lift blocks

let colors = new Array(6);//Texture Array

let counter = 0;//Lift Counter
let clearing = 0;//Currently clearing
let stop = 0;//Stop lifting of grid

let landAnimation = 18;//Length of land animation
let clearSpeed = 84;//Length of clear animation

let timer = clearSpeed + 1;//Stop while clearing
let max = 300;

let swapping;//Swapping class, holds block to be swapped
let sCounter = 0;//Swapping animation

let mt = 48;
let twitch = mt;//Cursor twitch animation

let cursorTexture;

let bg = 40;//Background Color

let drop, move, swap, clear; //Sound variables

let end = 0;//Game end variable, 1 ends the game

let freeze = 0; //Stop all movement

let counters = new Array(2);//Combo/Clear counter Array

let danger = new Array(x);//Close to top animation Array, 1 indicates column is close to top
let dangerTimerMax = landAnimation;
let dangerTimer = dangerTimerMax;

let chain = 0;//Chain combo variable

let dropMax = 8;//Drop Granularity if drawn
let dropSpeed = 2;//Controls the speed at which blocks drop (dropSpeed/dropMax)

let maxLooney = 10;
let stopTimer = maxLooney;

let dSCDMax = 5;
let dropSoundCD = dSCDMax;//Drop sound cooldown so that it doesn't get spammed

let score = 0;

let frame;
