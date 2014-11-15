GOD.StateConfiguration.prototype['Preloader'] = function(){
	var self = this;
	var game = self.game;

	return {
		preload : function () {
			game.load.atlasJSONArray("beings","assets/beings.png","assets/beings.json");
		},

		create : function(){
			game.state.start('Naming');
		},

		update : function(){}
	}
}