GOD.Hub = function(engine){
	this.engine = engine;
	this.container = document.getElementById('hub');
	this.controller = new GOD.ControllerManager(this);
	this.word = new GOD.WordManager(this);
	this.power = new GOD.PowerManager(this);
	this.currentController;
}

GOD.Hub.prototype.init = function(name){
	//this.clearDom();
	this.controller[name].setDom(this.container,this);
	this.currentController = name;
}

GOD.Hub.prototype.clearDom = function(){
	while(this.container.firstChild){
		this.container.removeChild(this.container.firstChild);
	}
}

GOD.Hub.prototype.call = function(name){
	if(this.controller[name]){
		if(typeof this.controller[name] == "function"){
			return this.controller[this.currentController][name]();
		} else {
			console.log("HUB.js || Returning value, not a function from .call(funcString) method: " + funcString);
			return this.controller[this.currentController][name];
		}
	}
	console.log("HUB.call() || Nothing called "+name+" in "+this.currentController);
}

GOD.Hub.prototype.get = function(name){
	if(this.controller[name]){
		return this.controller[name];
	}
	console.log("HUB.get() || Nothing called "+name+" in "+this.currentController);

}

GOD.Hub.prototype.set = function(name,value){
	if(this.controller[name]){
		this.controller[name] = value;
		return
	}
	console.log("HUB.set() || Nothing called "+name+" in "+this.currentController);

}


