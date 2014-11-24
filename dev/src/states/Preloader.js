GOD.StateConfiguration.prototype['Preloader'] = function(){
	var self = this;
	var game = self.game;

	return {
		preload : function () {
			game.load.atlasJSONArray("beings","assets/beings.png","assets/beings.json");
			game.load.tilemap("tileMapx2","assets/tileMapx2.json",null,Phaser.Tilemap.TILED_JSON);
			//game.load.tilemap("mapx1","assets/tiles_1x.png",null,Phaser.Tilemap.TILED_JSON);
			//game.load.tilemap("mapx0.5","assets/tiles_0.5x.png",null,Phaser.Tilemap.TILED_JSON);
			game.load.image("tileSetx2","assets/tiles_2x.png");
		},

		create : function(){
			game.state.start('Naming');
		},

		update : function(){}
	}
}