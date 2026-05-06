/* Projects, Services, About, Blog screens + post data */

/* ---------- Data ---------- */
const LATEST_POSTS = lang => [
  {
    id: 'boring-answer', category: 'decisions',
    title: lang === 'ES' ? 'La respuesta aburrida suele ser correcta' : 'The boring answer is usually correct',
    dek: lang === 'ES' ? 'Tres patrones que he visto adoptar por las razones equivocadas — y las alternativas aburridas que los superaron.' : 'Three patterns I\'ve watched teams adopt for the wrong reasons — and the boring alternatives that outlasted them.',
    date: 'Apr 12, 2026', read: '7 min', cover: 'decisions'
  },
  {
    id: 'event-driven-honestly', category: 'serverless',
    title: lang === 'ES' ? 'Event-driven, con honestidad' : 'Event-driven, honestly',
    dek: lang === 'ES' ? 'Lo que las slides de re:Invent no cuentan sobre event-driven al mes 18. Schema ownership, retries y el PR que nadie revisa.' : 'What the re:Invent slides don\'t tell you about event-driven systems at the 18-month mark.',
    date: 'Mar 28, 2026', read: '9 min', cover: 'serverless'
  },
  {
    id: 'unmicroservice', category: 'architecture',
    title: lang === 'ES' ? 'Desmicroservicializar sin perder el trabajo' : 'Un-microservicing without losing your job',
    dek: lang === 'ES' ? 'Cuándo y cómo colapsar microservicios que se pusieron demasiado clever. Con el ADR completo incluido.' : 'When and how to collapse microservices that got too clever. With the full ADR attached.',
    date: 'Mar 14, 2026', read: '12 min', cover: 'architecture'
  },
  {
    id: 'adrs-that-read', category: 'leadership',
    title: lang === 'ES' ? 'Escribir ADRs que la gente lea' : 'Writing ADRs people actually read',
    dek: lang === 'ES' ? 'Una plantilla, tres reglas, y la razón por la que tu doc de arquitectura nunca recibe comentarios.' : 'A template, three rules, and why your architecture doc never gets comments.',
    date: 'Feb 22, 2026', read: '6 min', cover: 'leadership'
  },
  {
    id: 'mainframe-off-ramp', category: 'legacy',
    title: lang === 'ES' ? 'Saliendo del mainframe sin prometer too much' : 'Off the mainframe, without promising too much',
    dek: lang === 'ES' ? 'Strangler fig, feature flags y la conversación difícil con el CFO.' : 'Strangler fig, feature flags, and the hard conversation with the CFO.',
    date: 'Feb 08, 2026', read: '10 min', cover: 'legacy'
  },
  {
    id: 'p99-regression', category: 'observ',
    title: lang === 'ES' ? 'Diagnosticando una regresión de p99 en 400ms' : 'Diagnosing a 400ms p99 regression',
    dek: lang === 'ES' ? 'Una postmortem completa. Culpamos al bus de eventos. El culpable fue un cold start.' : 'A full postmortem. We blamed the event bus. The real culprit was a cold start.',
    date: 'Jan 25, 2026', read: '14 min', cover: 'observ'
  }
]

