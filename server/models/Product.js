var Product = function (id, name, price, link, imageName, category, visible, addedby, dateadded) {
	this.id = id;
	this.name = name;
	this.price = price;
	this.link = link;
	this.imageName = imageName;
	this.category = category;
	this.visible = visible;
	this.addedby = addedby;
	this.dateadded = dateadded;
}

Product.prototype.id = -1;
Product.prototype.name = "";
Product.prototype.price = 0.0;
Product.prototype.link = "";
Product.prototype.imageName = "";
Product.prototype.category = null;
Product.prototype.visible = false;
Product.prototype.addedby = null;
Product.prototype.dateadded = "";

module.exports = Product;