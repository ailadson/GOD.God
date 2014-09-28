/*! GOD.God - v0.0.1 - 2014-09-28 */GOD = {};

GOD.Engine = function () {
	var self = this;

	this.width = window.innerWidth;
	this.height = window.innerHeight;

	this.game = new Phaser.Game(this.width,this.height,Phaser.AUTO,'game');
	this.loaded = false;

	this.world = new GOD.World(this);
	this.getState = new GOD.StateManager(this);

	this.game.state.add('boot',this.getState.boot);
	this.game.state.start('boot');
}
GOD.World = function (engine) {
	this.engine = engine;

	this.planes = [new GOD.Plane(this)];
	this.currentPlane = this.planes[0];
	this.rows = 4;
	this.columns = 5;
}
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

GOD.StateManager.prototype.start = function(game){};
GOD.StateManager.prototype.start.prototype =GOD.StateManager.getState(function(){

	},function(){

	},function(){

});

GOD.StateManager.prototype.switchFromPlane = function(game){}
GOD.StateManager.prototype.switchFromPlane.prototype = GOD.StateManager.getState(function(){

	},function(){

	},function(){

});

GOD.StateManager.prototype.switchToPlane = function(game){}
GOD.StateManager.prototype.switchToPlane.prototype = GOD.StateManager.getState(function(){

	},function(){

	},function(){

});

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
GOD.Plane = function (world) {
	this.world = world;

	this.beings = []; //{id,amount}
	this.structures = [];
	this.elements = [];

}