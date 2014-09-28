GOD.StateManager = function (engine) {
	this.engine = engine;
	this.world = engine.world;
}

GOD.StateManager.getState = function(pl,c,ud){
	return {
		preload : pl,
		create : c,
		update : ud
	}
}
