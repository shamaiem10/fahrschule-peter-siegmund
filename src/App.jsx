import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const images = {
  hero: 'https://fahrschule-siegmund.de/wp-content/uploads/2018/03/IMG-20150929-WA0024-500x300.jpg',
  team: 'https://fahrschule-siegmund.de/wp-content/uploads/2018/03/13164336_821124241364567_8374318152589491461_n-500x300.jpg',
  seminar: 'https://fahrschule-siegmund.de/wp-content/uploads/2018/03/kranenburg-458x275.jpg',
  center: 'https://fahrschule-siegmund.de/wp-content/uploads/2018/04/Neue-Bilder-Fahrschulen-002.jpg',
  dons: 'https://fahrschule-siegmund.de/wp-content/uploads/2018/04/Fahrschule-Donsbr%C3%BCggen-002.jpg',
  rindern: 'https://fahrschule-siegmund.de/wp-content/uploads/2018/04/Neue-Bilder-Fahrschulen-003.jpg',
  nuetterden: 'https://fahrschule-siegmund.de/wp-content/uploads/2018/04/Neue-Bilder-Fahrschulen-007.jpg'
};

const ease = [0.16, 1, 0.3, 1];
const reveal = { hidden: { opacity: 0, y: 28, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease } } };
const parentReveal = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };

