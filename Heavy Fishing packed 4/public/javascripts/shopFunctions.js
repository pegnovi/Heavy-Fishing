
//Reloads the shop stats to display the right information on the page
var reloadShopStats = function() {
	jQuery('#shopStats').text("points = " + pPoints + "\n" +
														"cash = " + pCash + "\n" +
														"line life = " + pLineLife + "\n" +
														"rod level = " + pRodLevel + "\n" +
														"ship level = " + pShipLevel + "\n" +
														"loot 1 = " + loots[0] + "\t" +
														"loot 2 = " + loots[1] + "\t" +
														"loot 3 = " + loots[2] + "\t" +
														"loot 4 = " + loots[3] + "\t" +
														"loot 5 = " + loots[4] + "\n");

	var str = "images/shop/shopLoot";
	for( var i=1; i<6; i++ ) {
		if( loots[i-1] == 0 ) {
			jQuery("#l"+i.toString()).attr("src", (str + i + "None" + ".png"));
		}
		else {
			jQuery("#l"+i.toString()).attr("src", (str + i + ".png"));
		}
	}
	
	
}

//Signal handler for the repairButton
// repairs the rod's life regardless of how much cash you have. 
// (you can end up having debt)
jQuery('#repairButton').click( function() {
	var deduct = (pRodLevel*100)-(pRodLevel*pLineLife);
	if( deduct == 0 ) {
		alert("Line does not need repairs...");
	}
	else {
		updateDatabase('/game/update', 0, -deduct, 100, 0, 0, 0, 0);
		pCash -= deduct;
		pLineLife = 100;
		alert("Line Repaired!!!");
	}

	reloadShopStats();
	
});

//Signal handler for the rodUpgradeButton
// calls updateDatabase() with the right parameters if the player has enough cash
jQuery('#rodUpgradeButton').click( function() {
	//cost calculation
	var cashDeduct = 1000;
	if( cashDeduct <= pCash ) {
		pCash -= cashDeduct;
		updateDatabase('/game/update', 0, -cashDeduct, pLineLife, 1, 0, 0, 0);
		reloadShopStats();
		alert("ROD UPGRADED!!!");
	}
	else {
		alert("Not Enough Funds...");
	}
});


//Signal handler for the shipUpgradeButton
// calls updateDatabase() with the right parameters if the player has enough cash
jQuery('#shipUpgradeButton').click( function() {
	//cost calculation
	var cashDeduct = 1000;
	if( cashDeduct <= pCash ) {
		pCash -= cashDeduct;
		updateDatabase('/game/update', 0, -cashDeduct, pLineLife, 0, 1, 0, 0);
		reloadShopStats();
		alert("SHIP UPGRADED!!!");
	}
	else {
		alert("Not Enough Funds...");
	}
});

//Signal handler for the sellItemButton
// calls updateDatabase() with the right parameters if the player has enough loot to sell
jQuery('#sellItemButton').click( function() {
	//cost calculation
	
	var t = jQuery('#sellItemType').val();
	var q = jQuery('#sellItemQuantity').val();
	
	//check if the input fields contain numbers
	if( !isNaN(t) && !isNaN(q) ) {
		var type = parseInt(t);
		var quantity = parseInt(q);
		
		var cashAdd = 0;
		var itemDeduct = 0;
		//check if the type inputted exists
		if( type > 0 && type <= 5 ) { 
			//check if the quantity is enough for that valid type
			if( quantity <= loots[type-1] ) { 
				itemDeduct = quantity;
				loots[type-1] -= itemDeduct;
				pCash += ((type*10)*itemDeduct);
				updateDatabase('/game/update', 0, ((type*10)*itemDeduct), pLineLife, 0, 0, type, -itemDeduct);
				reloadShopStats();
				alert("SOLD!!!");
			}
			else {
				alert("Invalid Input...");
			}
		}
	}
	else {
		alert("Invalid Input...");
	}

});

reloadShopStats();