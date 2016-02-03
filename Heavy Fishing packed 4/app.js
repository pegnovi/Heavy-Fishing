
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
	, ejs = require('ejs')
	, MongoStore = require('connect-mongo')(express) //session datastore using mongodb
	, mongoose = require('mongoose')
	, Player; //Player class defined below


	
//connect to the "HeavyFishing" database
mongoose.connect('mongodb://localhost/HeavyFishing');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
//once the DB connection is open...
db.once('open', function callback() {
	//Create a mongoose Schema (document structure)
	var playerSchema = mongoose.Schema({
		username: String, 
		password: String, 
		loot: { loot1:Number, loot2:Number, loot3:Number, loot4:Number, loot5:Number },
		cash: Number, points: Number, lineLife: Number, rodLevel: Number, shipLevel: Number
	});
	
	//Convert playerSchema into an instantiable "model" Class
	Player = mongoose.model("Player", playerSchema);
});

	
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
	app.use(express.cookieParser());
  app.use(express.session({ 
		secret: 'heavy fishing'
		, store: new MongoStore({db: "sessions"})
	}));
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//gets the starting login page
app.get('/', function(req, res, next) {
	if( req.session.username ) {
		Player.find({username: req.session.username}, function(err, players) {
			var player = players[0];
			req.session.username = req.session.username;
			res.render('game', {title: 'Heavy Fishing', pp: player.points.toString(), pc: player.cash.toString(), pllf: player.lineLife.toString(), prl: player.rodLevel.toString(), psl: player.shipLevel.toString()});

		});
	}
	else {
		next();
	}
}, routes.index);

//gets the register page
app.get('/register', routes.register);

//called when the user submits their registration
app.post('/register', function(req, res) {
	Player.find({username: req.body.username}, function(err, players) {
		//check if player already exists
		if( players.length != 0 ) {
			res.redirect('/register?error=Player already exists!');
			return;
		}
		
		var newPlayer = new Player({
			username: req.body.username, 
			password: req.body.password, 
			loot: { loot1:0, loot2:0, loot3:0, loot4:0, loot5:0 },
			cash: 0, points: 0, lineLife: 100, rodLevel: 1, shipLevel: 0
		});
		
		newPlayer.save(function(err, newPlayer) {
			res.redirect('/?error=Registration successful!');
		});		
	});

});

//called when the user submits their login
//The session is created if the user with the correct password exists
//player data is loaded into the game page
app.post('/login', function(req, res) {
	Player.find({username: req.body.username, password: req.body.password}, function(err, players) {
		//check if player exists
		if( err || players.length == 0 ) {
			res.redirect('/?error=Invalid username or password!');
			return;
		}

		var player = players[0];
		
		req.session.username = req.body.username;
		//res.redirect('/game');
		console.log("IN RENDER GAME!!!");
		console.log(player.points.toString());
		console.log(player.cash.toString());
		console.log(player.lineLife.toString());
		console.log(player.rodLevel.toString());
		console.log(player.shipLevel.toString());
		res.render('game', {title: 'Heavy Fishing', pp: player.points.toString(), pc: player.cash.toString(), pllf: player.lineLife.toString(), prl: player.rodLevel.toString(), psl: player.shipLevel.toString()});

	});

});

//sorts the users based on their score and gets the leaderboard page
app.get('/leaderboard', function(req, res) {
	Player.find(function(err, players){
		players.sort(function(a, b){
			return b.points-a.points;
		});
		
		var board = "";
		
		for (var i=0; i < players.length; i++) {
			board += players[i].username;
			board += "\t";
			board += players[i].points;
			board += "\n";
		}
		console.log(board);
	
		res.render('leaderboard', {title: 'Heavy Fishing', lb: board});
	});
});

//destroys the session and redirects user to login page
app.post("/logout", function(req, res){
	req.session.destroy(function(err){
      if(err){
          console.log("Error: %s", err);
      }
      res.redirect("/");
  });	
});

