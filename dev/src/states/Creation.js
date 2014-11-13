GOD.StateConfiguration.prototype.Creation = function(){
	var self = this;
	var engine = self.engine;
	var hub = engine.hub;
	var game = self.game;
	var state = new GOD.States.Creation(this);

	engine.currentState = state;

	//create()
	

	return {

		preload : function () {},

		create : function(){
			//hub
			hub.init("creation");

			//objs
			var text = state.createText();
			var tween = state.createTween(text);

			state.createGod();
			
		},

		update : function(){
			state.animate();
		}
	}
}

/*
***************************************************************************************
*/

GOD.States.Creation = function(config){
	this.game = config.game;
	this.engine = config.engine;
	this.hub = config.hub;
	this.textIndex = -1;
	this.texts = ["Let There Be Light","Embody Form",this.getCreateText,"Rest"];
	this.currentText = this.texts[this.textIndex];
	this.currentTextElement;
	this.introFadeTime = 4000;
	this.clicked = false;
	this.nextStateIncrement = 0;
	this.god;
	this.godColor;
	this.godForm = 'circle';
	this.creationDone = false;
};

GOD.States.Creation.prototype.animate = function(){
	if(this.godColor){
		this.animateGod();
	}
}

GOD.States.Creation.prototype.animateGod = function(){
	this.god.clear();
	this.god.beginFill(this.godColor);

	var x = this.game.world.centerX;
	var y = this.game.world.centerY;

	switch(this.godForm){
		case 'circle':
			this.god.drawCircle(x/2,y/2,100);
			break;
		case 'triangle':
			this.god.drawTriangle([new Phaser.Point((x/2)-100,(y/2)+100),new Phaser.Point((x/2),(y/2)-100),new Phaser.Point((x/2)+100,(y/2)+100)])
			break;
		case 'square' : 
			this.god.drawRect((x/2)-100,(y/2)-100,200,200);
			break;
	}

	this.god.endFill();
}

GOD.States.Creation.prototype.createGod = function(){
	this.god = this.game.add.graphics(this.game.world.centerX/2,this.game.world.centerY/2);
}

GOD.States.Creation.prototype.createText = function(){
	var textStyle = {
		align : "center",
		fill : "#FFFFFF",
		font: "40px Arial"
	}

	var tConf = this.engine.gameElements.get("introText");
	var text = this.game.add.text(tConf.x,tConf.y,this.currentText,textStyle);

	text.anchor.x = 0.5;
	text.anchor.y = 0.5;

	text.setShadow(2,2,"rgba(0,0,0,.7)",5);
	this.currentTextElement = text;
	return text;
	

}

GOD.States.Creation.prototype.createTween = function(text){
	text.text = this.getNextText();
	var tween = this.game.add.tween(text);
	//return this.engine.behaviors.fadeOut(textTween,this.introFadeTime);

}

GOD.States.Creation.prototype.changeText = function(){
	this.currentTextElement.text = this.getNextText();
}

GOD.States.Creation.prototype.getNextText = function(){
	this.textIndex += 1;

	if(this.textIndex < this.texts.length){
		this.currentText = this.texts[this.textIndex];

		if(typeof this.currentText == 'function'){
			return this.currentText();
		}

		return this.currentText;
	}

	console.log("No More Texts. Creation State.")
}