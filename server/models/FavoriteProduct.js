var FavoriteProduct = function (product, user, position, visible, lastfavorited) {
	this.product = product;
	this.user = user;
	this.position = position;
	this.visible = visible;
	this.lastfavorited = lastfavorited;
}

FavoriteProduct.prototype.product = null;
FavoriteProduct.prototype.user = null;
FavoriteProduct.prototype.position = -1;
FavoriteProduct.prototype.visible = false;
FavoriteProduct.prototype.lastfavorited = "";

module.exports = FavoriteProduct;