class CanvasActual {

	constructor() {

		this.canvasEl = $("<canvas class='shadows'></canvas>");
		this.canvas = this.canvasEl[0];
		this.ctx = this.canvas.getContext("2d");

		this.toolList = [new Pen(this), new Eraser(this), new Rectangle(this)];
		this.toolbar = new ToolBar(this);

		this.points = [];
		this.tempPoints = [];
		this.undonePoints = [];
		this.mouseDown = false;

		this.init();

	}

	init() {
		this.canvas.id = "canvas-main";
		this.canvas.width  = window.innerWidth/100 * 80;
		this.canvas.height = window.innerHeight/100 * 80;
		$('#canvas-wrap').append(this.canvas);
		//canvas.width  = 500;
		//canvas.height = 500;

		// Default ctx
		this.tempPoints.push({
			width: 5,
			color: "black"
		});

		var self = this;
		this.canvasEl.on("mousedown mousemove mouseup mouseleave", function(e) {
			self.handleMouse(e);
		});
	}

	midPointBetween(p1, p2) {
		return {
			x: p1.x + (p2.x - p1.x) / 2,
			y: p1.y + (p2.y - p1.y) / 2
		};
	}

	addPoint(x, y) {
		this.tempPoints.push({ x: x, y: y });
	}

	pushPoints() {
		this.points.push(this.tempPoints);
		this.tempPoints = [];
		this.tempPoints.push({
			width: this.ctx.lineWidth,
			color: this.ctx.strokeStyle
		});
	}

	undo() {
		if(this.points.length) {
			this.undonePoints.push(this.points.pop());
			this.drawSets();
		}else {
			console.log("Nothing to Undo");
		}
	}

	redo() {
		if(this.undonePoints.length) {
			this.points.push(this.undonePoints.pop());
			this.drawSets();
		}else {
			console.log("Nothing to Redo");
		}
	}

	clear() {
		this.points = [];
		this.undonePoints = [];
		this.drawSets();
	}

	setLineWidth(width) {
		//this.ctx.lineWidth = width;
		this.tempPoints[0].width = width;
	}

	setStrokeColor(color) {
		//this.ctx.strokeStyle = color;
		this.tempPoints[0].color = color;
	}

	drawSets() {
		//console.log(this.points);
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		for(var i=0; i<this.points.length; i++) {
			this.draw(this.points[i]);
		}
		if(this.tempPoints.length > 1) this.draw(this.tempPoints);
	}

	draw(pSet) {
		var attr = pSet.shift();
		var p1 = pSet[0];
		var p2 = pSet[1];

		//console.log(pSet);

		//console.log(attr);
		
		this.ctx.beginPath();
		this.ctx.lineWidth = attr.width;
		this.ctx.lineJoin = this.ctx.lineCap = 'round';
		this.ctx.strokeStyle = attr.color;
		this.ctx.moveTo(p1.x, p1.y);
		//console.log(this.ctx.lineWidth);
		
		for (var i = 1; i < pSet.length; i++) {
			// On the first run through, this draws a line between the first point and the midpoint
			// On the second run through, the start point is the previously calculated midpoint
			// The control is the second point in pSet
			// The end point is the midpoint between the second and third points in pSet
			var midPoint = this.midPointBetween(p1, p2);
			this.ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
			p1 = pSet[i];
			p2 = pSet[i+1];
		}
		// Once we run out of points, we draw a straight line to the final point in pSet.
		this.ctx.lineTo(p1.x, p1.y);
		this.ctx.stroke();
		this.ctx.closePath();
		pSet.unshift(attr);
	}

	handleMouse(e) {
		var x = e.pageX - this.canvasEl.offset().left;
		var y = e.pageY - this.canvasEl.offset().top;

		switch(e.type) {
			case "mousedown":
				this.mouseDown = true;
				this.addPoint(x, y); 
				break;
			case "mouseup":
				if(this.mouseDown) {
					this.addPoint(x, y);
					this.pushPoints();
					this.drawSets();
				}
				this.mouseDown = false;
				break;
			case "mouseleave":
				if(this.mouseDown) {
					this.addPoint(x, y);
					this.pushPoints();
					this.drawSets();
				}
				this.mouseDown = false;
				break;
			case "mousemove":
				if(this.mouseDown) {
					this.addPoint(x, y);
					this.drawSets();		
				}
				break;
		}
	}

}

