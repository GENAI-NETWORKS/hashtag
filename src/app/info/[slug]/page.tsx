import Link from 'next/link';
import { ArrowLeft, Check, ShieldCheck, Truck, Handshake, FileText } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// ─── Content Data ──────────────────────────────────────────────────

const PAGES: Record<string, { title: string; icon: any; content: React.ReactNode; color: string }> = {
  partner: {
    title: 'Partner with Hashtag',
    icon: Handshake,
    color: '#00AEEF',
    content: (
      <>
        <p className="lead">Join Salem&apos;s fastest-growing custom printing network. We partner with local businesses, corporate event organizers, and graphic designers to provide premium print fulfillment.</p>
        <h3>Why Partner With Us?</h3>
        <ul>
          <li><strong>Wholesale Pricing:</strong> Get up to 40% off retail prices on bulk orders.</li>
          <li><strong>Priority Production:</strong> Skip the queue with our guaranteed 24-hour turnaround for partners.</li>
          <li><strong>White-Label Dropshipping:</strong> We print and ship directly to your customers with your branding.</li>
          <li><strong>Dedicated Account Manager:</strong> Direct WhatsApp support for all your orders.</li>
        </ul>
        <p>Email us at <strong>partners@hashtagprints.in</strong> with your business profile to get started.</p>
      </>
    )
  },
  franchise: {
    title: 'Hashtag Franchise Opportunities',
    icon: Handshake,
    color: '#EC008C',
    content: (
      <>
        <p className="lead">Bring the Hashtag Custom Prints experience to your city. We are expanding across Tamil Nadu and looking for passionate franchise partners.</p>
        <h3>Franchise Benefits</h3>
        <ul>
          <li><strong>Turnkey Setup:</strong> Complete store design, machinery setup, and software integration.</li>
          <li><strong>Training:</strong> Comprehensive training on DTF, sublimation, and vinyl printing.</li>
          <li><strong>Marketing Support:</strong> Localized digital marketing campaigns and brand assets.</li>
          <li><strong>High ROI:</strong> Proven business model with fast break-even times.</li>
        </ul>
        <div className="card p-4 mt-6 bg-[#f8f9fa] border-[#e5e7eb]">
          <h4 className="font-bold mb-2">Franchise Enquiry</h4>
          <p className="text-sm text-[#444] mb-0">Call our franchise desk at <strong>+91 9XXXXXXXXX</strong> for details on investment and requirements.</p>
        </div>
      </>
    )
  },
  seller: {
    title: 'Become a Hashtag Seller',
    icon: Handshake,
    color: '#FFD700',
    content: (
      <>
        <p className="lead">Are you an artist, illustrator, or creator? Monetize your designs with Hashtag&apos;s Print-on-Demand seller program.</p>
        <h3>How It Works</h3>
        <ol>
          <li><strong>Upload Artwork:</strong> Set up your seller profile and upload your designs.</li>
          <li><strong>Select Products:</strong> Choose which products (tees, mugs, notebooks) your art goes on.</li>
          <li><strong>Set Your Margin:</strong> You control your profit margin on every sale.</li>
          <li><strong>We Handle the Rest:</strong> We print, pack, and ship. You get paid monthly.</li>
        </ol>
        <p>Zero upfront costs. Zero inventory. 100% creative freedom.</p>
      </>
    )
  },
  warehouse: {
    title: 'Warehouse & Fulfillment',
    icon: Truck,
    color: '#00AEEF',
    content: (
      <>
        <p className="lead">Our state-of-the-art production facility in Salem is equipped to handle thousands of custom prints daily with strict quality control.</p>
        <h3>Our Capabilities</h3>
        <ul>
          <li><strong>DTF (Direct to Film):</strong> High-resolution, durable apparel prints.</li>
          <li><strong>Sublimation:</strong> Vibrant, permanent prints for mugs and polyester.</li>
          <li><strong>UV Printing:</strong> For rigid materials, phone cases, and acrylics.</li>
          <li><strong>Commercial Offset & Digital:</strong> For premium business cards and notebooks.</li>
        </ul>
        <p>Looking for a reliable fulfillment partner for your e-commerce brand? Contact our fulfillment team today.</p>
      </>
    )
  },
  deliver: {
    title: 'Delivery Network',
    icon: Truck,
    color: '#16a34a',
    content: (
      <>
        <p className="lead">Fast, reliable, and secure. We ensure your custom prints reach you exactly when you need them.</p>
        <h3>Delivery Speeds</h3>
        <ul>
          <li><strong>Salem City (Local):</strong> Same-day dispatch and delivery for orders placed before 12 PM.</li>
          <li><strong>Tamil Nadu:</strong> 1–2 business days via premium courier partners.</li>
          <li><strong>Rest of India:</strong> 3–5 business days via Bluedart / Delhivery.</li>
        </ul>
        <p>All shipments are fully tracked. You will receive an SMS and Email with your tracking link once dispatched.</p>
      </>
    )
  },
  resources: {
    title: 'Design Resources & Templates',
    icon: FileText,
    color: '#7c3aed',
    content: (
      <>
        <p className="lead">Download our free templates and guides to ensure your artwork is print-ready and looks perfect.</p>
        <h3>Downloads</h3>
        <ul>
          <li><a href="#" className="text-[#00AEEF] hover:underline">T-Shirt Design Template (PSD/AI)</a></li>
          <li><a href="#" className="text-[#00AEEF] hover:underline">Business Card Bleed Guide (PDF)</a></li>
          <li><a href="#" className="text-[#00AEEF] hover:underline">Mug Wrap Template (PNG)</a></li>
        </ul>
        <h3>Print Guidelines</h3>
        <p>For the best results, please ensure your uploaded files meet these criteria:</p>
        <ul>
          <li><strong>Resolution:</strong> Minimum 300 DPI at actual print size.</li>
          <li><strong>Color Mode:</strong> CMYK preferred (RGB will be converted automatically).</li>
          <li><strong>File Types:</strong> PNG (with transparent background for tees), high-res JPG, or vector PDF.</li>
        </ul>
      </>
    )
  },
  shipping: {
    title: 'Shipping Policy',
    icon: Truck,
    color: '#EC008C',
    content: (
      <>
        <p className="lead">Everything you need to know about how we pack, ship, and deliver your custom printed products.</p>
        <h3>Dispatch Times</h3>
        <p>Because every item is custom printed to order, please allow <strong>24–48 hours</strong> for production before your item ships. Bulk orders (50+ items) may require 3–5 days for production.</p>
        <h3>Shipping Costs</h3>
        <ul>
          <li><strong>Orders above ₹999:</strong> Free standard shipping across India.</li>
          <li><strong>Standard Shipping:</strong> ₹50 flat rate for orders under ₹999.</li>
          <li><strong>Express Shipping:</strong> ₹100 flat rate (prioritized production and fastest delivery route).</li>
        </ul>
      </>
    )
  },
  returns: {
    title: 'Return & Refund Policy',
    icon: ShieldCheck,
    color: '#dc2626',
    content: (
      <>
        <p className="lead">At Hashtag, we pride ourselves on quality. If we make a mistake, we will make it right.</p>
        <h3>Custom Printed Items</h3>
        <p>Because our products are customized specifically for you, we <strong>cannot accept returns or exchanges for change of mind or incorrect sizing ordered by the customer.</strong> Please check our size charts carefully before ordering.</p>
        <h3>Defective or Incorrect Items</h3>
        <p>If your item arrives defective, damaged, or the print is incorrect, please contact us within <strong>48 hours of delivery</strong> with photos of the issue. We will offer a free replacement or a full refund.</p>
        <h3>How to Request a Replacement</h3>
        <ol>
          <li>Email <strong>support@hashtagprints.in</strong> with your Order ID.</li>
          <li>Attach clear photos showing the defect.</li>
          <li>Our team will respond within 24 hours to resolve the issue.</li>
        </ol>
      </>
    )
  },
  privacy: {
    title: 'Privacy Policy',
    icon: ShieldCheck,
    color: '#111111',
    content: (
      <>
        <p className="lead">Your privacy is important to us. This policy outlines how Hashtag Custom Prints collects, uses, and protects your data.</p>
        <h3>Information We Collect</h3>
        <ul>
          <li><strong>Account Details:</strong> Name, email, phone number, and delivery addresses.</li>
          <li><strong>Uploaded Artwork:</strong> Images and designs you upload for printing. <em>We never use your custom designs for other purposes without explicit permission.</em></li>
          <li><strong>Usage Data:</strong> Anonymized analytics on how you use our website to help us improve the experience.</li>
        </ul>
        <h3>Payment Security</h3>
        <p>We do not store your credit card or payment information. All payments are processed securely through Razorpay, a PCI-DSS compliant payment gateway.</p>
      </>
    )
  },
  terms: {
    title: 'Terms of Service',
    icon: FileText,
    color: '#111111',
    content: (
      <>
        <p className="lead">By using the Hashtag website and services, you agree to the following terms and conditions.</p>
        <h3>Content Ownership & Copyright</h3>
        <p>By uploading a design, you guarantee that you hold the copyright or have the right to reproduce the image. Hashtag Custom Prints will not be held liable for any copyright infringement resulting from customer-supplied artwork. We reserve the right to reject orders containing offensive, illegal, or copyrighted material.</p>
        <h3>Print Quality Variability</h3>
        <p>While we use top-of-the-line CMYK printers, slight variations in color between your screen (RGB) and the final printed product (CMYK) are normal and expected. We cannot guarantee 100% exact color matching.</p>
        <h3>Order Cancellations</h3>
        <p>Orders can only be cancelled within <strong>1 hour</strong> of placement. Once an order enters the production queue, it cannot be cancelled or modified.</p>
      </>
    )
  }
};

