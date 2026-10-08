const products = [
  // =====================================================
  // 📱 IPHONE / IOS
  // =====================================================

  {
    id: 1,
    name: "iPhone 12",
    brand: "Apple",
    category: "Téléphones",
    system: "iOS",
    price: 300000,
    image: "/images/12.png",
    badge: "Disponible",
  },

  {
    id: 2,
    name: "iPhone 12 Pro",
    brand: "Apple",
    category: "Téléphones",
    system: "iOS",
    price: 350000,
    image: "/images/iphone-12-pro.png",
    badge: "Populaire",
  },

  {
    id: 3,
    name: "iPhone 12 Pro Max",
    brand: "Apple",
    category: "Téléphones",
    system: "iOS",
    price: 400000,
    image: "/images/Iphone-12-Pro-Max-Bleu.png",
    badge: "Premium",
  },

  {
    id: 4,
    name: "iPhone 13",
    brand: "Apple",
    category: "Téléphones",
    system: "iOS",
    price: 380000,
    image: "/images/iphone13.jpg",
    badge: "Populaire",
  },

  {
    id: 5,
    name: "iPhone 14",
    brand: "Apple",
    category: "Téléphones",
    system: "iOS",
    price: 430000,
    image: "/images/iPhone14-blue-333x389-2.jpg",
    badge: "Disponible",
  },

  {
    id: 6,
    name: "iPhone 15",
    brand: "Apple",
    category: "Téléphones",
    system: "iOS",
    price: 500000,
    image: "/images/iphone_15_hero.png",
    badge: "Nouveau",
  },

  {
    id: 7,
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "Téléphones",
    system: "iOS",
    price: 650000,
    image: "/images/iPhone15pro.webp",
    badge: "Premium",
  },

  {
    id: 8,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "Téléphones",
    system: "iOS",
    price: 750000,
    image: "/images/iphone-15-pro-max-gris.webp",
    badge: "Premium",
  },

  {
    id: 9,
    name: "iPhone 16",
    brand: "Apple",
    category: "Téléphones",
    system: "iOS",
    price: 600000,
    image: "/images/iPhone_16_Noir_6.jpg",
    badge: "Nouveau",
  },

  {
    id: 10,
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    category: "Téléphones",
    system: "iOS",
    price: 800000,
    image: "/images/16ProMax.jfif",
    badge: "Premium",
  },

  {
    id: 11,
    name: "iPhone 17",
    brand: "Apple",
    category: "Téléphones",
    system: "iOS",
    price: 700000,
    image: "/images/17.jfif",
    badge: "Nouveau",
  },

  {
    id: 12,
    name: "iPhone 17 Air",
    brand: "Apple",
    category: "Téléphones",
    system: "iOS",
    price: 750000,
    image: "/images/17Air.jfif",
    badge: "Nouveau",
  },

  {
    id: 13,
    name: "iPhone 17 Pro",
    brand: "Apple",
    category: "Téléphones",
    system: "iOS",
    price: 850000,
    image: "/images/17Pro.jfif",
    badge: "Premium",
  },

  {
    id: 14,
    name: "iPhone 17 Pro Max",
    brand: "Apple",
    category: "Téléphones",
    system: "iOS",
    price: 950000,
    image: "/images/iphone-17-pro-max.jpg",
    badge: "Premium",
  },

  {
    id: 15,
    name: "iPhone 18 Pro",
    brand: "Apple",
    category: "Téléphones",
    system: "iOS",
    price: 1000000,
    image: "/images/iPhone-18-Pro.jpg",
    badge: "Nouveau",
  },

  // =====================================================
  // 🤖 ANDROID
  // =====================================================

  {
    id: 16,
    name: "Samsung Galaxy A16",
    brand: "Samsung",
    category: "Téléphones",
    system: "Android",
    price: 95000,
    image: "/images/A16.jfif",
    badge: "Disponible",
  },

  {
    id: 17,
    name: "Samsung Galaxy A25",
    brand: "Samsung",
    category: "Téléphones",
    system: "Android",
    price: 140000,
    image: "/images/A25.jpg",
    badge: "Populaire",
  },

  {
    id: 18,
    name: "Samsung Galaxy A56",
    brand: "Samsung",
    category: "Téléphones",
    system: "Android",
    price: 250000,
    image: "/images/A56.jfif",
    badge: "Nouveau",
  },

  {
    id: 19,
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    category: "Téléphones",
    system: "Android",
    price: 450000,
    image: "/images/S24.jfif",
    badge: "Premium",
  },

  {
    id: 20,
    name: "Google Pixel 8",
    brand: "Google",
    category: "Téléphones",
    system: "Android",
    price: 350000,
    image: "/images/Pixel8.jfif",
    badge: "Disponible",
  },

  {
    id: 21,
    name: "Google Pixel 9 Pro",
    brand: "Google",
    category: "Téléphones",
    system: "Android",
    price: 550000,
    image: "/images/PIXEL-9-PRO-2-600x600-1-1.png",
    badge: "Premium",
  },

  {
    id: 22,
    name: "Redmi Note 13",
    brand: "Xiaomi",
    category: "Téléphones",
    system: "Android",
    price: 130000,
    image: "/images/RedmiNote13.jpg",
    badge: "Populaire",
  },

  {
    id: 23,
    name: "Xiaomi 14",
    brand: "Xiaomi",
    category: "Téléphones",
    system: "Android",
    price: 400000,
    image: "/images/Xiaomi 14.webp",
    badge: "Premium",
  },

  // =====================================================
  // 🎧 ACCESSOIRES IOS
  // =====================================================

  {
    id: 24,
    name: "Coque iPhone Premium",
    brand: "Apple",
    category: "Accessoires",
    system: "iOS",
    type: "Coques",
    price: 10000,
    image: "/images/coque-iphone.png",
    badge: "Disponible",
  },

  {
    id: 25,
    name: "Chargeur iPhone",
    brand: "Apple",
    category: "Accessoires",
    system: "iOS",
    type: "Chargeurs",
    price: 15000,
    image: "/images/chzargeur-iphone.jfif",
    badge: "Populaire",
  },

  {
    id: 26,
    name: "AirPods",
    brand: "Apple",
    category: "Accessoires",
    system: "iOS",
    type: "Écouteurs",
    price: 120000,
    image: "/images/Airpod.jfif",
    badge: "Premium",
  },

  // =====================================================
  // 🎧 ACCESSOIRES ANDROID / UNIVERSELS
  // =====================================================

  {
    id: 27,
    name: "Coque Samsung Galaxy",
    brand: "Samsung",
    category: "Accessoires",
    system: "Android",
    type: "Coques",
    price: 10000,
    image: "/images/Coque-Samsung-Galaxy-A57-Silicone-Noir.webp",
    badge: "Disponible",
  },

  {
    id: 28,
    name: "Câble Chargeur USB",
    brand: "Universel",
    category: "Accessoires",
    system: "Android",
    type: "Câbles",
    price: 8000,
    image: "/images/cable-chargeur usb.jfif",
    badge: "Disponible",
  },

  {
    id: 29,
    name: "Écouteurs",
    brand: "Universel",
    category: "Accessoires",
    system: "Android",
    type: "Écouteurs",
    price: 15000,
    image: "/images/ecouteur.png",
    badge: "Disponible",
  },

  {
    id: 30,
    name: "Écouteurs Bluetooth",
    brand: "Universel",
    category: "Accessoires",
    system: "Android",
    type: "Écouteurs",
    price: 25000,
    image: "/images/ecouteur-blue.jfif",
    badge: "Populaire",
  },

  {
    id: 31,
    name: "Écouteurs USB-C",
    brand: "Universel",
    category: "Accessoires",
    system: "Android",
    type: "Écouteurs",
    price: 20000,
    image: "/images/ecouteurs-usb-c-avec-micro-et-controle-du-volume.jpg",
    badge: "Disponible",
  },

  {
    id: 32,
    name: "Power Bank 20 000 mAh",
    brand: "Universel",
    category: "Accessoires",
    system: "Android",
    type: "Power Banks",
    price: 25000,
    image: "/images/Pwerbank.jpg",
    badge: "Disponible",
  },
];

export default products;
