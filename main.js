var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

var background_sound = new Audio('background_sound.mp3');
var jump_sound = new Audio('jump.mp3');
var end_sound = new Audio('end.mp3');


var img_background = new Image();
img_background.src = 'background1.png'
var back = {
    x:0,
    y:0,
    width:canvas.width,
    height:canvas.height,

    draw(){
        ctx.drawImage(img_background, this.x, this.y, this.width, this.height);
    }
}
back.draw();

var img_user=[]
var img_user1 = new Image();
img_user1.src = 'dino1.png';
var img_user2 = new Image();
img_user2.src = 'dino2.png';




img_user=[img_user1, img_user2];

var user = {
    x:10,
    y:400,
    width:200,
    height:200,
    img_index:0,

    draw(a){
        if(a%5==0){ // 5프레임마다 (0,1,2,3,4 이후 1씩 index 증가)
            this.img_index = (this.img_index+1)%2
        }
        if(user.y<350){ // user의 값이 설정한 y값보다 작아지면 점프 모양으로 고정
            ctx.drawImage(img_user[1], this.x, this.y, this.width, this.height);
        }
        else{
            ctx.drawImage(img_user[this.img_index], this.x, this.y, this.width, this.height);
        }
        //ctx.fillStyle = 'green';
        //ctx.fillRect(this.x,this.y,this.width,this.height);
        
    }
}

user.draw(0);

var img_bomb= new Image();
img_bomb.src  = 'dino3.png';

class Bomb{ // 장애물
    constructor(){
        this.x = 1500;
        this.y = 500;
        this.width = 50;
        this.height =50;
    }
    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(img_bomb, this.x, this.y, this.width, this.height);
    }
}

//var bomb = new Bomb();
//bomb.draw();

var timer = 0 // 프레임 측정
var bombs = [] // 장애물 리스트
var jumpingTimer = 0; // 60프레임을 세주는 변수
var obstacleInterval = 180;  // 초기 장애물 생성 간격
var animation;

function frameSecond(){
    //1초에 60번 코드 실행
    animation = requestAnimationFrame(frameSecond);
    timer++;
    //프레임 돌때마다 프레임에 있는 요소들 clear해주는 함수
    ctx.clearRect(0,0,canvas.width, canvas.height);
    //배경
    back.draw();
    //점수
    gameScore();

    //배경음악 재생
    background_sound.play();
    
    if(timer % (180 - Math.round(timer/18))== 0){//장애물이 나오는 속도
        var bomb = new Bomb();
        bombs.push(bomb);
    }

    bombs.forEach((b, i, o)=>{
        if(b.x < 0){
            //i가 가리키는 값에서부터 1개 삭제
            o.splice(i,1);
        }
        b.x-=(5+ Math.round(timer/150));

        //bomb 점수 추가
        
        collision(user,b);
        b.draw();
    })

    //user.x++;
    if(jumping == true){ 
        jumpingTimer++;
        jump_sound.play();
        if(down == true){
            user.y+=20;
            if(user.y >= 400){
                down = false;
                jumping = false;
                jumpingTimer = 0;
            }
        }
        user.y-=5;
    }
    
    //점프 1초후
    if(jumpingTimer > 40 && down == false){
        if(down == true){
            user.y+=20;
            if(user.y >= 400){
                down = false;
                jumping = false;
                jumpingTimer = 0;
            }
        }
        jumping = false;
        jumpingTimer = 0;
    }
    //jumping이 false이고 user.y가 250 미만이면 하강
    if(jumping == false && user.y < 400){
        if(down == true){
            user.y+=20;
            if(user.y >= 400){
                down = false;
                jumping = false;
                jumpingTimer = 0;
            }
        }
        user.y+=5;
    }

    user.draw(timer);
}

frameSecond();

//충돌 확인 코드
function collision(user, bomb){
    var x_diff = bomb.x - (user.x + user.width/(3/2));
    var y_diff = bomb.y - (user.y + user.height/(3/2));
    if(x_diff < 0 && y_diff < 0){
        //프레임이 돌때마다 프레임에 있는 요소들 clear해주는 함수
        //ctx.clearRect(0,0,canvas.width, canvas.height);
        cancelAnimationFrame(animation);

        ctx.fillStyle = 'red';
        ctx.font = '60px 맑은 고딕';

        ctx.fillText('GAME OVER', canvas.width/5, canvas.height/5);
        background_sound.pause();
        end_sound.play();
    }
}   

var jumping = false;
document.addEventListener('keydown', function(e){
    if(e.code == 'Space' && user.y > 350){
        jumping = true;
    }
})

var down = false;
document.addEventListener('keydown', function(e){
    if(e.code == 'ArrowDown' && user.y <= 350){
        down = true;
    }
})

function gameScore(){
    ctx.font = '20px 맑은 고딕';
    ctx.fillStyle = 'black';
    ctx.fillText('SCORE : ' + Math.round(timer/10), 10, 30);
}

