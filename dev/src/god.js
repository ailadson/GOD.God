GOD.God = function(engine){
	this.engine = engine;
	this.game = engine.game;

	this.image;
	this.color;
	this.shape = 'circle';
	this.width = 100;
	this.wTohRatio = 1;
	this.getheight = function(){
		return this.width * this.wTohRatio;
	}

	this.faith = 0;
	this.faithCheck = 0;
	this.x;
	this.y;

	this.starterType;

	this.tween = {};
}

GOD.God.prototype.init = function(){
}

GOD.God.prototype.create = function(down){
	this.image = this.game.add.graphics(this.game.world.centerX/2,this.game.world.centerY/2);
	this.x = this.game.world.centerX;
	this.y = down ? this.game.world.centerY : -this.game.world.centerY;
	this.image.alpha = down ? 1 : 0.2;

	this.createTweens();
}

GOD.God.prototype.createTweens = function(){
	this.tween.up = this.game.add.tween(this);
	this.tween.down = this.game.add.tween(this);

	this.tween.up.to({y : -this.game.world.centerY, alpha : 0.2},5000);
	this.tween.down.to({y : this.game.world.centerY, alpha : 1},5000);
}

GOD.God.prototype.draw = function(){
	this.image.clear();
	this.image.beginFill(this.color);

	var x = this.x;
	var y = this.y;
	var w = this.width;
	var h = this.getheight();

	switch(this.shape){
		case 'circle':
			this.image.drawCircle(x/2,y/2,w);
			break;
		case 'triangle':
			this.image.drawTriangle([new Phaser.Point((x/2)-w,(y/2)+h),new Phaser.Point((x/2),(y/2)-h),new Phaser.Point((x/2)+w,(y/2)+h)])
			break;
		case 'square' : 
			this.image.drawRect((x/2)-w,(y/2)-h,w*2,h*2);
			break;
	}

	this.image.endFill();
}