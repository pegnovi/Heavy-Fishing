
G.gameStatus = 0; //3 == pause mode, 2 == win, 1 == in game match, 0 == in game no match, -1 == lose
G.prevGameStatus = G.gameStatus;

G.F.mainAI = function () {
	var i, target; 
	
	
	if( G.KB.keys.P.wasPressed ) {
		if( G.gameStatus != 3 ) {
			G.prevGameStatus = G.gameStatus;
			G.gameStatus = 3
			G.O.viewport.turnOff();
			G.O.pauseView.turnOn();
		}
		else {
			G.gameStatus = G.prevGameStatus;
			G.O.pauseView.turnOff();
			G.O.viewport.turnOn();
		}
	}
	

	
	//WIN or LOSE
	G.O.resultDisplay.AI();
	
	//PAUSE
	if( G.gameStatus == 3 ) {
		
	}
	//GAME
	else if( G.gameStatus == 0 || G.gameStatus == 1 ) {
		//Generate random speed creature if screen clicked 
		if( !G.O.creature.S.hooked ) {
			if( (G.gameStatus == 0) && G.M.isPressed && ((G.M.x >= G.O.viewport.x) && (G.M.x <= G.O.viewport.w)) && ((G.M.y >= G.O.viewport.y) && (G.M.y <= G.O.viewport.h))  ) {
				G.O.creature.S.hooked = true;
				G.O.creature.turnOn();
				G.prevGameStatus = G.gameStatus;
				G.gameStatus = 1;
				G.O.creature.speed = G.F.returnRandSpeed();
			}
		}
		
		// move ship 
		G.O.ship.AI();	
			
			
		if( G.O.creature.S.hooked ) {
			G.O.creature.AI();
		
			d = G.F.distance(G.O.ship.x, G.O.ship.y, G.O.creature.x, G.O.creature.y);
			if( d > 121 ) { // too far
				if( G.O.ship.lineLife-0.5 <= 0 ) { G.O.ship.lineLife = 0; }
				else { G.O.ship.lineLife -= (1)*(1/G.O.ship.S.rodLevel); }
			}
			else if( d < 59 ) { // too close
				if( G.O.creature.energy+0.1 >= 100 ) { G.O.creature.energy = 100; }
				else { G.O.creature.energy += 0.1; }
			}
			else if( d >= 60 && d <= 120 ) { // just right
				if( G.O.creature.energy-0.5 <= 0 ) { G.O.creature.energy = 0; }
				else { G.O.creature.energy -= (10/*0.5*/-(G.O.creature.speed*0.8))/2; }
			}
			else {
				if( G.O.creature.energy+0.1 >= 100 ) { G.O.creature.energy = 100; }
				else { G.O.creature.energy += 0.1; }
			}
			
			G.O.tensionBar.AI();
			G.O.pointer.AI(d);
			G.O.lineLifeBar.AI(G.O.ship.lineLife);
			G.O.energyBar.AI(G.O.creature.energy);
			G.F.checkWin(G.O.creature.energy, G.O.ship.lineLife);					
		}
		G.O.info.AI(G.O.ship.S.points);
		
	}
};

G.F.resultDisplayAI = function() {
	var t = this;
	
	if( t.S.displayed == false ) {
		if( G.gameStatus == 2 ) {
			t.turnOn();
			t.S.displayed = true;

			//var im = "'<img src=\"images/loot/loot"+num+".gif\" "+ "width=\"300\" height=\"200\"></img>'";

		}
		else if( G.gameStatus == -1 ) {
			t.turnOn();
			t.S.displayed = true;
		}
	}
	
	if( ((G.gameStatus == 2) || (G.gameStatus == -1) ) && G.M.isPressed && ((G.M.x >= G.O.viewport.x) && (G.M.x <= G.O.viewport.w)) && ((G.M.y >= G.O.viewport.y) && (G.M.y <= G.O.viewport.h)) ) {
		t.S.displayed = false;
		G.prevGameStatus = G.gameStatus;
		G.gameStatus = 0;
		G.M.isPressed = false;
		t.turnOff();
	}
 
	t.draw();
}

