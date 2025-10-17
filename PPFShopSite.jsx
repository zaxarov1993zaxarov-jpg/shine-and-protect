import React from "react";
import { motion } from "framer-motion";
import { Car, Shield, Sparkles, Scissors, PhoneCall, MapPin, Mail, CheckCircle2, Clock, Package, Paintbrush } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// --- External embeds ---
const SCHEDULING_URL = "https://shineprotect.as.me/";
const MAPS_EMBED_SRC = ""; // to be added later

// --- Utility animation presets ---
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true, margin: "-80px" },
};

export default function PPFShopSite() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header / Nav */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 border-b border-white/10">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 font-black">S&P</div>
            <span className="font-semibold tracking-wide">Shine & Protect</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#packages" className="hover:text-white">Packages</a>
            <a href="#gallery" className="hover:text-white">Gallery</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#booking" className="hover:text-white">Book</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>
          <a href="#booking" className="md:inline-flex hidden">
            <Button className="rounded-2xl bg-white text-neutral-900 hover:bg-neutral-200">Book Now</Button>
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_20%_70%,rgba(255,255,255,0.06),transparent_40%)]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div {...fadeUp} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300 mb-5">
              <Shield className="h-3.5 w-3.5" /> Premium Paint Protection Film
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Keep Your Finish <span className="text-neutral-400">Flawless</span>
            </h1>
            <p className="mt-4 text-neutral-300 max-w-xl">
              Professional PPF installations with precision plotting, wrapped edges, and crystal-clear gloss or stealth matte finishes. Protect your car from chips, scratches, and road debris.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <a href="#booking"><Button size="lg" className="rounded-2xl">Book Now</Button></a>
              <a href="#packages" className="text-neutral-300 hover:text-white text-sm">See Packages →</a>
            </div>
            <div className="mt-6 flex items-center gap-5 text-neutral-400 text-sm">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> Lifetime warranty options</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4"/> 24–72h turnaround</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold">Services</motion.h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: <Shield className="h-6 w-6"/>, title: 'Paint Protection Film', desc: 'Gloss or matte stealth. Wrapped edges, precision cut.' },
            { icon: <Sparkles className="h-6 w-6"/>, title: 'Ceramic Coating', desc: 'Hydrophobic top coats for easier maintenance.' },
            { icon: <Paintbrush className="h-6 w-6"/>, title: 'Paint Correction', desc: 'Single & multi-stage correction before film.' },
            { icon: <Scissors className="h-6 w-6"/>, title: 'Custom Patterns', desc: 'Track package, pillars, rocker panels & more.' },
          ].map((s, i) => (
            <motion.div {...fadeUp} key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3 text-neutral-200"><div className="p-2 rounded-xl bg-white/10">{s.icon}</div><div className="font-semibold">{s.title}</div></div>
              <p className="mt-3 text-sm text-neutral-300">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold">Popular Packages</motion.h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[{
            name: 'Partial Front',
            highlights: ['¼ hood', '¼ fenders', 'Full front bumper', 'Mirrors'],
            from: 799,
          },{
            name: 'Full Front',
            highlights: ['Full hood & fenders', 'Front bumper', 'Mirrors & headlights', 'Wrapped edges'],
            from: 1699,
          },{
            name: 'Track Package',
            highlights: ['Full Front + A-pillars', 'Roof leading edge', 'Rockers / lower doors', 'Luggage strip'],
            from: 2299,
          }].map((p, i) => (
            <motion.div {...fadeUp} key={i} className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.03] p-6 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{p.name}</div>
                <Package className="h-5 w-5 text-neutral-300"/>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-neutral-300">
                {p.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5"/> {h}</li>
                ))}
              </ul>
              <div className="mt-6 text-sm text-neutral-400">From</div>
              <div className="text-3xl font-black tracking-tight">${'{'}p.from{'}'}</div>
              <div className="mt-6">
                <a href="#contact"><Button className="w-full rounded-2xl">Request Quote</Button></a>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-neutral-400 mt-4">* Prices vary by vehicle size, film brand, and condition. Ask about matte/stealth finishes and lifetime warranty options.</p>
      </section>

      {/* Gallery (placeholders) */}
      <section id="gallery" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold">Recent Work</motion.h2>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-video rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="h-full w-full bg-[linear-gradient(120deg,rgba(255,255,255,0.06),transparent_40%),linear-gradient(300deg,rgba(255,255,255,0.05),transparent_50%)]" />
            </div>
          ))}
        </div>
      </section>

      {/* Pricing table (add-ons) */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold">Add-Ons & Options</motion.h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[{
            title: 'Ceramic Top Coat',
            desc: 'Boost gloss & hydrophobics for easier washing.',
            price: '$199–$399',
          },{
            title: 'Windshield Protection',
            desc: 'Film that helps resist pitting and impacts.',
            price: '$249–$399',
          },{
            title: 'Full Body PPF',
            desc: 'Every painted panel, gloss or stealth.',
            price: 'From $5499',
          }].map((a, i) => (
            <Card key={i} className="rounded-2xl border-white/10 bg-white/5">
              <CardContent className="p-6">
                <div className="text-lg font-semibold">{a.title}</div>
                <p className="mt-2 text-sm text-neutral-300">{a.desc}</p>
                <div className="mt-4 text-2xl font-bold">{a.price}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold">Online Booking</motion.h2>
        <p className="mt-3 text-neutral-300 max-w-2xl">Choose your package and time. If you don’t see a time that works, call us—we’ll try to fit you in.</p>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <iframe src={SCHEDULING_URL} title="Shine & Protect — Online Booking" width="100%" height="900" frameBorder="0" loading="lazy" className="w-full"></iframe>
        </div>
        <p className="text-xs text-neutral-400 mt-2">Having trouble? Call us and we’ll book you over the phone.</p>
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold">Why Choose Us</motion.h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[{
            title: 'Plotter-cut precision',
            desc: 'We use pro templates and hand-refine for perfect alignment.'
          },{
            title: 'Wrapped edges',
            desc: 'Cleaner look with reduced lift risk on exposed edges.'
          },{
            title: 'Clean-room installs',
            desc: 'Dust-controlled bay and double-bucket prep process.'
          }].map((w, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-lg font-semibold">{w.title}</div>
              <p className="mt-2 text-sm text-neutral-300">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold">FAQ</motion.h2>
        <div className="mt-6 space-y-4">
          {[{
            q: 'How long does an install take?',
            a: 'Partial/Full Front typically 1–2 days; full body 3–5 days depending on the vehicle and add-ons.'
          },{
            q: 'Gloss vs. matte (stealth)?',
            a: 'Both protect equally. Gloss enhances depth; matte gives a satin OEM-style finish.'
          },{
            q: 'How do I maintain PPF?',
            a: 'Use pH-neutral soap, avoid harsh chemicals, and consider a ceramic top coat for easier washing.'
          }].map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="font-semibold">{f.q}</div>
              <p className="mt-2 text-sm text-neutral-300">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold">Get a Quote</motion.h2>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <form action="https://formspree.io/f/mwpryrwo" method="POST" className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input name="name" required placeholder="Name" className="bg-neutral-900/60 border border-white/10 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"/>
              <input name="phone" required placeholder="Phone" className="bg-neutral-900/60 border border-white/10 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"/>
            </div>
            <input name="email" type="email" required placeholder="Email" className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"/>
            <input name="vehicle" placeholder="Vehicle (Year / Make / Model)" className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"/>
            <select name="package" className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-white/20">
              <option>Choose Package</option>
              <option>Partial Front</option>
              <option>Full Front</option>
              <option>Track Package</option>
              <option>Full Body</option>
            </select>
            <textarea name="notes" placeholder="Notes" rows={4} className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"/>
            <input type="hidden" name="_subject" value="New quote request — Shine & Protect" />
            <Button className="w-full rounded-2xl bg-white text-neutral-900 hover:bg-neutral-200">Send Request</Button>
            <p className="text-xs text-neutral-400">This demo form is static. Hook it to your email/CRM (e.g., Formspree, Zapier, Airtable).</p>
          </form>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 text-neutral-300"><PhoneCall className="h-4 w-4"/> <a href="tel:2672270089" className="hover:underline">(267) 227-0089</a></div>
            <div className="mt-2 flex items-center gap-2 text-neutral-300"><Mail className="h-4 w-4"/> <a href="mailto:shineandprotectshop@gmail.com" className="hover:underline">shineandprotectshop@gmail.com</a></div>
            <div className="mt-2 flex items-center gap-2 text-neutral-300"><MapPin className="h-4 w-4"/> 123 Detailer Ave, Suite A, Your City</div>
            <div className="mt-4">
              {/* Google Maps embed. Replace MAPS_EMBED_SRC at the top with your generated URL. */}
              <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
                <iframe
                  src={MAPS_EMBED_SRC}
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  title="Shine & Protect — Location Map"
                />
              </div>
            </div>
            <div className="mt-4 text-sm text-neutral-300">Mon–Sat: 9:00 – 6:00 • Sunday by appointment</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-6 text-sm text-neutral-300">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 font-black">S&P</div>
              <div className="font-semibold">Shine & Protect</div>
            </div>
            <p className="mt-3 text-neutral-400">Premium protection for daily drivers and track builds.</p>
          </div>
          <div>
            <div className="font-semibold text-neutral-200">Shop</div>
            <ul className="mt-3 space-y-2">
              <li><a className="hover:text-white" href="#packages">Packages</a></li>
              <li><a className="hover:text-white" href="#pricing">Add-Ons</a></li>
              <li><a className="hover:text-white" href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-neutral-200">Company</div>
            <ul className="mt-3 space-y-2">
              <li><a className="hover:text-white" href="#gallery">Gallery</a></li>
              <li><a className="hover:text-white" href="#contact">Contact</a></li>
              <li><a className="hover:text-white" href="#contact">Get a Quote</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-neutral-200">Legal</div>
            <ul className="mt-3 space-y-2">
              <li>© {new Date().getFullYear()} Shine & Protect</li>
              <li>All rights reserved</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
