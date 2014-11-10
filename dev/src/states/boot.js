GOD.StateConfiguration.prototype.Boot = function(){
	var self = this;
	var game = self.game;

	return {
		preload : function () {},

		create : function(){
			game.input.maxPointers = 1;
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			// game.scale.minWidth;
			// game.scale.minHeight;
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;
			game.scale.forceLandscape = true;
			game.scale.setScreenSize(true);

			game.input.addPointer();
			game.stage.backgroundColor = "#000000"

			game.state.start('Preloader');

		},

		update : function(){}
	}
}