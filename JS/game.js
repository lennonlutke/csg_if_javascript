
//Catch the bomb//

var gameSettings = [8,20,20,15,30];




class Player1 {
  constructor(el) {
    this.score = null;
    this.aantalVoorExtraLeven = el;
    this.breedte = 200;
    this.hoogte = 150;
    this.hoogteAirplane = airplane.height *  this.breedte / airplane.width;
    this.x = canvas.width / 2 - this.breedte / 2 ;
    this.y = canvas.height - this.hoogte - 10;
    this.snelheid = 23;
    this.niveau = null;
  }
  
  
  
  
  verwerkInvoer() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.snelheid;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.snelheid;
    }
    this.x=constrain(this.x,10,canvas.width - this.breedte - 10);
  }
  
  
  
  
  
  vang(bom) {
    if (bom.x > this.x && bom.x < this.x + this.breedte && bom.y > this.y && bom.y < this.y + bom.d) {
      bom.y = canvas.height + bom.d;
      this.niveau++;
      if (this.niveau % this.aantalVoorExtraLeven == 0) {
          this.score++;
      }
      bom.x = -1000; 
      bom.y = height / 2;
      bom.snelheid = 0;
    }
    if (bom.y > height) {
      this.score--;
      bom.x = -1000;
      bom.y = height / 2;
      bom.snelheid = 0;
    }
  }
  
 
 
 
 
 
 
  teken() {
    push();
    translate(this.x,this.y);
    fill(20,20,20);
    image(airplane,0,(this.hoogte - this.hoogteAirplane),this.breedte,this.hoogteAirplane);
    pop();
  }  
}




class Bom {
  constructor(b) {
    this.d = 80;
    this.bbom = bom.width *  this.d / bom.height;
    this.x = random(this.d,canvas.width - this.d);
    this.y = random(this.d,50);
    this.basisSnelheid = b;
    this.snelheid = (this.basisSnelheid + random(0,10)) / 10;
  }
  
  val() {
    this.y += this.snelheid;
  }
  
 
 
  teken() {
    push();
    fill(100,100,100,.25);
    image(bom,this.x - 2.4 * this.d / 2,this.y - this.d / 2,this.bbom,this.d);
    pop();
  }
}


class Catchbomb {
  constructor(settings) {
    this.settings = settings;
    this.player1 = new Player1(this.settings[0]);
    this.bommen = null;
    this.moeilijkheidsGraad = null;
    this.actief = false;
    this.af = null;
    this.highscore = 0;
    this.level = null;
  }



  nieuw() {
    this.actief = false;
    this.af = false;
    this.player1.score = 5;
    this.player1.niveau = 0;
    this.level = 1;
    this.bommenPerLevel = this.settings[1];
    this.moeilijkheidsGraad = this.settings[2];
    this.average = this.settings[3];
    this.pro = this.settings[4];
    this.bommen = [];
  }




  bombdrop() {
    if (frameCount % 149 == 0 || frameCount % 197 == 0 || frameCount % 229 == 0 || frameCount % 239 == 0 || frameCount % 269 == 0) {
      this.moeilijkheidsGraad++;
      this.bommen.push(new Bom(this.moeilijkheidsGraad));
      if (this.bommen.length % this.bommenPerLevel == 0) {
          this.level++;
      }
    }
  } 




  update() {
    if (this.actief && this.player1.score > 0) {
      this.bombdrop();
      for (var d = 0;d < this.bommen.length;d++) {
            this.bommen[d].val();
      }
      this.player1.verwerkInvoer();
      for (var d = 0;d < this.bommen.length;d++) {
          this.player1.vang(this.bommen[d]);
      }
      if (this.player1.niveau > this.highscore) {
          this.highscore = this.player1.niveau;
      }
    }
    if (this.player1.score <= 0) {
      this.af = true;
    }
  }    



  start() {
    push();
    fill(0, 139, 139,.5);
    rect(0,0,canvas.width,canvas.height);
    textAlign(CENTER,TOP);
    fill(0);
    text("Catch the bomb.\n\nProbeer zoveel mogelijk bommen te onderscheppen door op ze te schieten.\n\nGebruik de pijltjestoetsen voor de besturing (< voor links en > voor rechts). Klik om het spel te starten.",0,canvas.height / 4,canvas.width,canvas.height)
    pop();
  }

  
  
  end() {
    fill(0, 139, 139,.5);
    rect(0,0,canvas.width,canvas.height);      
    var tekst="jouw score: "+this.player1.niveau+" ( je highscore = "+this.highscore+")\n\nKlik op F5 voor een nieuw spel.";
    push();
    textAlign(CENTER,CENTER);
    fill(0);
    text(tekst,0,0,canvas.width,canvas.height);
    pop();
    this.levelplayer();
  }

 
 
  levelplayer() {
    var tekst = 'Je bent een noob!';
    var plaatje = noob;
    push();
    fill(140);
    stroke(20);
    strokeWeight(10);
    textSize(40);
    textAlign(CENTER,CENTER);
    if (this.player1.niveau >= this.settings[3]) {
        tekst = 'Lijkt er steeds meer op!';
        plaatje = average;
    }
    if (this.player1.niveau >= this.settings[4]) {
        tekst = 'Gast hoe ben je zo goed?';
        plaatje = pro;
    } 
    var hoogte = 100;
    var breedte = plaatje.width*hoogte/plaatje.height;
    image(plaatje,(canvas.width - breedte) / 2,100,breedte,hoogte);
    text(tekst,0,0,canvas.width,canvas.height * 2/ 3);
    pop();      
  }  

  
  
  scoreboard() {
    push();
    fill('black');
    textSize(30);
    text("level ",780,30);
    text(this.level,870,30);
    fill('red');
    image(heart,920,5,30,30);
    fill('black');
    text(this.player1.score,950,30);
    image(bom,670,0,80,35);
    text(this.player1.niveau,740,30);
    text("(highest:"+this.highscore+")",10,30);
    pop();
  }




  teken() {
    background('red');
    textFont("Monospace");
    textSize(20);
    push();
    fill('white');
    if (!this.actief) {
      this.start();
    }
    else {
      if (this.af) {
        this.end();
      }
      else {
        push();
        noStroke();
        fill('sienna');
        rect(0,canvas.height - 50,canvas.width,50);
        image(achtergrond,0,0,canvas.width,canvas.height);
        this.scoreboard();
        this.player1.teken();
        for (var d=0;d<this.bommen.length;d++) {
            this.bommen[d].teken();
        }
        pop();      
        }
      }
    }
}







function preload() {
  achtergrond = loadImage("images/backgrounds/achtergrond.png");
  bom = loadImage("images/backgrounds/bommetje.png");
  airplane = loadImage("images/backgrounds/airplane.png");
  noob = loadImage("images/backgrounds/soldier.png");
  average = loadImage("images/backgrounds/colonel.png");
  pro = loadImage("images/backgrounds/soldier2.png");  
  heart = loadImage("images/backgrounds/heart.png");
}





function setup() {
  canvas = createCanvas(1000,800);
  canvas.parent('processing');
  colorMode(RGB,255,255,255,1);
  frameRate(50);
  spel = new Catchbomb(gameSettings);
  spel.nieuw();
}




function draw() {
  spel.update();
  spel.teken();
}





function mousePressed() {
  if (!spel.actief) {
    spel.actief = true;
    spel.bommen = [];
  }
  else {
    if (spel.afgelopen) {
      spel.nieuw();
    }
  }
}

