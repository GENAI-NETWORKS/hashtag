import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Globe, Share2, Send } from 'lucide-react';

const FOOTER_LINKS = {
  Products: [
    { label: 'Custom T-Shirts', href: '/products?category=custom-tshirt-printing' },
    { label: 'Notebooks', href: '/products?category=custom-notebook-printing' },
    { label: 'Photo Mugs', href: '/products?category=custom-mug-printing' },
    { label: 'Photo Prints', href: '/products?category=photo-printing-online' },
    { label: 'Business Cards', href: '/products?category=business-card-printing' },
    { label: 'Custom Stickers', href: '/products?category=custom-sticker-printing' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'My Orders', href: '/orders' },
    { label: 'Track Order', href: '/orders' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Bulk Orders', href: '/about#bulk' },
  ],
  Network: [
    { label: 'Partner', href: '/info/partner' },
    { label: 'Franchise', href: '/info/franchise' },
    { label: 'Seller', href: '/info/seller' },
    { label: 'Warehouse', href: '/info/warehouse' },
    { label: 'Deliver', href: '/info/deliver' },
    { label: 'Resources', href: '/info/resources' },
  ],
  Support: [
    { label: 'FAQ', href: '/#faq-heading' },
    { label: 'Shipping Policy', href: '/info/shipping' },
    { label: 'Return Policy', href: '/info/returns' },
    { label: 'Privacy Policy', href: '/info/privacy' },
    { label: 'Terms of Service', href: '/info/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="hidden lg:block bg-[#111111] text-white mt-auto" aria-label="Site footer">
      <div className="container-app py-12">

        {/* Top section */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 pb-8 border-b border-white/10">

          {/* Brand column */}
          <div className="col-span-2 flex flex-col">
            <Link href="/" aria-label="Hashtag - Home" className="inline-block pb-6">
              <Image
                src="/HP_Logo.png"
                alt="Hashtag Custom Prints"
                width={150}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs mb-6">
              Salem&apos;s fastest custom printing service. T-shirts, notebooks, mugs,
              photo prints, and business cards - delivered to your door.
            </p>

            {/* Contact */}
            <div className="space-y-3 text-sm text-white/60 mb-6">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#fa028e] flex-shrink-0 mt-0.5" />
                <span>Salem, Tamil Nadu - 636001</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#01a2fb] flex-shrink-0" />
                <a href="tel:+919XXXXXXXXX" className="hover:text-white transition-colors">
                  +91 9XXXXXXXXX
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#fcd502] flex-shrink-0" />
                <a href="mailto:hello@hashtagprints.in" className="hover:text-white transition-colors">
                  hello@hashtagprints.in
                </a>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: Globe, href: 'https://hashtagprints.in', label: 'Website', color: '#01a2fb' },
                { icon: Share2, href: 'https://instagram.com/hashtagprints', label: 'Instagram', color: '#fa028e' },
                { icon: Send, href: 'https://wa.me/919XXXXXXXXX', label: 'WhatsApp', color: '#16a34a' },
              ].map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: `${color}18`, border: `1px solid ${color}33` }}
                >
                  <Icon size={16} style={{ color }} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">{heading}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Hashtag Custom Prints, Salem, Tamil Nadu. All rights reserved.</p>

          {/* CMYK brand accent */}
          <div className="flex items-center gap-1.5">
            {['#01a2fb', '#fa028e', '#fcd502', '#ffffff'].map((color) => (
              <span
                key={color}
                className="w-3 h-3 rounded-full"
                style={{ background: color, opacity: color === '#ffffff' ? 0.3 : 0.8 }}
              />
            ))}
            <span className="ml-1">Custom Prints • Made in Salem</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
