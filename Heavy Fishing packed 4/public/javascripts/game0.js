G.F.loadMain = function () { 
	
	console.log(this);
	console.log(typeof(this));

	this.AI = G.F.mainAI; 
	G.KB.addKeys('W','A','S','D','F','LEFT','RIGHT', 'P'); 
	
	G.M.deselectGob = true;
	
	
	G.setState(); 
	
	G.makeGob('pauseView', G)
		.setVar({x:50, y:50, w:600, h:400})
		//.setState({shopMode:false})
		.setStyle({backgroundColor:'Red'})
		.turnOff();	
	
	
	
	G.makeGob('viewport', G) 
		.setVar({x:50, y:50, w:600, h:400}) 
		//.setStyle({backgroundColor:'#000000'}) 
		.setVar({nextSrc:'<img src="images/seaAnim.gif" width="600" height="400"></img>'})
		.turnOn(); 
	
	G.makeGob('resultDisplay', G.O.viewport)
		.setVar({x:G.O.viewport.w/2-150, y:G.O.viewport.h/2-100, z:140, w:300, h:200, AI:G.F.resultDisplayAI})
		//.setStyle({backgroundColor:'#339999'})
		.setVar({nextSrc:'<img src="images/loot/loot5.gif" width="300" height="200"></img>'})
		.setState({displayed:false});
		//.setSrc();
	
	
	G.makeGob('ship', G.O.viewport/*, 'boat', $('#01')*/) 	
		.setVar({x:0, y:0, z: 120, w:50, h:50, speed:5, prevFH:0, prevFV:0, lineLife:pLineLife, AI:G.F.shipAI})
		.setState({facingVertical:0, facingHorizontal:0, rodLevel:pRodLevel, shipLevel:pShipLevel, maxLineLife:100, cash:pCash, points:pPoints})
		//.setStyle({backgroundColor:'#339999'}) 
		.setVar({nextSrc:'<img src="images/moving/boat20.gif" width="50" height="50"></img>'})
		.turnOn(); 

	
	G.makeGob('info',G.O.viewport) 
		.setVar({x:10/*495*/, y:370, z:130, w:200, h:20, AI:G.F.infoAI}) 
		.setSrc('Points: <strong>'+ G.O.ship.S.points + '</strong>') 
		.setStyle({color:'Yellow', backgroundColor:'#339999'}) 
		.turnOn();
	
	G.makeGob('tensionBar', G.O.viewport)
		.setVar({x:210, y:20, z:130, w:180, h:10, AI:G.F.tensionBarAI})
		//.setStyle({backgroundColor:'red'})
		.setVar({nextSrc:'<img src="images/tensionBar.png" width="180" height="20"></img>'})
		.turnOn();
	
	G.makeGob('pointer', G.O.viewport)
		.setVar({x:210, y:40, z:130, w:10, h:10, AI:G.F.pointerAI})
		.setStyle({backgroundColor:'yellow'})
		.turnOn();
	
	
	
	G.makeGob('lineLifeBar', G.O.viewport) 
		.setVar({x:550, y:150, z:130, w:20, h:G.O.ship.lineLife, AI:G.F.lineLifeBarAI})
		.setStyle({backgroundColor:'yellow'})
		.turnOn();
	
	G.makeGob('creature', G.O.viewport/*, 'creature', $('#01')*/) 
		.setVar({x:150, y:150, z: 100, w:100, h:100, prevFH:0, prevFV:0, speed:2, energy:100, AI:G.F.creatureAI})
		.setState({facingVertical:0, facingHorizontal:0, hooked:false})
		//.setStyle({backgroundColor:'#339999'}) 
		.setVar({nextSrc:'<img src="images/creature/creature20.gif" width="100" height="100"></img>'});
		//.turnOn(); 
		
	G.makeGob('energyBar', G.O.viewport)
		.setVar({x:10, y:150, z:130, w:20, h:100, AI:G.F.energyBarAI})
		.setStyle({backgroundColor:'blue'})
		.turnOn();
			
}; 

var Loot = function(t, c) {
	this.type = t;
	this.count = c;
}

G.F.infoAI = function(pts) {
	this.setSrc('Points: <strong>'+ pts + '</strong>');
	this.draw();
	return this;
}

G.F.tensionBarAI = function() {
	this.draw();
	return this;
}

G.F.pointerAI = function(dist) {
	var t = this;

	if( dist <= 0 ) {
	}
	else if( dist >= 180 ) {
	}
	else {
		t.setVar({x:210+dist});
	}
	
	t.draw();
	return t;
}


G.F.lineLifeBarAI = function(num) {
	var t = this;
	t.setVar({h:num});
	t.draw();
	return t;
}

G.F.energyBarAI = function(num) {
	var t = this;
	t.setVar({h:num});
	t.draw();
	return t;
}

G.F.distance = function(x1,y1,x2,y2) {
	x1 -= x2; y1 -= y2;
	return Math.sqrt((x1*x1)+(y1*y1));
}

G.F.randomNum = function(range) {
	var num = 0;
	while( num == 0 ) {
		num = Math.floor(Math.random()*range);
	}
	return num;
}

G.F.returnRandSpeed = function() {
	var rPass1 = 0;
	rPass1 = G.F.randomNum(10);
	
	var sp = 0;
	if( rPass1 >= 7 ) {
		while( sp == 0 ) {
			sp = G.F.randomNum(10);;
		}
	}
	else {
		while( sp == 0 ) {
			sp = G.F.randomNum(5);;
		}
	}
	return sp;
}