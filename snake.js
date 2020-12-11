const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// box baten dimentsioak erakutsi 32x32 pixel
const box = 32;

// argazkiak kargatu, fondoa eta sagarra
const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

// audioak hasieratu
let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

// karratua(sugea deklaratu eta hasieratu)
let snake = [];

snake[0] = 
{
    x : 9 * box, //x ardatzean zein box-etan hasieratzen den
    y : 10 * box //y ardatzean zein box-etan hasieratzen den
};

// JANARIA
//Hasierako sagarra zer posiziotan marraztuko den kalkulatzen du Math.random-ek
let food = 
{
    x : Math.floor(Math.random()*17+1) * box, //Kasu honetan, 17box eta 1box-aren artean. X ARDATZEAN
    y : Math.floor(Math.random()*15+3) * box // Kasu honetan, 15box eta 3box-aren artean. Y ARDATZEAN
}

// score markagailua sortu, margotu eta 0ra hasieratu
let score = 0;

//sugearen kontrola
let d; // d aldagai globala deklaratu.

document.addEventListener("keydown",direction);

function direction(event)
{
    let key = event.keyCode;
    if( key == 37 && d != "RIGHT")
    {
        left.play();
        d = "LEFT";
    }
    else if(key == 38 && d != "DOWN")
    {
        d = "UP";
        up.play();
    }
    else if(key == 39 && d != "LEFT")
    {
        d = "RIGHT";
        right.play();
    }
    else if(key == 40 && d != "UP")
    {
        d = "DOWN";
        down.play();
    }
}

// sugearen kolisioak
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

// Canvasean margotzen dena agertuko da hemen
function draw()
{
    
    ctx.drawImage(ground,0,0); //Lurraren argazkia kordenadatan ipini
    
    for( let i = 0; i < snake.length ; i++)
    {
        ctx.fillStyle = ( i == 0 )? "green" : "green";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);//karratuaren barrukoa 
        
        ctx.strokeStyle = "black";//karratua kalkulatu
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }
    
    ctx.drawImage(foodImg, food.x, food.y); //Sagarra margotuko du food.x eta food.y kordenadatan, hauek bi funtziotan kalkulatzen dira.
    //hasieratzeko funtzioan eta sagar bat jaterakoan beste sagar berri bat jartzeko kalkulatzen duena.
    
    // Karratuaren x eta y ardatzetako kordenadak gordeko dira array-an.
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // noranzkoa zehaztu
    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;
    
    // JANARIA JAN 
    // karratuaren x eta y ardatzako posizioa eta janariarena berdina badira = puntu bat+ eta beste sagar berri baten posizioa kalkulatzen du.
    if(snakeX == food.x && snakeY == food.y)
    {
        score++; //scorea igo
        eat.play();
        food = 
        {
         x : Math.floor(Math.random()*17+1) * box, //Math.random-ek posizioa aleatorio bat kalkulatzen du ondorengo posiziotan. 17box eta 1box-aren artean. X ARDATZEAN
            y : Math.floor(Math.random()*15+3) * box //""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""" 15box eta 3box-aren artean. Y ARDATZEAN
        }
        // sugearen isatsa ez da kentzen
    }
    else
    {
        // sugearen azken pixela kendu
        snake.pop();
    }
    
    // gehitu buru berri bat, baina gorputza ez da handitzen
    let newHead = 
    {
        x : snakeX,
        y : snakeY
    }
    
    // galdu duzu
    
    if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead,snake))
    {
        clearInterval(interbaloa); //funtzio bat gelditzeko, kasu honetan gure funtzioaren interbaloa gelditu egiten du.
        ctx.fillStyle = "black"; //Game over-en kolorea
        ctx.font = "80px Changa one"; //letra mota eta tamaina
        ctx.fillText('GAME OVER!', 1.75*box, 10.7*box); //zer ipiniko duen eta zer posiziotan
        dead.play();
    }
    
    snake.unshift(newHead); //Array-ko hasieran balore berriak ipintzeko, hau da, newHeaden kalkulatutako kordenadak arrayko hasieran ipini.
    
    //score-ko puntuak zer koloretan, fuentetan eta posiziotan agertuko diren
    ctx.fillStyle = "white"; // kolorea
    ctx.font = "45px Changa one"; //zer letra mota eta tamaina
    ctx.fillText(score,2*box,1.6*box); // filltext = printf ==> score-a zer posiziotan margotuko duen adierazten du. 
}


// funtzioaren interbaloa (zenbat aldiz errefreskatzen da)
let interbaloa = setInterval(draw,100);
