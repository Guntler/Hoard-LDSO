var ProductCategory = function (id, name) {
	this.id = id;
	this.name = name;
}

ProductCategory.prototype.id = -1;
ProductCategory.prototype.name = "";

module.exports = ProductCategory;