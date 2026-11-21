// Centralized High-Fidelity Mock & Fallback Data for QuickBite
export const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Burger', slug: 'burger', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', count: 18 },
  { id: 'cat-2', name: 'Pizza', slug: 'pizza', icon: '🍕', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', count: 24 },
  { id: 'cat-3', name: 'Momos', slug: 'momos', icon: '🥟', image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=400&q=80', count: 14 },
  { id: 'cat-4', name: 'Samosa', slug: 'samosa', icon: '🥟', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80', count: 12 },
  { id: 'cat-5', name: 'Biryani', slug: 'biryani', icon: '🍚', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80', count: 32 },
  { id: 'cat-6', name: 'Chinese', slug: 'chinese', icon: '🍜', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80', count: 22 },
  { id: 'cat-7', name: 'South Indian', slug: 'south-indian', icon: '🥞', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=400&q=80', count: 19 },
  { id: 'cat-8', name: 'Snacks', slug: 'snacks', icon: '🍟', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400&q=80', count: 26 },
  { id: 'cat-9', name: 'Beverages', slug: 'beverages', icon: '🥤', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80', count: 15 },
  { id: 'cat-10', name: 'Desserts', slug: 'desserts', icon: '🍰', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80', count: 20 }
];

export const MOCK_RESTAURANTS = [
  {
    _id: 'rest-1',
    name: 'The Royal Dum Biryani & Kebabs',
    tagline: 'Centuries-old Nizami Dum cooking & charcoal kebabs',
    description: 'Slow cooked in clay handis with pure saffron, royal spices, and aged Daawat basmati rice.',
    cuisineType: ['Biryani', 'Mughlai', 'North Indian'],
    rating: 4.8,
    totalReviews: 342,
    deliveryTimeMinutes: 25,
    distanceKm: 1.8,
    deliveryFee: 30,
    minOrderValue: 199,
    isPureVeg: false,
    isOpen: true,
    isFeatured: true,
    bannerImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80',
    logo: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=200&q=80',
    address: { street: '12 Heritage Galleria, Linking Road, Bandra West', city: 'Mumbai', zipCode: '400050' },
    phone: '+91 98200 44556'
  },
  {
    _id: 'rest-2',
    name: 'Crust & Craft Woodfired Pizza Bar',
    tagline: 'Artisanal sourdough crusts baked in 450°C oak ovens',
    description: 'Imported San Marzano tomatoes, Fior di Latte buffalo mozzarella, and slow-fermented 48hr dough.',
    cuisineType: ['Pizza', 'Italian', 'Snacks'],
    rating: 4.7,
    totalReviews: 289,
    deliveryTimeMinutes: 30,
    distanceKm: 2.4,
    deliveryFee: 40,
    minOrderValue: 249,
    isPureVeg: false,
    isOpen: true,
    isFeatured: true,
    bannerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
    logo: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=200&q=80',
    address: { street: '45 Artisan Boulevard, Hiranandani Estate, Powai', city: 'Mumbai', zipCode: '400076' },
    phone: '+91 98200 77889'
  },
  {
    _id: 'rest-3',
    name: 'Green Leaf Pure Veg Delights',
    tagline: '100% Pure Vegetarian Sattvic Thalis & Street Chaat',
    description: 'Dedicated pure vegetarian kitchen prepared in Desi Cow Ghee with organic spices and farm-fresh produce.',
    cuisineType: ['South Indian', 'Snacks', 'Desserts'],
    rating: 4.9,
    totalReviews: 410,
    deliveryTimeMinutes: 20,
    distanceKm: 1.2,
    deliveryFee: 25,
    minOrderValue: 149,
    isPureVeg: true,
    isOpen: true,
    isFeatured: true,
    bannerImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80',
    logo: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=200&q=80',
    address: { street: '88 Shanti Sadan, SV Road, Vile Parle West', city: 'Mumbai', zipCode: '400056' },
    phone: '+91 98200 99001'
  },
  {
    _id: 'rest-4',
    name: 'The Burger Bunker & Shake Co.',
    tagline: 'Smash burgers, crispy loaded waffle fries & thick shakes',
    description: 'Caramelized smash patties, double aged cheddar, brioche buns, and house secret bunker sauce.',
    cuisineType: ['Burger', 'Snacks', 'Beverages'],
    rating: 4.6,
    totalReviews: 195,
    deliveryTimeMinutes: 22,
    distanceKm: 3.1,
    deliveryFee: 35,
    minOrderValue: 179,
    isPureVeg: false,
    isOpen: true,
    isFeatured: false,
    bannerImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
    logo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200&q=80',
    address: { street: 'Shop 4, Hill Road, Bandra West', city: 'Mumbai', zipCode: '400050' },
    phone: '+91 98200 22334'
  },
  {
    _id: 'rest-5',
    name: 'Dragon Wok Asian Kitchen & Momos',
    tagline: 'Steamed Himalayan momos, wok tossed hakka noodles & dimsums',
    description: 'Crispy fried and juicy steamed dumplings with fiery chili garlic dip and sizzling wok bowls.',
    cuisineType: ['Momos', 'Chinese', 'Snacks'],
    rating: 4.7,
    totalReviews: 215,
    deliveryTimeMinutes: 25,
    distanceKm: 2.8,
    deliveryFee: 30,
    minOrderValue: 199,
    isPureVeg: false,
    isOpen: true,
    isFeatured: false,
    bannerImage: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1000&q=80',
    logo: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=200&q=80',
    address: { street: '22 Lotus Park, Andheri East', city: 'Mumbai', zipCode: '400069' },
    phone: '+91 98200 66778'
  }
];

export const MOCK_DISHES = [
  {
    _id: 'dish-1',
    restaurantId: 'rest-1',
    restaurantName: 'The Royal Dum Biryani & Kebabs',
    name: 'Royal Hyderabadi Mutton Dum Biryani',
    description: 'Prime baby lamb layered with fragrant basmati, saffron, and fried onions. Served with mirchi ka salan.',
    price: 449,
    discountPrice: 399,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    isVeg: false,
    category: 'Biryani',
    categoryName: 'Biryani',
    rating: 4.9,
    preparationTime: 25,
    isBestseller: true,
    isPopular: true,
    isRecommended: true,
    variants: [
      { name: 'Regular Handi (Serves 1-2)', priceDelta: 0 },
      { name: 'Jumbo Royal Handi (Serves 3-4)', priceDelta: 320 }
    ],
    addOns: [
      { name: 'Extra Salan & Burani Raita', price: 40 },
      { name: 'Boiled Masala Egg (2 pcs)', price: 30 }
    ]
  },
  {
    _id: 'dish-2',
    restaurantId: 'rest-2',
    restaurantName: 'Crust & Craft Woodfired Pizza Bar',
    name: 'Signature Truffle & Wild Mushroom Pizza',
    description: 'White garlic base, roasted portobello mushrooms, fresh Fior di Latte mozzarella and Italian truffle glaze.',
    price: 499,
    discountPrice: 449,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    category: 'Pizza',
    categoryName: 'Pizza',
    rating: 4.9,
    preparationTime: 25,
    isBestseller: true,
    isPopular: true,
    isRecommended: true,
    variants: [
      { name: '10 inch Medium Sourdough', priceDelta: 0 },
      { name: '12 inch Large Cheese Burst', priceDelta: 160 }
    ],
    addOns: [
      { name: 'Extra Truffle Oil Drizzle', price: 60 },
      { name: 'Garlic Butter Dip', price: 35 }
    ]
  },
  {
    _id: 'dish-3',
    restaurantId: 'rest-4',
    restaurantName: 'The Burger Bunker & Shake Co.',
    name: 'Double Cheddar Smash Bacon Burger',
    description: 'Two crispy grilled patties, double smoked cheddar, pickled gherkins, and house secret sauce on brioche.',
    price: 299,
    discountPrice: 269,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    isVeg: false,
    category: 'Burger',
    categoryName: 'Burger',
    rating: 4.8,
    preparationTime: 18,
    isBestseller: true,
    isPopular: true,
    isRecommended: false,
    variants: [
      { name: 'Single Patty', priceDelta: -50 },
      { name: 'Double Smash Patty', priceDelta: 0 },
      { name: 'Triple Tower Beast', priceDelta: 120 }
    ],
    addOns: [
      { name: 'Crispy Peri-Peri Fries', price: 80 },
      { name: 'Belgian Chocolate Shake', price: 120 }
    ]
  },
  {
    _id: 'dish-4',
    restaurantId: 'rest-5',
    restaurantName: 'Dragon Wok Asian Kitchen & Momos',
    name: 'Steamed Darjeeling Chicken Momos (8 pcs)',
    description: 'Thin-skinned dumplings packed with minced spiced chicken and scallions, served with fiery sesame chilli dip.',
    price: 220,
    discountPrice: 189,
    image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=600&q=80',
    isVeg: false,
    category: 'Momos',
    categoryName: 'Momos',
    rating: 4.7,
    preparationTime: 15,
    isBestseller: true,
    isPopular: true,
    isRecommended: true,
    variants: [
      { name: 'Steamed Classic', priceDelta: 0 },
      { name: 'Pan-Fried Crispy Kothey', priceDelta: 30 },
      { name: 'Fiery Schezwan Tossed', priceDelta: 45 }
    ]
  },
  {
    _id: 'dish-5',
    restaurantId: 'rest-3',
    restaurantName: 'Green Leaf Pure Veg Delights',
    name: 'Crispy Ghee Roast Mysore Masala Dosa',
    description: 'Golden buttery crepe smeared with spicy red chilli garlic chutney and stuffed with potato sabzi.',
    price: 180,
    discountPrice: 159,
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    category: 'South Indian',
    categoryName: 'South Indian',
    rating: 4.9,
    preparationTime: 12,
    isBestseller: true,
    isPopular: true,
    isRecommended: true
  },
  {
    _id: 'dish-6',
    restaurantId: 'rest-3',
    restaurantName: 'Green Leaf Pure Veg Delights',
    name: 'Mumbai Special Butter Pav Bhaji',
    description: 'Slow-cooked spiced vegetable mash garnished with melted butter, served with two toasted soft pavs.',
    price: 190,
    discountPrice: 169,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    category: 'Snacks',
    categoryName: 'Snacks',
    rating: 4.8,
    preparationTime: 14,
    isBestseller: true,
    isPopular: true,
    isRecommended: false
  },
  {
    _id: 'dish-7',
    restaurantId: 'rest-3',
    restaurantName: 'Green Leaf Pure Veg Delights',
    name: 'Thick Kesar Mango Lassi (400ml)',
    description: 'Fresh dahi churned with natural Ratnagiri Alphonso mango pulp, saffron, and sliced dry fruits.',
    price: 120,
    discountPrice: null,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    category: 'Beverages',
    categoryName: 'Beverages',
    rating: 4.9,
    preparationTime: 5,
    isBestseller: false,
    isPopular: true,
    isRecommended: true
  },
  {
    _id: 'dish-8',
    restaurantId: 'rest-1',
    restaurantName: 'The Royal Dum Biryani & Kebabs',
    name: 'Royal Shahi Tukda with Rabdi',
    description: 'Crispy fried bread soaked in saffron cardamom syrup, dressed with rich pistachio malai rabdi.',
    price: 160,
    discountPrice: 139,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    category: 'Desserts',
    categoryName: 'Desserts',
    rating: 4.9,
    preparationTime: 10,
    isBestseller: false,
    isPopular: false,
    isRecommended: true
  }
];

export const MOCK_PROMO_BANNERS = [
  {
    id: 'promo-1',
    badge: 'EXCLUSIVE FEAST DEAL',
    title: '50% OFF up to ₹150',
    subtitle: 'On your first 3 food orders with QuickBite',
    code: 'QUICKBITE50',
    bgColor: 'linear-gradient(135deg, #FF7900 0%, #FF5A00 100%)',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'promo-2',
    badge: 'KHAAO PIO MOJ KARO',
    title: 'Flat ₹100 Instant Discount',
    subtitle: 'Valid on royal biryanis & artisan pizzas above ₹349',
    code: 'MOJKARO',
    bgColor: 'linear-gradient(135deg, #1C1C1C 0%, #2A2A2A 100%)',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'promo-3',
    badge: 'WEEKEND PARTY FEAST',
    title: 'Flat 20% OFF on Group Meals',
    subtitle: 'Feast with family & colleagues with zero delivery fee',
    code: 'FEAST20',
    bgColor: 'linear-gradient(135deg, #242424 0%, #171717 100%)',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
  }
];

export const MOCK_VENDOR_APPROVALS = [
  {
    id: 'app-101',
    restaurantName: 'Spice & Saffron Tandoor',
    ownerName: 'Harpreet Singh',
    email: 'harpreet@spicetandoor.com',
    phone: '+91 98334 55667',
    cuisine: 'North Indian, Tandoor',
    location: 'Lokhandwala, Andheri West, Mumbai',
    fssaiLicense: 'FSSAI-11522019000492',
    gstin: '27AABCS1429B1Z2',
    submittedAt: '2026-11-20T10:30:00Z',
    status: 'pending',
    docUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'app-102',
    restaurantName: 'Bonsai Sushi & Dimsum Express',
    ownerName: 'Chen Wei / Ananya Deshmukh',
    email: 'hello@bonsaisushi.in',
    phone: '+91 98112 77889',
    cuisine: 'Japanese, Pan-Asian, Dimsums',
    location: 'Bandra Reclamation, Mumbai',
    fssaiLicense: 'FSSAI-11522020000881',
    gstin: '27AABCS8891C1Z4',
    submittedAt: '2026-11-19T14:15:00Z',
    status: 'pending',
    docUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80'
  }
];

export const MOCK_COMPLAINTS = [
  {
    id: 'cmp-501',
    orderNumber: 'QB-91823',
    customerName: 'Aarav Sharma',
    restaurantName: 'The Royal Dum Biryani',
    issue: 'Raita was missing from package',
    severity: 'Medium',
    status: 'Open',
    date: '2026-11-21',
    resolutionNote: ''
  },
  {
    id: 'cmp-502',
    orderNumber: 'QB-44120',
    customerName: 'Priya Mehta',
    restaurantName: 'Crust & Craft Woodfired Pizza',
    issue: 'Pizza arrived lukewarm due to heavy rain delay',
    severity: 'Low',
    status: 'Resolved',
    date: '2026-11-18',
    resolutionNote: 'Credited ₹150 QuickBite wallet discount code'
  }
];
