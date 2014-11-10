GOD.Hub = function(engine){
	this.engine = engine;
	this.container = document.getElementById('hub');
	this.controllers = new GOD.ControllerManager(this);
}

GOD.Hub.prototype.init = function(name){
	//this.clearDom();
	this.controllers[name].setDom(this.container,this);
}

GOD.Hub.prototype.clearDom = function(){

}