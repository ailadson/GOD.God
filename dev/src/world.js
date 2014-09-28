GOD.World = function (engine) {
	this.engine = engine;

	this.planes = [new GOD.Plane(this)];
	this.currentPlane = this.planes[0];
	this.rows = 4;
	this.columns = 5;
}