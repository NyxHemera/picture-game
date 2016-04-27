class CanvasActual {

	constructor() {

		this.canvasEl = $("<canvas class='shadows'></canvas>");
		this.canvas = this.canvasEl[0];
		this.ctx = this.canvas.getContext("2d");

		this.toolList = [new Pen(this), new Eraser(this), new Rectangle(this), new Ellipse(this)];
		this.currentTool;
		this.toolbar;

		this.points = [];
		this.tempPoints = [];
		this.undonePoints = [];
		this.mouseDown = false;
		this.shifted = false;
		this.lastMove = {x: 0, y: 0};
		this.lastEvent = "";

		this.init();

	}

	init() {
		this.canvas.id = "canvas-main";
		this.canvas.width  = window.innerWidth/100 * 80;
		this.canvas.height = window.innerHeight/100 * 80;
		$('#canvas-wrap').append(this.canvas);

		// This places the Toolbar within the canvas-wrap element
		this.toolbar = new ToolBar(this);
		this.drawSets();

		var self = this;
		this.canvasEl.on("mousedown mousemove mouseup mouseleave", function(e) {
			self.handleMouse(e);
		});
		this.canvasEl.on("touchstart touchmove touchend", function(e) {
			self.handleTouch(e);
		});
		$(document).on("keydown keyup", function(e) { self.handleKeys(e); });
	}

	addPoint(x, y) {
		this.tempPoints.push({ x: x, y: y });
	}

	pushPoints() {
		this.points.push(this.tempPoints);
		this.tempPoints = [];
		this.currentTool.initPoints();
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
		this.tempPoints[0].width = width;
	}

	setStrokeColor(stroke) {
		this.tempPoints[0].stroke = stroke;
	}

	setFillStyle(fill) {
		this.tempPoints[0].fill = fill;
	}

	drawSets() {
		//console.log(this.points);
		this.ctx.fillStyle = "#FFFFFF";
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		for(var i=0; i<this.points.length; i++) {
			this.toolList[this.points[i][0].type].draw(this.points[i]);
		}

		if(this.tempPoints.length > 1) this.toolList[this.tempPoints[0].type].draw(this.tempPoints);

	}

	setTool(ct) {
		this.currentTool = ct;
		this.currentTool.initPoints();
		//this.tempPoints[0].type = this.currentTool.toNum();
	}

	handleTouch(e) {
		switch(e.type) {
			case "touchstart":
				var x = e.originalEvent.touches[0].pageX - this.canvasEl.offset().left;
				var y = e.originalEvent.touches[0].pageY - this.canvasEl.offset().top;
				this.lastMove.x = x;
				this.lastMove.y = y;

				// Prevent Mouse Events and prevent scrolling
				e.stopPropagation();
				e.preventDefault();
				this.mouseDown = true;
				this.currentTool.processPoints(x, y);
				break;
			case "touchend":
				if(this.mouseDown) {
					var x = this.lastMove.x;
					var y = this.lastMove.y;

					// Prevent Mouse Events and prevent scrolling
					e.stopPropagation();
					e.preventDefault();
					this.currentTool.processPoints(x, y);
					this.pushPoints();
					this.drawSets();
				}
				this.mouseDown = false;
				break;
			case "touchmove":
				if(this.mouseDown) {
					var x = e.originalEvent.touches[0].pageX - this.canvasEl.offset().left;
					var y = e.originalEvent.touches[0].pageY - this.canvasEl.offset().top;
					this.lastMove.x = x;
					this.lastMove.y = y;

					// Prevent Mouse Events and prevent scrolling
					e.stopPropagation();
					e.preventDefault();
					this.currentTool.processPoints(x, y);
					this.drawSets();		
				}
				break;
		}
	}

	handleMouse(e) {
		var x = e.pageX - this.canvasEl.offset().left;
		var y = e.pageY - this.canvasEl.offset().top;

		switch(e.type) {
			case "mousedown":
				console.log(e);
				this.mouseDown = true;
				this.currentTool.processPoints(x, y);
				break;
			case "mouseup":
				if(this.mouseDown) {
					this.currentTool.processPoints(x, y);
					this.pushPoints();
					this.drawSets();
				}
				this.mouseDown = false;
				break;
			case "mouseleave":
				if(this.mouseDown) {
					this.currentTool.processPoints(x, y);
					this.pushPoints();
					this.drawSets();
				}
				this.mouseDown = false;
				break;
			case "mousemove":
				if(this.mouseDown) {
					this.currentTool.processPoints(x, y);
					this.drawSets();		
				}
				break;
		}
	}

	handleKeys(e) {
		switch(e.type) {
			case 'keydown':
				switch(e.keyCode) {
					case 16:
						this.shifted = true;
						break;
				}
				break;
			case 'keyup':
				switch(e.keyCode) {
					case 16:
						this.shifted = false;
						break;
				}
				break;
		}
	}
}

