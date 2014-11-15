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
	this.texts = ["Let There Be","Embody","Create","Rest"];
	this.currentText = this.texts[this.textIndex];
	this.currentTextElement;
	this.setUpBeingTime = (this.engine.devMode) ? 50 : 500;
	this.clicked = false;
	this.nextStateIncrement = 0;
	this.godColor;
	this.godForm = 'circle';
	this.formFinalized = false;
	this.being;
	this.beingTally = {
		leaf : 0,
		cloud : 0,
		sand : 0,
		water : 0,
	};

	this.restFadeTime = this.engine.devMode ? 50 : 1500;
	this.restMoveDownTime = this.engine.devMode ? 50 : 1000;
	this.godFadeTime = this.engine.devMode ? 50 : 2000;
	this.beingFadeTime = this.engine.devMode ? 50 : (this.restMoveDownTime + this.godFadeTime);
};

GOD.States.Creation.prototype.animate = function(){
	if(this.engine.god.color){
		this.animateGod();
	}
}

GOD.States.Creation.prototype.nextState = function(){
	console.log("hey");
}

GOD.States.Creation.prototype.rest = function(){
	var self = this;

	//first change the text
	this.changeText();

	//then create the tween
	var restTween = this.game.add.tween(this.currentTextElement);
	var godTween = this.game.add.tween(this.engine.god.image);
	var beingTween = this.game.add.tween(this.being);

	restTween.to({ y : this.game.world.centerY-50 },this.restMoveDownTime).to({alpha : 0},this.restFadeTime);
	godTween.to({alpha : 0 }, this.godFadeTime);
	beingTween.to({alpha : 0}, this.beingFadeTime);

	//attach tween events
	godTween.onComplete.add(function(){
		restTween.start();
	});

	restTween.onComplete.add(function(){
		self.nextState
	});

	//start
	godTween.start();
	beingTween.start();

}

GOD.States.Creation.prototype.animateGod = function(){
	this.engine.god.draw();
}

GOD.States.Creation.prototype.createBeing = function(){
	var being = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,"beings","defaultWorship_1.png");
	being.anchor.x = .25;
	//being.anchor.y = 0.5;

	being.animations.add("defaultWorship",["defaultWorship_1.png","defaultWorship_2.png","defaultWorship_3.png"],7,true);
	being.animations.add("leafWorship",["leafWorship_1.png","leafWorship_2.png","leafWorship_3.png"],7,true);
	being.animations.add("cloudWorship",["cloudWorship_1.png","cloudWorship_2.png","cloudWorship_3.png"],7,true);
	being.animations.add("waterWorship",["waterWorship_1.png","waterWorship_2.png","waterWorship_3.png"],7,true);
	being.animations.add("sandWorship",["dirtWorship_1.png","dirtWorship_2.png","dirtWorship_3.png"],7,true);
	being.animations.play("defaultWorship");
	this.being = being;
}


GOD.States.Creation.prototype.setUpBeings = function(){
	var self = this;
	var tween = this.game.add.tween(this.engine.god);

	tween.onComplete.add(self.createBeing,this);
	
	tween.to({ y : window.innerHeight/5},this.setUpBeingTime);

	tween.start();
}

GOD.States.Creation.prototype.addElementToBeing = function(name){
	this.beingTally[name] += 1;
	this.checkBeingType();
}

GOD.States.Creation.prototype.checkBeingType = function(){
	var total = 0;

	for(tally in this.beingTally){
		var amount = this.beingTally[tally];

		if(amount == 0 ){ return }

		total += amount;
	}

	var high = 0;
	var val;
	console.log(total);

	for(tally in this.beingTally){
		var amount = this.beingTally[tally];

		if(amount/total > .3 && amount > high){
			high = amount;
			val = tally;
		}
	}

	if(val){
		this.being.animations.play(val+"Worship");
	} else {
		this.being.animations.play("defaultWorship");
	}
}

GOD.States.Creation.prototype.createGod = function(){
	this.engine.god.image = this.game.add.graphics(this.game.world.centerX/2,this.game.world.centerY/2);
	this.engine.god.x = this.game.world.centerX;
	this.engine.god.y = this.game.world.centerY;
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