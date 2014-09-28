/*! GAMEAI.js - v0.0.1 - 2014-09-22 */
 GAMEAI = {};

GAMEAI.DECISION = {};

GAMEAI.DECISION.DecisionTree = function (ctx,b,config) {
	/**
	 * A variable in the global namespace called 'foo'.
	 * @var {number[]} node
	 */
	this.nodes = [];
	/**
	 * A variable in the global namespace called 'foo'.
	 * @var {number} foo
	 */
	this.frame = 0;
	/**
	 * A variable in the global namespace called 'foo'.
	 * @var {number} foo
	 */
	this.context = ctx;

	this.behaviors = b
	this.populate(config);
}

/**
* Used internally by DecisionTree. Populates the tree based on config object.
* @function
* @name populate
* @param {object} config
*/
GAMEAI.DECISION.DecisionTree.prototype.populate = function(config){
	//checks
	//is first level a single node?
	if(config[0].length != 1){
		console.log("The first level of the Decision Tree must have one node.")
		return
	}


	for (var i = config.length - 1; i >= 0; i--) {
		var level = config[i];
		var a = [];

		this.nodes.unshift(a);

		for (var j = 0; j < level.length; j++) {
			var nodeConfig = level[j];

			//make sure theres a context
			var ctx = nodeConfig.context || this.context;
			nodeConfig.context = ctx;

			//make sure no decision nodes are in the last level
			if(i == config.length-1 && nodeConfig.type != "action"){
				console.log("All branches must terminate in an action node")
				return
			}

			//attach nodes to children
			if(nodeConfig.type != "action"){
				var tNode = this.getNodeById(nodeConfig.trueNode);
				var fNode = this.getNodeById(nodeConfig.falseNode);
				nodeConfig.trueNode = tNode;
				nodeConfig.falseNode = fNode;
				
				if(!tNode || !fNode){
					console.log("Check node " + nodeConfig.id +"'s connection to its true/false nodes");
					return;
				}
			}

			switch(nodeConfig.type){
				case "action" : a.push( new GAMEAI.DECISION.DTActionNode(this.behaviors,nodeConfig));
					break;
				case "boolean" : a.push( new GAMEAI.DECISION.DTBooleanNode(nodeConfig));
					break;
				case "equal" : a.push( new GAMEAI.DECISION.DTEqualNode(nodeConfig));
					break;
				case "array" : a.push( new GAMEAI.DECISION.DTArrayNode(nodeConfig));
					break;
				case "random" : a.push( new GAMEAI.DECISION.DTRandomNode(nodeConfig,this));
					break;
				case "range" : a.push( new GAMEAI.DECISION.DTRangeNode(nodeConfig));
					break;
				case "custom" : a.push( new GAMEAI.DECISION.DTCustomNode(nodeConfig));
					break;
			}
		};
	};

	//console.log(this.nodes);
}

/**
* Returns a node based on ID
* @function
* @name getNodeById
* @param {string} id
*/
GAMEAI.DECISION.DecisionTree.prototype.getNodeById = function(id){
	for (var i = this.nodes.length - 1; i >= 0; i--) {
		var level = this.nodes[i];

		for (var j = 0; j < level.length; j++) {
			var node = level[j];

			if(node.core.id == id){ 
				return node
			}
		};
	};
}

/**
* Prompts the first node to make makeDecision and increments frame
* @function
* @name makeDecision
*/
GAMEAI.DECISION.DecisionTree.prototype.makeDecision = function(){
	this.frame += 1;
	var branch = this.nodes[0][0].getBranch();
	return branch.makeDecision();
}


/**
* Creates a decision tree Action node
* @constructor
*/
GAMEAI.DECISION.DTActionNode = function (b,config) {
	this.core={};
	this.core.id = config.id;
	this.behaviors = b;
	this.behavior = config.id;
}

/**
* Returns a behavior
*@function
*@name makeDecision
*/
GAMEAI.DECISION.DTActionNode.prototype.makeDecision = function(){
	return this.behaviors.getBehaviorById(this.behavior);
}

/**
* The core of all Decision nodes
* @constructor
*/
GAMEAI.DECISION.DTDecisionNodeBase = function (i,t,f,test,ctx) {
	this.id = i;
	this.trueNode = t;
	this.falseNode = f;
	this.testCtx = ctx;
	this.testValue = test;
	
}

GAMEAI.DECISION.DTDecisionNodeBase.prototype.getTestValue = function(){
	if(typeof this.testCtx[this.testValue] == "function") 
		return this.testCtx[this.testValue]();

	return this.testCtx[this.testValue]
}

