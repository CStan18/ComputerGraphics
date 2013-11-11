function Color(r, g, b, a) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = (typeof a == "undefined") ? 1 : a;
}
