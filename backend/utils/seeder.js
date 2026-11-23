import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';

dotenv.config();

export const seedData = async () => {
  try {
    console.log('[QuickBite Seeder] Clearing existing database collections...');
    await User.deleteMany();
    await Restaurant.deleteMany();
    await Category.deleteMany();
    await MenuItem.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();
    await Notification.deleteMany();

    console.log('[QuickBite Seeder] Creating Users...');
    // 1. Admin
    const adminUser = await User.create({
      name: 'Super Admin QuickBite',
      email: 'admin@quickbite.com',
      password: 'password123',
      phone: '+91 99000 11223',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      walletBalance: 1500
    });

    // 2. Customer
    const customerUser = await User.create({
      name: 'Aarav Sharma',
      email: 'customer@quickbite.com',
      password: 'password123',
      phone: '+91 98765 43210',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      walletBalance: 850.00,
      addresses: [
        {
          label: 'Home',
          street: 'Flat 402, Lotus Residency, Central Avenue, Powai',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400076',
          isDefault: true
        },
        {
          label: 'Work',
          street: 'Tech Park Tower 3, 5th Floor, BKC',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400051',
          isDefault: false
        }
      ]
    });

    // 3. Vendors
    const vendor1 = await User.create({
      name: 'Chef Vikram Malhotra',
      email: 'vendor1@quickbite.com',
      password: 'password123',
      phone: '+91 98200 44556',
      role: 'vendor',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80'
    });

    const vendor2 = await User.create({
      name: 'Chef Maria D\'Souza',
      email: 'vendor2@quickbite.com',
      password: 'password123',
      phone: '+91 98200 77889',
      role: 'vendor',
      avatar: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=400&q=80'
    });

    const vendor3 = await User.create({
      name: 'Chef Ramesh Patel',
      email: 'vendor3@quickbite.com',
      password: 'password123',
      phone: '+91 98200 99001',
      role: 'vendor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    });

    console.log('[QuickBite Seeder] Creating Restaurants...');
    const restaurant1 = await Restaurant.create({
      ownerId: vendor1._id,
      name: 'The Royal Dum Biryani & Kebabs',
      tagline: 'Centuries-old Nizami Dum cooking & succulent Charcoal Kebabs',
      description: 'Slow-cooked in handi with fragrant basmati rice, saffron, and tender spices. Every bite is an experience.',
      cuisineType: ['Biryani', 'Mughlai', 'Kebabs', 'North Indian'],
      address: {
        street: 'Shop 12, Heritage Galleria, Linking Road, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400050'
      },
      phone: '+91 98200 44556',
      email: 'orders@royalbiryani.quickbite.com',
      bannerImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
      logo: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=300&q=80',
      rating: 4.8,
      totalReviews: 240,
      isOpen: true,
      isApproved: true,
      deliveryFee: 30,
      minOrderValue: 199,
      deliveryTimeMinutes: 25,
      isPureVeg: false,
      isFeatured: true
    });

    const restaurant2 = await Restaurant.create({
      ownerId: vendor2._id,
      name: 'Crust & Craft Woodfired Pizza',
      tagline: 'Artisanal sourdough crusts baked at 450°C in oak wood ovens',
      description: 'San Marzano tomatoes, fresh buffalo mozzarella, hand-stretched dough and gourmet toppings.',
      cuisineType: ['Italian', 'Woodfired Pizza', 'Pasta', 'Desserts'],
      address: {
        street: '45 Artisan Boulevard, Hiranandani Estate, Thane West',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400607'
      },
      phone: '+91 98200 77889',
      email: 'hello@crustcraft.quickbite.com',
      bannerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
      logo: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=300&q=80',
      rating: 4.7,
      totalReviews: 185,
      isOpen: true,
      isApproved: true,
      deliveryFee: 40,
      minOrderValue: 249,
      deliveryTimeMinutes: 30,
      isPureVeg: false,
      isFeatured: true
    });

    const restaurant3 = await Restaurant.create({
      ownerId: vendor3._id,
      name: 'Green Leaf Pure Veg Delights',
      tagline: '100% Pure Vegetarian Gujarati Thalis, South Indian, & Street Chaat',
      description: 'Prepared in dedicated sattvic vegetarian kitchens with desi ghee, fresh organic produce and traditional hospitality.',
      cuisineType: ['Pure Veg', 'North Indian', 'South Indian', 'Gujarati'],
      address: {
        street: '88 Shanti Sadan, SV Road, Vile Parle West',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400056'
      },
      phone: '+91 98200 99001',
      email: 'namaste@greenleaf.quickbite.com',
      bannerImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
      logo: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=300&q=80',
      rating: 4.9,
      totalReviews: 310,
      isOpen: true,
      isApproved: true,
      deliveryFee: 25,
      minOrderValue: 149,
      deliveryTimeMinutes: 20,
      isPureVeg: true,
      isFeatured: true
    });

    console.log('[QuickBite Seeder] Creating Categories...');
    const categories = await Category.insertMany([
      {
        name: 'Biryani & Bowls',
        slug: 'biryani-bowls',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
        description: 'Aromatic basmati rice cooked to perfection with rich spices',
        displayOrder: 1
      },
      {
        name: 'Woodfired Pizza',
        slug: 'woodfired-pizza',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
        description: 'Cheesy, crisp, sourdough hand-tossed artisan pizzas',
        displayOrder: 2
      },
      {
        name: 'North Indian Thalis',
        slug: 'north-indian-thalis',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80',
        description: 'Creamy gravies, hot butter naans, paneer curries, and dal makhani',
        displayOrder: 3
      },
      {
        name: 'Burgers & Fries',
        slug: 'burgers-fries',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        description: 'Juicy patties, melted cheddar, crispy fries and thick milkshakes',
        displayOrder: 4
      },
      {
        name: 'South Indian & Chaat',
        slug: 'south-indian-chaat',
        image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=400&q=80',
        description: 'Crisp ghee roast dosas, fluffy idlis, vada pav, and tangy chaats',
        displayOrder: 5
      },
      {
        name: 'Desserts & Sweets',
        slug: 'desserts-sweets',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
        description: 'Sizzling brownies, authentic gulab jamun, rasmalai and tiramisu',
        displayOrder: 6
      }
    ]);

    console.log('[QuickBite Seeder] Creating Menu Items...');
    // Menu items for Restaurant 1 (Royal Dum Biryani)
    await MenuItem.insertMany([
      {
        restaurantId: restaurant1._id,
        name: 'Royal Hyderabadi Mutton Dum Biryani',
        description: 'Prime cuts of tender baby lamb layered with aged basmati rice, saffron, and fried onions. Served with mirchi ka salan & burani raita.',
        price: 449,
        discountPrice: 399,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        isAvailable: true,
        categoryName: 'Biryani & Bowls',
        preparationTime: 25,
        spicyLevel: 'medium',
        isBestseller: true,
        rating: 4.9,
        addOns: [
          { name: 'Extra Salan & Raita', price: 40 },
          { name: 'Boiled Egg (2 pcs)', price: 30 }
        ]
      },
      {
        restaurantId: restaurant1._id,
        name: 'Awadhi Chicken Dum Biryani',
        description: 'Succulent chicken marinated in aromatic spices and slow-cooked in dum style. Unmatched aroma and flavour.',
        price: 349,
        discountPrice: 299,
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        isAvailable: true,
        categoryName: 'Biryani & Bowls',
        preparationTime: 20,
        spicyLevel: 'medium',
        isBestseller: true,
        rating: 4.8
      },
      {
        restaurantId: restaurant1._id,
        name: 'Shahi Paneer Tikka Biryani',
        description: 'Marinated cottage cheese cubes grilled over charcoal embers, layered with spiced saffron rice.',
        price: 299,
        discountPrice: null,
        image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        categoryName: 'Biryani & Bowls',
        preparationTime: 20,
        spicyLevel: 'mild',
        rating: 4.7
      },
      {
        restaurantId: restaurant1._id,
        name: 'Galouti Melt-in-Mouth Kebabs (4 pcs)',
        description: 'Tender minced mutton patties delicately flavoured with 32 secret spices. Served with ulte tawe ka paratha.',
        price: 380,
        discountPrice: null,
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        isAvailable: true,
        categoryName: 'North Indian Thalis',
        preparationTime: 18,
        rating: 4.9
      },
      {
        restaurantId: restaurant1._id,
        name: 'Royal Shahi Tukda with Rabdi',
        description: 'Crispy fried bread triangles steeped in saffron sugar syrup and topped with thick, velvety pistachio rabdi.',
        price: 160,
        discountPrice: 139,
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        categoryName: 'Desserts & Sweets',
        preparationTime: 10,
        rating: 4.9
      }
    ]);

    // Menu items for Restaurant 2 (Crust & Craft Pizza)
    await MenuItem.insertMany([
      {
        restaurantId: restaurant2._id,
        name: 'Signature Truffle & Wild Mushroom Pizza',
        description: 'White garlic base, roasted portobello mushrooms, fresh Fior di Latte mozzarella, parmesan and Italian truffle oil drizzle.',
        price: 499,
        discountPrice: 449,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        categoryName: 'Woodfired Pizza',
        preparationTime: 25,
        isBestseller: true,
        rating: 4.9,
        addOns: [
          { name: 'Extra Truffle Glaze', price: 60 },
          { name: 'Cheese Burst Crust', price: 90 }
        ]
      },
      {
        restaurantId: restaurant2._id,
        name: 'Firehouse Peri-Peri Smoked Chicken Pizza',
        description: 'Spiced smoked pulled chicken, sliced jalapeños, red onions, bird\'s eye chillies and gooey mozzarella.',
        price: 479,
        discountPrice: 429,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        isAvailable: true,
        categoryName: 'Woodfired Pizza',
        preparationTime: 20,
        spicyLevel: 'hot',
        isBestseller: true,
        rating: 4.8
      },
      {
        restaurantId: restaurant2._id,
        name: 'Creamy Truffle Alfredo Penne Pasta',
        description: 'Al dente penne pasta in rich parmesan cream sauce with sautéed garlic mushrooms and fresh parsley.',
        price: 360,
        discountPrice: null,
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        categoryName: 'Woodfired Pizza',
        preparationTime: 18,
        rating: 4.6
      },
      {
        restaurantId: restaurant2._id,
        name: 'Cheesy Garlic Breadsticks with Marinara',
        description: 'Freshly baked sourdough fingers smothered with roasted garlic butter, oregano, and mozzarella.',
        price: 199,
        discountPrice: 179,
        image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        categoryName: 'Woodfired Pizza',
        preparationTime: 15,
        rating: 4.7
      },
      {
        restaurantId: restaurant2._id,
        name: 'Classic Venetian Tiramisu Jar',
        description: 'Espresso-soaked savoiardi ladyfingers layered with mascarpone cream and dusted with Dutch cocoa.',
        price: 220,
        discountPrice: null,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        categoryName: 'Desserts & Sweets',
        preparationTime: 5,
        rating: 4.9
      }
    ]);

    // Menu items for Restaurant 3 (Green Leaf Pure Veg)
    await MenuItem.insertMany([
      {
        restaurantId: restaurant3._id,
        name: 'Maharaja Royal Gujarati Thali Feast',
        description: 'Includes 2 Farsan (Khaman Dhokla & Khandvi), 3 Curries (Paneer Butter Masala, Undhiyu, Dal Tadka), Kadhi, 4 Phulkas, Rice, Gulab Jamun, and Chhaas.',
        price: 349,
        discountPrice: 299,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        categoryName: 'North Indian Thalis',
        preparationTime: 18,
        isBestseller: true,
        rating: 4.9
      },
      {
        restaurantId: restaurant3._id,
        name: 'Crispy Ghee Roast Mysore Masala Dosa',
        description: 'Crisp golden crepe smeared with spicy red garlic chutney, filled with potato masala, served with coconut chutney & piping hot sambar.',
        price: 180,
        discountPrice: 159,
        image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        categoryName: 'South Indian & Chaat',
        preparationTime: 15,
        isBestseller: true,
        rating: 4.9
      },
      {
        restaurantId: restaurant3._id,
        name: 'Special Butter Pav Bhaji (Double Pav)',
        description: 'Mashed spiced seasonal vegetables cooked on a giant tawa with amul butter, served with 2 butter-toasted pavs, chopped onions, and lemon wedges.',
        price: 190,
        discountPrice: 169,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        categoryName: 'South Indian & Chaat',
        preparationTime: 12,
        rating: 4.8
      },
      {
        restaurantId: restaurant3._id,
        name: 'Thick Kesar Mango Lassi (400ml)',
        description: 'Creamy yogurt churned with real Alphonso mango pulp, saffron strands, and crushed pistachios.',
        price: 120,
        discountPrice: null,
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        categoryName: 'South Indian & Chaat',
        preparationTime: 5,
        rating: 4.9
      }
    ]);

    console.log('[QuickBite Seeder] Creating Coupons...');
    await Coupon.insertMany([
      {
        code: 'QUICKBITE50',
        title: '50% Welcome Discount',
        description: 'Enjoy 50% discount up to ₹150 on your orders above ₹199!',
        discountType: 'percentage',
        discountValue: 50,
        minOrderValue: 199,
        maxDiscount: 150,
        isActive: true
      },
      {
        code: 'MOJKARO',
        title: 'Khaao Pio Moj Karo Deal',
        description: 'Flat ₹100 instant cash discount on any feast above ₹349.',
        discountType: 'flat',
        discountValue: 100,
        minOrderValue: 349,
        maxDiscount: 100,
        isActive: true
      },
      {
        code: 'FEAST20',
        title: '20% Weekend Feast Discount',
        description: '20% off up to ₹250 for group and party orders above ₹499.',
        discountType: 'percentage',
        discountValue: 20,
        minOrderValue: 499,
        maxDiscount: 250,
        isActive: true
      }
    ]);

    console.log('[QuickBite Seeder] Creating Sample Interactive Orders...');
    // Order 1: Delivered
    await Order.create({
      orderNumber: 'QB-91823',
      customerId: customerUser._id,
      restaurantId: restaurant1._id,
      items: [
        {
          name: 'Royal Hyderabadi Mutton Dum Biryani',
          price: 399,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Royal Shahi Tukda with Rabdi',
          price: 139,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80'
        }
      ],
      subtotal: 538,
      deliveryFee: 30,
      tax: 27,
      discount: 100,
      totalAmount: 495,
      appliedCoupon: { code: 'MOJKARO', discount: 100 },
      deliveryAddress: {
        street: 'Flat 402, Lotus Residency, Powai',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400076',
        phone: '+91 98765 43210'
      },
      paymentMethod: 'WALLET',
      paymentStatus: 'paid',
      orderStatus: 'delivered',
      statusHistory: [
        { status: 'placed', timestamp: new Date(Date.now() - 3600000) },
        { status: 'confirmed', timestamp: new Date(Date.now() - 3200000) },
        { status: 'preparing', timestamp: new Date(Date.now() - 2500000) },
        { status: 'out_for_delivery', timestamp: new Date(Date.now() - 1500000) },
        { status: 'delivered', timestamp: new Date(Date.now() - 500000), comment: 'Delivered at door' }
      ]
    });

    // Order 2: In-Progress (Out for Delivery) - live tracking showcase!
    await Order.create({
      orderNumber: 'QB-55412',
      customerId: customerUser._id,
      restaurantId: restaurant2._id,
      items: [
        {
          name: 'Signature Truffle & Wild Mushroom Pizza',
          price: 449,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Cheesy Garlic Breadsticks with Marinara',
          price: 179,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80'
        }
      ],
      subtotal: 628,
      deliveryFee: 40,
      tax: 31,
      discount: 150,
      totalAmount: 549,
      appliedCoupon: { code: 'QUICKBITE50', discount: 150 },
      deliveryAddress: {
        street: 'Flat 402, Lotus Residency, Powai',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400076',
        phone: '+91 98765 43210'
      },
      paymentMethod: 'UPI',
      paymentStatus: 'paid',
      orderStatus: 'out_for_delivery',
      driverInfo: {
        name: 'Sunil Verma',
        phone: '+91 98112 33445',
        vehicleNumber: 'MH-03-BW-7821'
      },
      statusHistory: [
        { status: 'placed', timestamp: new Date(Date.now() - 1800000) },
        { status: 'confirmed', timestamp: new Date(Date.now() - 1400000) },
        { status: 'preparing', timestamp: new Date(Date.now() - 900000) },
        { status: 'out_for_delivery', timestamp: new Date(Date.now() - 300000), comment: 'Driver Sunil is en route' }
      ]
    });

    console.log('[QuickBite Seeder] Creating Reviews...');
    await Review.create({
      customerId: customerUser._id,
      customerName: 'Aarav Sharma',
      restaurantId: restaurant1._id,
      rating: 5,
      comment: 'Hands down the best Mutton Dum Biryani in Mumbai! Fragrant, generous meat pieces, and delivered hot within 25 mins. Truly Khaao Pio Moj Karo!',
      vendorReply: {
        comment: 'Thank you Aarav! Your appreciation means the world to our kitchen team.',
        repliedAt: new Date()
      }
    });

    console.log('[QuickBite Seeder] Sample data seeded successfully! 🎉');
  } catch (error) {
    console.error(`[QuickBite Seeder Error]: ${error.message}`);
  }
};

// Auto-seed if database is freshly created on Render / Cloud
export const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[QuickBite] Fresh database detected. Auto-seeding initial users, dishes, restaurants and coupons...');
      await seedData();
      console.log('[QuickBite] Production database initialized successfully!');
    }
  } catch (err) {
    console.warn('[QuickBite] Auto-seed check warning:', err.message);
  }
};

// If run directly via node seeder.js
if (process.argv[1]?.endsWith('seeder.js')) {
  import('../config/db.js').then(async ({ default: connectDB }) => {
    await connectDB();
    await seedData();
    process.exit();
  });
}
