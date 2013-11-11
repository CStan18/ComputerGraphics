function Point(x, y, z) {
	this.x = (typeof x == "undefined") ? 0 : x;
	this.y = (typeof y == "undefined") ? 0 : y;
	this.z = (typeof z == "undefined") ? 0 : z;
}
