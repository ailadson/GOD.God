GOD.StateConfiguration.prototype.Creation = function(){
	var self = this;
	var engine = self.engine;
	var hub = engine.hub;
	var game = self.game;
	var state = new GOD.States.Creation(this);

	//create()
	

	return {

		preload : function () {},

		create : function(){
			

			//objs
			var text = state.createText();
			//var tween = state.createTween(text);

			engine.god.create(true);

			//hub
			hub.start("creation",state);
			
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
	this.textIndex = 0;
	this.texts = ["Illuminate","Embody","Create","Rest"];
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
		shroom : 0,
	};

	this.restFadeTime = this.engine.devMode ? 50 : 1500;
	this.restMoveDownTime = this.engine.devMode ? 50 : 1000;
	this.godFadeTime = this.engine.devMode ? 50 : 2000;
	this.restTime = this.engine.devMode ? 5 : 3000;
	this.beingFadeTime = this.engine.devMode ? 50 : (this.restMoveDownTime + this.godFadeTime);
};

GOD.States.Creation.prototype.animate = function(){
	if(this.engine.god.color){
		this.animateGod();
	}

}

GOD.States.Creation.prototype.nextState = function(){
	//console.log(this.starterType);
	this.engine.god.starterType = this.starterType;
	this.game.state.start('WorldCine');
}

GOD.States.Creation.prototype.rest = function(){
	var self = this;

	//first change the text
	this.changeText();

	//then create the tween
	var restTween = this.game.add.tween(this.currentTextElement);
	var godTween = this.game.add.tween(this.engine.god.image);
	var beingTween = this.game.add.tween(this.being);

	restTween.to({ y : this.game.world.centerY },this.restTime);
	godTween.to({alpha : 0.8 }, this.restTime);
	beingTween.to({alpha : 0, y : this.game.height}, this.restTime);

	//attach tween events
	godTween.onComplete.add(function(){
		//restTween.start();
	});

	restTween.onComplete.add(function(){
		
	});

	beingTween.onComplete.add(function(){
		self.being.destroy();
		self.engine.gameElements.set({
				x: self.currentTextElement.position.x,
				y: self.currentTextElement.position.y
			},"mainText")

		self.nextState();
	});

	//start
	//godTween.start();
	beingTween.start();
	//restTween.start();

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
	being.animations.add("shroomWorship",["shroomWorship_1.png","shroomWorship_2.png","shroomWorship_3.png"],7,true);
	being.animations.add("sandWorship",["dirtWorship_1.png","dirtWorship_2.png","dirtWorship_3.png"],7,true);
	being.animations.play("shroomWorship");
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

		total += amount;
	}

	var high = 0;
	var val;

	for(tally in this.beingTally){
		var amount = this.beingTally[tally];

		if(amount > high){ // && amount/total > .3 
			high = amount;
			this.starterType = tally;
		}
	}

	if(this.starterType){
		this.being.animations.play(this.starterType+"Worship");
	} else {
		this.being.animations.play("defaultWorship");
	}
}

// GOD.States.Creation.prototype.createGod = function(god){
// 	god.image = this.game.add.graphics(this.game.world.centerX/2,this.game.world.centerY/2);
// 	god.x = this.game.world.centerX;
// 	god.y = this.game.world.centerY;
// }

GOD.States.Creation.prototype.createText = function(){
	var textStyle = {
		align : "center",
		fill : "#FFFFFF",
		font: "40px Arial"
	}

	var tConf = this.engine.gameElements.get("mainText");
	var text = this.game.add.text(tConf.x,tConf.y,this.currentText,textStyle);

	text.anchor.x = 0.5;
	text.anchor.y = 0.5;

	text.setShadow(1,1,"rgba(0,0,0,.7)",3);
	this.currentTextElement = text;
	return text;
}

GOD.States.Creation.prototype.createTween = function(text){
	var tween = this.game.add.tween(text);
}

GOD.States.Creation.prototype.changeText = function(){
	if(this.currentTextElement){
		this.currentTextElement.text = this.getNextText();
	} 
}

GOD.States.Creation.prototype.getNextText = function(){
	this.textIndex += 1;
	if(this.textIndex < this.texts.length){
		this.currentText = this.texts[this.textIndex];

		return this.currentText;
	}

	console.log("No More Texts. Creation State.")
}