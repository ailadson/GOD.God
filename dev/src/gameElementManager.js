GOD.GameElementManager = function(engine){
	this.elements = {};
}

GOD.GameElementManager.prototype.set = function(element,name){
	this.elements[name] = element;
}

GOD.GameElementManager.prototype.get = function(name){
	return this.elements[name];
}