import icon from './icon.png';
import root from './root.jpg';
import logo from './logo.png';
import man from './man.png';
import banner from './banner.png';
import bannersm from './banner_sm.png';
import arrow from './right-arrow.png';
import hairoil from './hairoil.jpg';
import aloevera from './aloevera.jpg';
import lipbalm from './lipbalm.png';
import star_icon from './star.png';
import star_dull_icon from './star_dull.png';
import banner2 from './banner2.png';
import multanimitti from './multanimitti.jpg';
import addressimg from './address.png';
import products from './products.png';
import productlist from './productlist.png';
import orders from './orders.png';
import uploadarea from './image-upload.png';
import boxicon from './check-mark.png';
import soap from './soap.jpg';
import facewash from './facewash.jpg';
import sunscreen from './sunscreen.jpg';

export const assets = {
  icon,
  root,
  logo,
  man,
  banner,
  bannersm,
  arrow,
  hairoil,
  aloevera,
  lipbalm,
  star_icon,
  star_dull_icon,
  banner2,
  multanimitti,
  addressimg,
  products,
  productlist,
  orders,
  uploadarea,
  boxicon,
  soap,
  facewash,
  sunscreen,
};

export const categories = [
  {
    text: 'Oil',
    path: 'Oil',
    image: hairoil,
    bgColor: '#FEF6DA',
  },
  {
    text: 'Gel',
    path: 'Gel',
    image: aloevera,
    bgColor: '#FEE0E0',
  },
  {
    text: 'Balm',
    path: 'Balm',
    image: lipbalm,
    bgColor: '#FEF6DA',
  },
  {
    text: 'Powder',
    path: 'Powder',
    image: multanimitti,
    bgColor: '#FEE0E0',
  },
  {
    text: 'Sunscreen',
    path: 'Sunscreen',
    image: sunscreen, // Using aloevera as placeholder
    bgColor: '#E6F3FF',
  },
  {
    text: 'Face Wash',
    path: 'Face Wash',
    image: facewash, // Using hairoil as placeholder
    bgColor: '#F0F8FF',
  },
  {
    text: 'Soaps',
    path: 'Soaps',
    image: soap, // Using multanimitti as placeholder
    bgColor: '#FFF5E6',
  },
];

export const dummyProducts = [
  {
    _id: 'gd46g23g',
    name: 'Root Care Herbal Hair Oil',
    category: 'Oil',
    price: 250,
    offerPrice: 200,
    image: [hairoil],
    description: [
      'Natural Hair Oil',
      'Hair Growth & Anti-hairfall , Anti-Dandruff & Scalp Nourishment',
      'Ayurvedic Blend for Men & Women 100ml',
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    instock: true,
  },
  {
    _id: 'gd46g23h',
    name: 'Aloe Vera Gel',
    category: 'Gel',
    price: 250,
    offerPrice: 200,
    image: [aloevera],
    description: [
      'Natural Hair Oil',
      'Hair Growth & Anti-hairfall , Anti-Dandruff & Scalp Nourishment',
      'Ayurvedic Blend for Men & Women 100ml',
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    instock: true,
  },
  {
    _id: 'gd46g23i',
    name: 'Lip Balm',
    category: 'Balm',
    price: 250,
    offerPrice: 200,
    image: [lipbalm],
    description: [
      'Natural Hair Oil',
      'Hair Growth & Anti-hairfall , Anti-Dandruff & Scalp Nourishment',
      'Ayurvedic Blend for Men & Women 100ml',
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    instock: true,
  },
  {
    _id: 'gd46g23j',
    name: 'Multani Mitti',
    category: 'Powder',
    price: 250,
    offerPrice: 200,
    image: [multanimitti],
    description: [
      'Natural Hair Oil',
      'Hair Growth & Anti-hairfall , Anti-Dandruff & Scalp Nourishment',
      'Ayurvedic Blend for Men & Women 100ml',
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    instock: true,
  },
  {
    _id: 'gd46g23x',
    name: 'Multani Mitti 2',
    category: 'Powder',
    price: 250,
    offerPrice: 200,
    image: [multanimitti],
    description: [
      'Natural Hair Oil',
      'Hair Growth & Anti-hairfall , Anti-Dandruff & Scalp Nourishment',
      'Ayurvedic Blend for Men & Women 100ml',
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    instock: true,
  },
  {
    _id: 'gd46g23y',
    name: 'Natural Sunscreen SPF 50',
    category: 'Sunscreen',
    price: 350,
    offerPrice: 280,
    image: [aloevera],
    description: [
      'Natural Sun Protection',
      'Broad Spectrum SPF 50, UVA/UVB Protection',
      'Water Resistant, Non-Greasy Formula 50ml',
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    instock: true,
  },
  {
    _id: 'gd46g23z',
    name: 'Herbal Face Wash',
    category: 'Face Wash',
    price: 180,
    offerPrice: 150,
    image: [hairoil],
    description: [
      'Gentle Cleansing Formula',
      'Deep Cleansing & Oil Control',
      'Suitable for All Skin Types 100ml',
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    instock: true,
  },
  {
    _id: 'gd46g23w',
    name: 'Natural Herbal Soap',
    category: 'Soaps',
    price: 120,
    offerPrice: 95,
    image: [multanimitti],
    description: [
      'Handcrafted Natural Soap',
      'Moisturizing & Gentle on Skin',
      'Made with Natural Ingredients 100g',
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    instock: true,
  },
];

export const footerLinks = [
  {
    title: 'Quick Links',
    links: [
      { text: 'Home', link: '#' },
      { text: 'Best Sellers', link: '#' },
      { text: 'Offers & Deals', link: '#' },
      { text: 'Contact Us', link: '#' },
      { text: 'FAQs', link: '#' },
    ],
  },
  {
    title: 'Need help?',
    links: [
      { text: 'Delivery information', link: '#' },
      { text: 'Return & Refund Policy', link: '#' },
      { text: 'Payment Methodds', link: '#' },
      { text: 'Track Your Order', link: '#' },
      { text: 'Contact Us', link: '#' },
    ],
  },
  {
    title: ' Follow Us',
    links: [
      { text: 'Instagram', link: '#' },
      { text: 'Twitter', link: '#' },
      { text: 'Facebook', link: '#' },
      { text: 'Youtube', link: '#' },
    ],
  },
];
export const dummyAddresses = [
  {
    street: "12/4, Lake View Road, Adyar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600020",
    country: "India",
  },
  {
    street: "C-204, Green Meadows, Hinjewadi Phase 2",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411035",
    country: "India",
  },
  {
    street: "Flat 3B, Sky Heights, New Town",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700091", 
    country: "India",
  },
  {
    street: "27, MG Road, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    country: "India",
  },
  {
    street: "H-55, Sector 62",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",
    country: "India",
  },
];

export const dummyOrders = [
  {
    _id: "1a2b3c4d",
    userID: "user123",
    items:[
      {
        product:dummyProducts[3],
        quantity:1,
        _id:"1a2b3c4d-1",
      },
    ],
    amount: 200,
    address:dummyAddresses[0],
    status:"Order Placed",
    paymentType:"Online",
    isPaid:true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    _id: "1a2b3c4d5e",
    userID: "user124",
    items:[
      {
        product:dummyProducts[2],
        quantity:1,
        _id:"1a2b3c4d5e-1",
      },
    ],
    amount: 200,
    address:dummyAddresses[0],
    status:"Order Placed",
    paymentType:"COD",
    isPaid:false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    
  },
  
  
];