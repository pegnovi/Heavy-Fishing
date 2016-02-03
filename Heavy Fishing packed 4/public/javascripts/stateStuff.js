console.log("IN GAME NOW");
console.log(jQuery('#playerPoints').text());
console.log(jQuery('#playerCash').text());
console.log(jQuery('#playerLineLife').text());
console.log(jQuery('#playerRodLevel').text());
console.log(jQuery('#playerShipLevel').text());
var pPoints = parseInt(jQuery('#playerPoints').text());
var pCash = parseInt(jQuery('#playerCash').text());
var pLineLife = parseInt(jQuery('#playerLineLife').text());
var pRodLevel = parseInt(jQuery('#playerRodLevel').text());
var pShipLevel = parseInt(jQuery('#playerShipLevel').text());

jQuery('#playerPoints').hide();
jQuery('#playerCash').hide();
jQuery('#playerLineLife').hide();
jQuery('#playerRodLevel').hide();
jQuery('#playerShipLevel').hide();