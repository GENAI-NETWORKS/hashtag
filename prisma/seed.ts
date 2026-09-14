import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hashtagprints.in' },
    update: {},
    create: {
      name: 'Hashtag Admin',
      email: 'admin@hashtagprints.in',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create categories
  const categories = [
    {
      name: 'T-Shirts',
      slug: 'custom-tshirt-printing',
      icon: 'Shirt',
      description: 'Custom printed t-shirts for individuals, events, and corporate teams. Choose from 100% cotton, polyester, and blended fabrics.',
      sortOrder: 1,
    },
    {
      name: 'Notebooks',
      slug: 'notebook-printing-online',
      icon: 'BookOpen',
      description: 'Personalized notebooks with custom covers, spiral-bound or hardcover. Perfect for gifting, corporate use, and events.',
      sortOrder: 2,
    },
    {
      name: 'Mugs',
      slug: 'custom-mug-printing',
      icon: 'Coffee',
      description: 'Photo mugs, magic mugs, and corporate mugs with full-color custom printing. Dishwasher-safe ceramic mugs.',
      sortOrder: 3,
    },
    {
      name: 'Photo Prints',
      slug: 'photo-printing-online',
      icon: 'Image',
      description: 'High-resolution photo prints on canvas, photo paper, and acrylic. Ideal for home decor and gifts.',
      sortOrder: 4,
    },
    {
      name: 'Business Cards',
      slug: 'business-card-printing',
      icon: 'CreditCard',
      description: 'Premium business cards with matte, glossy, or soft-touch finish. Fast turnaround with bulk discounts.',
      sortOrder: 5,
    },
    {
      name: 'Stickers',
      slug: 'custom-sticker-printing',
      icon: 'Tag',
      description: 'Waterproof vinyl stickers, die-cut stickers, and label stickers in any shape and size.',
      sortOrder: 6,
    },
    {
      name: 'Gifts & More',
      slug: 'custom-gifts-printing',
      icon: 'Gift',
      description: 'Custom printed gifts including phone covers, cushions, keychains, and award plaques.',
      sortOrder: 7,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories created');

  // Get category IDs
  const tshirtCat = await prisma.category.findUnique({ where: { slug: 'custom-tshirt-printing' } });
  const notebookCat = await prisma.category.findUnique({ where: { slug: 'notebook-printing-online' } });
  const mugCat = await prisma.category.findUnique({ where: { slug: 'custom-mug-printing' } });
  const photoCat = await prisma.category.findUnique({ where: { slug: 'photo-printing-online' } });
  const bcardCat = await prisma.category.findUnique({ where: { slug: 'business-card-printing' } });
  const stickerCat = await prisma.category.findUnique({ where: { slug: 'custom-sticker-printing' } });
  const giftCat = await prisma.category.findUnique({ where: { slug: 'custom-gifts-printing' } });

  // Create sample products
  const products = [
    // T-Shirts
    {
      categoryId: tshirtCat!.id,
      name: 'Classic Round Neck T-Shirt',
      slug: 'classic-round-neck-custom-tshirt',
      description: 'Premium 180 GSM 100% combed cotton round-neck t-shirt. Ideal for custom printing with vibrant, long-lasting colors. Available in 15+ colors.',
      basePrice: 299,
      images: ['/uploads/products/tshirt-round-neck.jpg'],
      tags: ['tshirt', 'cotton', 'custom', 'roundneck'],
      isFeatured: true,
      isBestseller: true,
      metaTitle: 'Custom Round Neck T-Shirt Printing in Salem | Hashtag Prints',
      metaDesc: 'Order custom printed round-neck t-shirts in Salem. 180 GSM cotton, vibrant printing, starting at ₹299. Bulk discounts available.',
    },
    {
      categoryId: tshirtCat!.id,
      name: 'Polo T-Shirt with Logo',
      slug: 'custom-polo-tshirt-printing',
      description: '220 GSM premium polo t-shirt with collar. Perfect for corporate events, team uniforms, and brand merchandise. Custom logo printing.',
      basePrice: 449,
      images: ['/uploads/products/tshirt-polo.jpg'],
      tags: ['polo', 'corporate', 'custom', 'logo'],
      isFeatured: true,
      metaTitle: 'Custom Polo T-Shirt Printing Salem | Corporate Uniforms | Hashtag',
      metaDesc: 'Custom polo t-shirt printing for corporate teams and events in Salem. Starting ₹449. Bulk orders welcomed.',
    },
    {
      categoryId: tshirtCat!.id,
      name: 'Full Sleeve Custom T-Shirt',
      slug: 'custom-full-sleeve-tshirt',
      description: '100% cotton full sleeve t-shirt with custom all-over printing or chest print. Great for winters and sports teams.',
      basePrice: 399,
      images: ['/uploads/products/tshirt-full-sleeve.jpg'],
      tags: ['fullsleeve', 'cotton', 'custom', 'sports'],
    },
    // Notebooks
    {
      categoryId: notebookCat!.id,
      name: 'Custom Spiral Notebook A5',
      slug: 'custom-spiral-notebook-a5',
      description: 'A5 spiral-bound notebook with custom printed cover. 200 pages, 70 GSM ruled paper. Perfect for corporate gifts and events.',
      basePrice: 199,
      images: ['/uploads/products/notebook-spiral-a5.jpg'],
      tags: ['notebook', 'spiral', 'a5', 'corporate'],
      isFeatured: true,
      isBestseller: true,
      metaTitle: 'Custom Notebook Printing Salem | Personalized Spiral Notebooks | Hashtag',
      metaDesc: 'Custom printed spiral notebooks in Salem. A5 size, 200 pages, starting ₹199. Corporate bulk orders with fast delivery.',
    },
    {
      categoryId: notebookCat!.id,
      name: 'Hardcover Custom Notebook A4',
      slug: 'custom-hardcover-notebook-a4',
      description: 'Premium A4 hardcover notebook with custom cover design. 240 pages, premium 80 GSM paper. UV coated cover for durability.',
      basePrice: 349,
      images: ['/uploads/products/notebook-hardcover-a4.jpg'],
      tags: ['notebook', 'hardcover', 'a4', 'premium'],
      isFeatured: true,
    },
    // Mugs
    {
      categoryId: mugCat!.id,
      name: 'Classic Photo Mug 11oz',
      slug: 'custom-photo-mug-11oz',
      description: '11oz ceramic mug with full-wrap custom photo printing. Dishwasher-safe, food-grade coating. Perfect for gifts.',
      basePrice: 249,
      images: ['/uploads/products/mug-classic-11oz.jpg'],
      tags: ['mug', 'photo', 'ceramic', 'gift'],
      isFeatured: true,
      isBestseller: true,
      metaTitle: 'Custom Photo Mug Printing Salem | Personalized Mugs | Hashtag',
      metaDesc: 'Order custom photo mugs in Salem. 11oz ceramic, dishwasher-safe, starting ₹249. Same-day dispatch available.',
    },
    {
      categoryId: mugCat!.id,
      name: 'Magic Color-Changing Mug',
      slug: 'magic-color-changing-mug',
      description: 'Special black mug that reveals your custom photo when hot liquid is added. 11oz ceramic with heat-sensitive coating.',
      basePrice: 349,
      images: ['/uploads/products/mug-magic.jpg'],
      tags: ['mug', 'magic', 'colorchange', 'gift'],
      isFeatured: true,
    },
    // Photo Prints
    {
      categoryId: photoCat!.id,
      name: 'Canvas Photo Print 12x18',
      slug: 'canvas-photo-print-12x18',
      description: 'High-resolution photo printed on premium canvas. Gallery-wrapped, ready to hang. Ideal for home decor and special memories.',
      basePrice: 599,
      images: ['/uploads/products/photo-canvas-12x18.jpg'],
      tags: ['canvas', 'photo', 'homedecor', 'print'],
      isFeatured: true,
    },
    {
      categoryId: bcardCat!.id,
      name: 'Matte Business Cards (250 pcs)',
      slug: 'matte-business-cards-250',
      description: '250 premium matte-finish business cards. 350 GSM, full-color both sides, soft-touch matte coating. 2-day delivery.',
      basePrice: 499,
      images: ['/uploads/products/bcard-matte.jpg'],
      tags: ['businesscard', 'matte', 'bulk', 'corporate'],
      isBestseller: true,
    },
    // More T-Shirts
    {
      categoryId: tshirtCat!.id,
      name: 'Custom Printed Hoodie',
      slug: 'custom-printed-hoodie',
      description: 'Premium 320 GSM cotton fleece hoodie with kangaroo pockets. Stay warm and stylish with custom prints.',
      basePrice: 899,
      images: ['/uploads/products/Custom Printed Hoodie.png'],
      tags: ['hoodie', 'winter', 'custom', 'cotton'],
    },
    {
      categoryId: tshirtCat!.id,
      name: 'Oversized Drop Shoulder T-Shirt',
      slug: 'oversized-drop-shoulder-tshirt',
      description: 'Trendy oversized t-shirt in 220 GSM heavyweight cotton. Perfect for streetwear and casual custom designs.',
      basePrice: 499,
      images: ['/uploads/products/Oversized Drop Shoulder T-Shirt.png'],
      tags: ['oversized', 'streetwear', 'custom', 'heavyweight'],
    },
    // More Notebooks
    {
      categoryId: notebookCat!.id,
      name: 'Custom Pocket Notebook A6',
      slug: 'custom-pocket-notebook-a6',
      description: 'Handy A6 pocket notebook with custom soft cover. 120 pages of 70 GSM paper. Easy to carry everywhere.',
      basePrice: 99,
      images: ['/uploads/products/Custom Pocket Notebook A6.png'],
      tags: ['notebook', 'pocket', 'a6', 'compact'],
    },
    // More Mugs
    {
      categoryId: mugCat!.id,
      name: 'Enamel Campfire Mug',
      slug: 'enamel-campfire-mug',
      description: 'Durable enamel mug for outdoors. Custom printing that won\'t fade. Lightweight and shatterproof.',
      basePrice: 299,
      images: ['/uploads/products/mug-enamel.jpg'],
      tags: ['mug', 'enamel', 'outdoor', 'durable'],
    },
    {
      categoryId: mugCat!.id,
      name: 'Frosted Glass Beer Stein',
      slug: 'frosted-glass-beer-stein',
      description: 'Heavy frosted glass beer mug (16oz) with full-color custom print. Perfect for parties and gifts.',
      basePrice: 499,
      images: ['/uploads/products/mug-frosted-glass.jpg'],
      tags: ['mug', 'glass', 'frosted', 'gift'],
    },
    // More Photo Prints
    {
      categoryId: photoCat!.id,
      name: 'Premium Acrylic Photo Print',
      slug: 'premium-acrylic-photo-print',
      description: 'Stunning HD print mounted on 5mm thick crystal clear acrylic. Modern and sleek frameless look.',
      basePrice: 899,
      images: ['/uploads/products/photo-acrylic.jpg'],
      tags: ['acrylic', 'photo', 'premium', 'homedecor'],
      isFeatured: true,
    },
    // More Business Cards
    {
      categoryId: bcardCat!.id,
      name: 'Transparent Business Cards (100 pcs)',
      slug: 'transparent-business-cards-100',
      description: 'Stand out with clear, waterproof PVC business cards. Custom printed with high durability.',
      basePrice: 799,
      images: ['/uploads/products/bcard-transparent.jpg'],
      tags: ['businesscard', 'transparent', 'pvc', 'unique'],
    },
    // Stickers
    {
      categoryId: stickerCat!.id,
      name: 'Custom Die-Cut Vinyl Stickers',
      slug: 'custom-die-cut-vinyl-stickers',
      description: 'Durable, waterproof, and weatherproof die-cut stickers. Cut to the exact shape of your design.',
      basePrice: 99,
      images: ['/uploads/products/stickers-diecut.jpg'],
      tags: ['sticker', 'diecut', 'vinyl', 'waterproof'],
      isFeatured: true,
    },
    // Gifts & More
    {
      categoryId: giftCat!.id,
      name: 'Personalized Mouse Pad',
      slug: 'personalized-mouse-pad',
      description: 'Custom printed mouse pad with anti-slip rubber base and smooth fabric surface.',
      basePrice: 199,
      images: ['/uploads/products/gift-mousepad.jpg'],
      tags: ['gift', 'mousepad', 'custom', 'desk'],
    },
    {
      categoryId: giftCat!.id,
      name: 'Custom Printed Keychain',
      slug: 'custom-printed-keychain',
      description: 'High-quality MDF wood or acrylic keychains printed with your photos, logos, or text.',
      basePrice: 149,
      images: ['/uploads/products/gift-keychain.jpg'],
      tags: ['gift', 'keychain', 'custom', 'accessory'],
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (!existing) {
      const created = await prisma.product.create({ data: product as any });

      // Create variants for t-shirts
      if (product.categoryId === tshirtCat!.id) {
        const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        const colors = ['White', 'Black', 'Navy Blue', 'Red', 'Royal Blue', 'Yellow'];
        for (const size of sizes) {
          for (const color of colors) {
            await prisma.productVariant.create({
              data: {
                productId: created.id,
                size,
                color,
                material: '100% Cotton 180 GSM',
                priceModifier: size === 'XXL' ? 30 : size === 'XXXL' ? 60 : 0,
                stock: 100,
              },
            });
          }
        }
      }

      // Create variants for notebooks
      if (product.categoryId === notebookCat!.id) {
        const types = [
          { size: 'A5', material: 'Spiral Bound 200 Pages', priceModifier: 0 },
          { size: 'A4', material: 'Spiral Bound 200 Pages', priceModifier: 100 },
        ];
        for (const t of types) {
          await prisma.productVariant.create({
            data: {
              productId: created.id,
              size: t.size,
              material: t.material,
              priceModifier: t.priceModifier,
              stock: 500,
            },
          });
        }
      }
    }
  }
  console.log('✅ Products created');

  // Create sample coupons
  await prisma.coupon.upsert({
    where: { code: 'FIRST10' },
    update: {},
    create: {
      code: 'FIRST10',
      description: '10% off on first order',
      type: 'PERCENTAGE',
      value: 10,
      minOrder: 199,
      maxUses: 1000,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'BULK500' },
    update: {},
    create: {
      code: 'BULK500',
      description: '₹100 off on orders above ₹500',
      type: 'FIXED',
      value: 100,
      minOrder: 500,
    },
  });
  console.log('✅ Coupons created');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
