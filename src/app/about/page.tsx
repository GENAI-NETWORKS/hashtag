import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Clock, Star, Award, Users, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Hashtag - Custom Printing Studio in Salem, Tamil Nadu',
  description: 'Hashtag is Salem\'s premier custom printing service. Founded in Salem, TN, we offer custom t-shirts, notebooks, mugs, and business cards with same-day dispatch and delivery across India.',
  openGraph: {
    title: 'About Hashtag Custom Prints - Salem, Tamil Nadu',
    description: 'Learn about Hashtag, Salem\'s fastest custom printing service. Premium quality prints, same-day dispatch, bulk discounts.',
  },
};

const FACTS = [
  { icon: MapPin, label: 'Location', value: 'Salem, Tamil Nadu, India', color: '#fa028e' },
  { icon: Clock, label: 'Same-day Dispatch', value: 'Orders placed before 12 PM', color: '#01a2fb' },
  { icon: Star, label: 'Specialties', value: 'T-shirts, Notebooks, Mugs, Photo Prints', color: '#fcd502' },
  { icon: Award, label: 'Quality Standard', value: 'Premium 180–220 GSM materials', color: '#16a34a' },
  { icon: Users, label: 'Customers Served', value: '5000+ happy customers', color: '#7c3aed' },
];

const ABOUT_FAQS = [
  {
    q: 'Where is Hashtag located?',
    a: 'Hashtag is based in Salem, Tamil Nadu, India. We serve customers across Salem with same-day delivery, and ship custom printed products to all major cities across India within 3-5 business days.',
  },
  {
    q: 'What custom printing services does Hashtag offer?',
    a: 'Hashtag specializes in custom t-shirt printing, personalized notebook printing, photo mug printing, business card printing, canvas photo prints, and custom stickers. All products can be customized with your design, logo, or photo.',
  },
  {
    q: 'How does same-day printing work?',
    a: 'Orders placed before 12 PM on business days (Monday to Saturday) are dispatched the same day within Salem. Orders placed after 12 PM are dispatched the next business day.',
  },
  {
    q: 'Does Hashtag handle bulk corporate orders?',
    a: 'Yes. Hashtag provides dedicated bulk printing services for companies, schools, NGOs, and event organizers. Bulk orders of 10+ pieces receive progressive discounts. Contact us for a custom quote.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD: LocalBusiness (detailed) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Hashtag Custom Prints',
            alternateName: ['Hashtag Prints', 'Hashtag Salem'],
            description: 'Salem\'s premier custom printing service offering t-shirts, notebooks, mugs, photo prints, business cards, and stickers with same-day dispatch.',
            url: 'https://hashtagprints.in',
            logo: 'https://hashtagprints.in/logo.png',
            image: 'https://hashtagprints.in/about-banner.jpg',
            telephone: '+91-XXXXXXXXXX',
            email: 'hello@hashtagprints.in',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Salem',
              addressLocality: 'Salem',
              addressRegion: 'Tamil Nadu',
              postalCode: '636001',
              addressCountry: 'IN',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '11.6643',
              longitude: '78.1460',
            },
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '09:00',
                closes: '20:00',
              },
            ],
            priceRange: '₹₹',
            serviceType: 'Custom Printing',
            areaServed: [
              { '@type': 'City', name: 'Salem' },
              { '@type': 'State', name: 'Tamil Nadu' },
              { '@type': 'Country', name: 'India' },
            ],
          }),
        }}
      />

      <div className="container-app py-8 max-w-4xl mx-auto space-y-12">

        {/* Premium Hero */}
        <div className="relative rounded-[2rem] overflow-hidden bg-[#111] text-white">
          <div className="absolute inset-0 opacity-40">
            <img src="/uploads/products/realistic_polo.jpg" alt="Hashtag Custom Prints Studio" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/80 to-transparent" />

          <div className="relative z-10 p-8 sm:p-12 md:p-16 text-center max-w-2xl mx-auto flex flex-col items-center">
            <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-6"
              style={{ background: 'linear-gradient(135deg, #01a2fb, #fa028e)' }}>
              <span className="text-white font-black text-3xl leading-none">#</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight">
              About Hashtag
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Salem&apos;s fastest custom printing service - from a single t-shirt to bulk corporate orders,
              we deliver premium quality prints with unmatched speed.
            </p>
          </div>
        </div>

        {/* CMYK Divider */}
        <div className="cmyk-divider" />

        {/* Key Facts (for AEO - machine-readable business facts) */}
        <section aria-labelledby="facts-heading">
          <h2 id="facts-heading" className="text-lg font-black text-[#111] mb-4">Quick Facts</h2>
          <div className="space-y-3">
            {FACTS.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}18` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#888]">{label}</p>
                  <p className="text-sm font-bold text-[#111]">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="card p-6 border-l-4 border-[#01a2fb]">
          <h2 className="font-black text-[#111] text-lg mb-3">Our Mission</h2>
          <p className="text-[#444] leading-relaxed text-sm">
            Hashtag was founded with a simple belief: custom printing should be fast, affordable, and
            accessible to everyone in Salem and beyond. Whether you&apos;re a student printing 10 event
            t-shirts, a startup needing 500 branded notebooks, or a family ordering a personalized
            photo mug - Hashtag delivers the same premium quality and care.
          </p>
          <p className="text-[#444] leading-relaxed text-sm mt-3">
            We combine modern printing technology with a streamlined online ordering experience,
            so you can design, preview, and order your custom prints in minutes - and receive them
            in days, not weeks.
          </p>
        </section>

        {/* Services */}
        <section aria-labelledby="services-heading">
          <h2 id="services-heading" className="text-lg font-black text-[#111] mb-4">What We Print</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              'Custom T-Shirt Printing',
              'Personalized Notebooks',
              'Photo Mug Printing',
              'Canvas Photo Prints',
              'Business Card Printing',
              'Custom Stickers & Labels',
              'Corporate Merchandise',
              'Event Promotional Items',
            ].map((service) => (
              <div key={service} className="flex items-center gap-2 text-sm text-[#444] py-2 border-b border-[#f0f0f0]">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#01a2fb' }} />
                {service}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="about-faq-heading">
          <h2 id="about-faq-heading" className="text-lg font-black text-[#111] mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3" itemScope itemType="https://schema.org/FAQPage">
            {ABOUT_FAQS.map((faq, i) => (
              <div key={i} className="card p-4" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h3 className="font-semibold text-sm text-[#111] mb-2" itemProp="name">{faq.q}</h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-sm text-[#444] leading-relaxed" itemProp="text">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link href="/products" className="btn btn-primary btn-lg">
            Start Printing Now <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </>
  );
}
