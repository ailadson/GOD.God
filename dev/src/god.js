GOD.God = function(engine){
	this.engine = engine;
	this.game = engine.game;
	this.image;
	this.color;
	this.shape = 'circle';
	this.radius = 100;
	this.faith = 0;
	this.faithCheck = 0;
	this.x;
	this.y;
}

GOD.God.prototype.init = function(){
}

GOD.God.prototype.draw = function(){
	this.image.clear();
	this.image.beginFill(this.color);

	var x = this.x;
	var y = this.y;

	switch(this.shape){
		case 'circle':
			this.image.drawCircle(x/2,y/2,100);
			break;
		case 'triangle':
			this.image.drawTriangle([new Phaser.Point((x/2)-100,(y/2)+100),new Phaser.Point((x/2),(y/2)-100),new Phaser.Point((x/2)+100,(y/2)+100)])
			break;
		case 'square' : 
			this.image.drawRect((x/2)-100,(y/2)-100,200,200);
			break;
	}

	this.image.endFill();
}