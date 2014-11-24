GOD.World = function (engine) {
	this.engine = engine;
	this.game = engine.game;
	this.territories = {};
	//this.currentBeings = this.game.add.group();
	
	this.currentTerritory;
	this.map;
	this.layers;
	this.tweens = {
		base : {},
		water : {},
		collisions : {}
	};
}

GOD.World.prototype.init = function(firstType){
	var t = this.engine.types;

	for (var i = 0; i < t.length; i++) {
		var type = t[i];
		var first = (type == firstType);
		this.territories[type] = new GOD.Territory(this,type,first);
	};
}

GOD.World.prototype.createTerritory = function(type){
	if(this.currentTerritory){
		this.clearTerritory();
	}

	this.currentTerritory = this.territories[type];
	this.createMap();
	this.createTweens();
	//this.createBeings();
}

GOD.World.prototype.createMap = function(){
	this.map = this.currentTerritory.createMap();

	this.layers = this.currentTerritory.createLayers(this.map);

	this.map.setCollisionBetween(1,100,true,this.layers.water);
	this.map.setCollisionBetween(1,100,true,this.layers.collisions);

	this.layers.base.resizeWorld();

	//set inital position
	for(sheet in this.layers){
		this.layers[sheet].fixedToCamera = false;
		this.layers[sheet].position.y = this.game.height;
	}
}

GOD.World.prototype.tweenStart = function(name){
	for(layer in this.tweens){
		this.tweens[layer][name].start();
	}
}

GOD.World.prototype.createTweens = function(){
	for(i in this.layers){
		var layer = this.layers[i];
		this.tweens[i].up = this.game.add.tween(layer.position);
		this.tweens[i].down = this.game.add.tween(layer.position);
		this.tweens[i].out = this.game.add.tween(layer.position);

		this.tweens[i].up.to({ y : 0},5000);
		this.tweens[i].down.to({ y : (this.game.height - (this.game.height/10))},5000);
		this.tweens[i].out.to({ y : this.game.height},5000);
	}
}

GOD.World.prototype.createBeings = function(){
	// var population = this.currentTerritory.population;
	// var scale = this.currentTerritory.scale;
	// var type = this.currentTerritory.type;

	// for (var i = 0; i < population; i++) {
	// 	this.currentBeings.create(/**TO DO. x n y positions**/,"beings",type+"Worship_1.png");
	// };
}

GOD.World.prototype.clearTerritory = function(){
	this.currentBeings.removeAll(true);
}