// ─── Component ─────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = PAGES[params.slug];
  if (!page) return { title: 'Page Not Found | Hashtag' };
  return { title: `${page.title} | Hashtag Custom Prints` };
}

export default function InfoPage({ params }: { params: { slug: string } }) {
  const page = PAGES[params.slug];

  if (!page) {
    notFound();
  }

  const Icon = page.icon;

  return (
    <div className="container-app py-8 max-w-3xl mx-auto">
      
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#888] hover:text-[#111] transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#e5e7eb]">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${page.color}15`, border: `1px solid ${page.color}30` }}>
          <Icon size={28} style={{ color: page.color }} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#111] leading-tight tracking-tight">
          {page.title}
        </h1>
      </div>

      {/* Content */}
      <div className="space-y-6 text-sm sm:text-base text-[#444] leading-relaxed pb-20 [&_h3]:text-xl [&_h3]:font-black [&_h3]:text-[#111] [&_h3]:mt-8 [&_h3]:mb-4 [&_h4]:font-bold [&_h4]:text-[#111] [&_strong]:font-bold [&_strong]:text-[#111] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_li]:pl-1 [&_a]:text-[#00AEEF] [&_a:hover]:underline [&_.lead]:text-lg [&_.lead]:font-medium [&_.lead]:text-[#111] [&_.lead]:leading-snug">
        {page.content}
      </div>

    </div>
  );
}
