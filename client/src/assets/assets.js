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
import shampoo from './shampoo.jpg';
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
  shampoo,
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
  {
    text: 'Shampoo',
    path: 'Shampoo',
    image: shampoo, // Using multanimitti as placeholder
    bgColor: '#FFF5E6',
  },
];

export const footerLinks = [
  {
    title: 'Quick Links',
    links: [
      { text: 'Home', link: 'https://startup-frontend-flame.vercel.app/' },
      { text: 'Offers & Deals', link: 'https://startup-frontend-flame.vercel.app/products' },
      { text: 'Contact Us', link: 'https://startup-frontend-flame.vercel.app/contact' },
    ],
  },
  {
    title: 'Need help?',
    links: [
      { text: 'Delivery information', link: 'https://startup-frontend-flame.vercel.app/contact' },
      { text: 'Return & Refund Policy', link: 'https://startup-frontend-flame.vercel.app/contact' },
      { text: 'Contact Us', link: 'https://startup-frontend-flame.vercel.app/contact' },
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
