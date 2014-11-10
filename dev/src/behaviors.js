GOD.Behaviors = function (engine) {
	this.engine = engine;
	this.game = engine.game;
}

GOD.Behaviors.prototype.fadeOut = function(tween,duration,funcConfig) {
	var prop = { alpha: 0}
	tween.to(prop, duration);
	if(funcConfig){
		tween.onComplete.add(funcConfig.func,funcConfig.ctx,funcConfig.priority);
	}
};

GOD.Behaviors.prototype.fadeIn = function(tween,duration,funcConfig) {
	var prop = { alpha: 1000}
	tween.to(prop, duration);
	if(funcConfig){
		tween.onComplete.add(funcConfig.func,funcConfig.ctx,funcConfig.priority);
	}
};