/*
 * jQuery Simple Shopping Cart v0.1
 * Basis shopping cart using javascript/Jquery.
 *
 * Authour : Sirisha
 */


/* '(function(){})();' this function is used, to make all variables of the plugin Private */

(function ($, window, document, undefined) {

	/* Default Options */
	var defaults = {
		cart: [],
		addtoCartClass: '.js-to-cart',
		cartProductListClass: '.cart-list',
		totalCartCountClass: '.cart__number',
		totalCartCostClass: '.total-cart-cost',
		showcartID: '#show-cart',
		itemCountClass: '.item-count'
	};

	function Item(name, price, salePrice, count, id, image, info, value) {
		this.name = name;
		this.price = price;
		this.count = count;
		this.id = id;
		this.value = value;
		this.image = image;
		this.info = info;
		this.basePrice = price;
	}
	/*Constructor function*/
	function simpleCart(domEle, options) {

		/* Merge user settings with default, recursively */
		this.options = $.extend(true, {}, defaults, options);
		//Cart array
		this.cart = [];
		//Dom Element
		this.cart_ele = $(domEle);
		//Initial init function
		this.init();
	}


	/*plugin functions */
	$.extend(simpleCart.prototype, {
		init: function () {
			this._setupCart();
			this._setEvents();
			this._loadCart();
			this._updateCartDetails();
		},
		_setupCart: function () {
			this.cart_ele.append("");
		},
		_addProductstoCart: function () {
		},
		_updateCartDetails: function () {
			var mi = this;
			$(this.options.cartProductListClass).html(mi._displayCart());
			$(this.options.totalCartCountClass).html(mi._totalCartCount());
			var percent = 0;
			if (mi._totalCartCount() == 0) {
				$('.cart').removeClass('cart--1').removeClass('cart--2');
				// percent = 0;
			}
			if (mi._totalCartCount() == 1) {
				$('.cart').addClass('cart--1').removeClass('cart--2');
				percent = 35;
			}
			if (mi._totalCartCount() > 1) {
				$('.cart').addClass('cart--1').addClass('cart--2');
				// percent = 70;
			}

			console.log(mi._totalCartPrice(), mi._totalCartCost());
			$('.total-cart-discount').text(Math.round(100.0 * (mi._totalCartPrice() - mi._totalCartCost()) / mi._totalCartCost()) + '%');
			$('.total-cart-discount-cost').text(Math.round(mi._totalCartPrice()) - mi._totalCartCost());
			$('.total-cart-total').text(Math.round(mi._totalCartPrice()));

			$(this.options.totalCartCostClass).html(mi._totalCartCost());
		},
		_setCartbuttons: function () {

		},
		_setEvents: function () {
			var mi = this;
			$(this.options.addtoCartClass).on("click", function (e) {
				e.preventDefault();
				var name = $(this).attr("data-name");
				var count = Number($(this).attr("data-count"));
				var cost = Number($(this).attr("data-price")) * count;
				var salePrice = Number($(this).attr("data-sale-price")) * count;
				var id = $(this).attr("data-id");
				var image = $(this).attr("data-image");
				var value = $(this).attr("data-value");
				var info = $(this).attr("data-info");

				mi._addItemToCart(name, cost, salePrice, count, id, image, info, value);
				mi._updateCartDetails();

				var $cartIcon = $(".cart");
				if ($(this).parents('.products-item').length > 0) {
					var eTop = $(this).parents('.products-item').offset().top - $(window).scrollTop();
					var eLeft = $(this).parents('.products-item').offset().left;
					var $image = $('<img width="90px" height="90px" src="' + image + '"/>').css({ "position": "fixed", "z-index": "999", "top": eTop + "px", "left": eLeft + "px" });
					$(this).parents('.products-item').prepend($image);
				} else {
					var eTop = $(this).parents('.popup-product').offset().top - $(window).scrollTop();
					var eLeft = $(this).parents('.popup-product').offset().left;
					var $image = $('<img width="90px" height="90px" src="' + image + '"/>').css({ "position": "fixed", "z-index": "999", "top": eTop + "px", "left": eLeft + "px" });
					$(this).parents('.popup-product').prepend($image);
				}

				var position = $cartIcon.position();
				$image.animate({
					top: position.top,
					left: position.left
				}, 750, function () {
					$image.remove();
				});

			});

			$(this.options.showcartID).on("change", this.options.itemCountClass, function (e) {
				var ci = this;
				e.preventDefault();
				var count = $(this).val();
				var name = $(this).attr("data-name");
				var id = $(this).attr("data-id");
				var value = $(this).attr("data-value");
				var cost = Number($(this).attr("data-price"));
				mi._removeItemfromCart(name, cost, count, id, value);
				mi._updateCartDetails();
			});

			$(document).on('click', '.cart-calc .calc__btn', function (event) {

				var value = $(this).parent('.calc').find('input').val();

				if ($(this).hasClass('calc__minus')) {
					var new_value = parseInt(value) - 1;
				} else {
					var new_value = parseInt(value) + 1;
				}

				$(this).parent('.calc').find('input').val(new_value);
				if (new_value < 2) {
					$(this).parent('.calc').find('.calc__minus').removeClass('disabled');
				}
				if (new_value > 1) {
					$(this).parent('.calc').find('.calc__minus').removeClass('disabled');
				}
				var inp = $(this).parent('.calc').find('input');
				var count = inp.val();
				var name = inp.attr("data-name");
				var id = inp.attr("data-id");
				var value = inp.attr("data-value");
				var cost = Number(inp.attr("data-price"));
				mi._removeItemfromCart(name, cost, count, id, value);
				mi._updateCartDetails();
				return false;
			});


			$(document).on('click', '.calc-remove', function (event) {
				var inp = $('.calc').find('input');
				var count = 0;
				var name = inp.attr("data-name");
				var id = inp.attr("data-id");
				var value = inp.attr("data-value");
				var cost = Number(inp.attr("data-price"));
				mi._removeItemfromCart(name, cost, count, id, value);
				mi._updateCartDetails();
				return false;
			});

		},
		/* Helper Functions */
		_addItemToCart: function (name, price, salePrice, count, id, image, info, value) {
			for (var i in this.cart) {
				if (this.cart[i].id === id) {
					this.cart[i].count = parseInt(this.cart[i].count) + parseInt(count);
					this.cart[i].price = price * this.cart[i].count;
					this.cart[i].basePrice = price * this.cart[i].count;
					this._saveCart();
					this._updateCartDetails();
					return;
				}
			}

			var item = new Item(name, price, salePrice, count, id, image, info, value);
			this.cart.push(item);
			this._saveCart();
			this._updateCartDetails();
		},
		_removeItemfromCart: function (name, price, count, id, value) {
			for (var i in this.cart) {
				if (this.cart[i].id === id) {
					var singleItemCost = Number(price / this.cart[i].count);
					this.cart[i].count = count;
					this.cart[i].price = singleItemCost * count;
					if (count == 0) {
						this.cart.splice(i, 1);
					}
					break;
				}
			}
			this._saveCart();
		},
		_clearCart: function () {
			this.cart = [];
			this._saveCart();
		},
		_totalCartCount: function () {
			//return this.cart.length;
			var totalCount = 0;
			for (var i in this.cart) {
				totalCount += parseInt(this.cart[i].count);
			}
			return totalCount;
		},
		_displayCart: function () {
			var cartArray = this._listCart();
			console.log('cart array')
			console.log(cartArray);

			var output = "";
			if (cartArray.length <= 0) {
				output = '<div class="carp-empty popup-cart__title">Tu carrito esta vacía</div>';
				$('.cart-total').hide();
				$('.cart-empty').show();
			}
			else {
				$('.cart-total').show();
				$('.cart-empty').hide();
			}
			for (var i in cartArray) {
				if (cartArray[i].count == 1) {
					var disabled = 'disabled';
				} else {
					var disabled = '';
				}

				var display = 'block';

				if (cartArray[i].price == cartArray[i].basePrice) {
					display = 'none'
				} else {
					display = 'block'
				}

				output += '<div class=" row cart_item cart_item__row cart-list-item">\n\
					<div class="col-lg-6 p-0 d-flex">\n\
					<div class="cart-list-item__col cart-list-item__col--image">\n\
						<img class="cart_img" src="' + cartArray[i].image + '" alt="IMAGE">\n\
					</div>\n\
					<div class=" cart_text__side cart-list-item__col cart-list-item__col--text">\n\
						<h5 class="cart-list-item__title">' + cartArray[i].name + '</h5>\n\
						<p class="cart-list-item__subtitle">'+ cartArray[i].info + ' <span>' + cartArray[i].value + '</span></p>\n\
				<a href="#" class="calc-remove">Quitar del carrito <img src="img/small_close.svg" alt="">\n\
						</a>\n\
					</div>\n\
					</div>\n\
					<div class=" col-lg-6 d-flex flex-wrap justify-content-end p-0 cart-list-item__col cart-list-item__col--calc">\n\
						<div class="cart-calc calc">\n\
							<a href="#" class="calc__btn calc__minus minus control '+ disabled + '">-</a>\n\
							<input class="quant_prod item-count" type="number" name="number" value="'+ cartArray[i].count + '"  data-name="' + cartArray[i].name + '" data-price="' + cartArray[i].price + '" data-id="' + cartArray[i].id + '" data-value="' + cartArray[i].value + '" class="calc__input  item-count" maxlength="1">\n\
							<a href="#" class="calc__btn calc__plus plus control">+</a>\n\
						</div>\n\
						<div class="cost">Стоимость: <span>'+ cartArray[i].price + ' MXN</span></div>\n\
					</div>\n\
				</div>\n\
				</div>\n\
				';

			}
			return output;
		},

		_totalCartPrice: function () {
			let totalCost = 0;
			for (var i in this.cart) {
				totalCost += Number(this.cart[i].price);
			}
			console.log('total cart price:', totalCost)
			return totalCost;
		},
		_listCart: function () {
			let cartCopy = [];

			for (var i in this.cart) {
				let item = this.cart[i];
				let itemCopy = {};
				for (var p in item) {
					itemCopy[p] = item[p];
				}
				cartCopy.push(itemCopy);
			}
			return cartCopy;
		},
		_totalCartCost: function () {
			let totalCost = 0;
			this.cart.forEach(i => {
				console.log(i.basePrice)
				totalCost += i.basePrice;
			});
			console.log('total cart cost:', totalCost)
			return totalCost;
		},
		_calGST: function () {
			var GSTPercent = 18;
			var totalcost = this.totalCartCost();
			var calGST = Number((totalcost * GSTPercent) / 100);
			console.log('percentage:', calGST)
			return calGST;
		},
		_saveCart: async function () {
			console.log('save cart')
			console.log(this.cart)
			let productItems = [];

			this.cart.forEach(item => {
				productItems.push({
					productId: Number(item.id),
					amount: Number(item.count)
				})
			});


			if (productItems.length) {
				const { items } = await window.calculateCart({
					oid: Number($('.form-cart').data('offer-id')),
					items: productItems
				});

				if (items) {
					this.cart.map(item => {
						return items.forEach(product => {
							if (Number(item.id) === (product.productId)) {
								console.log('calculate cart item:', item)
								item.basePrice = Number(product.salePrice) * Number(item.count);
								item.price = Number(product.afterDiscountSalePrice) * Number(item.count);
							}
						});
					});
					localStorage.setItem("shoppingCart", JSON.stringify(this.cart));
					this._updateCartDetails();
					this._displayCart();
				}
			} else {
				localStorage.setItem("shoppingCart", JSON.stringify(this.cart));
				this._updateCartDetails();
				this._displayCart();
			}

		},
		_loadCart: function () {
			this.cart = JSON.parse(localStorage.getItem("shoppingCart"));
			if (this.cart === null) {
				this.cart = [];
			}
		}
	});
	/* Defining the Structure of the plugin 'simpleCart'*/
	$.fn.simpleCart = function (options) {
		return this.each(function () {
			$.data(this, "simpleCart", new simpleCart(this));
			console.log($(this, "simpleCart"));
		});
	}
		;
})(jQuery, window, document);



