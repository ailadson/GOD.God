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