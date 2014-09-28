GOD = {};

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