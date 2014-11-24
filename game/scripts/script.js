/*! GOD.God - v0.0.1 - 2014-11-23 */GOD = {};

GOD.Engine = function () {
	var self = this;

	this.counter = 0;
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.types = ['cloud','sand','shroom','leaf']

	this.game = new Phaser.Game(960,640,Phaser.AUTO,'game');
	this.player = new GOD.Player(this);
	this.behaviors = new GOD.Behaviors(this);
	this.stateManager = new GOD.StateManager(this);
	this.gameElements = new GOD.GameElementManager(this);
	this.hub = new GOD.Hub(this);
	this.god = new GOD.God(this);
	this.world = new GOD.World(this);

	this.devMode = false;

	this.init();
}

GOD.Engine.prototype.init = function(){
	this.stateManager.init();
	this.god.init();
	this.world.init();
}

GOD.Engine.prototype.getCurrentState = function(){
	if(!this.currentState){
		console.log("Engine.getCurrentState() || no currentState")
	}
	return this.currentState;
}
GOD.World = function (engine) {
	this.engine = engine;
	this.game = engine.game;
	this.territories = {};
	//this.currentBeings = this.game.add.group();
	
	this.currentTerritory;
	this.map;
	this.layers;
	this.tweens = {
		base : {},
		water : {},
		collisions : {}
	};
}

GOD.World.prototype.init = function(firstType){
	var t = this.engine.types;

	for (var i = 0; i < t.length; i++) {
		var type = t[i];
		var first = (type == firstType);
		this.territories[type] = new GOD.Territory(this,type,first);
	};
}

GOD.World.prototype.createTerritory = function(type){
	if(this.currentTerritory){
		this.clearTerritory();
	}

	this.currentTerritory = this.territories[type];
	this.createMap();
	this.createTweens();
	//this.createBeings();
}

GOD.World.prototype.createMap = function(){
	this.map = this.currentTerritory.createMap();

	this.layers = this.currentTerritory.createLayers(this.map);

	this.map.setCollisionBetween(1,100,true,this.layers.water);
	this.map.setCollisionBetween(1,100,true,this.layers.collisions);

	this.layers.base.resizeWorld();

	//set inital position
	for(sheet in this.layers){
		this.layers[sheet].fixedToCamera = false;
		this.layers[sheet].position.y = this.game.height;
	}
}

GOD.World.prototype.tweenStart = function(name){
	for(layer in this.tweens){
		this.tweens[layer][name].start();
	}
}

GOD.World.prototype.createTweens = function(){
	for(i in this.layers){
		var layer = this.layers[i];
		this.tweens[i].up = this.game.add.tween(layer.position);
		this.tweens[i].down = this.game.add.tween(layer.position);
		this.tweens[i].out = this.game.add.tween(layer.position);

		this.tweens[i].up.to({ y : 0},5000);
		this.tweens[i].down.to({ y : (this.game.height - (this.game.height/10))},5000);
		this.tweens[i].out.to({ y : this.game.height},5000);
	}
}

GOD.World.prototype.createBeings = function(){
	// var population = this.currentTerritory.population;
	// var scale = this.currentTerritory.scale;
	// var type = this.currentTerritory.type;

	// for (var i = 0; i < population; i++) {
	// 	this.currentBeings.create(/**TO DO. x n y positions**/,"beings",type+"Worship_1.png");
	// };
}

GOD.World.prototype.clearTerritory = function(){
	this.currentBeings.removeAll(true);
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
	this.game.state.add('WorldCine',this.get('WorldCine'));
	//this.game.state.add('FirstWord',this.get('FirstWord'));
	// this.game.state.add('expansion',this.stateManager.get('expansion'));
	this.game.state.start('Boot');
}

GOD.StateManager.prototype.get = function(name){
	return this.configurations[name]();
}
GOD.StateConfiguration = function(engine){
	this.engine = engine;
	this.game = engine.game;
	this.hub = engine.hub;
}

GOD.States = {};
GOD.StateConfiguration.prototype.Boot = function(){
	var self = this;
	var game = self.game;

	return {
		preload : function () {

		},

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

			self.engine.hub.init();
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
			},"mainText")

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
	this.introFadeOutTime = this.engine.devMode ?  100 : 3000;
	this.endTweenUpTime = this.engine.devMode ? 100 : 500;
	this.endTweenFadeTime = this.engine.devMode ? 100 : 1000;
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
	b.classList.add('btn-createSubmit')
	document.getElementById('hub').appendChild(b);
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

	textTween.to({y: 25},this.endTweenUpTime).to({ alpha : 0},this.endTweenFadeTime,Phaser.Easing.Linear.None,false,300);

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
	$(".naming").fadeOut(this.endTweenUpTime + this.endTweenFadeTime, function(){
		self.nextState(self);
	});

}