class Tool {
	constructor(CA) {
		this.CA = CA;

		this.color;
		this.lineWidth;
	}

	toString() {
		return "Generic Tool";
	}
}

class Pen extends Tool {
	constructor(CA) {
		super(CA);
	}

	toString() {
		return "Pen";
	}
}

class Eraser extends Pen {
	constructor(CA) {
		super(CA);
		this.color = "white";
	}

	toString() {
		return "Eraser";
	}
}

class Rectangle extends Tool {
	constructor(CA) {
		super(CA);

	}

	toString() {
		return "Rectangle";
	}
}

class ToolBar {
	constructor(can) {
		this.CA = can;
		this.toolbar;

		this.currentTool;
		this.init();
		this.dragging = false;
		this.lastPos = [0,0];
		this.handleEvents();
	}

	init() {
		this.toolbar = $("<div class='toolbar draggable noselect shadows'></div>");

		// tool dropdown
		this.initToolDrop();
		// Background Color
		this.initBackgroundColor();
		// Line Color
		this.initLineColor();
		// Line Width
		this.initLineWidth();
		// Clear
		this.initClear();
		// UndoRedo
		this.initRedo();

		$('#canvas-wrap').append(this.toolbar);
		this.setTool();
	}
	initToolDrop() {
		var toolDrop = $('<select class="tools"></select>');
		for(var i=0; i<this.CA.toolList.length; i++) {
			var tool = $("<option value= "+i+">" + this.CA.toolList[i].toString() + "</option>");
			toolDrop.append(tool);
		}
		this.toolbar.append(toolDrop);
		var self = this;
		toolDrop.change(function(){self.setTool()});
	}
	initBackgroundColor() {
		var bgColor = $("<label>BG: <input id='bgColor' type='color'></label>");
		this.toolbar.append(bgColor);
	}
	initLineColor() {
		var lineColor = $("<label>Line: <input id='lineColor' type='color'></label>");
		this.toolbar.append(lineColor);
		var self = this;
		lineColor.change(function() { self.changeLineColor(); });
	}
	initLineWidth() {
		var lineWidth = $("<label>Line Width: <input id='lineWidth' min='1' max='500' value='5' type='number'></label>");
		this.toolbar.append(lineWidth);
		var self = this;
		lineWidth.change(function() { self.changeLineWidth(); });
	}
	initClear() {
		var clear = $("<button class='btn btn-destroy' onClick='CA.clear()'>Clear</button>");
		this.toolbar.append(clear);
	}
	initRedo() {
		var redo = $("<div class='btn-group'><button class='btn btn-submit' onClick='CA.undo()'>Undo</button><button class='btn btn-submit'onClick='CA.redo()'>Redo</button></div>");
		this.toolbar.append(redo);
	}

	setTool() {
		this.currentTool = this.CA.toolList[$('.tools').val()];
		console.log(this.currentTool);
	}
	changeLineColor() {
		this.CA.setStrokeColor($('#lineColor').val());
		console.log($('#lineColor').val());
	}
	changeLineWidth() {
		this.CA.setLineWidth($('#lineWidth').val());
		console.log($('#lineWidth').val());
	}

	moveToolBar(x, y) {
		var left = $('.toolbar').position().left;
		var top = $('.toolbar').position().top;
		$('.toolbar').css('left', x+left);
		$('.toolbar').css('top', y+top);
	}

	handleEvents() {
		var self = this;
		$(document).on("mousedown", ".draggable", function(e){
		  self.dragging = true;
		  self.lastPos[0] = e.clientX;
		  self.lastPos[1] = e.clientY;
		});

		$(document).on("mouseup", ".draggable", function(e){
			self.dragging = false;
		});

		$(document).on("mousemove", ".draggable", function(e) {
			if(self.dragging) {
				self.moveToolBar(e.clientX - self.lastPos[0], e.clientY - self.lastPos[1]);
				self.lastPos[0] = e.clientX;
				self.lastPos[1] = e.clientY;
			}
		});
	}

}

function setImageVal() {
	var dataURL =  CA.canvas.toDataURL('image/png');
	//console.log(dataURL);
	$('#game_image').val(dataURL);
}