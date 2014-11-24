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