G.F.checkWin = function(energy, line) {
	tc = G.O.creature;
	ts = G.O.ship;
	
	var done = false;
	if( energy == 0 && line != 0 ) {
		console.log("Win");
		G.prevGameStatus = G.gameStatus;
		G.gameStatus = 2;
		ts.S.points += 5 * tc.speed;
		
		//
		var prize = 1;
		if( tc.speed <= 2 ) { prize = 1; console.log("true1");}
		else if( tc.speed <=4 ) { prize = 2; console.log("true2");}
		else if( tc.speed <=6 ) { prize = 3; console.log("true3");}
		else if( tc.speed <=8 ) { prize = 4; console.log("true4");}
		else if( tc.speed <= 10 ) { prize = 5; console.log("true5");}
		
		G.O.resultDisplay.setSrc("'<img src=\"images/loot/loot"+prize+".gif\" "+ "width=\"300\" height=\"200\"></img>'");
		updateDatabase('/game/update', (5*tc.speed), 0, ts.lineLife, 0, 0, prize, 1);

		done = true;
	}
	else if( energy != 0 && line == 0 ) {
		console.log("Lose");
		G.prevGameStatus = G.gameStatus;
		G.gameStatus = -1;
		ts.S.points -= (5*tc.speed);
		updateDatabase('/game/update', (-(5*tc.speed)), 0, ts.lineLife, 0, 0, 1, 0);
		G.O.resultDisplay.setSrc("'<img src=\"images/lose.png\" "+ "width=\"300\" height=\"200\"></img>'");
		
		done = true;
	}	
	
	if( done == true ) {
		tc.S.hooked = false;
		tc.energy = 100;
		tc.turnOff();
		ts.lineLife += 5;//ts.S.maxLineLife;
		return false
	}
}

 
G.F.shipAI = function () {
	var t=this; 

	var addedSpeed = t.S.shipLevel*0.2;
	//mine
	if( G.KB.keys.W.isPressed ) {
		t.prevFV = t.S.facingVertical;
		//G.O.ship.S.facingVertical = 1;
		//or
		t.setState({facingVertical:1});
		if( t.y-t.speed < 0 ){ t.setVar({y:0}); }
		else { t.setVar({y:t.y-(t.speed+addedSpeed)}); }
	}
	else if( G.KB.keys.S.isPressed ) {
		t.prevFV = t.S.facingVertical;
		t.setState({facingVertical:2});
		if( t.y+t.speed > G.O.viewport.h-t.h /*365*/ ) { t.setVar({y:G.O.viewport.h-t.h}); }
		else { t.setVar({y:t.y+(t.speed+addedSpeed)}); }
	}
	else {
		t.prevFV = t.S.facingVertical;
		t.setState({facingVertical:0});
	}

	if( G.KB.keys.A.isPressed ) {
		t.prevFH = t.S.facingHorizontal;
		t.setState({facingHorizontal:1});
		if( t.x-t.speed < 0 ) { t.setVar({x:0}); }
		else { t.setVar({x:t.x-(t.speed+addedSpeed)}); }
	}
	else if( G.KB.keys.D.isPressed ) {
		t.prevFH = t.S.facingHorizontal;
		t.setState({facingHorizontal:2});
		if( t.x+t.speed > G.O.viewport.w-t.w /*565*/ ) { t.setVar({x:G.O.viewport.w-t.w}); }
		else { t.setVar({x:t.x+(t.speed+addedSpeed)}); }
	}
	else {
		t.prevFH = t.S.facingHorizontal;
		t.setState({facingHorizontal:0});
	}
	
	if( (t.S.facingHorizontal == 0) && (t.S.facingVertical == 0) ) {
		if( (t.prevFH != t.S.facingHorizontal) || (t.prevFV != t.S.facingVertical) ) {
			var im = "'<img src=\"images/stationary/boat"+t.prevFH+t.prevFV+".gif\" "+ "width=\"50\" height=\"50\"></img>'";
			t.setVar({nextSrc:im});
		}
	}
	else {	
		if( (t.prevFH != t.S.facingHorizontal) || (t.prevFV != t.S.facingVertical) ) {
			var im = "'<img src=\"images/moving/boat"+t.S.facingHorizontal+t.S.facingVertical+".gif\" "+ "></img>'";	
			t.setSrc(im); 
			t.setVar({ty:-20, tw:50, th:75});

		}
	}
	
	t.draw(true);
	
	return t;
};

