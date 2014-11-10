/*! GOD.God - v0.0.1 - 2014-11-09 */GOD = {};

GOD.Engine = function () {
	var self = this;

	this.counter = 0;
	this.width = window.innerWidth;
	this.height = window.innerHeight;

	this.game = new Phaser.Game(this.width,this.height,Phaser.AUTO,'game');
	this.player = new GOD.Player(this);
	this.behaviors = new GOD.Behaviors(this);
	this.stateManager = new GOD.StateManager(this);
	this.gameElements = new GOD.GameElementManager(this);
	this.hub = new GOD.Hub(this);

	this.init();
}

GOD.Engine.prototype.init = function(){
	this.stateManager.init();
}
GOD.Player = function (engine) {
	this.name = null;
}

GOD.Player.prototype.setName = function(name){
	this.name = name;
}
GOD.StateManager = function (engine) {

	this.engine = engine;
	this.game = engine.game;
	this.configurations = new GOD.StateConfiguration(engine);

}

GOD.StateManager.prototype.init = function(){
	this.game.state.add('Boot',this.get('Boot'));
	this.game.state.add('Preloader',this.get('Preloader'));
	this.game.state.add('Naming',this.get('Naming'));
	this.game.state.add('Creation',this.get('Creation'));
	// this.game.state.add('firstWord',this.get('firstWord'));
	// this.game.state.add('expansion',this.stateManager.get('expansion'));
	this.game.state.start('Boot');
}

GOD.StateManager.prototype.get = function(name){
	return this.configurations[name]();
}
GOD.StateConfiguration = function(engine){
	this.engine = engine;
	this.game = engine.game;
}