GOD.States.Naming.prototype.nextState = function(_self,text){
	var self = _self || this;

	self.nextStateIncrement += 1;

	if(self.nextStateIncrement == 3){
		this.game.state.start('Creation');
	}
}


GOD.StateConfiguration.prototype['Preloader'] = function(){
	var self = this;
	var game = self.game;

	return {
		preload : function () {
			game.load.atlasJSONArray("beings","assets/beings.png","assets/beings.json");
			game.load.tilemap("tileMapx2","assets/tileMapx2.json",null,Phaser.Tilemap.TILED_JSON);
			//game.load.tilemap("mapx1","assets/tiles_1x.png",null,Phaser.Tilemap.TILED_JSON);
			//game.load.tilemap("mapx0.5","assets/tiles_0.5x.png",null,Phaser.Tilemap.TILED_JSON);
			game.load.image("tileSetx2","assets/tiles_2x.png");
		},

		create : function(){
			game.state.start('Naming');
		},

		update : function(){}
	}
}
GOD.StateConfiguration.prototype.WorldCine = function(){
	var self = this;
	var engine = self.engine;
	var world = engine.world;
	var god = engine.god;
	var hub = engine.hub;
	var game = self.game;
	var state = new GOD.States.WorldCine(this);

	return {
		preload : function(){
			//engine.currentState = state;

		},

		create : function(){
			god.create(true);		
			world.createTerritory(god.starterType);
			world.tweenStart('up');
			god.tween.up.start();
			

		},

		update : function(){
			state.animate();
		}
	}
}

/******************************************************************************************/


GOD.States.WorldCine = function(config){
	this.engine = config.engine;
	this.game = config.game;
	this.hub = config.hub;
}

GOD.States.WorldCine.prototype.animate = function(){
	this.engine.god.draw();
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
	this.game = engine.game;
	this.container = document.getElementById('hub');
	this.controller = new GOD.ControllerManager(this);
	this.word = new GOD.WordManager(this);
	this.power = new GOD.PowerManager(this);
	this.currentController;
}

GOD.Hub.prototype.init = function(){
	this.setUpStyle();
}

GOD.Hub.prototype.start = function(name,state){
	this.engine.currentState = state;
	this.clearDom();
	
	this.controller[name].setDom(this.container,this);

	this.currentController = name;
}

GOD.Hub.prototype.setUpStyle = function(){
	var nodes = document.getElementsByTagName("canvas");
	this.container.style.cssText = nodes[0].style.cssText;
}

GOD.Hub.prototype.clearDom = function(){
	while(this.container.firstChild){
		this.container.removeChild(this.container.firstChild);
	}
}

GOD.Hub.prototype.call = function(name){
	if(this.controller[name]){
		if(typeof this.controller[name] == "function"){
			return this.controller[this.currentController][name]();
		} else {
			console.log("HUB.js || Returning value, not a function from .call(funcString) method: " + funcString);
			return this.controller[this.currentController][name];
		}
	}
	console.log("HUB.call() || Nothing called "+name+" in "+this.currentController);
}

GOD.Hub.prototype.get = function(name){
	if(this.controller[name]){
		return this.controller[name];
	}
	console.log("HUB.get() || Nothing called "+name+" in "+this.currentController);

}

GOD.Hub.prototype.set = function(name,value){
	if(this.controller[name]){
		this.controller[name] = value;
		return
	}
	console.log("HUB.set() || Nothing called "+name+" in "+this.currentController);

}



GOD.ControllerManager = function(hub){
	this.hub = hub;
}

