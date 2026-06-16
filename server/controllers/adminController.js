const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments() || 0;
    const totalProducts = await Product.countDocuments() || 0;
    const totalOrders = await Order.countDocuments() || 0;

    // safer query (avoids null issues)
    const orders = await Order.find({ isPaid: true }) || [];

    const totalRevenue = orders.reduce(
      (acc, item) => acc + (item.totalPrice || 0),
      0
    );

    // safer fallback if no data
    const monthlySales = [
      { month: 'Jan', sales: 0 },
      { month: 'Feb', sales: 0 },
      { month: 'Mar', sales: 0 },
      { month: 'Apr', sales: 0 },
      { month: 'May', sales: 0 },
      { month: 'Jun', sales: 0 },
    ];

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        monthlySales
      }
    });

  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching stats"
    });
  }
};