GOD.States = {};
GOD.StateConfiguration.prototype.Boot = function(){
	var self = this;
	var game = self.game;

	return {
		preload : function () {},

		create : function(){
			game.input.maxPointers = 1;
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			// game.scale.minWidth;
			// game.scale.minHeight;
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;
			game.scale.forceLandscape = true;
			game.scale.setScreenSize(true);

			game.input.addPointer();
			game.stage.backgroundColor = "#000000"

			game.state.start('Preloader');

		},

		update : function(){}
	}
}
GOD.StateConfiguration.prototype.Creation = function(){
	var self = this;
	var engine = self.engine;
	var hub = engine.hub;
	var game = self.game;
	var state = new GOD.States.Creation(this);

	//create()
	console.log(self)
	

	return {

		preload : function () {},

		create : function(){
			//hub
			hub.init("creationLight");

			//objs
			var text = state.createText();
			var tween = state.createTween(text);

			//tween.start();
			
		},

		update : function(){
			//state.animate();
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
	this.introFadeTime = 4000;
	this.clicked = false;
	this.nextStateIncrement = 0;
};

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
	return text;
	

}

GOD.States.Creation.prototype.createTween = function(text){
	text.text = this.getNextText();
	var tween = this.game.add.tween(text);
	//return this.engine.behaviors.fadeOut(textTween,this.introFadeTime);

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
GOD.StateConfiguration.prototype.Naming = function(){
	var self = this;
	var engine = self.engine;
	var game = self.game;
	var state = new GOD.States.Naming(this);

	//create()
	

	return {

		preload : function () {},

		create : function(){
			//objs
			var text = state.createIntroText();
			engine.gameElements.set({
				x: text.position.x,
				y: 25
			},"introText")
			//tweens
			var endTween = state.createEndTween(text);
			var tween = state.createIntroTween(text,endTween);

			tween.start();
		},

		update : function(){

		}
	}
}

/*
***************************************************************************************
*/

GOD.States.Naming = function(config){
	this.game = config.game;
	this.engine = config.engine;
	this.textIndex = 0;
	this.texts = ["NOW YOU ARE HERE","TELL ME"];
	this.currentText = this.texts[this.textIndex];
	this.introFadeOutTime = 3000;
	this.clicked = false;
	this.nextStateIncrement = 0;
};

GOD.States.Naming.prototype.nextText = function(text){
	this.textIndex+=1;
	this.currentText = this.texts[this.textIndex];
	text.text = this.currentText;
	text.alpha = 1;
}

GOD.States.Naming.prototype.createTextFeild = function(){
	var input = document.createElement('input');
	input.type = "text"; 
	input.placeholder = "GOD'S NAME";
	input.classList.add("naming");
	input.style.cssText = "position:absolute;"+"width:100%;"+"height:20px;"+
						"top:50%;"+"bottom:0;"+"left:0;"+"right:0;";+
						"margin:auto;";
	document.body.appendChild(input);
	return input;
}

GOD.States.Naming.prototype.createButton = function(field,endTwn){
	var self = this;
	var b = document.createElement('button');
	b.classList.add("naming")
	b.addEventListener("click",function(){self.startEndAnim(field,endTwn)});
	b.style.cssText = "position:absolute;"+"width:1em;"+"height:1em;"+
						"top:60%;"+"bottom:0;"+"left:50%;"+"right:0;";+
						"margin:auto;";
	document.body.appendChild(b);
}

GOD.States.Naming.prototype.createIntroText = function(){
	var textStyle = {
		align : "center",
		fill : "#FFFFFF",
		font: "40px Arial"
	}

	var text = this.game.add.text(this.game.world.centerX,this.game.world.centerY-50,this.currentText,textStyle);
	text.anchor.x = 0.5;
	text.anchor.y = 0.5;
	return text
}

GOD.States.Naming.prototype.createIntroTween = function(text,endTwn){
	var textTween = this.game.add.tween(text);
	var self = this;

	var funcConfig = {};
	funcConfig.func = function(){
		if(self.textIndex >= self.texts.length){ 
			return 
		}

		self.nextText(text);
		var field = self.createTextFeild();
		self.createButton(field,endTwn);
	}
	

	this.engine.behaviors.fadeOut(textTween,this.introFadeOutTime,funcConfig);

	return textTween;
}

GOD.States.Naming.prototype.createEndTween = function(text){
	var textTween = this.game.add.tween(text);
	var self = this;

	textTween.to({y: 25},500).to({ alpha : 0},1000,Phaser.Easing.Linear.None,false,300);

	textTween.onComplete.add(function(){ 
		self.nextState(self,text)
	},this);

	return textTween
}

GOD.States.Naming.prototype.startEndAnim = function(field,endTwn){
	var self = this;

	if(!field.value){
		alert("TELL ME GOD'S NAME")
		return
	}

	this.engine.player.setName(field.value);
	endTwn.start();
	$(".naming").fadeOut(1500, function(){
		self.nextState(self);
	});

}

GOD.States.Naming.prototype.nextState = function(_self,text){
	var self = _self || this;

	self.nextStateIncrement += 1;
	console.log(self.nextStateIncrement)
	if(self.nextStateIncrement == 3){
		this.game.state.start('Creation');
	}
}


GOD.StateConfiguration.prototype['Preloader'] = function(){
	var self = this;
	var game = self.game;

	return {
		preload : function () {},

		create : function(){
			game.state.start('Naming');
		},

		update : function(){}
	}
}
GOD.Behaviors = function (engine) {
	this.engine = engine;
	this.game = engine.game;
}

GOD.Behaviors.prototype.fadeOut = function(tween,duration,funcConfig) {
	var prop = { alpha: 0}
	tween.to(prop, duration);
	if(funcConfig){
		tween.onComplete.add(funcConfig.func,funcConfig.ctx,funcConfig.priority);
	}
};

GOD.Behaviors.prototype.fadeIn = function(tween,duration,funcConfig) {
	var prop = { alpha: 1000}
	tween.to(prop, duration);
	if(funcConfig){
		tween.onComplete.add(funcConfig.func,funcConfig.ctx,funcConfig.priority);
	}
};
GOD.GameElementManager = function(engine){
	this.elements = {};
}

GOD.GameElementManager.prototype.set = function(element,name){
	this.elements[name] = element;
}

GOD.GameElementManager.prototype.get = function(name){
	return this.elements[name];
}
GOD.Hub = function(engine){
	this.engine = engine;
	this.container = document.getElementById('hub');
	this.controllers = new GOD.ControllerManager(this);
}

GOD.Hub.prototype.init = function(name){
	//this.clearDom();
	this.controllers[name].setDom(this.container,this);
}

GOD.Hub.prototype.clearDom = function(){

}
GOD.ControllerManager = function(hub){
	this.hub = hub;
}

GOD.Controllers = {};
GOD.ControllerManager.prototype.creationLight = {
	setDom : function (div) {
		var b = document.createElement('button');
		b.classList.add("btn-light");
		div.appendChild(b);
	},
}

GOD.Controllers.creationLightController = function($scope){

}
GOD.ControllerManager.prototype.creationLight = {

	setDom : function (div,hub) {
		this.engine = hub.engine;
		this.createButton(div);
	},

	createButton : function(div){
		var self = this;
		var b = document.createElement('button');
		b.classList.add("btn-light");
		b.innerHTML = "LIGHT";
		b.addEventListener("click",function(){
			self.onBtnClick();
		});

		div.appendChild(b);
		return b;
	},

	onBtnClick : function(){
		this.engine.game.stage.backgroundColor = "#96fcff";
	}
}