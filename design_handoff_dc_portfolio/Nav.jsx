/* Nav + Footer */

function Nav({ current, onNav, lang, setLang, theme, setTheme }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const links = [
    { id: 'home', label: lang === 'ES' ? 'Inicio' : 'Home' },
    { id: 'projects', label: lang === 'ES' ? 'Proyectos' : 'Projects' },
    { id: 'services', label: lang === 'ES' ? 'Servicios' : 'Services' },
    { id: 'about', label: lang === 'ES' ? 'Sobre mí' : 'About' },
    { id: 'blog', label: 'Blog' }
  ]
  return (
    <div className={`nav-wrap${scrolled ? ' scrolled' : ''}`}>
      <div className="nav">
        <a className="brand" onClick={() => onNav('home')}>
          <img src="assets/logo-iso.jpg" alt="" />
          <span className="brand-text">
            <span>David Cuy</span>
            <span className="sub">Cloud + Coffee</span>
          </span>
        </a>
        <div className="nav-links">
          {links.map(l => (
            <a key={l.id} className={current === l.id ? 'active' : ''} onClick={() => onNav(l.id)}>{l.label}</a>
          ))}
        </div>
        <div className="nav-actions">
          <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle theme">
            {theme === 'dark' ? <I.sun /> : <I.moon />}
          </button>
          <div className="lang-switch">
            <button className={lang === 'ES' ? 'active' : ''} onClick={() => setLang('ES')}>ES</button>
            <button className={lang === 'EN' ? 'active' : ''} onClick={() => setLang('EN')}>EN</button>
          </div>
          <Button variant="secondary" size="sm" icon={<I.calendar />} onClick={() => onNav('services')} className="nav-cta">
            {lang === 'ES' ? 'Contratar' : 'Hire me'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function Footer({ lang, onNav }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="row">
              <img src="assets/logo-iso.jpg" alt="" />
              <span>David Cuy</span>
            </div>
            <p>
              {lang === 'ES'
                ? 'Cloud Architect & Software Engineer. Nube + café — precisión técnica, servida tibia.'
                : 'Cloud Architect & Software Engineer. Cloud + coffee — technical precision, served warm.'}
            </p>
            <div className="socials">
              <a title="GitHub"><I.github /></a>
              <a title="LinkedIn"><I.linkedin /></a>
              <a title="RSS"><I.rss /></a>
              <a title="Email"><I.mail /></a>
            </div>
          </div>
          <div>
            <h4>{lang === 'ES' ? 'Sitio' : 'Site'}</h4>
            <ul>
              <li><a onClick={() => onNav('home')}>{lang === 'ES' ? 'Inicio' : 'Home'}</a></li>
              <li><a onClick={() => onNav('projects')}>{lang === 'ES' ? 'Proyectos' : 'Projects'}</a></li>
              <li><a onClick={() => onNav('services')}>{lang === 'ES' ? 'Servicios' : 'Services'}</a></li>
              <li><a onClick={() => onNav('about')}>{lang === 'ES' ? 'Sobre mí' : 'About'}</a></li>
            </ul>
          </div>
          <div>
            <h4>Blog</h4>
            <ul>
              <li><a onClick={() => onNav('blog')}>{lang === 'ES' ? 'Todos los posts' : 'All posts'}</a></li>
              <li><a>{lang === 'ES' ? 'Categorías' : 'Categories'}</a></li>
              <li><a>{lang === 'ES' ? 'Newsletter' : 'Newsletter'}</a></li>
              <li><a>RSS</a></li>
            </ul>
          </div>
          <div>
            <h4>{lang === 'ES' ? 'Contacto' : 'Contact'}</h4>
            <ul>
              <li><a>david@cloud-coffee.dev</a></li>
              <li><a>{lang === 'ES' ? 'Reservar llamada' : 'Book a call'}</a></li>
              <li><a>{lang === 'ES' ? 'Kit de ponente' : 'Speaker kit'}</a></li>
              <li><a>Mérida, MX</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © 2026 David Cuy ·
            {lang === 'ES' ? 'Hecho con nube + café.' : 'Made with cloud + coffee.'}
          </span>
          <span>v2.4.0 · deployed on the edge</span>
        </div>
      </div>
    </footer>
  )
}

Object.assign(window, { Nav, Footer })
