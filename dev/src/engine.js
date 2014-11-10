GOD = {};

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