function ExternalImage({ src, alt, className = '' }) {
  return (
    <div className={`image-shell ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
          const fallback = event.currentTarget.nextElementSibling;
          if (fallback) fallback.style.display = 'grid';
        }}
      />
      <div className="image-fallback" aria-hidden="true"><i className="bi bi-car-front-fill"></i></div>
    </div>
  );
}

function RippleLink({ href, className, children }) {
  const [ripples, setRipples] = useState([]);
  const reduced = useReducedMotion();
  const addRipple = (event) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ripple = { id: Date.now(), x: event.clientX - rect.left, y: event.clientY - rect.top };
    setRipples((current) => [...current, ripple]);
    window.setTimeout(() => setRipples((current) => current.filter((item) => item.id !== ripple.id)), 450);
  };
  return <motion.a href={href} className={className} onPointerDown={addRipple} whileTap={reduced ? {} : { scale: 0.97 }}>{children}{ripples.map((item) => <span className="ripple" key={item.id} style={{ left: item.x, top: item.y }} />)}</motion.a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [['Startseite', 'start'], ['FS-Klassen', 'klassen'], ['Seminare', 'seminare'], ['Standorte & Zeiten', 'standorte'], ['Team', 'team'], ['Fuhrpark', 'fuhrpark'], ['Kontakt', 'kontakt']];
  return <header className="site-header"><div className="nav-wrap"><a className="brand" href="#start" aria-label="Fahrschule Siegmund Startseite"><span className="brand-mark"><i className="bi bi-sign-turn-right-fill"></i></span><span>Fahrschule<br /><strong>Peter Siegmund</strong></span></a><button className="menu-button" type="button" aria-expanded={open} aria-label="Navigation öffnen" onClick={() => setOpen((value) => !value)}><i className={open ? 'bi bi-x-lg' : 'bi bi-list'}></i></button><nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Hauptnavigation">{links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}</nav></div></header>;
}

function CursorGlow() {
  const glow = useRef(null);
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return undefined;
    const move = (event) => {
      if (glow.current) glow.current.style.transform = `translate3d(${event.clientX - 120}px, ${event.clientY - 120}px, 0)`;
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);
  return <div ref={glow} className="cursor-glow" aria-hidden="true" />;
}

function Hero() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-10, 10]);
  const words = ['Wir', 'vermitteln', 'die', 'Freude', 'am', 'Fahren.'];
  return <section id="start" className="hero" ref={ref}><motion.div className="hero-photo" initial={{ opacity: 0, y: reduced ? 0 : 12, scale: reduced ? 1 : 1.015 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: reduced ? 0.2 : 0.3, ease: 'easeOut' }} style={{ y: imageY }}><ExternalImage src={images.hero} alt="Ausbildungsfahrzeug der Fahrschule Siegmund" /></motion.div><div className="hero-duotone"></div><div className="asphalt"></div><motion.div className="hero-glow" animate={reduced ? {} : { x: ['-4%', '5%', '-4%'], y: [0, '3%', 0], rotate: [0, 8, 0], scale: [1, 1.08, 1] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} /><div className="hero-content"><motion.div className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.3 }}><i className="bi bi-lightning-charge-fill"></i> Fahrschule Peter Siegmund</motion.div><h1>{words.map((word, index) => <motion.span key={word} initial={{ opacity: 0, y: reduced ? 0 : 28, rotate: reduced ? 0 : 1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.1 + index * 0.055, duration: reduced ? 0.2 : 0.34, ease }}>{word}{' '}</motion.span>)}</h1><motion.p className="hero-subline" initial={{ opacity: 0, y: reduced ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: reduced ? 0.2 : 0.3 }}>Bei uns auch Ausbildung mit Automatik möglich!!</motion.p><motion.div className="language-row" initial="hidden" animate="visible" variants={parentReveal}>{['We speak English', 'Wij spreken Nederlands'].map((label) => <motion.span variants={reveal} whileHover={reduced ? {} : { y: -2, scale: 1.03 }} whileTap={reduced ? {} : { scale: 0.96 }} className="language-chip" key={label}>{label}</motion.span>)}</motion.div><motion.div className="lane" initial={{ scaleX: reduced ? 1 : 0, opacity: 0.5 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ delay: 0.22, duration: reduced ? 0.2 : 0.6, ease }}><motion.i className="bi bi-car-front-fill lane-car" initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: '12vw', y: reduced ? 0 : [0, -2, 0], rotate: reduced ? 0 : [0, 0.6, 0] }} transition={reduced ? { duration: 0.2 } : { opacity: { delay: 0.5, duration: 0.2 }, x: { delay: 0.5, type: 'spring', stiffness: 180, damping: 20, mass: 0.8 }, y: { delay: 1.25, duration: 2.4, repeat: Infinity, ease: 'easeInOut' }, rotate: { delay: 1.25, duration: 2.4, repeat: Infinity, ease: 'easeInOut' } }} /></motion.div><motion.div className="hero-actions" initial={{ opacity: 0, y: reduced ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.3 }}><RippleLink href="#kontakt" className="button button-red">Jetzt anmelden <i className="bi bi-arrow-right-short"></i></RippleLink><RippleLink href="#seminare" className="button button-light">Intensivkurs-Termine</RippleLink></motion.div></div></section>;
}

function LicenseLane() {
  const reduced = useReducedMotion();
  const cards = [
    ['FS-Klassen', 'Finde die passende Führerscheinklasse.', 'klassen', 'bi bi-list-check'],
    ['Intensivkurs', 'In 2 bis 3 Wochen fit für den Führerschein.', 'seminare', 'bi bi-calendar2-check-fill'],
    ['ASF-Nachschulung', 'Aufbauseminar für Fahranfänger.', 'seminare', 'bi bi-exclamation-triangle-fill'],
    ['Standorte & Zeiten', 'Unterricht an vier Standorten.', 'standorte', 'bi bi-geo-alt-fill']
  ];
  return <section className="license-section section"><motion.div className="license-wrap" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}><div className="road-markings"></div><div className="section-heading inverted"><span className="kicker">Deine nächste Spur</span><h2>Einsteigen. Auswählen. Losfahren.</h2></div><motion.div className="license-track" drag={reduced ? false : 'x'} dragConstraints={{ left: -420, right: 0 }} dragElastic={0.08}>{cards.map(([title, copy, id, icon]) => <motion.article className="lane-card" key={title} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} whileHover={reduced ? {} : { y: -6, scale: 1.015, backgroundColor: 'rgba(30,64,175,0.92)', borderColor: 'rgba(250,204,21,0.70)', boxShadow: '0 20px 40px rgba(37,99,235,0.32)' }}><i className={icon || 'bi bi-sign-turn-right-fill'}></i><h3>{title}</h3><p>{copy}</p><a href={`#${id}`}>Mehr erfahren <i className="bi bi-arrow-right-short"></i></a></motion.article>)}</motion.div><div className="progress"><motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: reduced ? 0.2 : 0.8, ease }} /></div></motion.div></section>;
}

const locations = [
  { id: 'stadtmitte', city: 'Kleve Stadtmitte', address: 'Arntzstr.43 · 47533 Kleve-Stadtmitte', time: 'Dienstag + Freitag · 18.00 Uhr', src: images.center, icon: 'bi bi-geo-alt-fill', direction: 'up' },
  { id: 'donsbrueggen', city: 'Kleve – Donsbrüggen', address: 'Kranenburger Str.46 · 47533 Kleve', time: 'Montag · 18.00 Uhr', src: images.dons, icon: 'bi bi-geo-alt-fill', direction: 'right' },
  { id: 'rindern', city: 'Kleve – Rindern', address: 'Keekener Str.45 · 47533 Kleve', time: 'Montag + Mittwoch · 18.00 Uhr', src: images.rindern, icon: 'bi bi-geo-alt', direction: 'left' },
  { id: 'nuetterden', city: 'Kranenburg – Nütterden', address: 'Hoher Weg 8 · 47559 Kranenburg', time: 'Dienstag + Donnerstag · 18.00 Uhr', src: images.nuetterden, icon: 'bi bi-geo-alt', direction: 'up' }
];

function Locations() {
  const reduced = useReducedMotion();
  return <section id="standorte" className="locations section"><div className="map-grid"></div><div className="container"><motion.div className="section-heading" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}><span className="kicker">Standorte & Zeiten</span><h2>Viermal in Deiner Nähe.</h2><p>Wähle den Standort, der zu Deinem Alltag passt.</p></motion.div><motion.div className="location-grid" variants={parentReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }}>{locations.map((location, index) => <motion.article id={location.id} className={`location-card location-${index}`} key={location.city} variants={reveal} whileHover={reduced ? {} : { y: index === 0 ? -4 : -5, scale: index === 0 ? 1.015 : 1.018, rotate: index === 2 ? 0.25 : index > 0 ? -0.25 : 0, backgroundColor: '#f8fbff', borderColor: 'rgba(37,99,235,0.55)', boxShadow: '0 18px 38px rgba(37,99,235,0.20)' }}><motion.div className="location-image" initial={{ opacity: 0, clipPath: reduced ? 'none' : index === 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 100% 0)' }} whileInView={{ opacity: 1, clipPath: 'inset(0 0 0 0)' }} viewport={{ once: true }} transition={{ duration: reduced ? 0.2 : 0.58, delay: reduced ? 0 : index * 0.09, ease }}><ExternalImage src={location.src} alt={`Fahrschule Siegmund ${location.city}`} /></motion.div><div className="location-title"><span className="sheen"></span><i className={location.icon || 'bi bi-geo-alt-fill'}></i><h3>{location.city}</h3></div><div className="location-copy"><p><i className="bi bi-geo-alt-fill"></i>{location.address}</p><motion.p className="time-chip" whileHover={reduced ? {} : { y: -1, scale: 1.035, backgroundColor: '#fde68a', boxShadow: '0 7px 14px rgba(161,98,7,0.18)' }}><i className="bi bi-clock-fill"></i>{location.time}</motion.p><a href="#kontakt">Kontakt <i className="bi bi-arrow-right-short"></i></a></div></motion.article>)}</motion.div><div className="center-action"><RippleLink href="#kontakt" className="button button-blue">Alle Standorte ansehen</RippleLink></div></div></section>;
}

function Team() {
  const reduced = useReducedMotion();
  return <section id="team" className="team-section section"><div className="container team-grid"><motion.div className="team-image-card" initial={{ opacity: 0, x: reduced ? 0 : -48, rotate: reduced ? 0 : -1.5, scale: reduced ? 1 : 0.97 }} whileInView={{ opacity: 1, x: 0, rotate: 0, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: reduced ? 0.2 : 0.6, ease }} whileHover={reduced ? {} : { y: -5, scale: 1.01 }}><ExternalImage src={images.team} alt="Das Team der Fahrschule Siegmund" /></motion.div><motion.article className="team-copy" initial={{ opacity: 0, x: reduced ? 0 : 48, scale: reduced ? 1 : 0.97 }} whileInView={{ opacity: 1, x: 0, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: reduced ? 0 : 0.1, duration: reduced ? 0.2 : 0.6, ease }} whileHover={reduced ? {} : { y: -5, scale: 1.01, backgroundColor: '#fffafa', borderColor: 'rgba(220,38,38,0.46)', boxShadow: '0 24px 48px rgba(220,38,38,0.16)' }}><span className="red-bar"></span><div className="icon-disc"><i className="bi bi-people-fill"></i></div><span className="kicker">Dein Team</span><h2>Der richtige Coach für Dich.</h2><p>Wir sind ein gemischtes Team von Fahrlehrern, von jung bis alt, Mann oder Frau, bei uns findest Du auf jeden Fall den richtigen Coach.</p><p>Such Dir jetzt Deinen Lieblingsfahrlehrer aus. Er wird Dich bis zur Prüfung begleiten.</p><a className="text-link red-link" href="#kontakt">Team ansehen <i className="bi bi-person-check-fill"></i></a></motion.article></div></section>;
}

function Fleet() {
  return <section id="fuhrpark" className="fleet section"><div className="container"><motion.article className="fleet-card" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}><div className="icon-disc yellow"><i className="bi bi-car-front-fill"></i></div><div><span className="kicker">Der Fuhrpark</span><h2>Konzentriert auf Deine Ausbildung.</h2><p>Unser hochmoderner Fuhrpark besteht aus aktuellen Modellen. Bei uns gibt es nur Nichtraucherfahrzeuge und alle sind in einwandfreiem Zustand. Hier kannst Du dich voll und ganz auf Deine Ausbildung konzentrieren.</p></div></motion.article></div></section>;
}

function Seminars() {
  const reduced = useReducedMotion();
  const highlights = [
    { title: 'ASF-Kurse', copy: 'Aufbauseminar für Fahranfänger.', icon: 'bi bi-exclamation-triangle-fill', tone: 'asf' },
    { title: 'Intensivkurs', copy: 'In 2 bis 3 Wochen fit für den Führerschein.', icon: 'bi bi-calendar2-check-fill', tone: 'intensive' }
  ];
  return <section id="seminare" className="seminars section"><div className="container"><div className="section-heading"><span className="kicker">Seminare und Kurse</span><h2>Der direkte Weg zum nächsten Schritt.</h2></div><motion.div className="seminar-highlights" variants={parentReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>{highlights.map((item) => <motion.article className={`seminar-highlight ${item.tone}`} key={item.title} variants={reveal} whileHover={reduced ? {} : { y: -6, rotate: item.tone === 'asf' ? -2 : 2, scale: 1.018, borderColor: 'rgba(250,204,21,0.72)', boxShadow: item.tone === 'asf' ? '0 22px 44px rgba(220,38,38,0.38)' : '0 22px 44px rgba(37,99,235,0.38)' }}><i className={item.icon || 'bi bi-calendar2-check-fill'}></i><h3>{item.title}</h3><p>{item.copy}</p><div className="phone-row"><a href="tel:0282128293">02821–28293</a><a href="tel:01732808218">0173-2808218</a></div></motion.article>)}</motion.div><motion.article className="seminar-card" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} whileHover={reduced ? {} : { y: -5, scale: 1.01, backgroundColor: '#f8fbff', borderColor: 'rgba(37,99,235,0.52)', boxShadow: '0 24px 48px rgba(37,99,235,0.20)' }}><div className="seminar-image"><ExternalImage src={images.seminar} alt="Fahrschule Siegmund in Kranenburg" /></div><motion.div className="seminar-strip" initial={{ scaleX: reduced ? 1 : 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.12, duration: reduced ? 0.2 : 0.5, ease }}><i className="bi bi-calendar-event-fill"></i> Führerschein Intensivkurse</motion.div><div className="seminar-content"><h3>In 2 bis 3 Wochen fit für den Führerschein</h3><p>Auf der Grundlage der gesetzlichen Bestimmungen bieten wir Ihnen ein Intensiv-Ausbildungsprogramm. Erfragen Sie die Termine für die nächsten Seminare.</p><h3>Nachschulungskurse für Fahranfänger mit Führerschein auf Probe – ASF-Kurse</h3><p>Junge Fahranfänger, die während ihrer Probezeit durch verkehrswidriges Verhalten auffallen, werden seitens der zuständigen Behörde zur Teilnahme an einem Aufbauseminar verpflichtet.</p><div className="contact-inline"><RippleLink href="tel:0282128293" className="button button-red"><i className="bi bi-telephone-fill"></i> 02821–28293</RippleLink><a href="mailto:info@fahrschule-siegmund.de">info@fahrschule-siegmund.de</a></div></div></motion.article></div></section>;
}

const classGroups = [
  { title: 'Klasse B', age: '17 / 18 Jahre', text: 'Kraftfahrzeuge – außer Kraftfahrzeuge der Klasse AM, A1, A2 und A – bis 3500 kg zul. Gesamtmasse, zur Beförderung von nicht mehr als 8 Personen außer dem Fahrzeugführer. Anhänger bis 750 kg oder über 750 kg, sofern die Kombination 3500 kg nicht übersteigt. Einschluss der Klassen AM und L.' },
  { title: 'Klasse B96', age: '17 / 18 Jahre', text: 'Kombinationen aus einem Zugfahrzeug der Klasse B und einem Anhänger, wobei die zul. Gesamtmasse der Kombination bis 4250 kg betragen darf.' },
  { title: 'Klasse BE', age: '17 / 18 Jahre', text: 'Kombinationen aus einem Zugfahrzeug der Klasse B und einem Anhänger beziehungsweise Sattelanhänger bis zu 3500 kg zul. Gesamtmasse.' },
  { title: 'Klasse AM', age: '16 Jahre', text: 'Zweirädrige Kleinkrafträder, dreirädrige Kleinkrafträder und vierrädrige Leichtkraftfahrzeuge bis 45 km/h, maximal 50 ccm oder maximal 4 kW Elektromotor.' },
  { title: 'Klasse A1', age: 'Leichtkrafträder', text: 'Krafträder mit einem Hubraum von nicht mehr als 125 cm³ und einer Motorleistung von nicht mehr als 11 kW. Maximales Verhältnis Leistung/Gewicht: 0,1 kW/kg.' },
  { title: 'Klasse A2', age: '18 Jahre', text: 'Krafträder, auch mit Beiwagen, mit maximal 35 kW Motorleistung und einem Verhältnis Leistung/Gewicht von maximal 0,2 kW/kg. Einschluss AM und A1.' },
  { title: 'Klasse A', age: '20 / 21 / 24 Jahre', text: 'Krafträder, auch mit Beiwagen, über 45 km/h und mehr als 50 ccm sowie dreirädrige Kraftfahrzeuge über 15 kW. Einschluss AM, A1 und A2.' },
  { title: 'Klasse L', age: 'Land- und Forstwirtschaft', text: 'Zugmaschinen für land- oder forstwirtschaftliche Zwecke bis 40 km/h, mit Anhänger bis 25 km/h, sowie selbstfahrende Arbeitsmaschinen und Stapler bis 25 km/h.' }
];

function AccordionItem({ item, index }) {
  const [open, setOpen] = useState(index === 0);
  const reduced = useReducedMotion();
  return <motion.article className="accordion-item" variants={reveal}><motion.button type="button" className="accordion-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open} whileHover={reduced ? {} : { x: 4, scale: 1.005, backgroundColor: '#eff6ff', borderColor: 'rgba(37,99,235,0.48)', boxShadow: '0 9px 20px rgba(37,99,235,0.13)' }}><span><span className="class-badge">{item.title}</span>{item.age}</span><motion.i className="bi bi-chevron-down" animate={{ rotate: reduced ? 0 : open ? 180 : 0 }} /></motion.button><AnimatePresence initial={false}>{open && <motion.div className="accordion-body" initial={{ opacity: 0, height: 0, y: reduced ? 0 : -8 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: reduced ? 0 : -6 }} transition={{ duration: reduced ? 0.2 : 0.3, ease: 'easeOut' }}><p>{item.text}</p></motion.div>}</AnimatePresence></motion.article>;
}

function Classes() {
  return <section id="klassen" className="classes section"><div className="legal-glow"></div><div className="container narrow"><motion.div className="section-heading" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}><span className="kicker">FS-Klassen</span><h2>Übersicht über die Klassen</h2><p>Die in unserer Fahrschule ausgebildet werden.</p></motion.div><div className="class-columns"><motion.div variants={parentReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}><h3><i className="bi bi-list-check"></i> B · BE · B96</h3>{classGroups.slice(0, 3).map((item, index) => <AccordionItem item={item} index={index} key={item.title} />)}</motion.div><motion.div variants={parentReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}><h3><i className="bi bi-journal-text"></i> A · A2 · A1 · AM · L</h3>{classGroups.slice(3).map((item, index) => <AccordionItem item={item} index={index + 3} key={item.title} />)}</motion.div></div><p className="source">Quelle: Bundesverkehrsministerium</p></div></section>;
}

function Confidence() {
  const reduced = useReducedMotion();
  const badges = [['Wij spreken Nederlands', 'bi bi-translate'], ['We speak English', 'bi bi-translate'], ['Ausbildung mit Automatik möglich', 'bi bi-ev-front-fill']];
  return <section className="confidence section"><motion.div className="confidence-wrap" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}><div className="confidence-highlight"></div>{badges.map(([label, icon]) => <motion.div className="confidence-badge" key={label} variants={reveal} whileHover={reduced ? {} : { y: -3, scale: [1.055, 1.075, 1.055], backgroundColor: '#eff6ff', borderColor: 'rgba(37,99,235,0.62)', boxShadow: '0 12px 26px rgba(37,99,235,0.18)' }}><i className={icon || 'bi bi-translate'}></i><span>{label}</span></motion.div>)}</motion.div></section>;
}

