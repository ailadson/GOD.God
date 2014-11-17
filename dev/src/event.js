//configuration
/*

{
	requirements : {
		vectorMin : [-1,-1],
		vectorMax : [1,1],
		development : 10
	},

	init : function(){
	
	},

	update : function(){
	
	}
}

*/

GOD.Event = function(config){
	this.requirements = config.requirements;
	this.init = config.init;
	this.update = config.update;
}

GOD.Event.prototype.getRequirements = function(){
	return requirements;
}