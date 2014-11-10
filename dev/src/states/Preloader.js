GOD.StateConfiguration.prototype['Preloader'] = function(){
	var self = this;
	var game = self.game;

	return {
		preload : function () {},

		create : function(){
			game.state.start('Naming');
		},

		update : function(){}
	}
}