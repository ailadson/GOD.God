//Bovvkyukot
GOD.StateManager.prototype.boot = function(game){};
GOD.StateManager.prototype.boot.prototype = GOD.StateManager.getState(function(){
		//phaser config
		this.scale.forceLandscape = true;
		//load imgs
		this.load.image("introButton","assets/button.png");
	},function(){
		var button = this.add.button(this.world.centerX,this.world.centerY,"introButton",function(){
			console.log('heyy')
		});
		button.anchor.x = 0.5;

		var text = this.add.text(this.world.centerX,this.world.centerY-50,"Play Game",{fill:"white",align:"center"});
		text.anchor.x = 0.5
	},function(){		
})