/* Visual cover generator — each post gets an architecture-style SVG */
function PostCover({ kind }) {
  const covers = {
    decisions: (
      <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="200" fill="#1B3A6B" />
        <g fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 4">
          <path d="M40 100 L140 60 M40 100 L140 100 M40 100 L140 140" />
        </g>
        <circle cx="40" cy="100" r="12" fill="#4FB3D4" />
        <rect x="130" y="48" width="70" height="24" rx="4" fill="#7B4E38" opacity="0.9" />
        <rect x="130" y="88" width="70" height="24" rx="4" fill="#4FB3D4" opacity="0.9" />
        <rect x="130" y="128" width="70" height="24" rx="4" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" />
        <text x="165" y="63" textAnchor="middle" fontSize="10" fontFamily="ui-monospace" fill="#fff">Fancy</text>
        <text x="165" y="103" textAnchor="middle" fontSize="10" fontFamily="ui-monospace" fill="#fff" fontWeight="700">Boring ✓</text>
        <text x="165" y="143" textAnchor="middle" fontSize="10" fontFamily="ui-monospace" fill="#fff">Clever</text>
      </svg>
    ),
    serverless: (
      <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="200" fill="#152E55" />
        <g stroke="#4FB3D4" strokeWidth="1.5" fill="none" opacity="0.7">
          <path d="M40 50 Q160 20 280 50" />
          <path d="M40 100 Q160 70 280 100" />
          <path d="M40 150 Q160 120 280 150" />
        </g>
        {[60, 120, 180, 240].map((x, i) => <rect key={i} x={x} y="80" width="36" height="36" rx="6" fill="#4FB3D4" opacity={0.4 + i * 0.15} />)}
        <text x="160" y="180" textAnchor="middle" fontSize="11" fontFamily="ui-monospace" fill="rgba(255,255,255,0.55)">events → handlers → state</text>
      </svg>
    ),
    architecture: (
      <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="200" fill="#0F2240" />
        <g stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none">
          <rect x="30" y="40" width="80" height="50" rx="6" />
          <rect x="120" y="40" width="80" height="50" rx="6" />
          <rect x="210" y="40" width="80" height="50" rx="6" />
          <rect x="75" y="120" width="170" height="50" rx="6" stroke="#4FB3D4" strokeWidth="1.5" />
          <path d="M70 90 L130 120 M160 90 L160 120 M250 90 L190 120" strokeDasharray="3 3" />
        </g>
        <circle cx="160" cy="145" r="4" fill="#4FB3D4" />
        <text x="70" y="68" textAnchor="middle" fontSize="9" fontFamily="ui-monospace" fill="rgba(255,255,255,0.7)">svc-a</text>
        <text x="160" y="68" textAnchor="middle" fontSize="9" fontFamily="ui-monospace" fill="rgba(255,255,255,0.7)">svc-b</text>
        <text x="250" y="68" textAnchor="middle" fontSize="9" fontFamily="ui-monospace" fill="rgba(255,255,255,0.7)">svc-c</text>
        <text x="160" y="155" textAnchor="middle" fontSize="10" fontFamily="ui-monospace" fontWeight="700" fill="#fff">monolith-again</text>
      </svg>
    ),
    leadership: (
      <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="200" fill="#7B4E38" />
        <rect x="70" y="40" width="180" height="120" rx="10" fill="#FAF4F0" />
        <g fill="#7B4E38">
          <rect x="88" y="60" width="100" height="4" rx="2" />
          <rect x="88" y="76" width="140" height="3" rx="1.5" opacity="0.5" />
          <rect x="88" y="86" width="120" height="3" rx="1.5" opacity="0.5" />
          <rect x="88" y="100" width="60" height="4" rx="2" />
          <rect x="88" y="116" width="140" height="3" rx="1.5" opacity="0.5" />
          <rect x="88" y="126" width="100" height="3" rx="1.5" opacity="0.5" />
          <rect x="88" y="136" width="80" height="3" rx="1.5" opacity="0.5" />
        </g>
        <circle cx="232" cy="66" r="6" fill="#4FB3D4" />
      </svg>
    ),
    legacy: (
      <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="200" fill="#3E3832" />
        <rect x="30" y="50" width="100" height="100" rx="4" fill="#5A5249" stroke="#A89F92" />
        <rect x="40" y="60" width="80" height="6" fill="#A89F92" />
        <rect x="40" y="74" width="60" height="4" fill="#A89F92" opacity="0.6" />
        <rect x="40" y="84" width="70" height="4" fill="#A89F92" opacity="0.6" />
        <g stroke="#4FB3D4" strokeWidth="1.5" fill="none" strokeDasharray="4 4">
          <path d="M130 100 Q170 80 210 100" />
        </g>
        <rect x="200" y="70" width="100" height="60" rx="8" fill="#4FB3D4" opacity="0.3" stroke="#4FB3D4" />
        <text x="250" y="105" textAnchor="middle" fontSize="10" fontFamily="ui-monospace" fill="#fff">new world</text>
        <text x="80" y="140" textAnchor="middle" fontSize="9" fontFamily="ui-monospace" fill="#A89F92">mainframe</text>
      </svg>
    ),
    observ: (
      <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="200" fill="#173F52" />
        <g stroke="rgba(255,255,255,0.15)" strokeWidth="1">
          {[0, 1, 2, 3, 4].map(i => <line key={i} x1="30" y1={40 + i * 30} x2="290" y2={40 + i * 30} />)}
        </g>
        <path d="M30 140 L60 130 L90 135 L120 120 L150 125 L180 80 L210 85 L240 70 L270 75 L290 68" stroke="#4FB3D4" strokeWidth="2" fill="none" />
        <path d="M30 150 L60 145 L90 148 L120 140 L150 142 L180 135 L210 130 L240 128 L270 125 L290 120" stroke="#C79C80" strokeWidth="1.5" fill="none" opacity="0.7" />
        <circle cx="180" cy="80" r="5" fill="#B4452F" />
        <text x="185" y="74" fontSize="10" fontFamily="ui-monospace" fill="#fff">+400ms</text>
        <text x="35" y="175" fontSize="9" fontFamily="ui-monospace" fill="rgba(255,255,255,0.5)">p99 latency · checkout-svc</text>
      </svg>
    )
  }
  return <div className="pc-cover">{covers[kind] || covers.decisions}</div>
}

