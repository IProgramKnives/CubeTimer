var moves = ["R","R2","R'","L","L2","L'","U","U2","U'","D","D2","D'","F","F2","F'","B","B2","B'"]; 
var move = "";
var scramble = "";
var timerState = 0;
var ao5 = 0;
var ao5List = [];
var bestTime = 9999999999;
var worstTime = 0;
var movePos = 0;
var moveType = 0;
var sameMove = [0,0,0,0,0,0];
var tijdInduwStart = 0;
var huidigeTijd = 0;
var wachtTijd = 0;
var solveStart = 0;
var solveTijd = 0;
var solveList = [];

function setup(){
    createCanvas(1530, 750);
    frameRate(60);
}

function draw(){
    design();
    scrambler();
    timerStart();
    time();
}

function design(){
    fill(240);
    stroke(240);
    rect(0,0,1530,750);
    fill(0);
    stroke(0);
    textSize(30);
    textAlign(CENTER, CENTER);
    text(scramble, 0, 50, 1530, 100);

    textSize(60);
    switch(timerState){
        case 0:
        case 1:
        case 4:
            break;
        case 2:
            fill(200,0,0);
            stroke(130,0,0);
            break;
        case 3:
            fill(0,130,0);
            stroke(0,130,0);
            break;
    }
    textAlign(RIGHT, CENTER);
    text(Math.round(solveTijd/10) / 100,350,100,430,200);
    text("s",400,100,420,200);

    textAlign(LEFT, CENTER);

    fill(0);
    stroke(0);
    textSize(18);
    text("Last 12 solves",150, 240, 260, 280);
    text("Statistics",350, 240, 460, 280);

    textSize(15);
    if(solveList.length <= 12){
        for(i = 0; i < solveList.length; i++){
            text(solveList[i] + " s", 150, 250 + (i+1) * 10, 260, 280 + (i+1) * 10);
        }
    }
    else if(solveList.length > 12){
        for(i = 0; i < 12; i++){
            text(solveList[solveList.length - 12 + i] + " s", 150, 250 + (i+1) * 10, 260, 280 + (i+1) * 10);
        }
    }

    if(solveList.length <5){
        text("ao5: ...", 350, 260, 460, 290);
    }
    else{
        for(i = 0; i < 5; i++){
            ao5List[i] = solveList[solveList.length-1-i];
        }

        bestTime = 9999999999;
        worstTime = 0;

        for(i = 0; i < 5; i++){
            if(ao5List[i] < bestTime){
                bestTime = ao5List[i];
            }
        }
        
        for(i = 0; i < 5; i++){
            if(worstTime < ao5List[i]){
                worstTime = ao5List[i];
            }
        }
       ao5 = (ao5List[0] + ao5List[1] + ao5List[2] + ao5List[3] + ao5List[4] - bestTime - worstTime) / 3;
        text("ao5: " + Math.floor(ao5*1000)/1000 + " s", 350, 260, 460, 290);
    }

    if(solveList.length < 1){
        text("best: ...", 350, 270, 460, 300);
    }
    else{
        for(i = 0; i < solveList.length; i++){
            if(bestTime > solveList[i]){
                bestTime = solveList [i];
            }   
        }
        text("best: " + bestTime + " s", 350, 270, 460, 300);
    }

    if(solveList.length < 1){
        text("worst: ...", 350, 280, 460, 310);
    }
    else{
        for(i = 0; i < solveList.length; i++){
            if(worstTime < solveList[i]){
                worstTime = solveList [i];
            }   
        }
        text("worst: " + worstTime + " s", 350, 280, 460, 310);
    }
}


function scrambler(){
    if(timerState == 0){
        scramble = "";
        for(i = 0; i <= 19; i++){
            while(sameMove[movePos] != 0){
                movePos = Math.floor(Math.random() * 6);
                }

                for(j = 0; j < 6; j++){
                    if(movePos % 2 == 0){
                        if(j == movePos || j == movePos + 1){
                            if(j == movePos){
                                sameMove[j] = 1;
                            }
                        }
                         else{
                            sameMove[j] = 0;
                             }
                    }
                    if(movePos % 2 == 1){
                        if(j == movePos || j == movePos - 1){
                            if(j == movePos){
                                sameMove[j] = 1;
                            }
                        }
                         else{
                            sameMove[j] = 0;
                             }
                    }
                }
            
            moveType = Math.floor(Math.random() * 3);

            move = moves[3 * movePos + moveType];

            
            scramble += move + "   ";
        }
        timerState = 1;
    }
    
}

function timerStart(){
    if(timerState == 1 && keyIsDown(32) == 1){
        tijdInduwStart = millis();
        timerState = 2;
     }
    if(timerState == 2 && keyIsDown(32) == 1){
        huidigeTijd = millis()
        wachtTijd = huidigeTijd - tijdInduwStart;
        if(wachtTijd > 500){
            timerState = 3;
        }
    }
    else if(timerState == 1 || timerState == 2){
        timerState = 1;
    }
}

function time(){
    if(timerState == 3 && keyIsDown(32) == 0){
        solveStart = millis();
        timerState = 4;
    }
    if(timerState == 4 && keyIsDown(32) == 0){
        huidigeTijd = millis();
        solveTijd = huidigeTijd - solveStart;
    }
    if(timerState == 4 && keyIsPressed === true){
        solveList[solveList.length] = Math.round(solveTijd) / 1000;
        timerState = 0;
    }
}