//loads the player's info and sends the shop page
app.post('/shop' , function(req, res) {
	console.log(req.session.username);
	if( req.session.username ) {
		Player.find({username: req.session.username}, function(err, players) {
			var player = players[0];
			req.session.username = req.session.username;
			console.log(player.loot['loot1']);
			console.log(player.loot['loot2']);
			console.log(player.loot['loot3']);
			console.log(player.loot['loot4']);
			console.log(player.loot['loot5']);
			res.render('shop', {title: 'Heavy Fishing', 
													pp: player.points.toString(), pc: player.cash.toString(), 
													pllf: player.lineLife.toString(), prl: player.rodLevel.toString(), 
													psl: player.shipLevel.toString(),
													pl1: player.loot['loot1'].toString(), pl2: player.loot['loot2'].toString(), 
													pl3: player.loot['loot3'].toString(), pl4: player.loot['loot4'].toString(), 
													pl5: player.loot['loot5'].toString()
													});

		});
	}
});


//updates the database with the info sent from the AJAX POST function in clientToDatabase.js
//Doesn't reload the page. Just sends an OK message 200
app.post('/game/update', function(req, res) {
	console.log("pointsToAdd = " + req.body.pointsToAdd);
	console.log("cashToAdd = " + req.body.cashToAdd);
	
	Player.find({username: req.session.username}, function(err, players) {
		//check if player exists
		if( err || players.length == 0 ) {
			res.redirect('/?error=Invalid Player');
			return;
		}
		
		var player = players[0];
		
		// Points
		console.log("Current points = " + player.points);
		//player.points += req.body.pointsToAdd;
		var total = parseInt(player.points) + parseInt(req.body.pointsToAdd);
		console.log("Updated points = " + total);
		
		// Cash
		console.log("Current cash = " + player.cash);
		var totalCash = parseInt(player.cash) + parseInt(req.body.cashToAdd);
		console.log("Updated cash = " + totalCash);
		
		// Line Life
		var nLineLf = parseInt(req.body.newLineLife);
		console.log("RodLife = " + nLineLf);

		
		// Rod Level
		console.log("player.rodLevel = " + player.rodLevel);
		console.log("rodLevelToAdd = " + req.body.rodLevelToAdd);
		var nRodLvl = parseInt(player.rodLevel) + parseInt(req.body.rodLevelToAdd);
		console.log("curr rod level = " + player.rodLevel);
		console.log("updated rod level = " + nRodLvl);
		
		// Ship Level
		console.log("player.shipLevel = " + player.shipLevel);
		console.log("shipLevelToAdd = " + req.body.shipLevelToAdd);
		var nShipLvl = parseInt(player.shipLevel) + parseInt(req.body.shipLevelToAdd);
		console.log("curr ship level = " + player.shipLevel);
		console.log("updated ship level = " + nShipLvl);
		
		// Loot
		//
		var iTypeWon = parseInt(req.body.itemTypeWon);
		var iQtt = parseInt(req.body.itemQuantity);
		var indx;
		if( iTypeWon == 0 ) {
			iQtt = 0;
			indx = "loot1"
		}
		else {
			indx = "loot"+iTypeWon.toString();
			console.log("Loot type = " + indx);
			console.log("Loot " + player.loot[indx]);
		}
		console.log("Over here");
		
		
		var origQtt = parseInt(player.loot[indx]);
		console.log("origQtt = " + origQtt);
		
		console.log("final result = " + (origQtt + iQtt) );
		player.loot[indx] = origQtt + iQtt;
		console.log("final result = " + player.loot[indx]);
		//player.markModified(loot);
		//*/
		
		//One way to update the database
		Player.update({username: req.session.username}, {points: total, cash: totalCash, lineLife: nLineLf, rodLevel: nRodLvl, shipLevel: nShipLvl /*loot: player.loot, loot[indx]: (player.loot[indx]+iQtt)*/}, function(){});
		    
		//Another way to do it		
		player.modified = new Date();
		player.save(function(err) {
			if (err)
				console.log('error')
			else
				console.log('success')
		});
		
	});
	res.send(200);
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
