import {
  type CSSProperties,
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react"
import {
  company,
  navigation,
  products,
  type Product,
  type ProductCategory,
} from "./content"

const logo = "/assets/d-dynamic-soda-logo.png"
const factoryPhoto =
  "https://images.unsplash.com/photo-1530037335614-e68828dcf258?auto=format&fit=crop&w=1600&q=85"

function Icon({
  name,
  size = 20,
}: {
  name: "arrow" | "check" | "close" | "mail" | "phone" | "pin" | "spark"
  size?: number
}) {
  const paths = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    phone: (
      <path d="M6.6 3h3l1.5 4-2 1.8a16 16 0 0 0 6.1 6.1l1.8-2 4 1.5v3c0 2-1.6 3.6-3.6 3.6A14.4 14.4 0 0 1 3 6.6C3 4.6 4.6 3 6.6 3Z" />
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    spark: (
      <path d="m12 2 1.4 5.6L19 9l-5.6 1.4L12 16l-1.4-5.6L5 9l5.6-1.4L12 2Zm6 13 .7 2.3L21 18l-2.3.7L18 21l-.7-2.3L15 18l2.3-.7L18 15Z" />
    ),
  }
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

function Button({
  children,
  href,
  kind = "gold",
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode
  href?: string
  kind?: "gold" | "dark" | "outline" | "ghost"
  onClick?: () => void
  type?: "button" | "submit"
  disabled?: boolean
}) {
  const className = `button button--${kind}`
  if (href) {
    return (
      <a className={className} href={href} onClick={onClick}>
        {children}
      </a>
    )
  }
  return (
    <button
      className={className}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

function SectionTitle({
  eyebrow,
  title,
  copy,
  light = false,
}: {
  eyebrow: string
  title: string
  copy?: string
  light?: boolean
}) {
  return (
    <div className={`section-title ${light ? "section-title--light" : ""}`}>
      <p className="eyebrow">
        <span />
        {eyebrow}
      </p>
      <h2>{title}</h2>
      {copy && <p className="section-copy">{copy}</p>}
    </div>
  )
}

function ProductVisual({
  product,
  hero = false,
}: {
  product: Product
  hero?: boolean
}) {
  const style = {
    "--drink": product.color,
    "--drink-light": product.accent,
  } as CSSProperties
  return (
    <div
      className={`product-visual ${hero ? "product-visual--hero" : ""}`}
      style={style}
      aria-label={`${product.name} concept packaging mockup`}
    >
      <span className="fruit fruit--one" />
      <span className="fruit fruit--two" />
      <div className={`package package--${product.format}`}>
        <span className="package-shine" />
        <div className="package-label">
          <strong>D</strong>
          <small>DYNAMIC</small>
          <b>{product.name.split(" ")[0]}</b>
          <em>{product.flavour.replace(" concept", "")}</em>
        </div>
      </div>
      {!hero && <span className="mockup-label">Concept mockup</span>}
    </div>
  )
}

function ProductCard({
  product,
  onDetails,
  onEnquire,
}: {
  product: Product
  onDetails: (product: Product) => void
  onEnquire: (product: Product) => void
}) {
  return (
    <article className="product-card">
      <ProductVisual product={product} />
      <div className="product-card__body">
        <p className="product-category">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="product-flavour">{product.flavour}</p>
        <p>{product.description}</p>
        <p className="pack-size">{product.packSizes}</p>
        <div className="card-actions">
          <Button kind="outline" onClick={() => onDetails(product)}>
            View details
          </Button>
          <Button kind="dark" onClick={() => onEnquire(product)}>
            Product enquiry
          </Button>
        </div>
      </div>
    </article>
  )
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: ReactNode
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    document.body.classList.add("no-scroll")
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
      if (event.key === "Tab") {
        const modal = closeRef.current?.closest<HTMLElement>('[role="dialog"]')
        const focusable = [
          ...(modal?.querySelectorAll<HTMLElement>(
            'a, button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ) || []),
        ]
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.classList.remove("no-scroll")
      previous?.focus()
    }
  }, [onClose])
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          className="icon-button modal-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <Icon name="close" />
        </button>
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </div>
  )
}

type FormStatus = {
  state: "idle" | "loading" | "success" | "error"
  message: string
}

function EnquiryForm({
  business = false,
  selectedProduct = "",
}: {
  business?: boolean
  selectedProduct?: string
}) {
  const [status, setStatus] = useState<FormStatus>({
    state: "idle",
    message: "",
  })
  const [startedAt, setStartedAt] = useState(Date.now())

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    setStatus({ state: "loading", message: "Sending your enquiry…" })
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          privacy: data.privacy === "on",
          startedAt,
          formType: business ? "Business partnership" : "Contact",
        }),
      })
      const result = (await response.json()) as {
        accepted?: boolean
        error?: string
      }
      if (!response.ok || !result.accepted) {
        throw new Error(result.error || "We could not send your enquiry.")
      }
      form.reset()
      setStartedAt(Date.now())
      setStatus({
        state: "success",
        message: "Thank you. Your enquiry has been accepted and sent.",
      })
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      })
    }
  }

  return (
    <form className="enquiry-form" onSubmit={submit}>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {business && (
        <label className="field field--wide">
          <span>Business name *</span>
          <input name="businessName" required autoComplete="organization" />
        </label>
      )}
      <label className="field">
        <span>{business ? "Contact person *" : "Full name *"}</span>
        <input
          name={business ? "contactPerson" : "fullName"}
          required
          autoComplete="name"
        />
      </label>
      <label className="field">
        <span>Email address *</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label className="field">
        <span>Phone number *</span>
        <input name="phone" type="tel" required autoComplete="tel" />
      </label>
      {business && (
        <label className="field">
          <span>Location *</span>
          <input name="location" required autoComplete="address-level2" />
        </label>
      )}
      <label className="field">
        <span>Enquiry type *</span>
        <select
          name="enquiryType"
          required
          defaultValue={business ? "Distributor" : ""}
        >
          {!business && <option value="">Select an option</option>}
          <option>General</option>
          <option>Product</option>
          <option>Wholesale</option>
          <option>Distributor</option>
          <option>Retail supply</option>
        </select>
      </label>
      {!business && (
        <label className="field">
          <span>Product of interest</span>
          <select
            key={selectedProduct}
            name="product"
            defaultValue={selectedProduct}
          >
            <option value="">No specific product</option>
            {products.map((product) => (
              <option key={product.id} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="field field--wide">
        <span>Message *</span>
        <textarea
          name="message"
          rows={5}
          required
          placeholder={
            business
              ? "Tell us about your business and the opportunity you’d like to discuss."
              : "How can we help?"
          }
        />
      </label>
      <label className="privacy-check field--wide">
        <input name="privacy" type="checkbox" required />
        <span>
          I agree that my details may be used to respond to this enquiry. *
        </span>
      </label>
      <div className="form-submit field--wide">
        <Button type="submit" disabled={status.state === "loading"}>
          {status.state === "loading"
            ? "Sending…"
            : business
              ? "Send partnership enquiry"
              : "Send enquiry"}
          <Icon name="arrow" />
        </Button>
        {status.state !== "idle" && (
          <p
            className={`form-status form-status--${status.state}`}
            role="status"
          >
            {status.message}
          </p>
        )}
      </div>
    </form>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState<"All" | ProductCategory>("All")
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  const [selectedProduct, setSelectedProduct] = useState("")
  const [legal, setLegal] = useState<"Privacy policy" | "Terms of use" | null>(
    null,
  )
  const menuButton = useRef<HTMLButtonElement>(null)
  const drawer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) =>
            entry.isIntersecting && entry.target.classList.add("is-visible"),
        ),
      { threshold: 0.12 },
    )
    document
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const previous = document.activeElement as HTMLElement | null
    const panel = drawer.current
    document.body.classList.add("no-scroll")
    panel?.querySelector<HTMLElement>("a, button")?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
      if (event.key === "Tab" && panel) {
        const focusable = [...panel.querySelectorAll<HTMLElement>("a, button")]
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => {
      document.body.classList.remove("no-scroll")
      window.removeEventListener("keydown", handleKey)
      if (previous === menuButton.current || menuButton.current)
        menuButton.current?.focus()
    }
  }, [menuOpen])

  function enquire(product: Product) {
    setSelectedProduct(product.name)
    setActiveProduct(null)
    window.setTimeout(
      () => document.querySelector("#contact")?.scrollIntoView(),
      40,
    )
  }

  const visibleProducts =
    filter === "All"
      ? products
      : products.filter((product) => product.category === filter)

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="D Dynamic Soda home">
          <img src={logo} alt="D Dynamic Soda logo" />
          <span>
            <strong>D DYNAMIC</strong>
            <small>SODA</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map(([label, id]) => (
            <a href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </nav>
        <Button href="#contact">
          Enquire now <Icon name="arrow" />
        </Button>
        <button
          ref={menuButton}
          className={`menu-button ${menuOpen ? "is-open" : ""}`}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {menuOpen && (
        <div className="drawer-backdrop" onMouseDown={() => setMenuOpen(false)}>
          <div
            ref={drawer}
            id="mobile-navigation"
            className="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="drawer-heading">
              <span>Menu</span>
              <button
                className="icon-button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <Icon name="close" />
              </button>
            </div>
            <nav>
              {navigation.map(([label, id], index) => (
                <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>
                  <span>0{index + 1}</span>
                  {label}
                  <Icon name="arrow" />
                </a>
              ))}
            </nav>
            <Button href="#contact" onClick={() => setMenuOpen(false)}>
              Enquire now <Icon name="arrow" />
            </Button>
          </div>
        </div>
      )}

      <main>
        <section id="home" className="hero">
          <div className="hero-glow" />
          {[...Array(12)].map((_, index) => (
            <span className={`bubble bubble--${index + 1}`} key={index} />
          ))}
          <div className="hero-copy">
            <p className="eyebrow eyebrow--light">
              <span />
              Raise the refreshment
            </p>
            <h1>
              Bold Flavours.
              <br />
              <em>Refreshing</em> Moments.
            </h1>
            <p className="hero-lead">
              Discover refreshing drinks and sodas from D Dynamic Soda, crafted
              to bring flavour to every occasion.
            </p>
            <div className="hero-actions">
              <Button href="#products">
                Explore our products <Icon name="arrow" />
              </Button>
              <Button href="#distributor" kind="ghost">
                Become a distributor
              </Button>
            </div>
            <p className="hero-note">
              <Icon name="spark" /> Product range shown with editable concept
              mockups
            </p>
          </div>
          <div className="hero-products" aria-hidden="true">
            <div className="hero-disc hero-disc--one" />
            <div className="hero-disc hero-disc--two" />
            <div className="hero-product hero-product--left">
              <ProductVisual product={products[0]} hero />
            </div>
            <div className="hero-product hero-product--centre">
              <ProductVisual product={products[1]} hero />
            </div>
            <div className="hero-product hero-product--right">
              <ProductVisual product={products[2]} hero />
            </div>
          </div>
          <a className="scroll-cue" href="#featured">
            <span />
            Scroll to discover
          </a>
        </section>

        <section id="featured" className="featured section reveal">
          <div className="section-head-row">
            <SectionTitle
              eyebrow="Featured refreshments"
              title="Made to stand out. Ready to refresh."
              copy="Explore sample concepts for the D Dynamic Soda catalogue. Final names, photography, formats, and specifications can be updated in one central content file."
            />
            <Button href="#products" kind="outline">
              View all products <Icon name="arrow" />
            </Button>
          </div>
          <div className="featured-grid">
            {products
              .filter((product) => product.featured)
              .map((product, index) => (
                <article
                  className={`featured-card featured-card--${index + 1}`}
                  key={product.id}
                >
                  <div>
                    <p>0{index + 1} / Featured</p>
                    <h3>{product.name}</h3>
                    <span>{product.flavour}</span>
                    <button onClick={() => setActiveProduct(product)}>
                      Discover flavour <Icon name="arrow" />
                    </button>
                  </div>
                  <ProductVisual product={product} />
                </article>
              ))}
          </div>
        </section>

        <section id="about" className="about section reveal">
          <div className="about-intro">
            <SectionTitle
              eyebrow="About D Dynamic Soda"
              title="Energy in every detail."
            />
            <p>{company.story}</p>
          </div>
          <div className="about-grid">
            <div className="about-image">
              <img
                src={factoryPhoto}
                alt="Glass bottles moving through an industrial production setting"
                loading="lazy"
              />
              <span>Representative manufacturing image</span>
              <a
                href="https://unsplash.com/@waldemarbrandt67w"
                target="_blank"
                rel="noreferrer"
              >
                Photo: Waldemar Brandt / Unsplash
              </a>
            </div>
            <div className="about-content">
              <div className="quote-mark">“</div>
              <p className="about-statement">
                A distinctive beverage brand, built to create refreshing moments
                and strong partnerships.
              </p>
              <div className="mission-grid">
                <div>
                  <span>01</span>
                  <h3>Our mission</h3>
                  <p>{company.mission}</p>
                </div>
                <div>
                  <span>02</span>
                  <h3>Our vision</h3>
                  <p>{company.vision}</p>
                </div>
              </div>
              <div className="values">
                {[
                  "Distinctive flavour",
                  "Reliable partnership",
                  "Responsible growth",
                  "Everyday refreshment",
                ].map((value) => (
                  <span key={value}>
                    <Icon name="check" size={17} />
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="products section reveal">
          <div className="products-heading">
            <SectionTitle
              eyebrow="The product range"
              title="Find your next favourite."
              copy="Every item below is clearly marked as editable sample content until D Dynamic Soda supplies its confirmed catalogue."
              light
            />
            <div
              className="filter-tabs"
              role="group"
              aria-label="Filter products by category"
            >
              {([
                "All",
                "Soft Drinks",
                "Flavoured Drinks",
                "Soda",
              ] as const).map((category) => (
                <button
                  key={category}
                  className={filter === category ? "active" : ""}
                  aria-pressed={filter === category}
                  onClick={() => setFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="product-grid" aria-live="polite">
            {visibleProducts.length ? (
              visibleProducts.map((product) => (
                <ProductCard
                  product={product}
                  key={product.id}
                  onDetails={setActiveProduct}
                  onEnquire={enquire}
                />
              ))
            ) : (
              <p className="empty-state">
                No products are available in this category yet.
              </p>
            )}
          </div>
        </section>

        <section id="manufacturing" className="manufacturing section reveal">
          <div className="manufacturing-copy">
            <SectionTitle
              eyebrow="Manufacturing & quality"
              title="A clear path from preparation to delivery."
              copy="This process is a presentation framework, not a claim about current facilities, controls, or certifications. Replace it with verified company information before publication."
            />
            <div className="quality-note">
              <Icon name="spark" />
              <p>
                <strong>Quality information placeholder</strong>
                <br />
                Add confirmed manufacturing practices, packaging information,
                quality procedures, and certifications here.
              </p>
            </div>
          </div>
          <ol className="process">
            {[
              "Preparation",
              "Production",
              "Quality checks",
              "Packaging",
              "Distribution",
            ].map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div className="process-icon">
                  <i />
                </div>
                <strong>{step}</strong>
                <small>{index < 4 ? "Next step" : "Ready to connect"}</small>
              </li>
            ))}
          </ol>
        </section>

        <section id="distributor" className="distributor section reveal">
          <div className="distributor-panel">
            <div className="distributor-copy">
              <p className="eyebrow eyebrow--light">
                <span />
                Grow with us
              </p>
              <h2>
                Let’s build something <em>refreshing.</em>
              </h2>
              <p>
                We welcome conversations with retailers, wholesalers, and
                distributors who see an opportunity to grow with D Dynamic Soda.
              </p>
              <div className="partner-types">
                {["Retailers", "Wholesalers", "Distributors"].map(
                  (type, index) => (
                    <span key={type}>
                      <b>0{index + 1}</b>
                      {type}
                    </span>
                  ),
                )}
              </div>
              <div className="service-placeholder">
                <strong>Service and supply coverage</strong>
                <p>{company.serviceAreas}</p>
              </div>
            </div>
            <div className="form-card">
              <p className="form-kicker">Partnership enquiry</p>
              <h3>Partner with us</h3>
              <p>
                Tell us about your business and we’ll start the conversation.
              </p>
              <EnquiryForm business />
            </div>
          </div>
        </section>

        <section id="contact" className="contact section reveal">
          <div className="contact-layout">
            <div className="contact-copy">
              <SectionTitle
                eyebrow="Contact us"
                title="Start a refreshing conversation."
              />
              <p>
                Questions about the range, product availability, or business
                opportunities? Send an enquiry and the team can respond once
                contact delivery is configured.
              </p>
              <div className="contact-details">
                <div>
                  <span>
                    <Icon name="phone" />
                  </span>
                  <p>
                    <small>Call us</small>
                    {company.phone}
                  </p>
                </div>
                <div>
                  <span>
                    <Icon name="mail" />
                  </span>
                  <p>
                    <small>Email us</small>
                    {company.email}
                  </p>
                </div>
                <div>
                  <span>
                    <Icon name="pin" />
                  </span>
                  <p>
                    <small>Visit us</small>
                    {company.address}
                  </p>
                </div>
              </div>
              <p className="hours">
                <strong>Business hours:</strong> {company.hours}
              </p>
            </div>
            <div className="contact-form-wrap">
              <EnquiryForm selectedProduct={selectedProduct} />
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-main">
          <div className="footer-brand">
            <img src={logo} alt="D Dynamic Soda logo" />
            <p>
              Bold refreshment and vibrant flavour concepts for customers and
              business partners.
            </p>
            <span>Social links: [Add confirmed profiles]</span>
          </div>
          <div className="footer-links">
            <h3>Explore</h3>
            {navigation.slice(0, 4).map(([label, id]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </div>
          <div className="footer-links">
            <h3>Connect</h3>
            <a href="#distributor">Become a distributor</a>
            <a href="#contact">Product enquiry</a>
            <a href="#contact">Contact us</a>
          </div>
          <div className="footer-contact">
            <h3>Contact</h3>
            <p>{company.phone}</p>
            <p>{company.email}</p>
            <p>{company.address}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} D Dynamic Soda. All rights reserved.
          </p>
          <div>
            <button onClick={() => setLegal("Privacy policy")}>
              Privacy policy
            </button>
            <button onClick={() => setLegal("Terms of use")}>
              Terms of use
            </button>
          </div>
        </div>
      </footer>

      {activeProduct && (
        <Modal
          title={activeProduct.name}
          onClose={() => setActiveProduct(null)}
        >
          <div className="product-modal">
            <ProductVisual product={activeProduct} />
            <div>
              <p className="product-category">{activeProduct.category}</p>
              <h3>{activeProduct.flavour}</h3>
              <p>{activeProduct.description}</p>
              <p className="pack-size">{activeProduct.packSizes}</p>
              <p className="placeholder-warning">
                Editable sample product. Confirm all product information and
                replace this mockup before publication.
              </p>
              <Button onClick={() => enquire(activeProduct)}>
                Enquire about this product <Icon name="arrow" />
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {legal && (
        <Modal title={legal} onClose={() => setLegal(null)}>
          <div className="legal-copy">
            <p>
              <strong>Editable policy placeholder</strong>
            </p>
            <p>
              This page must be reviewed and replaced with content that reflects
              D Dynamic Soda’s actual business, data handling, cookies, sales
              practices, and legal jurisdiction before the website is published.
            </p>
            <p>
              Enquiry details should only be used to respond to the visitor’s
              request and retained according to the company’s approved privacy
              and retention practices.
            </p>
          </div>
        </Modal>
      )}
    </div>
  )
}