GOD.Controllers = {};
GOD.ControllerManager.prototype.creation = {

	setDom : function (div,hub) {
		this.engine = hub.engine;
		this.hub = hub;
		//this.animationState = 0;
		this.createLightButtons(div);
	},

	createSubmitButton : function(div){
		var btn = document.createElement('button');

		btn.classList.add('btn-createSubmit');

		div.appendChild(btn);

		return btn
	},

	//***Create Light**//
	/////////////////////
	createLightButtons : function(div){
		var colors = ['#96fcff','#CCF0CF','#EBD798','#F2A2FC'];

		for (var i = 0; i < colors.length; i++) {
			var color = colors[i];

			this.createLightButton(div,color,i);
		};
	},

	createLightButton : function(div,color,i) {
		var self = this;
		var b = document.createElement('button');
		b.classList.add("btn-createLight"+(i+1));
		
		b.addEventListener("click",function(){
			self.onLightBtnClick(color,div);
		});

		div.appendChild(b);
		return b;
	},

	onLightBtnClick : function(color,div){
		this.engine.game.stage.backgroundColor = color;
		this.hub.clearDom();
		this.setDomForm(div);
	},

	//**Create Form**//
	///////////////////
	setDomForm : function(div){
		this.createRadios(div);
		this.createColorPicker(div);
		this.createFormButton(div);
		this.engine.getCurrentState().changeText();
	},

	createFormButton : function(div){
		// var container = document.createElement('div');
		// var btn = document.createElement('button');

		var self = this;
		// container.classList.add("btn-createForm-container");
		// btn.classList.add('btn-createForm');
		// btn.innerHTML = "CREATE";
		var btn = this.createSubmitButton(div);

		btn.addEventListener('click',function(){
			self.onFormBtnClick(div);
		});

		//container.appendChild(btn);
		//div.appendChild(container);

	},

	onFormBtnClick : function(div){
		this.engine.getCurrentState().formFinalized = true;
		this.hub.clearDom();
		this.setDomBeings(div);
	},

	createColorPicker : function(div){
		var ip = document.createElement('input');
		var self = this;

		ip.type = 'color'
		ip.value = '#888888';
		ip.classList.add("colorInpt-createForm");
		ip.addEventListener('input',function(){
			self.engine.god.color = self.convertColorTo0x(ip.value);
		});

		this.engine.god.color = this.convertColorTo0x(ip.value);
		div.appendChild(ip);

	},

	convertColorTo0x : function(val){
		return val.replace("#","0x");
	},

	createRadios : function(div){
		var shapes = ['circle','square','triangle'];
		var container = document.createElement('div');
		container.classList.add('radioInpt-createForm-container');

		for (var i = 0; i < 3; i++) {
			this.createRadio(container,div,shapes[i]);
		};

		div.appendChild(container);


	},

	createRadio : function(container,div,shape){
		var ip = document.createElement('input');
		var self = this;

		ip.type = 'radio'
		ip.value = shape;
		ip.name="shape";
		ip.classList.add('radioInpt-createForm');
		ip.addEventListener("click",function(){
			self.engine.god.shape = ip.value;
		})
		container.appendChild(ip);

		var text = document.createElement('span');
		text.innerHTML = shape;
		container.appendChild(text);

		container.appendChild(document.createElement('br'));
	},

	//**Create Being**//
	///////////////////
	setDomBeings : function(div){
		this.engine.getCurrentState().changeText();
		this.engine.getCurrentState().setUpBeings();
		this.createBeingsButtons(div);
		this.createRestButton(div);
	},

	createBeingsButtons : function(div){
		var buttons = this.engine.types;
		var container = document.createElement('div');
		container.classList.add("btn-createBeings-container");

		for (var i = 0; i < buttons.length; i++) {
			this.createBeingsButton(container,buttons[i],i);
		};

		div.appendChild(container);
	},

	createBeingsButton : function(div,name,i){
		var btn = document.createElement('button');
		var d = document.createElement('div');
		var self = this;

		btn.classList.add('btn-createBeings');
		btn.innerHTML = name;
		div.appendChild(btn);
		
		btn.addEventListener('click',function(){
			self.engine.getCurrentState().addElementToBeing(name);
		})

		
	},

	createRestButton : function(div){
		// var btn = document.createElement('button');
		var self = this;

		// btn.classList.add('btn-createRest');
		// btn.innerHTML = "REST";
		// div.appendChild(btn);

		var btn = this.createSubmitButton(div);

		btn.addEventListener('click',function(){
			self.hub.clearDom();
			self.engine.getCurrentState().rest();
		});
	}




	
}
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
GOD.PowerManager = function(hub){

}
GOD.Territory = function(world,type,home){
	this.scale = 2;
	this.engine = world.engine;
	this.game = this.engine.game;
	this.firstTerritory = home || false;
	this.population = 3;
	this.type = type;	
	this.buildings = []; //array of sprite IDs
	this.events = [];
}

GOD.Territory.prototype.createMap = function(){
	console.log(this);
	var map = this.game.add.tilemap('tileMapx' + this.scale);
	map.addTilesetImage('tiles_'+this.scale+'x','tileSetx'+this.scale);
	return map;
}

GOD.Territory.prototype.createLayers = function(map){
	var obj = {};

	obj.water = map.createLayer(this.type+'x'+this.scale+" water");
	obj.base = map.createLayer(this.type+'x'+this.scale+" base");
	obj.collisions = map.createLayer(this.type+'x'+this.scale+" collisions");

	return obj;
}

/*
**Events
*/
GOD.Territory.prototype.addEvent = function(evt){
	this.events.push(evt);
}
GOD.WordManager = function(hub){
	
}