/* Home page + Hero section */

function HomePage({ lang, onNav }) {
  return (
    <div className="page-enter">
      <section className="container">
        <div className="hero">
          <div>
            <div className="hero-eyebrow">
              <span className="dot" />
              {lang === 'ES' ? 'Disponible para nuevos proyectos · Q3 2026' : 'Available for new projects · Q3 2026'}
            </div>
            <h1>
              {lang === 'ES'
                ? (
                    <>
                      Arquitectura
                      <br />
                      que sobrevive al
                      <br />
                      <em style={{ fontStyle: 'italic', color: 'var(--coffee-600)' }}>lunes</em>
                      .
                      <span className="cursor" />
                    </>
                  )
                : (
                    <>
                      Cloud systems
                      <br />
                      that survive
                      <br />
                      <em style={{ fontStyle: 'italic', color: 'var(--coffee-600)' }}>Monday</em>
                      {' '}
                      morning.
                      <span className="cursor" />
                    </>
                  )}
            </h1>
            <p className="lede">
              {lang === 'ES'
                ? 'Soy David Cuy, Cloud Architect basado en Mérida, MX. Diseño sistemas pragmáticos sobre AWS, lidero equipos de ingeniería y escribo sobre los tradeoffs que nadie te contó.'
                : 'I\'m David Cuy, a Cloud Architect based in Mérida, MX. I design pragmatic systems on AWS, lead engineering teams, and write about the tradeoffs nobody warned you about.'}
            </p>
            <div className="hero-cta">
              <Button variant="primary" size="lg" iconAfter={<I.arrow />} onClick={() => onNav('services')}>
                {lang === 'ES' ? 'Trabajemos juntos' : 'Let\'s work together'}
              </Button>
              <Button variant="ghost" size="lg" iconAfter={<I.arrowUpRight />} onClick={() => onNav('projects')}>
                {lang === 'ES' ? 'Ver proyectos' : 'See projects'}
              </Button>
            </div>
            <div className="hero-meta">
              <span>
                <I.pin />
                {' '}
                Mérida, MX
              </span>
              <span>
                <I.dot style={{ color: 'var(--success)' }} />
                {' '}
                {lang === 'ES' ? 'Respondo en 48h' : 'Replies in 48h'}
              </span>
              <span>ES / EN</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-avatar">
              <img src="assets/mascot-coder.webp" alt="David Cuy — illustrated as a cat barista coding" />
            </div>
            <div className="hero-badge hero-badge-loc">
              <div className="ico"><I.cloud /></div>
              <div>
                <div className="t">AWS Solutions Architect</div>
                <div className="s">Professional · 2024</div>
              </div>
            </div>
            <div className="hero-badge hero-badge-aws">
              <div className="ico"><I.zap /></div>
              <div>
                <div className="t">
                  10+
                  {lang === 'ES' ? 'años' : 'years'}
                </div>
                <div className="s">{lang === 'ES' ? 'sistemas en producción' : 'systems in production'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="tech-strip">
        <div className="tech-strip-inner">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span>AWS</span>
              <span>Lambda</span>
              <span>EventBridge</span>
              <span>DynamoDB</span>
              <span>Pulumi</span>
              <span>Terraform</span>
              <span>TypeScript</span>
              <span>Python</span>
              <span>Docker</span>
              <span>Kubernetes</span>
              <span>GitHub Actions</span>
              <span>CloudWatch</span>
              <span>PostgreSQL</span>
              <span>Redis</span>
              <span>Node.js</span>
              <span>Nuxt</span>
            </React.Fragment>
          )
          )}
        </div>
      </div>

      <AboutSection lang={lang} onNav={onNav} />
      <ExperienceSection lang={lang} />
      <SkillsSection lang={lang} />
      <TestimonialsSection lang={lang} />
      <LatestPostsSection lang={lang} onNav={onNav} />
      <section className="container" style={{ paddingBottom: 96 }}>
        <CTABand lang={lang} onNav={onNav} />
      </section>
    </div>
  )
}

