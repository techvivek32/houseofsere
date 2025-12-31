import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, Instagram } from "lucide-react";

// Import product images
import goldenSharara from "@/assets/products/golden-sharara.jpg";
import maroonLehenga from "@/assets/products/maroon-lehenga.jpg";
import whiteAnarkali from "@/assets/products/white-anarkali.jpg";
import maroonJacketLehenga from "@/assets/products/maroon-jacket-lehenga.jpg";
import blueSharara from "@/assets/products/blue-sharara.jpg";
import purpleLehenga from "@/assets/products/purple-lehenga.jpg";
import greenGown from "@/assets/products/green-gown.jpg";
import bridalLehenga from "@/assets/products/bridal-lehenga.jpg";
import blackAnarkali from "@/assets/products/black-anarkali.jpg";
import plumVelvetSaree from "@/assets/products/plum-velvet-saree.jpg";
import skyBlueFloralLehenga from "@/assets/products/sky-blue-floral-lehenga.jpg";
import redShararaSet from "@/assets/products/red-sharara-set.jpg";
import lavenderFloralLehenga from "@/assets/products/lavender-floral-lehenga.jpg";
import maroonBridalSharara from "@/assets/products/maroon-bridal-sharara.jpg";
import royalBlueBandhani from "@/assets/products/royal-blue-bandhani.jpg";
import goldenBridalLehenga from "@/assets/products/golden-bridal-lehenga.jpg";
import blueBandhaniSuit from "@/assets/products/blue-bandhani-suit.jpg";
import orangeFloralLehenga from "@/assets/products/orange-floral-lehenga.jpg";
import orangeFloralGown from "@/assets/products/orange-floral-gown.png";
import purpleVelvetSaree from "@/assets/products/purple-velvet-saree.png";
import goldenSequinLehenga from "@/assets/products/golden-sequin-lehenga.png";
import coralFloralLehenga from "@/assets/products/coral-floral-lehenga.png";
import pinkEmbroideredLehenga from "@/assets/products/product-5.png";
import tealSilkGown from "@/assets/products/product-6.png";
import roseGoldLehenga from "@/assets/products/product-7.png";
import ivoryBridalLehenga from "@/assets/products/product-8.png";
import emeraldGreenSaree from "@/assets/products/product-9.png";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=7096748749";
const INSTAGRAM_URL = "https://www.instagram.com/house_ofsere/";

const getWhatsAppLink = (productTitle: string) => {
  const text = encodeURIComponent(`Hello, I'm interested in the ${productTitle}`);
  return `${WHATSAPP_URL}&text=${text}`;
};

