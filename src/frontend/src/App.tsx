import {
  Check,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Leaf,
  Menu,
  Play,
  Quote,
  Target,
  Twitter,
  X,
  Youtube,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEvents, useMembershipTiers } from "./hooks/useQueries";

// ─── Spring config ────────────────────────────────────────────────────────────
const spring = { type: "spring" as const, damping: 40, stiffness: 300 };
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: spring },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Grain Overlay ────────────────────────────────────────────────────────────
function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden="true" />;
}

// ─── Animated Section Wrapper ─────────────────────────────────────────────────
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { ...spring, delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = ["HOME", "MEMBERSHIP", "FACILITIES", "EVENTS", "CONTACT"];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id.toLowerCase());
    el?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#2A2A2A]"
            : "bg-transparent"
        }`}
      >
        <nav className="flex items-center justify-between px-6 md:px-10 h-16 max-w-[1600px] mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#CEFF00] flex items-center justify-center">
              <span className="text-[#0A0A0A] font-black text-xs">G</span>
            </div>
          </div>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link}>
                <button
                  type="button"
                  data-ocid={`nav.${link.toLowerCase()}.link`}
                  onClick={() => scrollTo(link)}
                  className="font-inter-tight font-semibold text-xs tracking-[0.15em] text-[#A8A8A8] hover:text-[#CEFF00] transition-colors duration-200 uppercase cursor-pointer"
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <button
            type="button"
            data-ocid="nav.join_cta.button"
            onClick={() => scrollTo("MEMBERSHIP")}
            className="hidden md:flex items-center gap-2 bg-[#CEFF00] text-[#0A0A0A] font-inter-tight font-black text-xs tracking-[0.12em] px-5 py-2.5 rounded-full hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            JOIN THE ELITE
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            data-ocid="nav.mobile_menu.button"
            className="md:hidden text-[#EDEDED] p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            data-ocid="nav.mobile_menu.modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center"
          >
            <button
              type="button"
              data-ocid="nav.mobile_menu.close_button"
              className="absolute top-5 right-6 text-[#EDEDED]"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={26} />
            </button>
            <ul className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { ...spring, delay: i * 0.06 },
                  }}
                >
                  <button
                    type="button"
                    data-ocid={`nav.mobile.${link.toLowerCase()}.link`}
                    onClick={() => scrollTo(link)}
                    className="font-inter-tight font-black text-3xl tracking-[0.1em] text-[#EDEDED] hover:text-[#CEFF00] transition-colors uppercase"
                  >
                    {link}
                  </button>
                </motion.li>
              ))}
            </ul>
            <button
              type="button"
              data-ocid="nav.mobile_join.button"
              onClick={() => scrollTo("MEMBERSHIP")}
              className="mt-12 bg-[#CEFF00] text-[#0A0A0A] font-inter-tight font-black text-sm tracking-[0.12em] px-8 py-3.5 rounded-full"
            >
              JOIN THE ELITE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage:
          "url('/assets/generated/hero-track.dim_1920x1080.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0A0A0A]/75" />
      {/* Gradient fade to bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A]" />

      {/* Video placeholder */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 hidden lg:flex items-center justify-center w-48 h-28 rounded-xl border border-[#2A2A2A] bg-[#0A0A0A]/60 backdrop-blur-sm cursor-pointer group hover:border-[#CEFF00] transition-colors duration-300 z-10">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full border border-[#CEFF00] flex items-center justify-center group-hover:bg-[#CEFF00] transition-colors duration-300">
            <Play
              size={16}
              className="text-[#CEFF00] group-hover:text-[#0A0A0A] ml-0.5"
              fill="currentColor"
            />
          </div>
          <span className="text-[10px] font-inter-tight font-semibold tracking-widest text-[#A8A8A8] uppercase">
            Watch Reel
          </span>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10 pt-24 pb-16 flex flex-col justify-center min-h-screen">
        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 }}
          className="animate-float mb-8 self-start"
        >
          <div
            data-ocid="hero.membership_badge.card"
            className="inline-flex items-center gap-2 bg-[#CEFF00]/10 border border-[#CEFF00]/30 backdrop-blur-sm rounded-full px-4 py-2"
          >
            <div className="w-2 h-2 rounded-full bg-[#CEFF00] animate-pulse" />
            <span className="text-[#CEFF00] font-inter-tight font-semibold text-xs tracking-[0.1em] uppercase">
              Join 500+ Elite Members
            </span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mb-6"
        >
          <motion.h1
            variants={fadeUp}
            className="font-inter-tight font-black uppercase text-[#EDEDED] leading-[0.88] tracking-[-0.02em] mb-0"
            style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}
          >
            THE GANDIPET
          </motion.h1>
          <motion.h1
            variants={fadeUp}
            className="font-inter-tight font-black uppercase leading-[0.88] tracking-[-0.02em]"
            style={{
              fontSize: "clamp(3rem, 10vw, 9rem)",
              color: "#CEFF00",
            }}
          >
            ATHLETIC SOCIETY
          </motion.h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.3 }}
          className="font-inter-tight font-bold text-[#EDEDED] uppercase tracking-[0.12em] text-base md:text-xl mb-3"
        >
          FORGE YOUR LEGACY. UNLEASH THE UNYIELDING.
        </motion.p>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.4 }}
          className="text-[#A8A8A8] text-sm md:text-base max-w-md mb-10 font-inter-tight leading-relaxed"
        >
          Experience World-Class Immersive Athletics, Elite Training, &amp;
          Performance Excellence.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.5 }}
          className="flex flex-wrap gap-4 items-center"
        >
          <button
            type="button"
            data-ocid="hero.get_started.primary_button"
            onClick={() =>
              document
                .getElementById("membership")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-[#CEFF00] text-[#0A0A0A] font-inter-tight font-black text-sm tracking-[0.12em] uppercase px-8 py-4 rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(206,255,0,0.4)] transition-all duration-300 cursor-pointer"
          >
            GET STARTED
          </button>
          <button
            type="button"
            data-ocid="hero.learn_more.secondary_button"
            onClick={() =>
              document
                .getElementById("philosophy")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="border border-[#EDEDED]/40 text-[#EDEDED] font-inter-tight font-bold text-sm tracking-[0.12em] uppercase px-8 py-4 rounded-full hover:border-[#CEFF00] hover:text-[#CEFF00] transition-all duration-300 cursor-pointer"
          >
            LEARN MORE
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Philosophy Section ───────────────────────────────────────────────────────
function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const pillars = [
    {
      icon: <Target size={28} className="text-[#CEFF00]" />,
      title: "Science-Backed Training",
      desc: "Every program is engineered with sports science principles. Data-driven coaching that adapts to your physiology for maximum performance gains.",
    },
    {
      icon: <Zap size={28} className="text-[#CEFF00]" />,
      title: "Olympic-Grade Equipment",
      desc: "Train with the same tools used by champions. Our facility boasts competition-standard equipment sourced from the world's leading manufacturers.",
    },
    {
      icon: <Leaf size={28} className="text-[#CEFF00]" />,
      title: "Community Spirit",
      desc: "Join a tribe of like-minded athletes who push each other beyond limits. Our culture of excellence creates bonds that transcend the track.",
    },
  ];

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 md:px-10"
      style={{ backgroundColor: "#0F0F0F" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <AnimatedSection>
          <p className="font-inter-tight font-semibold text-xs tracking-[0.2em] text-[#CEFF00] uppercase mb-4">
            Our Philosophy
          </p>
          <h2
            className="font-inter-tight font-black text-[#EDEDED] leading-[0.9] tracking-tight mb-6"
            style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}
          >
            Performance
            <br />
            <em className="not-italic text-[#CEFF00]">is a Habit.</em>
          </h2>
          <p className="text-[#A8A8A8] text-base max-w-xl leading-relaxed mb-16">
            We believe athletic greatness isn't born — it's systematically built
            through consistent, intelligent effort in an environment designed
            for champions.
          </p>
        </AnimatedSection>

        <motion.div
          ref={pillarsRef}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { ...spring, delay: i * 0.12 },
                },
              }}
              data-ocid={`philosophy.pillar.item.${i + 1}`}
              className="group p-7 rounded-xl border border-[#2A2A2A] bg-[#161616] hover:border-[#CEFF00]/30 hover:-translate-y-2 transition-all duration-300 cursor-default"
            >
              <div className="w-12 h-12 rounded-lg bg-[#CEFF00]/10 flex items-center justify-center mb-5 group-hover:bg-[#CEFF00]/20 transition-colors">
                {pillar.icon}
              </div>
              <h3 className="font-inter-tight font-black text-[#EDEDED] text-lg uppercase tracking-wide mb-3">
                {pillar.title}
              </h3>
              <p className="text-[#A8A8A8] text-sm leading-relaxed">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Live Clock (IST) ─────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const istTime = new Date(
    time.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  );
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes().toString().padStart(2, "0");
  const seconds = istTime.getSeconds().toString().padStart(2, "0");
  const displayHours = (hours % 12 || 12).toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const isOpen = hours >= 5 && hours < 22;

  return (
    <div
      data-ocid="bento.clock.card"
      className="relative flex flex-col justify-between h-full p-7 bg-[#111111] rounded-xl overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-inter-tight font-bold text-xs tracking-[0.2em] text-[#A8A8A8] uppercase">
          Gandipet HQ
        </span>
        <span
          className={`font-inter-tight font-black text-xs tracking-[0.15em] uppercase px-3 py-1 rounded-full ${
            isOpen
              ? "bg-[#CEFF00]/15 text-[#CEFF00] border border-[#CEFF00]/30"
              : "bg-red-900/30 text-red-400 border border-red-700/30"
          }`}
        >
          {isOpen ? "● OPEN" : "● CLOSED"}
        </span>
      </div>
      <div>
        <div
          className="font-inter-tight font-black text-[#EDEDED] leading-none tabular-nums"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
        >
          {displayHours}:{minutes}
          <span className="text-[#CEFF00]">:{seconds}</span>
        </div>
        <div className="font-inter-tight font-semibold text-[#A8A8A8] text-sm mt-1 tracking-widest">
          {ampm} — IST
        </div>
      </div>
      <p className="text-[#A8A8A8] text-xs mt-3 leading-relaxed">
        Open daily 5:00 AM – 10:00 PM
      </p>
    </div>
  );
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function useCountdown(targetMs: number) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, targetMs - Date.now()),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, targetMs - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const mins = Math.floor((remaining % 3600000) / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  return { days, hours, mins, secs };
}

function CountdownCell({
  eventName,
  targetMs,
}: { eventName: string; targetMs: number }) {
  const { days, hours, mins, secs } = useCountdown(targetMs);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div
      data-ocid="bento.countdown.card"
      className="flex flex-col justify-between h-full p-7 bg-[#111111] rounded-xl"
    >
      <div>
        <p className="font-inter-tight font-bold text-xs tracking-[0.2em] text-[#CEFF00] uppercase mb-1">
          Next Event
        </p>
        <p className="font-inter-tight font-black text-[#EDEDED] text-sm uppercase tracking-wide truncate">
          {eventName}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-4">
        {[
          { label: "DAYS", value: days },
          { label: "HRS", value: hours },
          { label: "MINS", value: mins },
          { label: "SECS", value: secs },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center">
            <span
              className="font-inter-tight font-black text-[#EDEDED] tabular-nums leading-none"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
            >
              {pad(value)}
            </span>
            <span className="font-inter-tight font-semibold text-[8px] md:text-[10px] tracking-[0.2em] text-[#A8A8A8] mt-1 uppercase">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bento Grid Section ───────────────────────────────────────────────────────
function BentoSection() {
  const { data: events } = useEvents();
  const cellRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cellRef, { once: true, margin: "-80px" });

  // Determine next event target timestamp
  const nextEventMs = (() => {
    const now = Date.now();
    if (events && events.length > 0) {
      const future = events
        .map((e) => Number(e.date) / 1_000_000) // nanoseconds -> ms
        .filter((ms) => ms > now)
        .sort((a, b) => a - b);
      if (future.length > 0) return future[0];
    }
    // fallback: Hyderabad Marathon 2026
    return new Date("2026-08-15T06:00:00+05:30").getTime();
  })();

  const nextEventName = (() => {
    if (events && events.length > 0) {
      const now = Date.now();
      const future = events
        .filter((e) => Number(e.date) / 1_000_000 > now)
        .sort((a, b) => Number(a.date) - Number(b.date));
      if (future.length > 0) return future[0].name;
    }
    return "Hyderabad Elite Marathon";
  })();

  const cells = [
    {
      id: "clock",
      component: <LiveClock />,
    },
    {
      id: "track",
      component: (
        <div
          data-ocid="bento.track.card"
          className="relative h-full rounded-xl overflow-hidden group cursor-pointer"
        >
          <img
            src="/assets/generated/track-detail.dim_800x600.jpg"
            alt="Our Track"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5">
            <p className="font-inter-tight font-black text-[#EDEDED] text-sm uppercase tracking-[0.15em]">
              Our Track
            </p>
            <p className="text-[#A8A8A8] text-xs tracking-wide">
              400m Olympic Standard
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "countdown",
      component: (
        <CountdownCell eventName={nextEventName} targetMs={nextEventMs} />
      ),
    },
    {
      id: "testimonial",
      component: (
        <div
          data-ocid="bento.testimonial.card"
          className="relative h-full rounded-xl overflow-hidden flex flex-col justify-end p-7"
          style={{
            backgroundImage:
              "url('/assets/generated/athletes-action.dim_800x600.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-[#0A0A0A]/60" />
          <div
            className="relative z-10 rounded-xl p-5"
            style={{
              backdropFilter: "blur(16px)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Quote
              size={24}
              className="text-[#CEFF00] mb-3"
              fill="rgba(206,255,0,0.15)"
            />
            <p className="font-inter-tight text-[#EDEDED] text-sm leading-relaxed mb-3">
              &ldquo;Training here changed everything. The facilities are
              world-class and the community pushes you to your limits.&rdquo;
            </p>
            <p className="font-inter-tight font-bold text-[#CEFF00] text-xs tracking-[0.1em] uppercase">
              — Arjun Reddy, Sprint Champion
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="bento" className="py-24 md:py-32 px-6 md:px-10 bg-[#0A0A0A]">
      <div className="max-w-[1400px] mx-auto">
        <AnimatedSection className="mb-12">
          <p className="font-inter-tight font-bold text-xs tracking-[0.2em] text-[#CEFF00] uppercase mb-3">
            Immersive Experience
          </p>
          <h2
            className="font-inter-tight font-black text-[#EDEDED] uppercase tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 5rem)" }}
          >
            THE EXPERIENCE
          </h2>
        </AnimatedSection>

        <div
          ref={cellRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
        >
          {cells.map((cell, i) => (
            <motion.div
              key={cell.id}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.97 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { ...spring, delay: i * 0.1 },
                },
              }}
              style={{ minHeight: 320 }}
            >
              {cell.component}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Facilities Carousel ──────────────────────────────────────────────────────
function FacilitiesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const facilities = [
    {
      name: "State-of-the-Art Gym",
      sub: "Olympic-Grade Equipment",
      img: "/assets/generated/gym-interior.dim_800x600.jpg",
    },
    {
      name: "Olympic Pool",
      sub: "Competition Standard",
      img: "/assets/generated/facility-pool.dim_800x600.jpg",
    },
    {
      name: "Athletics Track",
      sub: "400m IAAF Standard",
      img: "/assets/generated/track-detail.dim_800x600.jpg",
    },
    {
      name: "Elite Training Zone",
      sub: "High-Performance Hub",
      img: "/assets/generated/athletes-action.dim_800x600.jpg",
    },
    {
      name: "Recovery Suite",
      sub: "Ice Baths & Physio",
      img: "/assets/generated/gym-interior.dim_800x600.jpg",
    },
  ];

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 370, behavior: "smooth" });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  return (
    <section
      id="facilities"
      className="py-24 md:py-32 bg-[#0A0A0A] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto mb-10 px-6 md:px-10">
        <AnimatedSection>
          <p className="font-inter-tight font-bold text-xs tracking-[0.25em] text-[#CEFF00] uppercase mb-3">
            ELITE FACILITIES
          </p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h2
              className="font-inter-tight font-black text-[#EDEDED] uppercase tracking-tight leading-none"
              style={{ fontSize: "clamp(2rem, 5.5vw, 6rem)" }}
            >
              WHERE CHAMPIONS TRAIN
            </h2>
            {/* Arrow buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                data-ocid="facilities.carousel.prev.button"
                onClick={() => scrollBy(-1)}
                disabled={!canScrollLeft}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  canScrollLeft
                    ? "border-[#CEFF00] text-[#CEFF00] hover:bg-[#CEFF00] hover:text-[#0A0A0A]"
                    : "border-[#2A2A2A] text-[#2A2A2A] cursor-not-allowed"
                }`}
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                data-ocid="facilities.carousel.next.button"
                onClick={() => scrollBy(1)}
                disabled={!canScrollRight}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  canScrollRight
                    ? "border-[#CEFF00] text-[#CEFF00] hover:bg-[#CEFF00] hover:text-[#0A0A0A]"
                    : "border-[#2A2A2A] text-[#2A2A2A] cursor-not-allowed"
                }`}
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Edge-to-edge horizontal scroll */}
      <div
        ref={scrollRef}
        data-ocid="facilities.carousel.panel"
        className="flex gap-4 px-6 md:px-10 overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        style={{ scrollSnapType: "x mandatory" }}
      >
        {facilities.map((f, i) => (
          <div
            key={f.name}
            data-ocid={`facilities.carousel.item.${i + 1}`}
            className="flex-shrink-0 relative rounded-xl overflow-hidden group"
            style={{ width: 340, height: 460, scrollSnapAlign: "start" }}
          >
            <img
              src={f.img}
              alt={f.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="font-inter-tight font-black text-[#EDEDED] text-lg uppercase tracking-wide leading-tight">
                {f.name}
              </p>
              <p className="font-inter-tight font-medium text-[#CEFF00] text-xs tracking-[0.15em] uppercase mt-1">
                {f.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Membership Tiers ─────────────────────────────────────────────────────────
const fallbackTiers = [
  {
    name: "STARTER",
    priceInINR: BigInt(8500),
    features: [
      "Access to main gym",
      "Locker room access",
      "2 group classes/week",
      "Standard equipment",
    ],
  },
  {
    name: "PRO",
    priceInINR: BigInt(18500),
    features: [
      "Full facility access",
      "Unlimited group classes",
      "Personal trainer (2x/week)",
      "Pool & track access",
      "Recovery suite",
      "Nutrition consultation",
    ],
  },
  {
    name: "ELITE",
    priceInINR: BigInt(35000),
    features: [
      "All Pro features",
      "Daily 1-on-1 coaching",
      "Priority event registration",
      "Physio & sports medicine",
      "Performance analytics",
      "VIP lounge access",
      "Custom training plan",
    ],
  },
];

function TierCard({
  tier,
  isPro,
  index,
}: {
  tier: { name: string; priceInINR: bigint; features: string[] };
  isPro: boolean;
  index: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { ...spring, delay: index * 0.12 },
        },
      }}
      data-ocid={`membership.tier.item.${index + 1}`}
      className={`relative flex flex-col rounded-xl border overflow-hidden transition-all duration-300 ${
        isPro
          ? "border-[#CEFF00] bg-[#141414]"
          : "border-[#2A2A2A] bg-[#141414] hover:border-[#3A3A3A]"
      }`}
      style={
        isPro
          ? {
              boxShadow:
                "0 0 30px rgba(206,255,0,0.25), 0 0 80px rgba(206,255,0,0.08)",
            }
          : {}
      }
    >
      {/* MOST POPULAR ribbon */}
      {isPro && (
        <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden pointer-events-none">
          <div
            className="absolute top-5 right-[-28px] w-32 text-center font-inter-tight font-black text-[10px] tracking-[0.1em] uppercase py-1 bg-[#CEFF00] text-[#0A0A0A]"
            style={{ transform: "rotate(45deg)" }}
          >
            MOST POPULAR
          </div>
        </div>
      )}

      <div className="p-7 pb-0">
        <p className="font-inter-tight font-bold text-xs tracking-[0.2em] text-[#A8A8A8] uppercase mb-3">
          {tier.name}
        </p>
        <div className="flex items-baseline gap-2 mb-1">
          <span
            className={`font-inter-tight font-black leading-none ${
              isPro ? "text-[#CEFF00]" : "text-[#EDEDED]"
            }`}
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            ₹{Number(tier.priceInINR).toLocaleString("en-IN")}
          </span>
        </div>
        <p className="text-[#A8A8A8] text-xs tracking-wide mb-6">/month</p>
      </div>

      <div className="px-7 flex-1">
        <div className="h-px bg-[#2A2A2A] mb-6" />
        <ul className="flex flex-col gap-3 mb-8">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-[#CEFF00]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={10} className="text-[#CEFF00]" strokeWidth={3} />
              </div>
              <span className="font-inter-tight text-[#A8A8A8] text-sm">
                {f}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-7 pt-0">
        <button
          type="button"
          data-ocid={`membership.tier.item.${index + 1}.button`}
          className={`w-full font-inter-tight font-black text-sm tracking-[0.1em] uppercase py-3.5 rounded-xl transition-all duration-300 cursor-pointer ${
            isPro
              ? "bg-[#CEFF00] text-[#0A0A0A] hover:shadow-[0_0_25px_rgba(206,255,0,0.4)] hover:scale-[1.02]"
              : "border border-[#3A3A3A] text-[#EDEDED] hover:border-[#CEFF00] hover:text-[#CEFF00]"
          }`}
        >
          {isPro ? "ENROLL NOW" : "GET STARTED"}
        </button>
      </div>
    </motion.div>
  );
}

function MembershipSection() {
  const { data: tiers, isLoading } = useMembershipTiers();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const displayTiers = (
    tiers && tiers.length > 0 ? tiers : fallbackTiers
  ).slice(0, 3);

  const getProIndex = () => {
    const idx = displayTiers.findIndex(
      (t) =>
        t.name.toUpperCase().includes("PRO") || Number(t.priceInINR) === 18500,
    );
    return idx >= 0 ? idx : 1;
  };

  return (
    <section
      id="membership"
      className="py-24 md:py-32 px-6 md:px-10 bg-[#0A0A0A]"
    >
      <div className="max-w-[1400px] mx-auto">
        <AnimatedSection className="mb-14 text-center">
          <p className="font-inter-tight font-bold text-xs tracking-[0.2em] text-[#CEFF00] uppercase mb-3">
            Membership
          </p>
          <h2
            className="font-inter-tight font-black text-[#EDEDED] uppercase tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 5.5rem)" }}
          >
            SELECT YOUR TIER
          </h2>
          <p className="text-[#A8A8A8] text-base max-w-lg mx-auto mt-4">
            Choose your path to athletic excellence. All memberships include
            facility access and community support.
          </p>
        </AnimatedSection>

        {isLoading ? (
          <div
            data-ocid="membership.tiers.loading_state"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[520px] rounded-xl bg-[#141414] border border-[#2A2A2A] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {displayTiers.map((tier, i) => (
              <TierCard
                key={tier.name}
                tier={tier}
                isPro={i === getProIndex()}
                index={i}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ─── Final CTA + Footer ───────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  const socialLinks = [
    { icon: <Twitter size={18} />, href: "#", label: "Twitter" },
    { icon: <Instagram size={18} />, href: "#", label: "Instagram" },
    { icon: <Youtube size={18} />, href: "#", label: "YouTube" },
  ];

  return (
    <footer id="contact" className="relative bg-[#0A0A0A]">
      {/* Radial gradient BG */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(206,255,0,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Final CTA block */}
      <div className="relative z-10 border-t border-[#2A2A2A] px-6 md:px-10 py-24 md:py-36 text-center">
        <AnimatedSection>
          <p className="font-inter-tight font-bold text-xs tracking-[0.2em] text-[#CEFF00] uppercase mb-6">
            Limited Spots Available
          </p>
          <h2
            className="font-inter-tight font-black text-[#EDEDED] uppercase tracking-tight leading-[0.9] mx-auto"
            style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)", maxWidth: "16ch" }}
          >
            RESERVE YOUR SPOT
          </h2>
          <p className="text-[#A8A8A8] text-base mt-6 mb-10 max-w-md mx-auto">
            Become part of an elite community. Limited memberships available.
          </p>
          <button
            type="button"
            data-ocid="footer.reserve.primary_button"
            className="bg-[#CEFF00] text-[#0A0A0A] font-inter-tight font-black uppercase tracking-[0.1em] px-10 py-5 rounded-full hover:scale-[1.04] hover:shadow-[0_0_40px_rgba(206,255,0,0.4)] transition-all duration-300 cursor-pointer"
            style={{ fontSize: "clamp(0.875rem, 1.5vw, 1.1rem)" }}
          >
            RESERVE YOUR SPOT NOW
          </button>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              type="button"
              data-ocid="footer.view_memberships.secondary_button"
              onClick={() =>
                document
                  .getElementById("membership")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="font-inter-tight font-bold text-sm tracking-[0.1em] uppercase px-7 py-3.5 rounded-full bg-[#CEFF00] text-[#0A0A0A] hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              VIEW MEMBERSHIPS
            </button>
            <button
              type="button"
              data-ocid="footer.tour.secondary_button"
              onClick={() =>
                document
                  .getElementById("facilities")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="font-inter-tight font-bold text-sm tracking-[0.1em] uppercase px-7 py-3.5 rounded-full border border-[#EDEDED]/40 text-[#EDEDED] hover:border-[#CEFF00] hover:text-[#CEFF00] transition-all duration-200 cursor-pointer"
            >
              TOUR THE CLUB
            </button>
          </div>
        </AnimatedSection>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-[#1A1A1A] px-6 md:px-10 py-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#CEFF00] flex items-center justify-center">
              <span className="text-[#0A0A0A] font-black text-[10px]">G</span>
            </div>
            <span className="font-inter-tight font-semibold text-xs tracking-[0.15em] text-[#A8A8A8] uppercase">
              @GandipetClub
            </span>
          </div>

          {/* Center nav */}
          <nav className="flex flex-wrap justify-center gap-5">
            {["HOME", "MEMBERSHIP", "FACILITIES", "EVENTS", "CONTACT"].map(
              (link) => (
                <button
                  type="button"
                  key={link}
                  data-ocid={`footer.${link.toLowerCase()}.link`}
                  onClick={() =>
                    document
                      .getElementById(link.toLowerCase())
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="font-inter-tight font-semibold text-[10px] tracking-[0.15em] text-[#A8A8A8] hover:text-[#CEFF00] uppercase transition-colors cursor-pointer"
                >
                  {link}
                </button>
              ),
            )}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-4">
            <span className="font-inter-tight font-semibold text-[10px] tracking-[0.15em] text-[#A8A8A8] uppercase">
              IND / EST. 2023
            </span>
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  data-ocid={`footer.${s.label.toLowerCase()}.link`}
                  className="text-[#A8A8A8] hover:text-[#CEFF00] transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Caffeine attribution */}
        <div className="mt-4 text-center">
          <p className="font-inter-tight text-[10px] text-[#555555] tracking-wide">
            © {year}.{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#A8A8A8] transition-colors"
            >
              Built with ❤ using caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] font-inter-tight">
      <GrainOverlay />
      <Navbar />
      <main>
        <HeroSection />
        <PhilosophySection />
        <BentoSection />
        <FacilitiesCarousel />
        <MembershipSection />
      </main>
      <Footer />
    </div>
  );
}
