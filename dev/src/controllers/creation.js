GOD.ControllerManager.prototype.creation = {

	setDom : function (div,hub) {
		this.engine = hub.engine;
		this.hub = hub;
		//this.animationState = 0;
		this.createButtons(div);
	},

	//***Create Light**//
	/////////////////////
	createButtons : function(div){
		var colors = ['#96fcff','#CCF0CF','#EBD798','#F2A2FC'];

		for (var i = 0; i < colors.length; i++) {
			var color = colors[i];

			this.createButton(div,color,i);
		};
	},

	createButton : function(div,color,i) {
		var self = this;
		var b = document.createElement('button');
		b.classList.add("btn-createLight"+(i+1));
		
		b.addEventListener("click",function(){
			self.onLightBtnClick(color,div);
		});

		div.appendChild(b);
		return b;
	},

	onLightBtnClick : function(color,div){
		this.engine.game.stage.backgroundColor = color;
		this.hub.clearDom();
		this.setDomForm(div);
	},

	//**Create Form**//
	///////////////////
	setDomForm : function(div){
		this.createRadios(div);
		this.createColorPicker(div);
		this.createFormButton(div);
		this.engine.getCurrentState().changeText();
	},

	createFormButton : function(div){
		var container = document.createElement('div');
		var btn = document.createElement('button');

		var self = this;
		container.classList.add("btn-createForm-container");
		btn.classList.add('btn-createForm');
		btn.innerHTML = "CREATE";
		btn.addEventListener('click',function(){
			self.onFormBtnClick();
		});

		container.appendChild(btn);
		div.appendChild(container);

	},

	onFormBtnClick : function(){
		console.log('awesome');
	},

	createColorPicker : function(div){
		var ip = document.createElement('input');
		var self = this;

		ip.type = 'color'
		ip.value = '#888888';
		ip.classList.add("colorInpt-createForm");
		ip.addEventListener('input',function(){
			self.engine.getCurrentState().godColor = self.convertColorTo0x(ip.value);
		});

		this.engine.getCurrentState().godColor = this.convertColorTo0x(ip.value);
		div.appendChild(ip);

	},

	convertColorTo0x : function(val){
		return val.replace("#","0x");
	},

	createRadios : function(div){
		var shapes = ['circle','square','triangle'];
		var container = document.createElement('div');
		container.classList.add('radioInpt-createForm-container');

		for (var i = 0; i < 3; i++) {
			this.createRadio(container,div,shapes[i]);
		};

		div.appendChild(container);


	},

	createRadio : function(container,div,shape){
		var ip = document.createElement('input');
		var self = this;

		ip.type = 'radio'
		ip.value = shape;
		ip.name="shape";
		ip.classList.add('radioInpt-createForm');
		ip.addEventListener("click",function(){
			self.engine.getCurrentState().godForm = ip.value;
		})
		container.appendChild(ip);

		var text = document.createElement('span');
		text.innerHTML = shape;
		container.appendChild(text);

		container.appendChild(document.createElement('br'));
	},



	
}