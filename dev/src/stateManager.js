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