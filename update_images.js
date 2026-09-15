const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const imageMap = {
  'classic-round-neck-custom-tshirt': '/uploads/products/tshirt.jpg',
  'custom-polo-tshirt-printing': '/uploads/products/Polo Neck Custom T-Shirt.png',
  'custom-full-sleeve-tshirt': '/uploads/products/tshirt2.svg',
  'custom-spiral-notebook-a5': '/uploads/products/A5 Spiral Custom Notebook.png',
  'custom-hardcover-notebook-a4': '/uploads/products/Custom Hardcover Notebook.png',
  'custom-photo-mug-11oz': '/uploads/products/mug.jpg',
  'magic-color-changing-mug': '/uploads/products/Custom Photo Magic Mug.png',
  'canvas-photo-print-12x18': '/uploads/products/canvas.svg',
  'matte-business-cards-250': '/uploads/products/Standard Business Cards (100 pcs).png',
  'custom-printed-hoodie': '/uploads/products/Custom Printed Hoodie.png',
  'oversized-drop-shoulder-tshirt': '/uploads/products/Oversized Drop Shoulder T-Shirt.png',
  'custom-pocket-notebook-a6': '/uploads/products/Custom Pocket Notebook A6.png',
  'enamel-campfire-mug': '/uploads/products/Enamel Campfire Mug.png',
  'frosted-glass-beer-stein': '/uploads/products/Frosted Glass Stein.png',
  'premium-acrylic-photo-print': '/uploads/products/Premium Acrylic Photo Print.png',
  'transparent-business-cards-100': '/uploads/products/Transparent Business Cards (100 pcs).png',
  'custom-die-cut-vinyl-stickers': '/uploads/products/Custom Die-Cut Vinyl Stickers.png',
  'personalized-mouse-pad': '/uploads/products/Personalized Mouse Pad.png',
  'custom-printed-keychain': '/uploads/products/Custom Printed Keychain.png'
};

async function main() {
  console.log('Updating images...');
  for (const [slug, image] of Object.entries(imageMap)) {
    try {
      await prisma.product.updateMany({
        where: { slug },
        data: { images: [image] }
      });
      console.log(`Updated ${slug} -> ${image}`);
    } catch (e) {
      console.error(`Error updating ${slug}`, e);
    }
  }
  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
