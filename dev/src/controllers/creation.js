GOD.ControllerManager.prototype.creation = {

	setDom : function (div,hub) {
		this.engine = hub.engine;
		this.hub = hub;
		//this.animationState = 0;
		this.createLightButtons(div);
	},

	createSubmitButton : function(div){
		var btn = document.createElement('button');

		btn.classList.add('btn-createSubmit');

		div.appendChild(btn);

		return btn
	},

	//***Create Light**//
	/////////////////////
	createLightButtons : function(div){
		var colors = ['#96fcff','#CCF0CF','#EBD798','#F2A2FC'];

		for (var i = 0; i < colors.length; i++) {
			var color = colors[i];

			this.createLightButton(div,color,i);
		};
	},

	createLightButton : function(div,color,i) {
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
		// var container = document.createElement('div');
		// var btn = document.createElement('button');

		var self = this;
		// container.classList.add("btn-createForm-container");
		// btn.classList.add('btn-createForm');
		// btn.innerHTML = "CREATE";
		var btn = this.createSubmitButton(div);

		btn.addEventListener('click',function(){
			self.onFormBtnClick(div);
		});

		//container.appendChild(btn);
		//div.appendChild(container);

	},

	onFormBtnClick : function(div){
		this.engine.getCurrentState().formFinalized = true;
		this.hub.clearDom();
		this.setDomBeings(div);
	},

	createColorPicker : function(div){
		var ip = document.createElement('input');
		var self = this;

		ip.type = 'color'
		ip.value = '#888888';
		ip.classList.add("colorInpt-createForm");
		ip.addEventListener('input',function(){
			self.engine.god.color = self.convertColorTo0x(ip.value);
		});

		this.engine.god.color = this.convertColorTo0x(ip.value);
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
			self.engine.god.shape = ip.value;
		})
		container.appendChild(ip);

		var text = document.createElement('span');
		text.innerHTML = shape;
		container.appendChild(text);

		container.appendChild(document.createElement('br'));
	},

	//**Create Being**//
	///////////////////
	setDomBeings : function(div){
		this.engine.getCurrentState().changeText();
		this.engine.getCurrentState().setUpBeings();
		this.createBeingsButtons(div);
		this.createRestButton(div);
	},

	createBeingsButtons : function(div){
		var buttons = this.engine.types;
		var container = document.createElement('div');
		container.classList.add("btn-createBeings-container");

		for (var i = 0; i < buttons.length; i++) {
			this.createBeingsButton(container,buttons[i],i);
		};

		div.appendChild(container);
	},

	createBeingsButton : function(div,name,i){
		var btn = document.createElement('button');
		var d = document.createElement('div');
		var self = this;

		btn.classList.add('btn-createBeings');
		btn.innerHTML = name;
		div.appendChild(btn);
		
		btn.addEventListener('click',function(){
			self.engine.getCurrentState().addElementToBeing(name);
		})

		
	},

	createRestButton : function(div){
		// var btn = document.createElement('button');
		var self = this;

		// btn.classList.add('btn-createRest');
		// btn.innerHTML = "REST";
		// div.appendChild(btn);

		var btn = this.createSubmitButton(div);

		btn.addEventListener('click',function(){
			self.hub.clearDom();
			self.engine.getCurrentState().rest();
		});
	}




	
}