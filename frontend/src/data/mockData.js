// Centralized High-Fidelity Mock & Fallback Data for QuickBite
export const MOCK_CATEGORIES = [
  { id: 'cat-dessert', name: 'Dessert', slug: 'desserts', icon: '🍰', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80', count: 20 },
  { id: 'cat-drinks', name: 'Drinks', slug: 'beverages', icon: '🍹', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80', count: 18 },
  { id: 'cat-burger', name: 'Burger', slug: 'burger', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', count: 24 },
  { id: 'cat-pizza', name: 'Pizza', slug: 'pizza', icon: '🍕', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80', count: 28 },
  { id: 'cat-biryani', name: 'Biryani', slug: 'biryani', icon: '🍚', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80', count: 32 },
  { id: 'cat-momos', name: 'Momos', slug: 'momos', icon: '🥟', image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=400&q=80', count: 14 },
  { id: 'cat-chinese', name: 'Chinese', slug: 'chinese', icon: '🍜', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80', count: 22 },
  { id: 'cat-south-indian', name: 'South Indian', slug: 'south-indian', icon: '🥞', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=400&q=80', count: 19 },
  { id: 'cat-snacks', name: 'Snacks', slug: 'snacks', icon: '🍟', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400&q=80', count: 26 },
  { id: 'cat-samosa', name: 'Samosa', slug: 'samosa', icon: '🥟', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80', count: 12 }
];

export const MOCK_RESTAURANTS = [
  {
    _id: 'rest-2',
    name: 'Crust & Craft Woodfired Pizza Bar',
    tagline: 'Artisanal sourdough crusts baked in 450°C oak ovens',
    description: 'Imported San Marzano tomatoes, Fior di Latte buffalo mozzarella, and slow-fermented 48hr dough.',
    cuisineType: ['Pizza', 'Italian', 'Snacks'],
    rating: 4.9,
    totalReviews: 2300,
    deliveryTimeMinutes: 25,
    distanceKm: 2.4,
    deliveryFee: 40,
    minOrderValue: 249,
    isPureVeg: false,
    isOpen: true,
    isFeatured: true,
    bannerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
    logo: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=200&q=80',
    address: { street: '45 Artisan Boulevard, California, USA', city: 'California', zipCode: '90210' },
    phone: '+1 (555) 382-9901'
  },
  {
    _id: 'rest-1',
    name: 'The Royal Dum Biryani & Kebabs',
    tagline: 'Centuries-old Nizami Dum cooking & charcoal kebabs',
    description: 'Slow cooked in clay handis with pure saffron, royal spices, and aged Daawat basmati rice.',
    cuisineType: ['Biryani', 'Mughlai', 'North Indian'],
    rating: 4.8,
    totalReviews: 1420,
    deliveryTimeMinutes: 25,
    distanceKm: 1.8,
    deliveryFee: 30,
    minOrderValue: 199,
    isPureVeg: false,
    isOpen: true,
    isFeatured: true,
    bannerImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80',
    logo: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=200&q=80',
    address: { street: '12 Heritage Galleria, Linking Road', city: 'California', zipCode: '90001' },
    phone: '+1 (555) 982-4455'
  },
  {
    _id: 'rest-4',
    name: 'The Burger Bunker & Shake Co.',
    tagline: 'Smash burgers, crispy loaded waffle fries & thick shakes',
    description: 'Caramelized smash patties, double aged cheddar, brioche buns, and house secret bunker sauce.',
    cuisineType: ['Burger', 'Snacks', 'Beverages'],
    rating: 4.8,
    totalReviews: 890,
    deliveryTimeMinutes: 20,
    distanceKm: 3.1,
    deliveryFee: 35,
    minOrderValue: 179,
    isPureVeg: false,
    isOpen: true,
    isFeatured: true,
    bannerImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
    logo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200&q=80',
    address: { street: 'Shop 4, Sunset Boulevard', city: 'California', zipCode: '90028' },
    phone: '+1 (555) 782-2233'
  },
  {
    _id: 'rest-3',
    name: 'Green Leaf Pure Veg & Desserts',
    tagline: 'Artisan bakery, farm fresh beverages and gourmet treats',
    description: 'Freshly baked berry cakes, cold-pressed fruit mocktails, and decadent confections.',
    cuisineType: ['Desserts', 'Beverages', 'Snacks'],
    rating: 4.9,
    totalReviews: 1840,
    deliveryTimeMinutes: 15,
    distanceKm: 1.2,
    deliveryFee: 25,
    minOrderValue: 149,
    isPureVeg: true,
    isOpen: true,
    isFeatured: true,
    bannerImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80',
    logo: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=200&q=80',
    address: { street: '88 Rose Valley Avenue', city: 'California', zipCode: '90036' },
    phone: '+1 (555) 990-0112'
  }
];

export const MOCK_DISHES = [
  {
    _id: 'dish-supreme-pizza',
    restaurantId: 'rest-2',
    restaurantName: 'Crust & Craft Woodfired Pizza Bar',
    name: 'Supreme Pizza',
    description: 'Fresh veggies, rich mozzarella, and crispy baked crust with bold seasoning and house tomato glaze.',
    price: 20.00,
    discountPrice: null,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    category: 'Pizza',
    categoryName: 'Pizza',
    rating: 4.9,
    reviewsCount: '2.3k',
    preparationTime: '25-30 Min',
    calories: '100 Kcal',
    isBestseller: true,
    isPopular: true,
    isRecommended: true,
    variants: [
      { name: 'Small', priceDelta: 0 },
      { name: 'Medium', priceDelta: 4 },
      { name: 'Large', priceDelta: 8 }
    ],
    addOns: [
      { name: 'Extra Cheese', price: 2.00, image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=200&q=80' },
      { name: 'Mushroom Dip', price: 1.50, image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=200&q=80' }
    ]
  },
  {
    _id: 'dish-dessert',
    restaurantId: 'rest-3',
    restaurantName: 'Green Leaf Pure Veg & Desserts',
    name: 'Dessert',
    description: 'Decadent strawberry sponge layered with fresh whipped vanilla cream, sweet glaze, and ripe berry slices.',
    price: 6.99,
    discountPrice: null,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    category: 'Desserts',
    categoryName: 'Dessert',
    rating: 4.9,
    reviewsCount: '1.8k',
    preparationTime: '10-15 Min',
    calories: '180 Kcal',
    isBestseller: true,
    isPopular: true,
    isRecommended: true,
    variants: [
      { name: 'Single Slice', priceDelta: 0 },
      { name: 'Box of 2', priceDelta: 5.50 }
    ],
    addOns: [
      { name: 'Whipped Cream', price: 1.00, image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=200&q=80' }
    ]
  },
  {
    _id: 'dish-drinks',
    restaurantId: 'rest-3',
    restaurantName: 'Green Leaf Pure Veg & Desserts',
    name: 'Drinks',
    description: 'Chilled cold-pressed botanical fruit coolers with fresh mint sprigs, citrus zest, and natural crushed berries.',
    price: 6.99,
    discountPrice: null,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    category: 'Beverages',
    categoryName: 'Drinks',
    rating: 4.9,
    reviewsCount: '3.1k',
    preparationTime: '5-10 Min',
    calories: '65 Kcal',
    isBestseller: true,
    isPopular: true,
    isRecommended: true,
    variants: [
      { name: '350ml Regular', priceDelta: 0 },
      { name: '500ml Jumbo Jar', priceDelta: 2.50 }
    ],
    addOns: [
      { name: 'Boba Pearls', price: 1.20, image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=200&q=80' }
    ]
  },
  {
    _id: 'dish-burger',
    restaurantId: 'rest-4',
    restaurantName: 'The Burger Bunker & Shake Co.',
    name: 'Burger',
    description: 'Caramelized smash patty, melted aged cheddar, crisp lettuce, house bunker sauce on toasted brioche.',
    price: 8.99,
    discountPrice: null,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    category: 'Burger',
    categoryName: 'Burger',
    rating: 4.9,
    reviewsCount: '2.1k',
    preparationTime: '15-20 Min',
    calories: '320 Kcal',
    isBestseller: true,
    isPopular: true,
    isRecommended: true,
    variants: [
      { name: 'Single Patty', priceDelta: 0 },
      { name: 'Double Patty', priceDelta: 3.50 }
    ],
    addOns: [
      { name: 'Crispy Fries', price: 2.50, image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=200&q=80' }
    ]
  },
  {
    _id: 'dish-margherita',
    restaurantId: 'rest-2',
    restaurantName: 'Crust & Craft Woodfired Pizza Bar',
    name: 'Margherita Pizza',
    description: 'Classic Neapolitan pizza with San Marzano tomato coulis, fresh buffalo mozzarella, and fragrant garden basil.',
    price: 14.99,
    discountPrice: null,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    category: 'Pizza',
    categoryName: 'Pizza',
    rating: 4.8,
    reviewsCount: '1.9k',
    preparationTime: '20-25 Min',
    calories: '190 Kcal',
    isBestseller: false,
    isPopular: true,
    isRecommended: true,
    variants: [
      { name: '10 Inch', priceDelta: 0 },
      { name: '12 Inch', priceDelta: 4 }
    ],
    addOns: [
      { name: 'Extra Mozzarella', price: 2.00, image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=200&q=80' }
    ]
  },
  {
    _id: 'dish-alfredo',
    restaurantId: 'rest-2',
    restaurantName: 'Crust & Craft Woodfired Pizza Bar',
    name: 'Alfredo Pasta',
    description: 'Fresh fettuccine tossed in a silky parmesan garlic butter emulsion with cracked black pepper and herbs.',
    price: 12.99,
    discountPrice: null,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281220?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    category: 'Italian',
    categoryName: 'Pasta',
    rating: 4.8,
    reviewsCount: '1.4k',
    preparationTime: '15-20 Min',
    calories: '260 Kcal',
    isBestseller: false,
    isPopular: true,
    isRecommended: true,
    variants: [
      { name: 'Regular', priceDelta: 0 },
      { name: 'Large', priceDelta: 3.50 }
    ],
    addOns: [
      { name: 'Garlic Bread (2 pcs)', price: 2.20, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=200&q=80' }
    ]
  },
  {
    _id: 'dish-biryani',
    restaurantId: 'rest-1',
    restaurantName: 'The Royal Dum Biryani & Kebabs',
    name: 'Royal Dum Biryani',
    description: 'Fragrant basmati rice layered with prime slow-braised spices, saffron milk, and caramelized onions.',
    price: 15.99,
    discountPrice: null,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    category: 'Biryani',
    categoryName: 'Biryani',
    rating: 4.9,
    reviewsCount: '3.4k',
    preparationTime: '25-30 Min',
    calories: '310 Kcal',
    isBestseller: true,
    isPopular: true,
    isRecommended: true,
    variants: [
      { name: 'Regular Handi', priceDelta: 0 },
      { name: 'Jumbo Royal Handi', priceDelta: 7.00 }
    ]
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
