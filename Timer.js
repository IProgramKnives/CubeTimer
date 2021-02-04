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
var instructions = [];
var turnAmount = 1;
var startco = [0,0];
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
     cubeSim(instructions);
     drawCube();
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
    if(timerState == 0 || timerState == 1 || timerState == 2 || timerState == 3){
    text(scramble, 0, 50, 1530, 100);
    }

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
    text((Math.round((solveTijd/1000)*100)/100).toFixed(2),350,100,430,200);
    text("s",400,100,420,200);

    textAlign(LEFT, CENTER);

    fill(250);
    stroke(0);
    rect(140,360,400,240);
    line(140, 390, 540, 390);

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
        for(i = 0; i < 20; i++){ 
            do {
                movePos = Math.floor(Math.random() * 6);
                }
                while(sameMove[movePos] != 0)

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
            
            instructions[i] = move; 
            
            scramble += move + "   ";
        }
        timerState = 1;
    }
    
}

function cubeSim(instr){
    wm = [[1,1,1],[1,1,1],[1,1,1]]; //wm = white matrix en nwm = new white matrix, 1 lijst is 1 rij en de elementen van de rij geven de kolommen aan
                                    //dus [1][2] geeft de 2de rij, 3de kolom aan
    gm = [[2,2,2],[2,2,2],[2,2,2]];
    bm = [[3,3,3],[3,3,3],[3,3,3]];
    rm = [[4,4,4],[4,4,4],[4,4,4]];
    om = [[5,5,5],[5,5,5],[5,5,5]];
    ym = [[6,6,6],[6,6,6],[6,6,6]];

    for(i = 0; i < 20; i++){  
        
        if(instr[i].length == 1){
            turnAmount = 1;
        }
        else if(instr[i][1] == "2"){
            turnAmount = 2;
        }
        else if(instr[i][1] == "'"){
            turnAmount = 3;
        }
            switch(instr[i][0]){
                case "R":
                    for(j = 0; j < turnAmount; j++){
                    //vlakken laten draaien zonder de kleurinfo te verwijderen zodat de draai "tegelijk" gebeurt voor alle kleuren
                    nwm = [[wm[0][0],wm[0][1],gm[0][2]],[wm[1][0],wm[1][1],gm[1][2]],[wm[2][0],wm[2][1],gm[2][2]]];
                    ngm = [[gm[0][0],gm[0][1],ym[2][0]],[gm[1][0],gm[1][1],ym[1][0]],[gm[2][0],gm[2][1],ym[0][0]]];
                    nbm = [[bm[0][0],bm[0][1],wm[0][2]],[bm[1][0],bm[1][1],wm[1][2]],[bm[2][0],bm[2][1],wm[2][2]]];
                    nym = [[bm[2][2],ym[0][1],ym[0][2]],[bm[1][2],ym[1][1],ym[1][2]],[bm[0][2],ym[2][1],ym[2][2]]];
                    nrm = [[rm[2][0],rm[1][0],rm[0][0]],[rm[2][1],rm[1][1],rm[0][1]],[rm[2][2],rm[1][2],rm[0][2]]];
                    
                    //kleuren overschrijven met hun nieuwe waardes
                    wm = nwm;
                    gm = ngm;
                    bm = nbm;
                    ym = nym;
                    rm = nrm;
                    }
                    break;
                case "L":
                    for(j = 0; j < turnAmount; j++){
                        nwm = [[bm[0][0],wm[0][1],wm[0][2]],[bm[1][0],wm[1][1],wm[1][2]],[bm[2][0],wm[2][1],wm[2][2]]];
                        nbm = [[ym[2][2],bm[0][1],bm[0][2]],[ym[1][2],bm[1][1],bm[1][2]],[ym[0][2],bm[2][1],bm[2][2]]];
                        ngm = [[wm[0][0],gm[0][1],gm[0][2]],[wm[1][0],gm[1][1],gm[1][2]],[wm[2][0],gm[2][1],gm[2][2]]];
                        nym = [[ym[0][0],ym[0][1],gm[2][0]],[ym[1][0],ym[1][1],gm[1][0]],[ym[2][0],ym[2][1],gm[0][0]]];
                        nom = [[om[2][0],om[1][0],om[0][0]],[om[2][1],om[1][1],om[0][1]],[om[2][2],om[1][2],om[0][2]]];
                        
                        wm = nwm;
                        gm = ngm;
                        bm = nbm;
                        ym = nym;
                        om = nom;
                        }
                        break;
                case "F":
                    for(j = 0; j < turnAmount; j++){
                        nwm = [[wm[0][0],wm[0][1],wm[0][2]],[wm[1][0],wm[1][1],wm[1][2]],[om[2][0],om[2][1],om[2][2]]];
                        nom = [[om[0][0],om[0][1],om[0][2]],[om[1][0],om[1][1],om[1][2]],[ym[2][0],ym[2][1],ym[2][2]]];
                        nrm = [[rm[0][0],rm[0][1],rm[0][2]],[rm[1][0],rm[1][1],rm[1][2]],[wm[2][0],wm[2][1],wm[2][2]]];
                        nym = [[ym[0][0],ym[0][1],ym[0][2]],[ym[1][0],ym[1][1],ym[1][2]],[rm[2][0],rm[2][1],rm[2][2]]];
                        ngm = [[gm[2][0],gm[1][0],gm[0][0]],[gm[2][1],gm[1][1],gm[0][1]],[gm[2][2],gm[1][2],gm[0][2]]];
                        
                        wm = nwm;
                        om = nom;
                        rm = nrm;
                        ym = nym;
                        gm = ngm;
                        }
                        break;
                case "B":
                    for(j = 0; j < turnAmount; j++){
                        nwm = [[rm[0][0],rm[0][1],rm[0][2]],[wm[1][0],wm[1][1],wm[1][2]],[wm[2][0],wm[2][1],wm[2][2]]];
                        nom = [[wm[0][0],wm[0][1],wm[0][2]],[om[1][0],om[1][1],om[1][2]],[om[2][0],om[2][1],om[2][2]]];
                        nrm = [[ym[0][0],ym[0][1],ym[0][2]],[rm[1][0],rm[1][1],rm[1][2]],[rm[2][0],rm[2][1],rm[2][2]]];
                        nym = [[om[0][0],om[0][1],om[0][2]],[ym[1][0],ym[1][1],ym[1][2]],[ym[2][0],ym[2][1],ym[2][2]]];
                        nbm = [[bm[2][0],bm[1][0],bm[0][0]],[bm[2][1],bm[1][1],bm[0][1]],[bm[2][2],bm[1][2],bm[0][2]]];
                        
                        wm = nwm;
                        om = nom;
                        rm = nrm;
                        ym = nym;
                        bm = nbm;
                        }
                        break;
                case "U":
                    for(j = 0; j < turnAmount; j++){
                        ngm = [[rm[2][0],rm[1][0],rm[0][0]],[gm[1][0],gm[1][1],gm[1][2]],[gm[2][0],gm[2][1],gm[2][2]]];
                        nom = [[om[0][0],om[0][1],gm[0][0]],[om[1][0],om[1][1],gm[0][1]],[om[2][0],om[2][1],gm[0][2]]];
                        nrm = [[bm[2][0],rm[0][1],rm[0][2]],[bm[2][1],rm[1][1],rm[1][2]],[bm[2][2],rm[2][1],rm[2][2]]];
                        nbm = [[bm[0][0],bm[0][1],bm[0][2]],[bm[1][0],bm[1][1],bm[1][2]],[om[2][2],om[1][2],om[0][2]]];
                        nwm = [[wm[2][0],wm[1][0],wm[0][0]],[wm[2][1],wm[1][1],wm[0][1]],[wm[2][2],wm[1][2],wm[0][2]]];
                        
                        wm = nwm;
                        om = nom;
                        rm = nrm;
                        bm = nbm;
                        gm = ngm;
                        }
                        break;
                case "D":
                    for(j = 0; j < turnAmount; j++){
                        nbm = [[rm[0][2],rm[1][2],rm[2][2]],[bm[1][0],bm[1][1],bm[1][2]],[bm[2][0],bm[2][1],bm[2][2]]];
                        nrm = [[rm[0][0],rm[0][1],gm[2][2]],[rm[1][0],rm[1][1],gm[2][1]],[rm[2][0],rm[2][1],gm[2][0]]];
                        nom = [[bm[0][2],om[0][1],om[0][2]],[bm[0][1],om[1][1],om[1][2]],[bm[0][0],om[2][1],om[2][2]]];
                        ngm = [[gm[0][0],gm[0][1],gm[0][2]],[gm[1][0],gm[1][1],gm[1][2]],[om[0][0],om[1][0],om[2][0]]];
                        nym = [[ym[2][0],ym[1][0],ym[0][0]],[ym[2][1],ym[1][1],ym[0][1]],[ym[2][2],ym[1][2],ym[0][2]]];
                        
                        ym = nym;
                        om = nom;
                        rm = nrm;
                        bm = nbm;
                        gm = ngm;
                        }
                        break;
            }
        
    }
}
function drawCube(){
    fill(0);
    stroke(0);
    rect(800,420,480,120);
    rect(1040,300,120,360);
    startco = [800,420];
    drawCubeFace(ym);
    startco[0] = 920;
    drawCubeFace(om);
    startco[0] = 1040;
    drawCubeFace(wm);
    startco[0] = 1160;
    drawCubeFace(rm);
    startco = [1040,540];
    drawCubeFace(gm);
    startco[1] = 300;
    drawCubeFace(bm);

   
    
}
function drawCubeFace(matrix){
    for(i = 0; i < 3; i++){
        for(j = 0; j < 3; j++){
            numToCol(matrix[i][j]);
            rect(startco[0]+(40)*j, startco[1]+(40)*i, 40, 40);
        }
    }
}

function numToCol(matrixEl){
    switch(matrixEl){
        case 1:
            fill(255);
            break;
        case 2:
            fill(0,150,0);
            break;
        case 3:
            fill(0,0,150);
            break;
        case 4:
            fill(150,0,0);
            break;
        case 5:
            fill(240,130,0);
            break;
        case 6:
            fill(255,255,60);
            break;
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