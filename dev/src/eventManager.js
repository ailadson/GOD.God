GOD.EventManger = function(engine){
	this.store = {};
	this.possibleEvents = [];
}

//GET()
//params
//@ array[int,int]; the society vector
//@int; the society's development level
//@bool; is the event and inner event
//return an event that meets the requirements
GOD.Event.prototype.get = function(vector,development,inner){
	var pEvents = [];

	for (var i = 0; i < this.possibleEvents.length; i++) {
		var pEvent = this.possibleEvents[i];
		var r = pEvent.getRequirements(); 
		var vecMin = r.vectorMin;
		var vecMax = r.vectorMax
		var dev = r.development;

		if(pEvent.inner == inner && this.checkVectors(vecMin,vecMax,vector) && this.checkDevelopment(dev,development)){
			pEvents.push(pEvent)
		}
	};

	var rand = Math.floor(Math.random() * pEvents.length);

	return pEvents[rand];
}

GOD.Event.prototype.checkVectors = function(min,max,vec){
	if(min){
		if(vec[0] < min[0] || vec[1] < min[1]){
			return false;
		}
	}

	if(max){
		if(vec[0] > max[0] || vec[1] > max[1]){
			return false;
		}
	}

	return true;
}

GOD.Event.prototype.checkDevelopment = function(eDev,sDev){
	if(sDev >= eDev){
		return true
	}

}

//CREATE()
//param = @string; name of event
//makes the event specified by the name a possible evente
GOD.Event.prototype.create = function(name){
	if(this.store[name]){
		this.possibleEvents.push(this.store[name]);
	}
}