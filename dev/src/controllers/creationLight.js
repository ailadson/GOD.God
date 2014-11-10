GOD.ControllerManager.prototype.creationLight = {

	setDom : function (div,hub) {
		this.engine = hub.engine;
		this.createButton(div);
	},

	createButton : function(div){
		var self = this;
		var b = document.createElement('button');
		b.classList.add("btn-light");
		b.innerHTML = "LIGHT";
		b.addEventListener("click",function(){
			self.onBtnClick();
		});

		div.appendChild(b);
		return b;
	},

	onBtnClick : function(){
		this.engine.game.stage.backgroundColor = "#96fcff";
	}
}