/**
* Decision node that branches based on boolean value
* @constructor
*/
GAMEAI.DECISION.DTBooleanNode = function(config){
	this.core = new GAMEAI.DECISION.DTDecisionNodeBase(config.id,config.trueNode,config.falseNode,config.testValue,config.context);
}

GAMEAI.DECISION.DTBooleanNode.prototype.getBranch = function(){
	var testValue = this.core.getTestValue();

	if(testValue){
		return this.core.trueNode
	}else{
		return this.core.falseNode
	}
}

GAMEAI.DECISION.DTBooleanNode.prototype.makeDecision = function(){
	var branch = this.getBranch();
	return branch.makeDecision();
}


/**
* Decision node that branches based on value
* @constructor
*/
GAMEAI.DECISION.DTEqualNode = function(config){
	this.core = new GAMEAI.DECISION.DTDecisionNodeBase(config.id,config.trueNode,config.falseNode,config.testValue,config.context);
	this.opts = config.opts;
}

GAMEAI.DECISION.DTEqualNode.prototype.getBranch = function(){
	var testValue = this.core.getTestValue();

	if(testValue === this.opts.equalTo)
		return this.core.trueNode
	else
		return this.core.falseNode
}

GAMEAI.DECISION.DTEqualNode.prototype.makeDecision = function(){
	var branch = this.getBranch();
	return branch.makeDecision();
}


/**
* Decision node that branches based on value
* @constructor
*/
GAMEAI.DECISION.DTArrayNode = function(config){
	this.core = new GAMEAI.DECISION.DTDecisionNodeBase(config.id,config.trueNode,config.falseNode,config.testValue,config.context);
	this.opts = config.opts;
}

GAMEAI.DECISION.DTArrayNode.prototype.getBranch = function(){
	var testValue = this.core.getTestValue();
	
	for (var i = 0; i < this.opts.inArray.length; i++) {
		if(this.opts.inArray[i] == testValue)
			return this.core.trueNode
	};
		return this.core.falseNode
}

GAMEAI.DECISION.DTArrayNode.prototype.makeDecision = function(){
	var branch = this.getBranch();
	return branch.makeDecision();
}


/**
* Decision node that branches based on value
* @constructor
*/
GAMEAI.DECISION.DTRangeNode = function(config){
	this.core = new GAMEAI.DECISION.DTDecisionNodeBase(config.id,config.trueNode,config.falseNode,config.testValue,config.context);
	this.opts = config.opts;
}

GAMEAI.DECISION.DTRangeNode.prototype.getBranch = function(){
	var testValue = this.core.getTestValue();

	if((!this.opts.min ||testValue > this.opts.min) && 
		(!this.opts.max || testValue < this.opts.max)){
		return this.core.trueNode
	}

	return this.core.falseNode
}

GAMEAI.DECISION.DTRangeNode.prototype.makeDecision = function(){
	var branch = this.getBranch();
	return branch.makeDecision();
}

/**
* Decision node that branches based on value
* @constructor
*/
GAMEAI.DECISION.DTRandomNode = function(config,DT){
	this.core = new GAMEAI.DECISION.DTDecisionNodeBase(config.id,config.trueNode,config.falseNode);
	this.opts = DT.frame;
	this.lastFrame = -1
	this.lastDecision = null;
}

GAMEAI.DECISION.DTRandomNode.prototype.getBranch = function(){
	if(this.opts > this.lastFrame + 1){
		this.lastDecision = this.getRandomBranch();
	}
	
	this.lastFrame = this.opts;

	return this.lastDecision;
}

GAMEAI.DECISION.DTRandomNode.prototype.getRandomBranch = function(){
	var i = Math.round(Math.random());

	if(i == 1)
		return this.core.trueNode;
	else
		return this.core.falseNode;
}

GAMEAI.DECISION.DTRandomNode.prototype.makeDecision = function(){
	var branch = this.getBranch();
	return branch.makeDecision();
}

/**
* Decision node that branches based on value
* @constructor
*/
GAMEAI.DECISION.DTCustomNode = function(config){
	this.core = new GAMEAI.DECISION.DTDecisionNodeBase(config.id,config.trueNode,config.falseNode,config.testValue,config.context);
	this.opts = config.opts;
}

GAMEAI.DECISION.DTCustomNode.prototype.getBranch = function(){
	var testValue = this.core.getTestValue();
	
	if(this.opts.custom(testValue)){
		return this.core.trueNode
	}

	return this.core.falseNode
}

GAMEAI.DECISION.DTCustomNode.prototype.makeDecision = function(){
	var branch = this.getBranch();
	return branch.makeDecision();
}



















