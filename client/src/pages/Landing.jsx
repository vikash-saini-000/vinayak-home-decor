import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Shield, Eye, EyeOff, Lock, Heart, Users, ChevronDown, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';

const FadeInSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Landing = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    document.body.style.overflow = 'auto';
  }, []);

  const features = [
    { icon: EyeOff, title: 'Completely Anonymous', desc: 'No one knows you added them. Ever. Unless it\'s mutual — and you both say yes.' },
    { icon: Shield, title: 'Privacy First', desc: 'No tracking, no data selling, no public profiles. Your feelings, your control.' },
    { icon: Lock, title: 'Consent-Based Reveal', desc: 'Even mutual matches stay hidden. Identities revealed only when both agree.' },
    { icon: Users, title: 'College Only', desc: 'Verified educational emails only. Your campus, your community.' },
  ];

  const steps = [
    { num: '01', title: 'Sign In', desc: 'Login with your college email. Only educational domains accepted.' },
    { num: '02', title: 'Add Crushes', desc: 'Search and add up to 10 crushes per day. Completely anonymous.' },
    { num: '03', title: 'Mutual Detection', desc: 'If they add you back, both get notified — without revealing identities.' },
    { num: '04', title: 'Consent Reveal', desc: 'Both must agree to reveal. Decline anytime. Full control.' },
  ];

  const faqs = [
    { q: 'Can someone see that I added them?', a: 'Never. Your crushes are completely private. The other person is only notified if they also added you — and even then, identities remain hidden until both consent.' },
    { q: 'What happens on a mutual match?', a: 'Both users see "Someone you added also added you" — without knowing who. You can choose to reveal, wait, or decline permanently.' },
    { q: 'Which emails are allowed?', a: 'Only verified educational domains (.edu, .ac.in, etc.) are accepted. Personal emails like Gmail or Yahoo are rejected.' },
    { q: 'Can I undo a reveal?', a: 'No. Once both users agree to reveal, identities are visible. Think of it as a mutual decision — both must agree.' },
    { q: 'Is my data safe?', a: 'Your crush data is encrypted and never shared. We don\'t sell data or track behavior. Privacy is our core principle.' },
  ];

  const testimonials = [
    { text: "I never had the courage to tell him. Turns out he added me too. Campus Crush made it happen.", initials: 'AS', college: 'NIT Surathkal' },
    { text: "The privacy aspect is what sold me. No one knows unless it's mutual. Genius.", initials: 'RK', college: 'IIT Delhi' },
    { text: "Finally a platform that respects consent. The reveal flow is beautifully designed.", initials: 'PM', college: 'VIT Vellore' },
  ];

  return (
    <div className="relative">
      {/* Background effects */}
      <div className="fixed inset-0 noise pointer-events-none z-10" />

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/3 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-500/5 to-transparent rounded-full blur-3xl" />
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-20 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] mb-8">
              <Sparkles size={14} className="text-purple-400" />
              <span className="text-xs text-zinc-400 tracking-wider uppercase">Anonymous · Mutual · Consent-based</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Not every crush
            <br />
            <span className="gradient-text">should stay a secret.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Anonymous mutual matching exclusively for college students.
            <br className="hidden sm:block" />
            Add your crushes secretly. Discover if they feel the same.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="/auth/google"
              className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4"
            >
              Continue with Google
              <ArrowRight size={18} />
            </a>
            <a
              href="#how-it-works"
              className="btn-secondary inline-flex items-center gap-2 text-base px-8 py-4"
            >
              Explore Platform
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <ChevronDown size={20} className="text-zinc-600 animate-bounce" />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeInSection className="text-center mb-20">
            <p className="text-sm text-purple-400 uppercase tracking-widest mb-4">Why Campus Crush</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Built for privacy.
              <br />
              <span className="text-zinc-500">Designed for courage.</span>
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className="glass-card h-full group">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-5 group-hover:border-purple-500/20 transition-colors duration-500">
                    <feature.icon size={22} className="text-zinc-400 group-hover:text-purple-400 transition-colors duration-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeInSection className="text-center mb-20">
            <p className="text-sm text-purple-400 uppercase tracking-widest mb-4">How It Works</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Four simple steps.
              <br />
              <span className="text-zinc-500">Complete privacy.</span>
            </h2>
          </FadeInSection>

          <div className="space-y-6">
            {steps.map((step, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className="glass-card flex items-start gap-6 group">
                  <span className="text-3xl font-bold text-zinc-800 group-hover:text-purple-500/30 transition-colors duration-500 shrink-0">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-zinc-500">{step.desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeInSection className="text-center mb-16">
            <p className="text-sm text-purple-400 uppercase tracking-widest mb-4">Privacy Promise</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Your secrets are safe.
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto leading-relaxed">
              We built Campus Crush on a single principle: nobody should ever feel exposed.
              Your data stays private. Always.
            </p>
          </FadeInSection>

          <FadeInSection>
            <div className="glass p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                    <EyeOff size={24} className="text-zinc-400" />
                  </div>
                  <h4 className="font-semibold mb-2">No one sees your list</h4>
                  <p className="text-xs text-zinc-500">Your crushes are never visible to anyone, including admins.</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                    <Lock size={24} className="text-zinc-400" />
                  </div>
                  <h4 className="font-semibold mb-2">Consent always required</h4>
                  <p className="text-xs text-zinc-500">Even mutual matches stay hidden until both explicitly agree.</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                    <Shield size={24} className="text-zinc-400" />
                  </div>
                  <h4 className="font-semibold mb-2">Anti-harassment</h4>
                  <p className="text-xs text-zinc-500">Block and report systems. Rate limits prevent spam.</p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeInSection className="text-center mb-16">
            <p className="text-sm text-purple-400 uppercase tracking-widest mb-4">Stories</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Real feelings.
              <span className="text-zinc-500"> Real matches.</span>
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className="glass-card h-full flex flex-col">
                  <MessageCircle size={18} className="text-zinc-700 mb-4" />
                  <p className="text-sm text-zinc-400 leading-relaxed flex-1 mb-6">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                      <span className="text-xs font-medium text-zinc-400">{t.initials}</span>
                    </div>
                    <span className="text-xs text-zinc-600">{t.college}</span>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <FadeInSection className="text-center mb-16">
            <p className="text-sm text-purple-400 uppercase tracking-widest mb-4">FAQ</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Common questions.
            </h2>
          </FadeInSection>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FadeInSection key={i} delay={i * 0.05}>
                <div className="glass-card">
                  <h4 className="font-semibold mb-2">{faq.q}</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-4">
        <FadeInSection>
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/5 blur-3xl rounded-full" />
              <div className="relative glass p-12 md:p-20">
                <Heart size={32} className="text-zinc-700 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Some feelings deserve
                  <br />
                  a second chance.
                </h2>
                <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                  Discover mutual emotions anonymously within your campus.
                </p>
                <a href="/auth/google" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base">
                  Get Started
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.04] py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">
              campus<span className="text-purple-400">crush</span>
            </span>
          </div>
          <p className="text-xs text-zinc-600">
            Built with privacy at its core. Not affiliated with any institution.
          </p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="text-xs text-zinc-500 hover:text-white transition-colors">Privacy</a>
            <a href="#features" className="text-xs text-zinc-500 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-xs text-zinc-500 hover:text-white transition-colors">How It Works</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
