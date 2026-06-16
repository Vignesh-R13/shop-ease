const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const products = [
  {
    title: "Premium Wireless Headphones",
    description: "Experience crystal clear sound with our latest noise-canceling technology. Comfortable for long sessions.",
    price: 299,
    discountPrice: 249,
    category: "Electronics",
    stock: 50,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000"],
    ratings: 4.8
  },
  {
    title: "Minimalist Modern Watch",
    description: "A sleek, stainless steel watch for the modern professional. Water resistant up to 50m.",
    price: 199,
    discountPrice: 159,
    category: "Fashion",
    stock: 30,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000"],
    ratings: 4.5
  },
  {
    title: "Ergonomic Office Chair",
    description: "Support your back during long working hours with our high-end ergonomic chair.",
    price: 499,
    discountPrice: 399,
    category: "Home",
    stock: 15,
    images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1000"],
    ratings: 4.9
  },
  {
    title: "Smart Home Speaker",
    description: "Voice-controlled smart speaker with rich, room-filling sound and built-in assistant.",
    price: 129,
    discountPrice: 99,
    category: "Electronics",
    stock: 100,
    images: ["https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=1000"],
    ratings: 4.2
  },
  {
    title: "Professional DSLR Camera",
    description: "Capture life's moments in stunning clarity with this professional-grade DLSR camera.",
    price: 1200,
    discountPrice: 1099,
    category: "Electronics",
    stock: 10,
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000"],
    ratings: 4.7
  },
  {
    title: "Organic Silk Dress",
    description: "Beautiful, eco-friendly silk dress perfect for summer evenings and special occasions.",
    price: 149,
    discountPrice: 119,
    category: "Fashion",
    stock: 25,
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000"],
    ratings: 4.6
  },
  {
    title: "Apple iPhone 17 Pro Max",
    description: "Experience the next frontier of smartphone performance featuring an advanced titanium chassis, next-gen A19 Pro neural architecture, and professional ultra-motion camera arrays.",
    price: 1399,
    discountPrice: 1299,
    category: "Electronics",
    stock: 15,
    images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000"],
    ratings: 4.9
  },
  {
    title: "Vitamin C Hydrating Facial Serum",
    description: "Brighten and deeply revitalize your skin structure. Formulated with pure hyaluronic acid and botanical extracts for a healthy, vibrant glow.",
    price: 45,
    discountPrice: 38,
    category: "Beauty",
    stock: 120,
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000"],
    ratings: 4.7
  },
  {
    title: "Velvet Matte Liquid Lipstick Trio",
    description: "Highly pigmented, transfer-resistant long-wear formula that delivers luxurious, full-coverage color with a completely weightless feel.",
    price: 34,
    discountPrice: 28,
    category: "Beauty",
    stock: 85,
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=1000"],
    ratings: 4.5
  },
  {
    title: "Match Performance Soccer Ball",
    description: "Engineered with precision aerodynamic grooves and high-grade thermal bonding for optimal flight stabilization and durability across all turf types.",
    price: 55,
    discountPrice: 45,
    category: "Sports",
    stock: 60,
    images: ["https://images.unsplash.com/photo-1517747614396-d21a78b850e8?auto=format&fit=crop&q=80&w=1000"],
    ratings: 4.4
  },
  {
    title: "Adjustable Dial Dumbbell Set",
    description: "Smart space-saving strength training companion. Effortlessly adjust weight metrics configurations per dumbbell to streamline home gym workouts.",
    price: 349,
    discountPrice: 299,
    category: "Sports",
    stock: 20,
    images: ["https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&q=80&w=1000"],
    ratings: 4.8
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    
    // We need a dummy user ID for the 'user' field in Product
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
        admin = await User.create({
            name: "Admin User",
            email: "admin@shopease.com",
            password: "password123",
            role: "admin"
        });
    }

    const sampleProducts = products.map(product => {
      return { ...product, user: admin._id };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}