GAMEAI.Behaviors = function (config) {
	var config = config || {};
	
	this.behaviors = {};

	this.populate(config);
}

GAMEAI.Behaviors.prototype.populate = function(config){
	for (var i = 0; i < config.length; i++) {
		var  behavior = config[i];
		this.behaviors[behavior.id] = behavior.context[behavior.name];
	}
}

GAMEAI.Behaviors.prototype.extractBehaviors =function(obj,exclud){
	var exclude = exclud || [];
	for (var behavior in obj) {
		
		if(!this.behaviors[behavior] && exclude.indexOf(behavior) == -1){
			this.behaviors[behavior] = obj[behavior];
		}
	}
}

GAMEAI.Behaviors.prototype.getBehaviorById = function(id){
	console.log(id);
	console.log(this.behaviors)
	return this.behaviors[id];
}

GAMEAI.DECISION.StateMachine = function (ctx,b,config) {
	this.states = {};
	this.populate(config.states);

	this.initialState = this.getStateById(config.initialState);
	this.currentState = this.initialState;
	this.behaviors = b;
}

GAMEAI.DECISION.StateMachine.prototype.populate = function (states){
	for (var i = 0; i < states.length; i++) {
		var state = states[i];

		this.states[state.id] = new GAMEAI.DECISION.SMState(this,state);
	};
}

GAMEAI.DECISION.StateMachine.prototype.update = function(){
	var triggeredTransition;
	var transitions = this.currentState.getTransitions();
	var behaviors = [];

	//check each transition and store the first that triggers
	for (var i = 0; i < transitions.length; i++) {
		var transition = transitions[i];

		if(transition.isTriggered()){
			triggeredTransition = transition;
			break;
		}
	};

	if(triggeredTransition){

		var targetState = triggeredTransition.getTargetState();
		//behaviors.concat(this.currentState.getExitBehaviors());
		behaviors = behaviors.concat(triggeredTransition.getBehaviors());
		//behaviors = behaviors.concat(targetState.getEntryBehaviors());
		this.currentState = targetState
		return this.getBehaviors(behaviors);
	} else {
		behaviors = behaviors.concat(this.currentState.getBehaviors());
		return this.getBehaviors(behaviors);
	}

}

GAMEAI.DECISION.StateMachine.prototype.getStateById = function(id){
	return this.states[id]
}

GAMEAI.DECISION.StateMachine.prototype.getBehaviors = function(ids){
	var bArray = [];

	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];

		bArray.push( this.behaviors.getBehaviorById(id));
	}
	
	return bArray;

}


//States
GAMEAI.DECISION.SMState = function(sm,config){
	this.id = config.id;
	this.stateMachine = sm;
	this.transitions = [];
	this.entryBehaviors = config.entryBehaviors;
	this.behaviors = config.behaviors;
	this.exitBehaviors = config.exitBehaviors;
	this.populate(config.transitions)
}

GAMEAI.DECISION.SMState.prototype.populate = function(transitions){
	for (var i = 0; i < transitions.length; i++) {
		var transition = transitions[i];

		this.transitions.push(new GAMEAI.DECISION.SMTransition(this,transition))
	};
}

GAMEAI.DECISION.SMState.prototype.getBehaviors = function(){
	return this.behaviors;
}

GAMEAI.DECISION.SMState.prototype.getEntryBehaviors = function(){

}

GAMEAI.DECISION.SMState.prototype.getExitBehaviors = function(){

}

GAMEAI.DECISION.SMState.prototype.getTransitions = function(){
	return this.transitions;
}

//Transitions
GAMEAI.DECISION.SMTransition = function(state,config){
	this.state = state;
	this.behaviors = config.behaviors;
	this.targetState = config.targetState;
	this.condition = new GAMEAI.DECISION.SMCondition(config.condition);
}

GAMEAI.DECISION.SMTransition.prototype.isTriggered = function(){
	return this.condition.test();
}

GAMEAI.DECISION.SMTransition.prototype.getTargetState = function(){
	return this.state.stateMachine.states[this.targetState];
}

GAMEAI.DECISION.SMTransition.prototype.getBehaviors = function(){
	return this.behaviors;
}

//condition
GAMEAI.DECISION.SMCondition = function(config){
	this.callback = config.callback;
	this.context = config.context;
	this.name = config.name;
}

GAMEAI.DECISION.SMCondition.prototype.test = function(){
	/*var testVals = [];

	for (var i = 0; i < this.testCtx.length; i++) {
		var ctx = this.testCtx[i];
		var val = ctx[this.testVal];
		testVals.push(val);
	};*/

	return this.callback(this.context[this.name]);
}