const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('products.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, products: [], totalPrice: 0 });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Save/Update cart
// @route   POST /api/cart
// @access  Private
exports.saveCart = async (req, res, next) => {
  try {
    const { products, totalPrice } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      cart.products = products;
      cart.totalPrice = totalPrice;
      await cart.save();
    } else {
      cart = await Cart.create({
        user: req.user.id,
        products,
        totalPrice
      });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