function RequiredImageStrip() {
  const extras = [
    ['https://fahrschule-siegmund.de/wp-content/uploads/2018/03/logo_neu02.gif', 'Fahrschule Siegmund Logo'],
    ['https://fahrschule-siegmund.de/wp-content/plugins/easy-facebook-likebox/public/assets/images/loader.gif', 'Facebook'],
    ['https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-1/292560819_546089263877459_8146950070118308627_n.jpg?stp=cp0_dst-jpg_s50x50_tt6&_nc_cat=100&ccb=1-7&_nc_sid=f907e8&_nc_ohc=PurOt-DeyiQQ7kNvwGDJOQl&_nc_oc=Adrh9czeos4if76ceWt-tGPJ5HA7vY6-kHqT104boP7I3s_DnAlrxaHAiuloq8PmzrE&_nc_zt=24&_nc_ht=scontent-lax3-2.xx&edm=ADwHzz8EAAAA&_nc_gid=JBRmu_2p9ac-cx9d10_f1g&oh=00_AQAsywlQi8n6UycLOc9ITX1dH9NYTTphk9CNMcxHNUB7CA&oe=6A682B45', 'Fahrschule Siegmund auf Facebook'],
    ['https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-1/359723221_6464367153644371_8523241843928123182_n.jpg?stp=cp0_dst-jpg_s40x40_tt6&_nc_cat=100&ccb=1-7&_nc_sid=28885b&_nc_ohc=uwNp2CENtPYQ7kNvwEK-zIP&_nc_oc=AdoEQgt9_12_lctVCwWPkDg2XAvnw8Y_iGrKiAW9H81YUFCbawk5GHq9MmeuBmxtZys&_nc_zt=24&_nc_ht=scontent-lax3-2.xx&edm=ADwHzz8EAAAA&_nc_gid=JBRmu_2p9ac-cx9d10_f1g&oh=00_AQCN3DnZLBxGkMVot2TOkry8iG6a7XVG1N2JYiDOaWYU2w&oe=6A680D20', 'Peter Siegmund auf Facebook'],
    ['https://fahrschule-siegmund.de/wp-content/uploads/2018/03/logo_neu01-1.gif', 'Fahrschule Siegmund'],
    ['https://fahrschule-siegmund.de/wp-content/themes/automotive/images/arrow-up.png', 'Nach oben']
  ];
  return <div className="required-images" aria-label="Fahrschule Siegmund und Facebook">{extras.map(([src, alt]) => <ExternalImage src={src} alt={alt} key={src} />)}</div>;
}