function AboutSection({ lang, onNav }) {
  return (
    <section className="container section">
      <div className="section-head">
        <div>
          <div className="label">{lang === 'ES' ? '01 · Presentación' : '01 · About'}</div>
          <h2>
            {lang === 'ES'
              ? 'Arquitectura es tradeoffs. No consignas.'
              : 'Architecture is tradeoffs. Not slogans.'}
          </h2>
        </div>
        <div className="num">— /about</div>
      </div>
      <div className="about-grid">
        <div>
          <p className="lead">
            {lang === 'ES'
              ? 'Llevo más de una década ayudando a equipos a migrar fuera de mainframes, re-platformar en AWS, desmontar microservicios que se pusieron demasiado clever, y escribir ADRs que la gente realmente lee.'
              : 'Over the last decade I\'ve helped teams migrate off mainframes, re-platform on AWS, un-microservice when they got too clever, and write ADRs people actually read.'}
          </p>
          <p>
            {lang === 'ES'
              ? 'En teoría, event-driven desacopla todo. En la práctica, acabas moviendo el acoplamiento a un schema registry que nadie posee. Lo que sí funciona: decisiones aburridas documentadas bien, y retries que caben en tres líneas.'
              : 'In theory, event-driven decouples everything. In practice, you\'ve moved the coupling into a schema registry nobody owns. What actually works: boring decisions, well-documented, and retry logic that fits in three lines.'}
          </p>
          <Button variant="ghost" iconAfter={<I.arrow />} onClick={() => onNav('about')}>
            {lang === 'ES' ? 'Más sobre mí' : 'Read the full story'}
          </Button>
        </div>
        <div>
          <div className="about-stat">
            <span className="n">10+</span>
            <span className="u">{lang === 'ES' ? 'años en producción' : 'years in production'}</span>
          </div>
          <div className="about-stat">
            <span className="n">40+</span>
            <span className="u">{lang === 'ES' ? 'sistemas cloud entregados' : 'cloud systems shipped'}</span>
          </div>
          <div className="about-stat">
            <span className="n">8</span>
            <span className="u">{lang === 'ES' ? 'equipos liderados' : 'teams led'}</span>
          </div>
          <div className="about-stat">
            <span className="n">2</span>
            <span className="u">{lang === 'ES' ? 'idiomas técnicos' : 'technical languages'}</span>
          </div>
          <div className="about-stat">
            <span className="n">∞</span>
            <span className="u">{lang === 'ES' ? 'tazas de café' : 'cups of coffee'}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function ExperienceSection({ lang }) {
  const rows = [
    { year: '2025 — Now', role: 'Head of Dev & Architecture', co: 'Hertz Mexico', city: 'Mérida',
      desc: lang === 'ES'
        ? 'Lidero la reestructuración de la plataforma tecnológica — menos microservicios, más ADRs, 400ms menos en p99.'
        : 'Leading the platform re-org — fewer microservices, more ADRs, 400ms off p99.' },
    { year: '2024 — 2025', role: 'Architect Lead', co: 'ActDigital', city: 'Remote',
      desc: lang === 'ES'
        ? 'Diseño de arquitecturas cloud-native para clientes enterprise. Event-driven donde tiene sentido, sync donde importa la latencia.'
        : 'Designed cloud-native architectures for enterprise clients. Event-driven where it makes sense, sync where latency matters.' },
    { year: '2022 — 2024', role: 'Technical Lead', co: 'Millicom (Tigo Money)', city: 'LATAM',
      desc: lang === 'ES'
        ? 'Lideré el equipo de pagos móviles. Migración a AWS, incidentes en producción, y el arte de decir "todavía no" a features.'
        : 'Led the mobile payments team. Migrated to AWS, handled production incidents, and the art of saying "not yet" to features.' },
    { year: '2020 — 2022', role: 'Solution Architect', co: 'diram', city: 'Remote',
      desc: lang === 'ES'
        ? 'Arquitecturas serverless para startups. Aprendí cuándo NO usar Lambda por las malas.'
        : 'Serverless architectures for startups. Learned when NOT to reach for Lambda the hard way.' }
  ]
  return (
    <section className="container section">
      <div className="section-head">
        <div>
          <div className="label">{lang === 'ES' ? '02 · Trayectoria' : '02 · Experience'}</div>
          <h2>{lang === 'ES' ? 'Una década, varias guerras.' : 'A decade, a few war stories.'}</h2>
        </div>
        <div className="num">— /experience</div>
      </div>
      <div className="timeline">
        {rows.map(r => (
          <div className="exp-row" key={r.year}>
            <div className="exp-year">{r.year}</div>
            <div className="exp-role">
              <h3>{r.role}</h3>
              <div className="co">
                {r.co}
                <span className="bullet">·</span>
                {r.city}
              </div>
              <p>{r.desc}</p>
            </div>
            <div className="exp-arrow"><I.arrowUpRight /></div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SkillsSection({ lang }) {
  const tabs = [
    { id: 'cloud', label: lang === 'ES' ? 'Cloud & DevOps' : 'Cloud & DevOps' },
    { id: 'code', label: lang === 'ES' ? 'Stack de código' : 'Code stack' },
    { id: 'data', label: lang === 'ES' ? 'Bases de datos' : 'Databases' },
    { id: 'ai', label: lang === 'ES' ? 'Experimentos IA' : 'AI experiments' }
  ]
  const skills = {
    cloud: [
      { n: 'AWS', d: lang === 'ES' ? 'Lambda, ECS, EventBridge, SQS, VPC. La caja de herramientas de todos los días.' : 'Lambda, ECS, EventBridge, SQS, VPC. Everyday toolbox.', lvl: 5, ico: 'cloud' },
      { n: 'Pulumi', d: lang === 'ES' ? 'IaC en TypeScript. Mejor que YAML, peor que Terraform para algunos casos.' : 'IaC in TypeScript. Better than YAML, worse than Terraform in some cases.', lvl: 5, ico: 'box' },
      { n: 'CloudFormation', d: lang === 'ES' ? 'La herramienta nativa. Cuando el equipo no quiere aprender un DSL más.' : 'AWS\'s native tool. When the team refuses to learn another DSL.', lvl: 4, ico: 'server' },
      { n: 'Docker', d: lang === 'ES' ? 'Contenedores, multi-stage builds, y entender que no todo necesita estar dockerizado.' : 'Containers, multi-stage builds, and knowing not everything needs to be dockerized.', lvl: 5, ico: 'box' },
      { n: 'GitHub Actions', d: lang === 'ES' ? 'CI/CD que cabe en un repo. Matriz, composites, reusable workflows.' : 'CI/CD that fits in a repo. Matrix, composites, reusable workflows.', lvl: 5, ico: 'git' },
      { n: 'CloudWatch & Grafana', d: lang === 'ES' ? 'Observabilidad. Si no tienes un p99 en el grafico, no estás en producción.' : 'Observability. If you don\'t have a p99 on a chart, you\'re not in production.', lvl: 4, ico: 'eye' }
    ],
    code: [
      { n: 'TypeScript', d: lang === 'ES' ? 'Tipos estrictos, tsconfig honesto, y menos any de los que crees.' : 'Strict types, an honest tsconfig, and fewer `any` than you think.', lvl: 5, ico: 'code' },
      { n: 'Python', d: lang === 'ES' ? 'Lambdas, scripts, glue code. Boto3 es un amigo difícil.' : 'Lambdas, scripts, glue code. Boto3 is a difficult friend.', lvl: 5, ico: 'code' },
      { n: 'Node.js', d: lang === 'ES' ? 'Runtime de servicios y herramientas. Async/await, streams, workers.' : 'Runtime for services and tooling. Async/await, streams, workers.', lvl: 5, ico: 'code' },
      { n: 'Go', d: lang === 'ES' ? 'Cuando la latencia importa y el cold start no puede costar 800ms.' : 'When latency matters and cold start can\'t cost 800ms.', lvl: 3, ico: 'code' }
    ],
    data: [
      { n: 'PostgreSQL', d: lang === 'ES' ? 'La respuesta aburrida casi siempre es Postgres.' : 'The boring answer is usually Postgres.', lvl: 5, ico: 'db' },
      { n: 'DynamoDB', d: lang === 'ES' ? 'Single-table design. GSIs. Y aceptar que JOINs ya no existen.' : 'Single-table design. GSIs. Accept that JOINs no longer exist.', lvl: 5, ico: 'db' },
      { n: 'Redis', d: lang === 'ES' ? 'Caché, rate limits, queues ligeras. No como DB primaria.' : 'Cache, rate limits, lightweight queues. Never as primary DB.', lvl: 4, ico: 'db' }
    ],
    ai: [
      { n: 'Claude API', d: lang === 'ES' ? 'Agentes de producto, clasificación y summarization. Prompt-engineering como una habilidad seria.' : 'Product agents, classification, summarization. Prompt-engineering as a serious skill.', lvl: 4, ico: 'brain' },
      { n: 'RAG + embeddings', d: lang === 'ES' ? 'Cuándo sirve, cuándo es un buscador caro.' : 'When it helps, when it\'s an expensive search bar.', lvl: 4, ico: 'brain' }
    ]
  }
  const [tab, setTab] = useState('cloud')
  const list = skills[tab]
  return (
    <section className="container section">
      <div className="section-head">
        <div>
          <div className="label">{lang === 'ES' ? '03 · Herramientas' : '03 · Tools'}</div>
          <h2>{lang === 'ES' ? 'Las herramientas que uso casi todos los días.' : 'The tools I reach for almost every day.'}</h2>
        </div>
        <div className="num">— /skills</div>
      </div>
      <div className="skills-tabs">
        {tabs.map(t => (
          <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
            {t.label}
            {' '}
            <span className="count">
              ·
              {skills[t.id].length}
            </span>
          </button>
        ))}
      </div>
      <div className="skills-grid">
        {list.map((s) => {
          const Ico = I[s.ico] || I.cloud
          return (
            <div className="skill-card" key={s.n}>
              <div className="icon-box"><Ico /></div>
              <h4>{s.n}</h4>
              <p>{s.d}</p>
              <div className="meta">
                <span>{lang === 'ES' ? 'Nivel' : 'Level'}</span>
                <div className="lvl">
                  {[1, 2, 3, 4, 5].map(n => <i key={n} className={n <= s.lvl ? 'on' : ''} />)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function TestimonialsSection({ lang }) {
  const tms = [
    { n: 'Henry Serrano', r: 'iOS Mobile Architect @ Google',
      q: lang === 'ES'
        ? 'David combina experiencia técnica profunda con habilidades de gente. Sabe cuándo y qué solución se necesita, balanceando producto y negocio. Lo recomiendo sin duda para roles estratégicos.'
        : 'David has a rare combination of deep technical expertise and people skills. He knows what and when a solution is required while balancing product and business. I recommend him for any strategic role.',
      a: 'HS' },
    { n: 'Sebastian Redondo', r: 'CTO @ Guavapay LATAM',
      q: lang === 'ES'
        ? 'Excelente profesional con conocimiento profundo de arquitecturas modernas, AWS, y servicios cloud. Creativo, con visión integral y orientado a resultados. Un placer colaborar con él.'
        : 'Excellent professional with deep knowledge of modern architectures, AWS and cloud services. Creative, with a comprehensive vision. A pleasure to collaborate with.',
      a: 'SR' },
    { n: 'Christian Alvarado', r: 'Senior Software Engineer · AWS',
      q: lang === 'ES'
        ? 'Conozco su trabajo profesional por más de 10 años. Experto en soluciones cloud, diseño de arquitectura tecnológica y desarrollo de software. Un gran aporte a cualquier empresa.'
        : 'I\'ve known his work for over 10 years. Expert in cloud solutions, tech architecture design and software development. He\'ll be a great asset to your company.',
      a: 'CA' }
  ]
  return (
    <section className="container section">
      <div className="section-head">
        <div>
          <div className="label">{lang === 'ES' ? '04 · Referencias' : '04 · References'}</div>
          <h2>{lang === 'ES' ? 'Lo que dicen quienes han trabajado conmigo.' : 'What people who worked with me say.'}</h2>
        </div>
        <div className="num">— /testimonials</div>
      </div>
      <div className="tmnl-grid">
        {tms.map(t => (
          <div className="tmnl" key={t.n}>
            <div className="quote-mark">"</div>
            <blockquote>{t.q}</blockquote>
            <div className="tmnl-author">
              <div className="ava">{t.a}</div>
              <div>
                <div className="tmnl-n">{t.n}</div>
                <div className="tmnl-r">{t.r}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function LatestPostsSection({ lang, onNav }) {
  const posts = LATEST_POSTS(lang)
  return (
    <section className="container section">
      <div className="section-head">
        <div>
          <div className="label">{lang === 'ES' ? '05 · Escritura' : '05 · Writing'}</div>
          <h2>{lang === 'ES' ? 'Ensayos recientes del blog.' : 'Recent essays from the blog.'}</h2>
        </div>
        <a className="btn btn-ghost btn-sm" onClick={() => onNav('blog')}>
          {lang === 'ES' ? 'Ver todos los posts' : 'View all posts'}
          {' '}
          <I.arrow />
        </a>
      </div>
      <div className="posts-rest">
        {posts.slice(0, 3).map(p => <PostCard key={p.id} post={p} />)}
      </div>
    </section>
  )
}

function CTABand({ lang, onNav }) {
  return (
    <div className="cta-band">
      <div>
        <h2>{lang === 'ES' ? '¿Tu sistema necesita un segundo par de ojos?' : 'Does your system need a second pair of eyes?'}</h2>
        <p>
          {lang === 'ES'
            ? 'Revisiones de arquitectura, diseño de sistemas nuevos, o liderazgo técnico fraccionario. Primera llamada de 30 min siempre gratis.'
            : 'Architecture reviews, new system design, or fractional tech leadership. First 30-minute call always free.'}
        </p>
      </div>
      <div className="cta-actions">
        <Button variant="primary" size="lg" icon={<I.calendar />}>
          {lang === 'ES' ? 'Reservar llamada' : 'Book a call'}
        </Button>
        <span className="cta-small">{lang === 'ES' ? 'Respuesta en 48h · LATAM / remoto' : 'Replies in 48h · LATAM / remote'}</span>
      </div>
    </div>
  )
}

Object.assign(window, { HomePage, CTABand })