const products = [
  {
    id: 1,
    title: "Plum Velvet Saree",
    category: "Saree",
    image: plumVelvetSaree,
  },
  {
    id: 2,
    title: "Sky Blue Floral Lehenga",
    category: "Lehenga",
    image: skyBlueFloralLehenga,
  },
  {
    id: 3,
    title: "Red Georgette Sharara Set",
    category: "Sharara",
    image: redShararaSet,
  },
  {
    id: 4,
    title: "Lavender Floral Lehenga",
    category: "Lehenga",
    image: lavenderFloralLehenga,
  },
  {
    id: 5,
    title: "Maroon Bridal Sharara",
    category: "Bridal",
    image: maroonBridalSharara,
  },
  {
    id: 6,
    title: "Royal Blue Bandhani Suit",
    category: "Suit",
    image: royalBlueBandhani,
  },
  {
    id: 7,
    title: "Golden Bridal Lehenga",
    category: "Bridal",
    image: goldenBridalLehenga,
  },
  {
    id: 8,
    title: "Blue Bandhani Kurta Set",
    category: "Suit",
    image: blueBandhaniSuit,
  },
  {
    id: 9,
    title: "Orange Floral Lehenga",
    category: "Lehenga",
    image: orangeFloralLehenga,
  },
  {
    id: 10,
    title: "Golden Sharara Set",
    category: "Sharara",
    image: goldenSharara,
  },
  {
    id: 11,
    title: "Maroon Designer Lehenga",
    category: "Lehenga",
    image: maroonLehenga,
  },
  {
    id: 12,
    title: "White Anarkali with Dupatta",
    category: "Anarkali",
    image: whiteAnarkali,
  },
  {
    id: 13,
    title: "Maroon Jacket Lehenga",
    category: "Lehenga",
    image: maroonJacketLehenga,
  },
  {
    id: 14,
    title: "Royal Blue Sharara",
    category: "Sharara",
    image: blueSharara,
  },
  {
    id: 15,
    title: "Purple Bridal Lehenga",
    category: "Lehenga",
    image: purpleLehenga,
  },
  {
    id: 16,
    title: "Lime Green Gown",
    category: "Gown",
    image: greenGown,
  },
  {
    id: 17,
    title: "Bridal Maroon Lehenga",
    category: "Bridal",
    image: bridalLehenga,
  },
  {
    id: 18,
    title: "Black Anarkali with Gold",
    category: "Anarkali",
    image: blackAnarkali,
  },
  {
    id: 19,
    title: "Orange Floral Gown",
    category: "Gown",
    image: orangeFloralGown,
  },
  {
    id: 20,
    title: "Purple Velvet Saree",
    category: "Saree",
    image: purpleVelvetSaree,
  },
  {
    id: 21,
    title: "Golden Sequin Lehenga",
    category: "Lehenga",
    image: goldenSequinLehenga,
  },
  {
    id: 22,
    title: "Coral Floral Lehenga",
    category: "Lehenga",
    image: coralFloralLehenga,
  },
  {
    id: 23,
    title: "Pink Embroidered Lehenga",
    category: "Lehenga",
    image: pinkEmbroideredLehenga,
  },
  {
    id: 24,
    title: "Teal Silk Gown",
    category: "Gown",
    image: tealSilkGown,
  },
  {
    id: 25,
    title: "Rose Gold Lehenga",
    category: "Lehenga",
    image: roseGoldLehenga,
  },
  {
    id: 26,
    title: "Ivory Bridal Lehenga",
    category: "Bridal",
    image: ivoryBridalLehenga,
  },
  {
    id: 27,
    title: "Emerald Green Saree",
    category: "Saree",
    image: emeraldGreenSaree,
  },
];

const CollectionsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="collections" className="section-padding bg-background" ref={ref}>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">
            Curated Excellence
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
            <span className="text-foreground">Our </span>
            <span className="gold-gradient">Collections</span>
          </h2>
          <div className="luxury-divider" />
          <p className="text-muted-foreground max-w-2xl mx-auto mt-6">
            Each piece in our collection is a masterpiece of traditional craftsmanship 
            and contemporary design, created to make you feel extraordinary.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.03 }}
              className="group relative overflow-hidden rounded-sm border border-border bg-card shadow-card hover:shadow-hover transition-all duration-500"
            >
              <div className="aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover hq-image transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              
              {/* Overlay - always visible on mobile, hover on desktop */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-primary/90 text-primary-foreground text-xs px-3 py-1 rounded-sm tracking-wider uppercase">
                  {product.category}
                </span>
              </div>
              
              {/* Content - always visible on mobile, hover on desktop */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground transform translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-serif text-lg mb-3">{product.title}</h3>
                <div className="flex gap-2">
                  <a
                    href={getWhatsAppLink(product.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-2 px-3 rounded-sm text-sm hover:bg-[#128C7E] transition-colors"
                    aria-label={`Inquire on WhatsApp about ${product.title}`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Inquire
                  </a>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center bg-primary/20 text-primary-foreground py-2 px-3 rounded-sm hover:bg-primary/30 transition-colors"
                    aria-label="Open Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground border border-primary hover:bg-transparent hover:text-primary shadow-luxury rounded-sm px-8 py-3 transition-all duration-300"
            aria-label="View more products on Instagram"
          >
            <Instagram className="h-5 w-5" />
            View More on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CollectionsSection;
