GOD = {};

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