function PostCard({ post, large }) {
  const labels = {
    architecture: 'Cloud Architecture', serverless: 'Serverless',
    legacy: 'Legacy', decisions: 'Decisions',
    productivity: 'Productivity', leadership: 'Leadership',
    observ: 'Observability', realsystems: 'Real Systems'
  }
  return (
    <article className={`pc${large ? ' pc-lg' : ''}`}>
      <div className="pc-cover-wrap"><PostCover kind={post.cover} /></div>
      <div className="pc-body">
        <Badge category={post.category}>{labels[post.category]}</Badge>
        <h3>{post.title}</h3>
        <p className="dek">{post.dek}</p>
        <div className="meta">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.read}</span>
        </div>
      </div>
    </article>
  )
}

/* ---------- Projects page ---------- */
function ProjectsPage({ lang }) {
  const projects = [
    { id: 1, title: lang === 'ES' ? 'Plataforma de pagos en tiempo real' : 'Real-time payments platform',
      desc: lang === 'ES' ? 'Re-plataforma de Tigo Money. Transacciones < 300ms p99 en LATAM, multi-región activo-activo.' : 'Tigo Money re-platform. Transactions under 300ms p99 across LATAM, multi-region active-active.',
      tags: ['AWS', 'DynamoDB', 'Lambda', 'Event-driven'], kind: 'serverless', badge: '2024' },
    { id: 2, title: lang === 'ES' ? 'Migración de mainframe → AWS' : 'Mainframe → AWS migration',
      desc: lang === 'ES' ? 'Strangler fig sobre un core bancario de 20 años. Cero downtime, 18 meses, un equipo de ocho.' : 'Strangler fig over a 20-year-old banking core. Zero downtime, 18 months, a team of eight.',
      tags: ['ECS', 'Aurora', 'Step Functions', 'DMS'], kind: 'legacy', badge: '2023' },
    { id: 3, title: lang === 'ES' ? 'Flota de alquiler de autos — Hertz MX' : 'Car-rental fleet platform — Hertz MX',
      desc: lang === 'ES' ? 'Plataforma operativa end-to-end: reservas, inventario, mantenimiento. EventBridge como columna vertebral.' : 'End-to-end operations platform: bookings, inventory, maintenance. EventBridge as the backbone.',
      tags: ['EventBridge', 'SQS', 'Nuxt', 'Postgres'], kind: 'architecture', badge: '2025 · Live' },
    { id: 4, title: lang === 'ES' ? 'Agente de soporte con Claude' : 'Claude-powered support agent',
      desc: lang === 'ES' ? 'Agente con herramientas, RAG sobre un millón de tickets, y guardrails que de verdad funcionan.' : 'Tool-using agent, RAG over a million tickets, and guardrails that actually hold.',
      tags: ['Claude', 'RAG', 'OpenSearch', 'Python'], kind: 'ai', badge: '2025' },
    { id: 5, title: lang === 'ES' ? 'Plataforma de logs multi-tenant' : 'Multi-tenant logs platform',
      desc: lang === 'ES' ? 'Ingesta de 2TB/día, queries sub-segundo, y un presupuesto de CloudWatch que no crece sin control.' : 'Ingests 2TB/day, sub-second queries, and a CloudWatch bill that does NOT grow unbounded.',
      tags: ['OpenSearch', 'Firehose', 'S3', 'Athena'], kind: 'observ', badge: '2023' },
    { id: 6, title: lang === 'ES' ? 'SDK interno para IaC' : 'Internal IaC SDK',
      desc: lang === 'ES' ? 'Librería Pulumi compartida entre 30 repos. Convenciones, tags, y un linter que impide subnets públicas.' : 'A shared Pulumi library across 30 repos. Conventions, tags, and a linter that forbids public subnets.',
      tags: ['Pulumi', 'TypeScript', 'CI'], kind: 'decisions', badge: '2024' }
  ]
  const filters = [
    { id: 'all', label: lang === 'ES' ? 'Todos' : 'All' },
    { id: 'architecture', label: lang === 'ES' ? 'Arquitectura' : 'Architecture' },
    { id: 'serverless', label: 'Serverless' },
    { id: 'legacy', label: lang === 'ES' ? 'Legacy' : 'Legacy' },
    { id: 'ai', label: 'AI / LLM' },
    { id: 'observ', label: lang === 'ES' ? 'Observabilidad' : 'Observability' }
  ]
  const [f, setF] = useState('all')
  const shown = f === 'all' ? projects : projects.filter(p => p.kind === f)
  return (
    <div className="page-enter">
      <section className="container">
        <div className="blog-hero">
          <div>
            <div className="hero-eyebrow">
              <span className="dot" />
              {' '}
              {lang === 'ES' ? 'Trabajo seleccionado' : 'Selected work'}
            </div>
            <h1>{lang === 'ES' ? 'Proyectos que de hecho llegaron a producción.' : 'Projects that actually made it to production.'}</h1>
            <p>
              {lang === 'ES'
                ? 'Sistemas cloud entregados en la última década. Cada uno tiene un ADR, una postmortem, y al menos una decisión de la que me arrepiento.'
                : 'Cloud systems shipped over the last decade. Each one has an ADR, a postmortem, and at least one decision I regret.'}
            </p>
          </div>
          <div className="mascot"><img src="assets/mascot-chaser.webp" alt="" /></div>
        </div>
        <div className="projects-filter">
          {filters.map(x => (
            <button key={x.id} className={`cat-chip${f === x.id ? ' active' : ''}`} onClick={() => setF(x.id)}>{x.label}</button>
          ))}
        </div>
        <div className="projects-grid">
          {shown.map(p => (
            <div className="proj-card" key={p.id}>
              <div className="proj-cover-wrap">
                <span className="proj-badge">{p.badge}</span>
                <PostCover kind={p.kind === 'ai' ? 'leadership' : p.kind} />
              </div>
              <div className="proj-body">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="proj-tags">
                  {p.tags.map(t => <span className="proj-tag" key={t}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ---------- Services page ---------- */
function ServicesPage({ lang, onNav }) {
  const services = [
    { num: '01', title: lang === 'ES' ? 'Revisión de arquitectura' : 'Architecture review',
      desc: lang === 'ES' ? 'Una semana mirando tu sistema con ojos frescos. Termina con un informe de 20 páginas y un Loom de 30 min.' : 'One week looking at your system with fresh eyes. Ends with a 20-page report and a 30-min Loom.',
      bullets: lang === 'ES'
        ? ['Revisión de diagrama y ADRs', 'Entrevistas con equipo (3–5 personas)', 'Hallazgos priorizados por impacto', 'Sesión de Q&A con stakeholders']
        : ['Diagram & ADR review', 'Team interviews (3–5 people)', 'Findings prioritized by impact', 'Stakeholder Q&A session'],
      price: lang === 'ES' ? 'Desde $4,800 USD · 1 semana' : 'From $4,800 USD · 1 week' },
    { num: '02', title: lang === 'ES' ? 'Liderazgo técnico fraccionario' : 'Fractional tech leadership',
      desc: lang === 'ES' ? 'Dos días por semana como tu arquitecto principal. Diseño, revisión de PRs, mentoring y las decisiones difíciles.' : 'Two days a week as your lead architect. Design, PR reviews, mentoring, and the hard calls.',
      bullets: lang === 'ES'
        ? ['2 días/semana · ES + EN', 'Participación en planning y retros', 'Diseño de nuevos sistemas', 'Mentoring de ingenieros senior', 'Escritura de ADRs']
        : ['2 days/week · ES + EN', 'Planning & retro participation', 'New system design', 'Senior eng mentoring', 'Write the ADRs'],
      price: lang === 'ES' ? 'Desde $12,000 USD/mes · retainer' : 'From $12,000 USD/mo · retainer',
      featured: true },
    { num: '03', title: lang === 'ES' ? 'Diseño de sistema nuevo' : 'New system design',
      desc: lang === 'ES' ? 'De diagrama a pull request. Llevo el diseño desde la primera pizarra hasta el primer deploy en producción.' : 'Diagram to pull request. I take the design from first whiteboard to first production deploy.',
      bullets: lang === 'ES'
        ? ['Workshops de dominio (DDD ligero)', 'ADRs, RFCs y diagramas', 'Spike de prototipo en staging', 'Handoff formal al equipo']
        : ['Domain workshops (light DDD)', 'ADRs, RFCs and diagrams', 'Prototype spike in staging', 'Formal handoff to the team'],
      price: lang === 'ES' ? 'Desde $18,000 USD · 4–8 semanas' : 'From $18,000 USD · 4–8 weeks' }
  ]
  const steps = [
    { n: '01', t: lang === 'ES' ? 'Primera llamada' : 'Intro call', d: lang === 'ES' ? '30 min · gratis · sin venta.' : '30 min · free · no sales pitch.' },
    { n: '02', t: lang === 'ES' ? 'Propuesta' : 'Proposal', d: lang === 'ES' ? 'Un documento corto. Scope, entregables, precio.' : 'A short doc. Scope, deliverables, price.' },
    { n: '03', t: lang === 'ES' ? 'Trabajo' : 'Work', d: lang === 'ES' ? 'Check-ins semanales. Slack compartido. Cero slideware.' : 'Weekly check-ins. Shared Slack. Zero slideware.' },
    { n: '04', t: lang === 'ES' ? 'Handoff' : 'Handoff', d: lang === 'ES' ? 'Informe, Loom, y 30 días de preguntas incluidas.' : 'Report, Loom, and 30 days of follow-up Q&A included.' }
  ]
  return (
    <div className="page-enter">
      <section className="container">
        <div className="blog-hero">
          <div>
            <div className="hero-eyebrow">
              <span className="dot" />
              {' '}
              {lang === 'ES' ? 'Disponible Q3 2026' : 'Booking Q3 2026'}
            </div>
            <h1>{lang === 'ES' ? 'Cómo puedo ayudar.' : 'How I can help.'}</h1>
            <p>
              {lang === 'ES'
                ? 'Tres formas de trabajar juntos. Todos incluyen honestidad, ADRs, y un café.'
                : 'Three ways to work together. All include honesty, ADRs, and a coffee.'}
            </p>
          </div>
          <div className="mascot"><img src="assets/mascot-speaker.webp" alt="" /></div>
        </div>

        <div className="services-grid">
          {services.map(s => (
            <div className={`svc-card${s.featured ? ' featured' : ''}`} key={s.num}>
              <span className="svc-num">
                {s.num}
                {s.featured ? ' · ' + (lang === 'ES' ? 'Más solicitado' : 'Most booked') : ''}
              </span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <ul>{s.bullets.map(b => <li key={b}>{b}</li>)}</ul>
              <div className="svc-price">{s.price}</div>
              <Button variant={s.featured ? 'primary' : 'ghost'} iconAfter={<I.arrow />}>
                {lang === 'ES' ? 'Pedir información' : 'Get in touch'}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <div>
            <div className="label">{lang === 'ES' ? 'Cómo trabajamos' : 'How we work'}</div>
            <h2>{lang === 'ES' ? 'Un proceso corto, sin misterios.' : 'A short process, no mystery.'}</h2>
          </div>
          <div className="num">— /process</div>
        </div>
        <div className="process-steps">
          {steps.map(s => (
            <div className="process-step" key={s.n}>
              <div className="n">{s.n}</div>
              <h4>{s.t}</h4>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 96 }}>
        <CTABand lang={lang} onNav={onNav} />
      </section>
    </div>
  )
}

/* ---------- About page ---------- */
function AboutPage({ lang, onNav }) {
  return (
    <div className="page-enter">
      <section className="container-narrow" style={{ padding: '80px 32px 40px' }}>
        <Badge category="leadership">{lang === 'ES' ? 'Sobre mí' : 'About'}</Badge>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px,5vw,56px)', lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--fg-strong)', fontWeight: 700, margin: '18px 0 20px' }}>
          {lang === 'ES' ? 'Hola, soy David.' : 'Hi, I\'m David.'}
        </h1>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: '34px', color: 'var(--fg-strong)', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 28 }}>
          {lang === 'ES'
            ? 'Cloud Architect & Software Engineer. Paso el día diseñando sistemas que tienen que seguir funcionando el lunes por la mañana.'
            : 'Cloud Architect & Software Engineer. I spend my days designing systems that have to keep working on Monday morning.'}
        </p>
        <p style={{ fontSize: 17, lineHeight: '29px', color: 'var(--fg)', marginBottom: 20 }}>
          {lang === 'ES'
            ? 'Vivo en Mérida, México. Hace más de diez años que trabajo en la nube — desde los días en que "serverless" era un meme de Twitter, hasta ahora, que lo uso con cariño y con criterio.'
            : 'I live in Mérida, Mexico. I\'ve been working in the cloud for over ten years — from back when "serverless" was a Twitter meme, to now, where I reach for it with affection and judgement.'}
        </p>
        <p style={{ fontSize: 17, lineHeight: '29px', color: 'var(--fg)', marginBottom: 20 }}>
          {lang === 'ES'
            ? 'He migrado equipos fuera de mainframes, re-platformado sobre AWS, y desmontado microservicios que se pusieron demasiado clever. Todo es tradeoffs. Mi trabajo es nombrarlos.'
            : 'I\'ve migrated teams off mainframes, re-platformed on AWS, and un-microserviced systems that got too clever. Everything is tradeoffs. My job is to name them.'}
        </p>
        <p style={{ fontSize: 17, lineHeight: '29px', color: 'var(--fg)', marginBottom: 20 }}>
          {lang === 'ES'
            ? 'Escribo aquí cuando encuentro algo que valga decir dos veces. Doy charlas bilingües (ES/EN) cuando el café del evento es decente. La marca tiene un gato. Se llama Isotipo.'
            : 'I write here when I find something worth saying twice. I give bilingual talks (ES/EN) when the event\'s coffee is decent. The brand has a cat. It\'s named Isotype.'}
        </p>
        <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: '32px', fontWeight: 600, color: 'var(--coffee-900)', background: 'var(--coffee-50)', padding: '22px 26px', borderLeft: '3px solid var(--coffee-600)', borderRadius: 8, margin: '32px 0', letterSpacing: '-0.005em' }}>
          "
          {lang === 'ES'
            ? 'En teoría esto suena genial. En la práctica creó un problema distinto. Lo que sí funcionó fue…'
            : 'In theory this sounds great. In practice this created a different problem. What actually worked was…'}
          "
          <cite style={{ display: 'block', marginTop: 10, fontFamily: 'var(--font-body)', fontStyle: 'normal', fontSize: 13, color: 'var(--coffee-700)' }}>
            —
            {' '}
            {lang === 'ES' ? 'Mi frase favorita en retros' : 'My favorite phrase in retros'}
          </cite>
        </blockquote>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
          <Button variant="primary" icon={<I.mail />}>david@cloud-coffee.dev</Button>
          <Button variant="ghost" iconAfter={<I.arrowUpRight />} onClick={() => onNav('services')}>
            {lang === 'ES' ? 'Ver servicios' : 'See services'}
          </Button>
        </div>
      </section>
    </div>
  )
}

/* ---------- Blog page ---------- */
function BlogPage({ lang }) {
  const CATEGORIES = [
    { id: 'all', label: lang === 'ES' ? 'Todos' : 'All' },
    { id: 'architecture', label: lang === 'ES' ? 'Arquitectura' : 'Architecture' },
    { id: 'serverless', label: 'Serverless' },
    { id: 'decisions', label: lang === 'ES' ? 'Decisiones' : 'Decisions' },
    { id: 'leadership', label: lang === 'ES' ? 'Liderazgo' : 'Leadership' },
    { id: 'observ', label: lang === 'ES' ? 'Observabilidad' : 'Observability' },
    { id: 'legacy', label: 'Legacy' }
  ]
  const [cat, setCat] = useState('all')
  const posts = LATEST_POSTS(lang)
  const list = cat === 'all' ? posts : posts.filter(p => p.category === cat)
  const [featured, ...rest] = list
  return (
    <div className="page-enter">
      <section className="container">
        <div className="blog-hero">
          <div>
            <div className="hero-eyebrow">
              <span className="dot" />
              {lang === 'ES' ? 'Nube + Café' : 'Cloud + Coffee'}
            </div>
            <h1>{lang === 'ES' ? 'Ensayos sobre arquitectura real.' : 'Essays on real architecture.'}</h1>
            <p>
              {lang === 'ES'
                ? 'Un post al mes, más o menos. Sin hype, sin listicles, sin "10 patrones que debes conocer". Solo decisiones reales y lo que salió mal.'
                : 'One post a month, give or take. No hype, no listicles, no "10 patterns you must know". Just real decisions and what went wrong.'}
            </p>
          </div>
          <div className="mascot"><img src="assets/mascot-barista.webp" alt="" /></div>
        </div>

        <div className="cat-rail">
          {CATEGORIES.map(c => (
            <button key={c.id} className={`cat-chip${cat === c.id ? ' active' : ''}`} onClick={() => setCat(c.id)}>{c.label}</button>
          ))}
        </div>

        {featured && (
          <div className="posts-featured">
            <div style={{ gridRow: 'span 2' }}><PostCard post={featured} large /></div>
            {rest.slice(0, 2).map(p => <PostCard key={p.id} post={p} />)}
          </div>
        )}
        {rest.length > 2 && (
          <div className="posts-rest" style={{ marginBottom: 80 }}>
            {rest.slice(2).map(p => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}

Object.assign(window, { ProjectsPage, ServicesPage, AboutPage, BlogPage, PostCard, LATEST_POSTS })
