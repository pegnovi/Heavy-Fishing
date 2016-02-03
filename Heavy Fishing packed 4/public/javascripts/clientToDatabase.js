//AJAX POST to the server
var updateDatabase = function(route, ptsToAdd, cshToAdd, lLife, rLvl, sLvl, iType, qtt) {
		jQuery.ajax({
			type: "POST",
			url: route, 	
			dataType: 'json',
			data: {pointsToAdd: ptsToAdd, 
						 cashToAdd: cshToAdd,
						 newLineLife: lLife, 
						 rodLevelToAdd: rLvl,
						 shipLevelToAdd: sLvl,
						 itemTypeWon: iType, 
						 itemQuantity: qtt},
			succes: function() {
				console.log("Send Success");
			}
		});
		false;
}