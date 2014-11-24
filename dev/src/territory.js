GOD.Territory = function(world,type,home){
	this.scale = 2;
	this.engine = world.engine;
	this.game = this.engine.game;
	this.firstTerritory = home || false;
	this.population = 3;
	this.type = type;	
	this.buildings = []; //array of sprite IDs
	this.events = [];
}

GOD.Territory.prototype.createMap = function(){
	console.log(this);
	var map = this.game.add.tilemap('tileMapx' + this.scale);
	map.addTilesetImage('tiles_'+this.scale+'x','tileSetx'+this.scale);
	return map;
}

GOD.Territory.prototype.createLayers = function(map){
	var obj = {};

	obj.water = map.createLayer(this.type+'x'+this.scale+" water");
	obj.base = map.createLayer(this.type+'x'+this.scale+" base");
	obj.collisions = map.createLayer(this.type+'x'+this.scale+" collisions");

	return obj;
}

/*
**Events
*/
GOD.Territory.prototype.addEvent = function(evt){
	this.events.push(evt);
}