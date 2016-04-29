function setImageVal() {
	var dataURL =  CA.canvas.toDataURL('image/png');
	//console.log(dataURL);
	$('#game_image').val(dataURL);
}

function showIPG() {
	$('.f-game').hide(300);
	$('.ip-game').show(300);
}

function showAllG() {
	$('.f-game').show(300);
	$('.ip-game').show(300);
}

function showCG() {
	$('.f-game').show(300);
	$('.ip-game').hide(300);		
}