function Contact() {
  return <section id="kontakt" className="contact section"><div className="container contact-grid"><div><span className="kicker light">Kontakt</span><h2>Wir helfen Dir gerne weiter.</h2><p>Wenn Du noch Fragen hast, kannst Du uns natürlich jeder Zeit anrufen oder vorbei kommen.</p></div><div className="contact-actions"><a href="tel:0282128293"><i className="bi bi-telephone-fill"></i><span>02821–28293</span></a><a href="tel:01732808218"><i className="bi bi-phone-fill"></i><span>0173-2808218</span></a><a href="mailto:info@fahrschule-siegmund.de"><i className="bi bi-envelope-fill"></i><span>info@fahrschule-siegmund.de</span></a></div></div><RequiredImageStrip /></section>;
}

function Footer() {
  return <footer><div className="footer-wrap"><p><strong>Fahrschule Peter Siegmund</strong></p><nav aria-label="Rechtliches"><a href="https://fahrschule-siegmund.de/datenschutz/">Datenschutz</a><a href="https://fahrschule-siegmund.de/impressum/">Impressum</a><a href="https://www.facebook.com/199597500183914?ref=embed_page">Facebook</a></nav><a className="back-top" href="#start" aria-label="Nach oben"><i className="bi bi-arrow-up"></i></a></div></footer>;
}

export default function App() {
  return <><CursorGlow /><Header /><main><Hero /><LicenseLane /><Locations /><Team /><Fleet /><Seminars /><Classes /><Confidence /><Contact /></main><Footer /></>;
}