class Tool {
	constructor(CA) {
		this.CA = CA;
		this.join = 'round';
		this.cap = 'round';
	}

	initPoints() {
		var ctx = this.CA.ctx;

		this.CA.tempPoints[0] = {
			width: $('#lineWidth').val(), // Assigns last width used
			stroke: $('#lineColor').val(), // Assigns last stroke used
			fill: $('#bgColor').val(), // Assigns last fill used
			join: this.join,
			cap: this.cap,
			type: this.toNum()
		};
	}

	processPoints(x, y) {
		this.CA.addPoint(x, y);
	}

	draw(pSet) {
		var attr = pSet.shift();
		var p1 = pSet[0];
		var p2 = pSet[1];
		var ctx = this.CA.ctx;
		
		ctx.beginPath();
		ctx.lineWidth = attr.width;
		ctx.lineJoin = attr.join
		ctx.lineCap = attr.cap;
		ctx.strokeStyle = attr.stroke;
		ctx.moveTo(p1.x, p1.y);
		
		for (var i = 1; i < pSet.length; i++) {
			// On the first run through, this draws a line between the first point and the midpoint
			// On the second run through, the start point is the previously calculated midpoint
			// The control is the second point in pSet
			// The end point is the midpoint between the second and third points in pSet
			var midPoint = this.midPointBetween(p1, p2);
			ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
			p1 = pSet[i];
			p2 = pSet[i+1];
		}
		// Once we run out of points, we draw a straight line to the final point in pSet.
		ctx.lineTo(p1.x, p1.y);
		ctx.stroke();
		ctx.closePath();
		pSet.unshift(attr);
	}

	midPointBetween(p1, p2) {
		return {
			x: p1.x + (p2.x - p1.x) / 2,
			y: p1.y + (p2.y - p1.y) / 2
		};
	}

	toString() {
		return "Generic Tool";
	}
	toNum() {
		return 0;
	}
}

class Pen extends Tool {
	constructor(CA) {
		super(CA);
	}

	toString() {
		return "Pen";
	}
	toNum() {
		return 0;
	}
}

class Eraser extends Pen {
	constructor(CA) {
		super(CA);
	}

	toString() {
		return "Eraser";
	}
	toNum() {
		return 1;
	}
}

class Rectangle extends Tool {
	constructor(CA) {
		super(CA);
		this.join = 'miter';
		this.cap = 'butt';
	}

	processPoints(x, y) {
		if(this.CA.tempPoints[1] == undefined) {
			this.CA.addPoint(x, y);
			return;
		}

		var width = x - this.CA.tempPoints[1].x;
		var height = y - this.CA.tempPoints[1].y;

		if(this.CA.shifted) {
			if(Math.abs(width) > Math.abs(height)) {
				// If both are positive or both are negative, else
				(height > 0 && width > 0) || (height < 0 && width < 0)  ? height = width : height = width*-1;
			}else {
				(height > 0 && width > 0) || (height < 0 && width < 0)  ? width = height : width = height*-1;
			}
		}
		console.log(width);
		this.CA.tempPoints[2] = { width: width, height: height };
		console.log(this.CA.tempPoints);
	}

	draw(pSet) {
		var attr = pSet.shift();
		var ctx = this.CA.ctx;
		ctx.beginPath();
		ctx.lineWidth = attr.width;
		ctx.lineJoin = attr.join;
		ctx.lineCap = attr.cap;
		ctx.strokeStyle = attr.stroke;
		ctx.fillStyle = attr.fill;
		ctx.moveTo(pSet[0].x, pSet[0].y);
		
		ctx.strokeRect(pSet[0].x, pSet[0].y, pSet[1].width, pSet[1].height);
		ctx.fillRect(pSet[0].x, pSet[0].y, pSet[1].width, pSet[1].height);

		ctx.closePath();
		pSet.unshift(attr);
	}

	toString() {
		return "Rectangle";
	}
	toNum() {
		return 2;
	}
}

class Ellipse extends Tool {
	constructor(CA) {
		super(CA);
		this.join = 'miter';
		this.cap = 'butt';
	}

