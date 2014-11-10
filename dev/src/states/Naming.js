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