G.F.creatureAI = function () {
	var t = this;
	var s = G.O.ship;
	
	//If it's hooked, move around randomly
	if( t.S.hooked ) {
	
		t.prevFV = t.S.facingVertical;
		t.prevFH = t.S.facingHorizontal;
		
		if (t.S.facingHorizontal == 0 && t.S.facingVertical == 0)			
			t.setState({facingHorizontal:1,facingVertical:1});
		else {
			var randomH = Math.floor(Math.random()*30);
			var randomV = Math.floor(Math.random()*30);
			
			if( ((t.x == 0) || (t.x == G.O.viewport.w-t.w)) ) {
				if( G.F.randomNum(10) > 8 ) {
					if (t.S.facingHorizontal == 1) {
						t.setState({facingHorizontal:2});
					}
					else {
						t.setState({facingHorizontal:1});
					}
				}
			}
			else if ( randomH == 10 ){
				if (t.S.facingHorizontal == 1) {
					t.setState({facingHorizontal:2});
				}
				else {
					t.setState({facingHorizontal:1});
				}
			}
			
			if( ((t.y == 0) || (t.y == G.O.viewport.h-t.h)) ) {
				if( G.F.randomNum(10) > 8 ) {
					if (t.S.facingVertical == 1) {
						t.setState({facingVertical:2});
					}
					else {
						t.setState({facingVertical:1});
					}
				}
			}
			else if ( randomV == 10 ){
				if (t.S.facingVertical == 1) {
					t.setState({facingVertical:2});
				}
				else {
					t.setState({facingVertical:1});
				}
			}
		}
	}
	
	//Movement based on speed variable
	if( t.S.facingVertical == 1 ) {
		if( t.y-t.speed < 0 ){ t.setVar({y:0}); }
		else { t.setVar({y:t.y-(t.speed)}); }
	}
	else if( t.S.facingVertical == 2 ) {
		if( t.y+t.speed > G.O.viewport.h-t.h ) { t.setVar({y:G.O.viewport.h-t.h}); }
		else { t.setVar({y:t.y+(t.speed)}); }
	}
	if( t.S.facingHorizontal == 1 ) {
		if( t.x-t.speed < 0 ) { t.setVar({x:0}); }
		else { t.setVar({x:t.x-(t.speed)}); }
	} 
	else if( t.S.facingHorizontal == 2 ) {
		if( t.x+t.speed > G.O.viewport.w-t.w ) { t.setVar({x:G.O.viewport.w-t.w}); }
		else { t.setVar({x:t.x+(t.speed)}); }
	}
	
	if( (t.prevFH != t.S.facingHorizontal) || (t.prevFV != t.S.facingVertical) ) {
		var im = "'<img src=\"images/creature/creature"+t.S.facingHorizontal+t.S.facingVertical+".gif\" "+ "width=\"100\" height=\"100\"></img>'";
		t.setVar({nextSrc:im});
		t.setVar({ty:-20, tw:100, th:125});
	}
	
	t.draw();
	
	return t;
};

G.makeBlock('main', G.F.loadMain).loadBlock('main');