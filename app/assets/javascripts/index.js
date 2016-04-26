function setImageVal() {
	var dataURL =  CA.canvas.toDataURL('image/png');
	//console.log(dataURL);
	$('#game_image').val(dataURL);
}