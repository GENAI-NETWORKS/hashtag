import { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us - Hashtag Custom Prints | Salem',
  description: 'Get in touch with Hashtag Custom Prints in Salem. We offer custom t-shirts, notebooks, mugs, and bulk printing. Fast response and support.',
};

export default function ContactPage() {
  return (
    <div className="container-app py-8 max-w-4xl mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-6 bg-gradient-to-br from-[#00AEEF] to-[#EC008C]">
          <Mail className="text-white" size={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-[#111] mb-4">Contact Us</h1>
        <p className="text-[#888] text-sm leading-relaxed">
          Have a question about an order, bulk printing, or our services? We're here to help. 
          Reach out to our team in Salem, and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="card p-6 border-t-4 border-[#00AEEF]">
            <h2 className="font-bold text-[#111] text-lg mb-4">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="text-[#00AEEF] mt-0.5 shrink-0" size={18} />
                <div className="text-[#444]">
                  <strong className="text-[#111]">Hashtag Custom Prints</strong><br />
                  Salem, Tamil Nadu<br />
                  India - 636001
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#444]">
                <Phone className="text-[#EC008C] shrink-0" size={18} />
                <a href="tel:+919XXXXXXXXX" className="hover:text-[#EC008C] font-medium transition-colors">
                  +91 9XXXXXXXXX
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#444]">
                <Mail className="text-[#FFD700] shrink-0" size={18} />
                <a href="mailto:hello@hashtagprints.in" className="hover:text-[#FFD700] font-medium transition-colors">
                  hello@hashtagprints.in
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm text-[#444]">
                <Clock className="text-[#16a34a] mt-0.5 shrink-0" size={18} />
                <div>
                  <strong className="text-[#111]">Business Hours:</strong><br />
                  Mon - Sat: 9:00 AM - 8:00 PM<br />
                  Sunday: Closed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card p-6">
          <h2 className="font-bold text-[#111] text-lg mb-4">Send a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#888] mb-1.5" htmlFor="name">
                Your Name
              </label>
              <input type="text" id="name" className="input w-full text-sm" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#888] mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input type="email" id="email" className="input w-full text-sm" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#888] mb-1.5" htmlFor="subject">
                Subject
              </label>
              <input type="text" id="subject" className="input w-full text-sm" placeholder="How can we help?" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#888] mb-1.5" htmlFor="message">
                Message
              </label>
              <textarea id="message" rows={4} className="input w-full text-sm py-2" placeholder="Write your message here..."></textarea>
            </div>
            <button type="button" className="btn btn-primary w-full flex items-center justify-center gap-2">
              Send Message <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
