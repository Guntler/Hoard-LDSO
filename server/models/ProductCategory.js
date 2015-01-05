var ProductCategory = function (categoryid, categoryname) {
	this.categoryid = categoryid;
	this.name = categoryname;
};

ProductCategory.prototype.categoryid = -1;
ProductCategory.prototype.categoryname = "";

module.exports = ProductCategory;