	processPoints(x, y) {
		var tempPoints = this.CA.tempPoints;
		if(tempPoints[1] == undefined) {
			this.CA.addPoint(x, y);
			return;
		}

		tempPoints[2] = { x: x, y: y };

		tempPoints[0].center = this.midPointBetween(tempPoints[1], tempPoints[2]);
		tempPoints[0].radius = {x: Math.abs((tempPoints[1].x - tempPoints[2].x)/2), y: Math.abs((tempPoints[1].y - tempPoints[2].y)/2)};
		tempPoints[0].sAng = 0;
		tempPoints[0].eAng = 2*Math.PI;
		tempPoints[0].rotation = 0;
		tempPoints[0].circle = this.CA.shifted; 
	}

	draw(pSet) {
		var attr = pSet.shift();
		var ctx = this.CA.ctx;
		ctx.beginPath();
		ctx.lineWidth = attr.width;
		ctx.lineJoin = attr.join;
		ctx.lineCap = attr.cap;
		ctx.strokeStyle = attr.stroke;
		ctx.fillStyle = attr.fill;
		
		if(attr.circle) {
			var radMax = attr.radius.x > attr.radius.y ? attr.radius.x : attr.radius.y;
			ctx.arc(attr.center.x, attr.center.y, radMax, attr.sAng, attr.eAng);
		}else {
			ctx.ellipse(attr.center.x, attr.center.y, attr.radius.x, attr.radius.y, attr.rotation, attr.sAng, attr.eAng);
		}

		ctx.fill();
		ctx.stroke();

		ctx.closePath();
		pSet.unshift(attr);
	}

	toString() {
		return "Ellipse";
	}
	toNum() {
		return 3;
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
		// Create and set in toolbar
		var bgColor = $("<label id='bglabel'>BG: <input id='bgColor' type='color'></label>");
		this.toolbar.append(bgColor);

		// Handle Events
		var self = this;
		bgColor.change(function() { self.changeFillColor(); });
	}
	initLineColor() {
		// Create and set in toolbar
		var lineColor = $("<label>Line: <input id='lineColor' type='color'></label>");
		this.toolbar.append(lineColor);
		
		// Handle Events
		var self = this;
		lineColor.change(function() { self.changeLineColor(); });
	}
	initLineWidth() {
		// Create and set in toolbar
		var lineWidth = $("<label>Line Width: <input id='lineWidth' min='1' max='500' value='5' type='number'></label>");
		this.toolbar.append(lineWidth);
		
		// Handle Events
		var self = this;
		lineWidth.change(function() { self.changeLineWidth(); });
	}
	initClear() {
		// Create and set in toolbar
		var clear = $("<button class='btn btn-destroy' onClick='CA.clear()'>Clear</button>");
		this.toolbar.append(clear);
	}
	initRedo() {
		// Create and set in toolbar
		var redo = $("<div class='btn-group'><button class='btn btn-submit' onClick='CA.undo()'>Undo</button><button class='btn btn-submit'onClick='CA.redo()'>Redo</button></div>");
		this.toolbar.append(redo);
	}

	setTool() {
		var val = $('.tools').val();
		this.currentTool = this.CA.toolList[val];
		// Refresh values to defaults
		this.currentTool.initPoints();
		this.CA.setTool(this.currentTool);

		
		if(val == 1) {
			$('#lineWidth').val(25);
			$('#lineColor').val('#FFFFFF');
			this.changeLineColor();
			this.changeLineWidth();
		}

		// Remove bgColor if not shape
		if(val == 2 || val == 3) {
			$('#bglabel').css('display', 'initial');
		}else {
			$('#bglabel').css('display', 'none');
		}
	}
	changeLineColor() {
		this.CA.setStrokeColor($('#lineColor').val());
	}
	changeLineWidth() {
		this.CA.setLineWidth($('#lineWidth').val());
	}
	changeFillColor() {
		this.CA.setFillStyle($('#bgColor').val());
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
		$(document).on("touchstart", ".draggable", function(e){
		  self.dragging = true;
		  self.lastPos[0] = e.originalEvent.touches[0].clientX;
		  self.lastPos[1] = e.originalEvent.touches[0].clientY;
		});

		$(document).on("touchend", ".draggable", function(e){
			self.dragging = false;
		});

		$(document).on("touchmove", ".draggable", function(e) {
			// Prevent Mouse Events and prevent scrolling
			e.stopPropagation();
			e.preventDefault();
			if(self.dragging) {
				self.moveToolBar(e.originalEvent.touches[0].clientX - self.lastPos[0], e.originalEvent.touches[0].clientY - self.lastPos[1]);
			  self.lastPos[0] = e.originalEvent.touches[0].clientX;
			  self.lastPos[1] = e.originalEvent.touches[0].clientY;
			}
		});
	}
}