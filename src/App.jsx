import React, { useState, useMemo, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */

const css = `
:root {
  --bg: #FAF9F6;
  --ink: #242424;
  --muted: #77736C;
  --accent: #B38A5B;
  --beige: #E9E5DE;
  --card: #FFFFFF;
  --border: #E5E1D8;
}
.dark {
  --bg: #1B1A18;
  --ink: #ECE9E2;
  --muted: #9A958C;
  --accent: #C9A06C;
  --beige: #2A2825;
  --card: #232220;
  --border: #3A3733;
}
body { margin: 0; }
.tj {
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
  font-family: "Inter", "Source Sans 3", system-ui, sans-serif;
  font-size: 17px;
  line-height: 1.7;
  transition: background 0.25s, color 0.25s;
}
.serif { font-family: Georgia, "Lora", serif; }
.mono { font-family: "JetBrains Mono", ui-monospace, monospace; }
.container { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
.measure { max-width: 700px; margin: 0 auto; }
a { color: inherit; text-decoration: none; }
.kicker {
  font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--accent); font-weight: 600;
}
.mutedtext { color: var(--muted); }
.btn {
  display: inline-block; border: 1px solid var(--ink); background: var(--ink);
  color: var(--bg); padding: 10px 22px; border-radius: 2px; font-size: 14px;
  cursor: pointer; letter-spacing: 0.04em; transition: opacity .15s;
}
.btn:hover { opacity: 0.85; }
.btn-ghost {
  background: transparent; color: var(--ink); border-color: var(--border);
}
.navlink { font-size: 14px; color: var(--muted); padding-bottom: 3px; border-bottom: 1px solid transparent; }
.navlink.active { color: var(--ink); border-bottom-color: var(--accent); }
.card {
  background: var(--card); border: 1px solid var(--border); border-radius: 3px;
}
.divider { border: 0; border-top: 1px solid var(--border); }
.pill {
  display: inline-block; font-size: 11px; letter-spacing: .1em; text-transform: uppercase;
  color: var(--accent); border: 1px solid var(--accent); padding: 3px 10px; border-radius: 999px;
}
.article-body p { margin: 0 0 1.4em; }
.article-body h2 { font-family: Georgia, serif; font-size: 27px; margin: 2em 0 .7em; }
.article-body blockquote {
  margin: 1.8em 0; padding: .2em 0 .2em 1.2em;
  border-left: 3px solid var(--accent); color: var(--muted); font-style: italic;
}
.article-body pre {
  background: var(--beige); padding: 16px 18px; border-radius: 3px; overflow-x: auto;
  font-size: 14px; line-height: 1.6; margin: 1.6em 0;
}
.article-body .eq {
  text-align: center; font-family: Georgia, serif; font-style: italic; font-size: 20px;
  margin: 1.6em 0; color: var(--ink);
}
.input, .textarea, .select {
  width: 100%; background: var(--card); color: var(--ink);
  border: 1px solid var(--border); border-radius: 2px; padding: 10px 12px;
  font-size: 15px; font-family: inherit; box-sizing: border-box;
}
.textarea { min-height: 260px; resize: vertical; line-height: 1.6; }
.meta { font-size: 13px; color: var(--muted); letter-spacing: .04em; }
`;

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  "Economics",
  "Data Science",
  "Finance",
  "AI & Technology",
  "Research",
  "Personal Insights",
];

const ARTICLES = [
  {
    id: "understanding-the-world-through-data",
    title: "Understanding the World Through Data",
    subtitle: "An exploration of data, evidence, and economic thinking",
    category: "Research",
    date: "2026-11-18",
    readTime: 8,
    readers: "2.4K",
    featured: true,
    views: 3120,
    likes: 214,
    excerpt:
      "Why careful reasoning about evidence matters more than clever models, and how data can discipline our understanding of the social world.",
    tags: ["evidence", "economic method", "causality"],
    body: `Few ideas matter more in the social sciences than the discipline of looking at the world as it is, not as our intuitions describe it.

Data does not speak for itself. Every figure we compute is the product of a chain of decisions: what to measure, whom to sample, how to define a variable. The honest analyst makes this chain visible.

## Evidence before theory, or theory before evidence?

The classical view in economics holds that theory comes first: models tell us which facts are worth collecting. A more pragmatic view starts with the puzzle. Both positions are wrong when held exclusively.

> A good empirical finding is one that would have surprised your prior, but not enough to break your model entirely.

Consider the question of household savings. Textbook consumption smoothing predicts that households borrow in lean years and repay in good ones. The data tells a more interesting story: behavior differs systematically by household type, constraints, and salience.

## The anatomy of a good empirical claim

A claim earns our confidence only when three conditions hold:

1. The measurement is well defined and replicable.
2. The comparison is meaningful, ideally approaching a controlled contrast.
3. The result survives reasonable perturbations of assumptions.

## What this means for practice

Working with data is an act of humility. The modest lesson of modern statistics is that most of our questions cannot be answered with the data we have, and the questions that can be answered are usually smaller than we hoped.

$$E[Y|D=1] - E[Y|D=0] \\neq E[Y_1 - Y_0]$$

The gap between these expressions is the entire discipline of causal inference in one line.`,
  },
  {
    id: "why-financial-decisions-differ-across-households",
    title: "Why Do Financial Decisions Differ Across Households?",
    subtitle: "Constraints, beliefs, and the limits of the rational-agent model",
    category: "Economics",
    date: "2026-11-10",
    readTime: 6,
    readers: "1.8K",
    featured: false,
    views: 2410,
    likes: 156,
    tags: ["household finance", "behavioral economics"],
    excerpt:
      "Two households with identical incomes make very different financial choices. The explanation lies in constraints and beliefs, not intelligence.",
    body: `Two households with identical incomes, education, and access to credit can end up with radically different balance sheets. Standard theory struggles with this observation.

## Three frictions that matter

First, *constraints*: many households cannot borrow against future income at all. Second, *beliefs*: expectations about inflation, unemployment, and returns vary enormously and could all be, from each household's perspective, rational. Third, *salience*: the financially relevant facts are not equally visible at decision time.

## What follows

Policy designs that ignore heterogeneity in constraints and beliefs tend to disappoint. Retirement savings programs, for example, work far better when defaults reflect actual behavioral tendencies rather than an idealized planner.

> The right question is rarely "is this household irrational?" It is "which constraint is binding?"`,
  },
  {
    id: "learning-machine-learning-from-first-principles",
    title: "Learning Machine Learning From First Principles",
    subtitle: "Deriving the algorithms by hand before trusting the libraries",
    category: "Data Science",
    date: "2026-10-28",
    readTime: 10,
    readers: "3.1K",
    views: 3890,
    likes: 302,
    featured: false,
    tags: ["python", "statistics", "pedagogy"],
    excerpt:
      "Implementing linear regression, gradient descent, and even backpropagation from scratch teaches things no tutorial can.",
    body: `The fastest way to develop intuition for machine learning is to distrust it. Implement everything once, badly, in raw Python.

## Start with the loss

Every supervised method is a loss function plus an optimization routine. Once that decomposition is internalized, the zoo of algorithms becomes navigable.

For least squares, the objective is

$$\\min_w \\; \\lVert y - Xw \\rVert^2$$

and the solution satisfies the normal equations. Notice what this assumes: that quadratic loss is the right notion of error. Change one word of the specification and a different algorithm falls out.

## Code before libraries

\`\`\`python
def gradient_descent(X, y, lr=0.01, epochs=1000):
    w = np.zeros(X.shape[1])
    for _ in range(epochs):
        grad = 2 * X.T @ (X @ w - y)
        w -= lr * grad
    return w
\`\`\`

Twelve lines. Running it, watching it fail on badly scaled features, and fixing it teaches more than any lecture.

## What the abstractions hide

Libraries hide three things worth knowing: numerical stability, initialization sensitivity, and the choices embedded in default hyperparameters. Rediscover them once and they become permanent tools.`,
  },
  {
    id: "the-economics-of-attention-markets",
    title: "The Economics of Attention Markets",
    subtitle: "What happens when the scarce resource is human focus",
    category: "AI & Technology",
    date: "2026-10-14",
    readTime: 7,
    featured: false,
    views: 1870,
    likes: 121,
    readers: "1.9K",
    tags: ["platforms", "attention", "media"],
    excerpt:
      "Attention behaves like an asset: finite, positional, and increasingly contested. The economics of platforms follow from that fact.",
    excerptNote: true,
    body: `Attention is the one input no technology has ever manufactured more of. Total human attention is roughly fixed, which makes the market for it zero-sum in a way most markets are not.

## Supply, demand, and the feed

A recommendation feed is a matching technology: it allocates a fixed stock of attention across a variable stock of content. Quality is only one input to the allocation; predictability of engagement matters just as much.

> When the resource is fixed, competition shifts from producing more to producing more compelling.

## Implications

For readers, the scarce skill is curation. For writers, the scarce skill is earning trust, which compounds slowly and erodes quickly. Neither lesson appears in the platform's own analytics dashboard.`,
  },
  {
    id: "notes-on-causal-inference-toolkit",
    title: "Research Note: A Compact Causal Inference Toolkit",
    subtitle: "Five methods, five assumptions, one checklist",
    category: "Research",
    date: "2026-09-30",
    readTime: 4,
    featured: false,
    views: 980,
    likes: 64,
    readers: "1.0K",
    tags: ["methods", "causality", "notebook"],
    excerpt:
      "A short reference: matching, diff-in-diff, IV, RDD, and synthetic control, with the assumption each one quietly asks you to defend.",
    body: `A quick reference for choosing an identification strategy.

| Method | Key assumption | Watch for |
| --- | --- | --- |
| Matching | Selection on observables | Unobserved confounding |
| Difference-in-differences | Parallel trends | Anticipation effects |
| Instrumental variables | Exclusion restriction | Weak instruments |
| Regression discontinuity | Continuity at cutoff | Manipulation of running variable |
| Synthetic control | Pre-period fit generalizes | Few control units |

## A small experiment

\`\`\`sql
SELECT treated, AVG(outcome) AS avg_outcome,
       COUNT(*) AS n
FROM study_panel
WHERE post_period = TRUE
GROUP BY treated;
\`\`\`

Simple contrasts are the starting point, never the answer. The design carries the causal weight, not the estimator.`,
  },
  {
    id: "a-learning-cadence-that-survives-semester",
    title: "A Learning Cadence That Survives the Semester",
    subtitle: "Notes on studying deliberately, not heroically",
    category: "Personal Insights",
    date: "2026-09-12",
    readTime: 5,
    featured: false,
    views: 1420,
    likes: 98,
    readers: "1.4K",
    tags: ["learning", "habits"],
    excerpt:
      "Most study systems fail because they assume unlimited willpower. A cadence assumes you will be tired, busy, and sometimes bored.",
    body: `The systems that survive are the small ones. Not a productivity architecture, but a cadence.

## Three rules

1. Read something difficult every day, even briefly.
2. Write before you feel ready.
3. Review notes weekly, ruthlessly deleting what no longer matters.

> Learning is not the accumulation of material. It is the gradual deletion of confusion.

## On motivation

Motivation is a lagging indicator of routine, not a leading one. Build the routine, and motivation shows up late but reliably.`,
  },
];

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/* Fake-author context: in a real deployment this would come from auth */
const isAdmin = true;

function renderBody(body) {
  const paras = body.split("\n\n");
  return paras.map((p, i) => {
    if (p.startsWith("## ")) return <h2 key={i}>{p.slice(3)}</h2>;
    if (p.startsWith("> "))
      return (
        <blockquote key={i} className="article-body" style={{ margin: 0 }}>
          <p>{p.slice(2)}</p>
        </blockquote>
      );
    if (/^\d\. /m.test(p) && !p.startsWith("$$")) {
      const items = p.split("\n").filter(Boolean);
      return (
        <ol key={i} style={{ marginBottom: "1.4em", paddingLeft: "1.4em" }}>
          {items.map((it, j) => (
            <li key={j} style={{ marginBottom: ".4em" }}>
              {it.replace(/^\d\. /, "")}
            </li>
          ))}
        </ol>
      );
    }
    const tableMatch = p.trim().startsWith("|");
    if (tableMatch) {
      const rows = p
        .trim()
        .split("\n")
        .filter((r) => !/^\|[\s-|]+\|$/.test(r));
      const parse = (r) => r.slice(1, -1).split("|").map((c) => c.trim());
      return (
        <div key={i} style={{ margin: "1.6em 0", overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", fontSize: 15 }}>
            <thead>
              <tr>
                {parse(rows[0]).map((h, j) => (
                  <th
                    key={j}
                    style={{
                      textAlign: "left",
                      padding: "8px 14px",
                      borderBottom: "2px solid var(--border)",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((r, j) => (
                <tr key={j}>
                  {parse(r).map((c, k) => (
                    <td
                      key={k}
                      style={{
                        padding: "8px 14px",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (p.startsWith("$$"))
      return (
        <div key={i} className="eq">
          {p.replaceAll("$$", "").replaceAll("\\lVert", "‖").replaceAll("\\rVert", "‖").replaceAll("\\neq", "≠").replaceAll("\\; ", "").replaceAll("\\min", "min").replace(/_/g, "")}
        </div>
      );
    if (p.includes("\\") && !p.startsWith("$$") && p.split("\n").length === 1 && p.length < 90)
      return null;
    if (p.startsWith("\`\`\`")) {
      const code = p.split("\n").slice(1, -1).join("\n");
      return (
        <pre key={i} className="mono">
          <code>{code}</code>
        </pre>
      );
    }
    return (
      <p key={i} className="article-body" style={{ margin: 0 }}>
        {p}
      </p>
    );
  });
}

/* ------------------------------------------------------------------ */
/* Chrome                                                              */
/* ------------------------------------------------------------------ */

function Nav({ dark, setDark }) {
  const active = useLocation().pathname;
  const links = [
    ["/", "Home"],
    ["/explore", "Explore"],
    ["/archive", "Archive"],
    ["/about", "About"],
    ["/contact", "Contact"],
  ];
  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <div className="container" style={{ padding: "18px 24px" }}>
        <div
          className="container"
          style={{ maxWidth: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: 0 }}
        >
          <Link to="/" style={{ display: "flex", flexDirection: "column" }}>
            <span
              className="serif"
              style={{ fontSize: 22, letterSpacing: ".05em", fontWeight: 600 }}
            >
              THE THINKING JOURNAL
            </span>
            <span
              style={{
                fontSize: 10,
                letterSpacing: ".22em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              A personal publication
            </span>
          </Link>
          <nav
            style={{ display: "flex", gap: 22, alignItems: "center" }}
            className="hide-sm"
          >
            {links.map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className={`navlink ${active === to ? "active" : ""}`}
              >
                {label}
              </Link>
            ))}
            <button
              onClick={() => setDark(!dark)}
              title="Toggle dark mode"
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: 999,
                width: 32,
                height: 32,
                cursor: "pointer",
                color: "var(--ink)",
                fontSize: 14,
              }}
            >
              {dark ? "☀" : "☾"}
            </button>
            <Link to="/admin" className={`navlink ${active === "/admin" ? "active" : ""}`}>
              Admin
            </Link>
          </nav>
        </div>
        <nav style={{ display: "none" }} className="show-sm-wrap" />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        marginTop: 90,
        padding: "40px 0 50px",
      }}
    >
      <div className="container" style={{ textAlign: "center" }}>
        <div className="serif" style={{ fontSize: 18, marginBottom: 8 }}>
          The Thinking Journal
        </div>
        <div className="meta">
          About · Archive · Newsletter · Contact · RSS
        </div>
        <div className="meta" style={{ marginTop: 14 }}>
          © 2026 · Essays, research, and observations
        </div>
      </div>
    </footer>
  );
}

function ArticleCard({ a, large }) {
  return (
    <Link to={`/article/${a.id}`} className="card" style={{ display: "block" }}>
      <div
        style={{
          height: large ? 220 : 140,
          background: `linear-gradient(135deg, var(--beige), var(--card))`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span className="serif" style={{ fontSize: large ? 40 : 26, color: "var(--accent)", fontStyle: "italic" }}>
          {a.category[0]}
          {a.category.split(" ").map((w) => w[0]).join("").slice(0, 2)}
        </span>
      </div>
      <div style={{ padding: large ? 26 : 20 }}>
        <div className="kicker" style={{ marginBottom: 8 }}>
          {a.category}
        </div>
        <h3
          className="serif"
          style={{ margin: "0 0 8px", fontSize: large ? 28 : 20, lineHeight: 1.25 }}
        >
          {a.title}
        </h3>
        {large && (
          <p className="mutedtext" style={{ margin: "0 0 12px", fontSize: 15 }}>
            {a.excerpt}
          </p>
        )}
        <div className="meta">
          {fmtDate(a.date)} · {a.readTime} min read
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

function Home() {
  const featured = ARTICLES.find((a) => a.featured);
  const rest = ARTICLES.filter((a) => a.id !== featured.id);
  const popular = [...ARTICLES].sort(
    (a, b) => parseFloat(b.views) - parseFloat(a.views)
  ).slice(0, 3);
  return (
    <div>
      {/* Hero */}
      <section style={{ padding: "90px 0 60px", textAlign: "center" }}>
        <div className="container measure" style={{ textAlign: "center" }}>
          <div className="kicker" style={{ marginBottom: 18 }}>
            Ideas worth thinking about
          </div>
          <h1
            className="serif"
            style={{ fontSize: 46, margin: "0 0 18px", lineHeight: 1.15 }}
          >
            Essays, research, and observations about economics, data, and the
            ideas shaping our world.
          </h1>
          <p className="mutedtext" style={{ fontSize: 18, margin: 0 }}>
            Exploring economics, technology, data, and society through careful
            writing and honest analysis.
          </p>
        </div>
      </section>

      {/* Featured */}
      <section className="container" style={{ marginBottom: 70 }}>
        <ArticleCard a={featured} large />
      </section>

      {/* Latest */}
      <section className="container" style={{ marginBottom: 70 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <h2 className="serif" style={{ margin: 0, fontSize: 26 }}>
            Latest stories
          </h2>
          <Link to="/explore" className="navlink">
            View all →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {rest.slice(0, 3).map((a) => (
            <ArticleCard key={a.id} a={a} />
          ))}
        </div>
      </section>

      {/* Popular strip */}
      <section className="container" style={{ marginBottom: 70 }}>
        <hr className="divider" style={{ marginBottom: 32 }} />
        <h2 className="serif" style={{ margin: "0 0 24px", fontSize: 26 }}>
          Popular this month
        </h2>
        <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {popular.map((a, i) => (
            <li key={a.id} style={{ borderBottom: "1px solid var(--border)" }}>
              <Link
                to={`/article/${a.id}`}
                style={{
                  display: "flex",
                  gap: 24,
                  padding: "20px 0",
                  alignItems: "baseline",
                }}
              >
                <span
                  className="serif"
                  style={{ fontSize: 28, color: "var(--accent)", minWidth: 34 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontFamily: "Georgia, serif", fontSize: 19, marginBottom: 4 }}>
                    {a.title}
                  </span>
                  <span className="meta">
                    {a.category} · {a.readTime} min read · {a.readers || a.views} reads
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Topics */}
      <section className="container" style={{ marginBottom: 70 }}>
        <h2 className="serif" style={{ margin: "0 0 20px", fontSize: 26 }}>
          Browse by topic
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/explore?topic=${encodeURIComponent(c)}`} className="pill">
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container">
        <div
          className="card"
          style={{ padding: "44px 32px", textAlign: "center", background: "var(--beige)" }}
        >
          <h2 className="serif" style={{ margin: "0 0 8px", fontSize: 26 }}>
            Subscribe to the newsletter
          </h2>
          <p className="mutedtext" style={{ margin: "0 0 22px" }}>
            One email per publication. No noise. Unsubscribe anytime.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  if (done)
    return <p style={{ color: "var(--accent)", fontWeight: 600 }}>Thank you. Please check your inbox to confirm.</p>;
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
      style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}
    >
      <input
        className="input"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ maxWidth: 320 }}
        required
      />
      <button className="btn" type="submit">Subscribe</button>
    </form>
  );
}

function Explore() {
  const [params, setParams] = useState("");
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [sort, setSort] = useState("newest");

  const list = useMemo(() => {
    let out = ARTICLES.filter(
      (a) =>
        (!topic || a.category === topic) &&
        (!query ||
          (a.title + a.excerpt + a.tags.join(" "))
            .toLowerCase()
            .includes(query.toLowerCase()))
    );
    out = [...out].sort((a, b) => {
      if (sort === "newest") return b.date.localeCompare(a.date);
      if (sort === "oldest") return a.date.localeCompare(b.date);
      return b.views - a.views;
    });
    return out;
  }, [query, topic, sort]);

  return (
    <div className="container" style={{ paddingTop: 60 }}>
      <h1 className="serif" style={{ fontSize: 38, margin: "0 0 8px" }}>
        Explore
      </h1>
      <p className="mutedtext" style={{ marginTop: 0, marginBottom: 32 }}>
        All published essays and research notes.
      </p>

      <div
        style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}
      >
        <input
          className="input"
          style={{ maxWidth: 320 }}
          placeholder="Search title, keyword, tag…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="select" style={{ maxWidth: 220 }} value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">All topics</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className="select" style={{ maxWidth: 200 }} value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="popular">Most popular</option>
        </select>
      </div>

      <div className="meta" style={{ marginBottom: 24 }}>
        {list.length} article{list.length === 1 ? "" : "s"}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {list.map((a) => (
          <ArticleCard key={a.id} a={a} />
        ))}
      </div>
    </div>
  );
}

function ArticlePage() {
  const { id } = useParams();
  const nav = useNavigate();
  const a = ARTICLES.find((x) => x.id === id);
  const [claps, setClaps] = useState(a ? a.likes : 0);
  const [clapped, setClapped] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => { setClaps(a ? a.likes : 0); setClapped(false); setSaved(false); }, [id]);
  if (!a) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        <p>Article not found.</p>
        <button className="btn btn-ghost" onClick={() => nav("/explore")}>Browse all</button>
      </div>
    );
  }
  const related = ARTICLES.filter((x) => x.id !== a.id && x.category === a.category).slice(0, 2);
  const copyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <article>
      <div className="measure" style={{ padding: "70px 20px 0", maxWidth: 740, margin: "0 auto" }}>
        <div className="kicker" style={{ marginBottom: 14 }}>{a.category}</div>
        <h1 className="serif" style={{ fontSize: 42, margin: "0 0 14px", lineHeight: 1.15 }}>
          {a.title}
        </h1>
        <p className="mutedtext" style={{ fontSize: 20, fontFamily: "Georgia, serif", fontStyle: "italic", margin: "0 0 22px" }}>
          {a.subtitle}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontSize: 18 }}>
            A
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Akhadjon Abubakirov</div>
            <div className="meta">
              {fmtDate(a.date)} · {a.readTime} min read
            </div>
          </div>
        </div>
        <div
          style={{
            height: 260,
            borderRadius: 3,
            background: "linear-gradient(135deg, var(--beige), var(--card))",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <span className="serif" style={{ fontSize: 56, color: "var(--accent)", fontStyle: "italic" }}>
            {a.category[0]}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 20px" }}>
        <div className="article-body" style={{ fontSize: 18.5, lineHeight: 1.8 }}>
          {renderBody(a.body)}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "36px 0" }}>
          {a.tags.map((t) => (
            <span key={t} className="pill">#{t}</span>
          ))}
        </div>

        <hr className="divider" />

        {/* Interactions */}
        <div style={{ display: "flex", gap: 14, alignItems: "center", padding: "18px 0", flexWrap: "wrap" }}>
          <button
            onClick={() => { setClaps(clapped ? claps - 1 : claps + 1); setClapped(!clapped); }}
            className="btn btn-ghost"
            style={{ color: clapped ? "var(--accent)" : "var(--ink)" }}
          >
            👏 {claps}
          </button>
          <button className="btn btn-ghost" onClick={() => setSaved(!saved)}>
            {saved ? "★ Saved" : "☆ Save"}
          </button>
          <button className="btn btn-ghost" onClick={copyLink}>
            {copied ? "Link copied" : "Copy link"}
          </button>
          <button
            onClick={() => setClaps(claps)}
            className="btn btn-ghost"
            title="Share"
          >
            Share
          </button>
        </div>

        {/* Author + related */}
        <hr className="divider" />
        <div style={{ display: "flex", gap: 18, padding: "28px 0", alignItems: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontSize: 28 }}>
            A
          </div>
          <div>
            <div className="kicker" style={{ marginBottom: 4 }}>Written by</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 20, marginBottom: 4 }}>
              Akhadjon Abubakirov
            </div>
            <div className="mutedtext" style={{ fontSize: 14 }}>
              Researcher and writer on economics, data science, finance, and technology.
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <>
            <hr className="divider" />
            <h2 className="serif" style={{ fontSize: 22, margin: "26px 0 18px" }}>
              Related reading
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18, marginBottom: 50 }}>
              {related.map((r) => (
                <ArticleCard key={r.id} a={r} />
              ))}
            </div>
          </>
        )}

        {/* Comments */}
        <div style={{ paddingBottom: 60 }}>
          <h2 className="serif" style={{ fontSize: 22 }}>
            Responses ({listComments(a.id).length})
          </h2>
          <CommentList id={a.id} />
        </div>
      </div>
    </article>
  );
}

const COMMENTS = {
  "understanding-the-world-through-data": [
    {
      name: "M. Keller",
      date: "Nov 20",
      text: "The framing around 'the chain of decisions' behind every figure is elegantly put. Looking forward to the episode on causal inference.",
    },
  ],
  "learning-machine-learning-from-first-principles": [
    {
      name: "S. Petrov",
      date: "Nov 2",
      text: "Implementing GD from scratch before touching sklearn, agreed completely. It removes all the magic.",
    },
  ],
};
const listComments = (id) => COMMENTS[id] || [];

function CommentList({ id }) {
  const [comments, setComments] = useState(listComments(id));
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  return (
    <div>
      {comments.map((c, i) => (
        <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>
            {c.name} <span className="meta">· {c.date}</span>
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 15 }}>{c.text}</p>
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          setComments([...comments, { name: name.trim() || "Anonymous", date: "Just now", text: text.trim() }]);
          setText("");
          setName("");
        }}
        style={{ marginTop: 24 }}
      >
        <input
          className="input"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: 10, maxWidth: 320 }}
        />
        <textarea
          className="textarea"
          style={{ minHeight: 90 }}
          placeholder="Share a thoughtful response…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn" style={{ marginTop: 12 }} type="submit">
          Post response
        </button>
      </form>
    </div>
  );
}

function About() {
  return (
    <div className="measure" style={{ padding: "70px 20px 0", maxWidth: 700, margin: "0 auto" }}>
      <div className="kicker" style={{ marginBottom: 14 }}>About</div>
      <h1 className="serif" style={{ fontSize: 40, margin: "0 0 30px" }}>
        Hello, I'm Akhadjon.
      </h1>
      <div
        style={{ width: 88, height: 88, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontSize: 38, marginBottom: 30 }}
      >
        A
      </div>
      <div className="article-body" style={{ fontSize: 18 }}>
        <p>
          I'm a researcher and writer interested in how evidence, economics,
          and technology shape the decisions we make. By training I work with
          economics, data science, and finance; by temperament I am drawn to
          the questions in between.
        </p>
        <h2>What I write about</h2>
        <p>
          Applied economics and the limits of models, data science from first
          principles, financial markets and household finance, and the
          technology that increasingly mediates both. Some of it is long-form
          analysis; some of it lives in short research notes.
        </p>
        <h2>Current projects</h2>
        <p>
          Research on household financial decision-making, a growing notebook
          on causal inference methods, and an ongoing effort to explain
          machine learning the way I wish I had learned it: from the loss
          function up.
        </p>
        <blockquote>
          The goal is not to have opinions, but to earn them.
        </blockquote>
        <h2>Elsewhere</h2>
        <p>
          You can find me on LinkedIn and GitHub, or follow along with the
          newsletter and RSS feed for new publications.
        </p>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
        {["LinkedIn", "GitHub", "RSS"].map((l) => (
          <a key={l} href="#" onClick={(e) => e.preventDefault()} className="btn btn-ghost">
            {l}
          </a>
        ))}
      </div>
    </div>
  );
}

function Archive() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const filtered = ARTICLES.filter(
    (a) =>
      (!cat || a.category === cat) &&
      (!q || (a.title + a.excerpt).toLowerCase().includes(q.toLowerCase()))
  );
  const byYear = {};
  const byMonth = {};
  filtered.forEach((a) => {
    const [y, m] = a.date.split("-");
    byYear[y] = (byYear[y] || 0) + 1;
    const key = `${y}-${m}`;
    (byMonth[key] = byMonth[key] || []).push(a);
  });
  const monthName = (m) =>
    new Date(`${m}-01`).toLocaleDateString("en-GB", { month: "long" });
  return (
    <div className="container" style={{ paddingTop: 60 }}>
      <h1 className="serif" style={{ fontSize: 38, margin: "0 0 8px" }}>Archive</h1>
      <p className="mutedtext" style={{ marginTop: 0, marginBottom: 28 }}>
        A chronological record of everything published.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
        <input
          className="input"
          style={{ maxWidth: 300 }}
          placeholder="Search the archive…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="select" style={{ maxWidth: 220 }} value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      {Object.keys(byMonth)
        .sort((a, b) => b.localeCompare(a))
        .map((key) => {
          const [y, m] = key.split("-");
          return (
            <section key={key} style={{ marginBottom: 44 }}>
              <h2 className="serif" style={{ fontSize: 24, margin: "0 0 6px" }}>
                {monthName(m)} <span style={{ fontSize: 30, color: "var(--accent)" }}>{y}</span>
              </h2>
              <div className="meta" style={{ marginBottom: 14 }}>
                {byMonth[key].length} article{byMonth[key].length === 1 ? "" : "s"}
              </div>
              {byMonth[key].map((a) => (
                <Link
                  key={a.id}
                  to={`/article/${a.id}`}
                  style={{ display: "flex", justifyContent: "space-between", gap: 20, padding: "14px 0", borderTop: "1px solid var(--border)", alignItems: "baseline" }}
                >
                  <span>
                    <span style={{ fontFamily: "Georgia, serif", fontSize: 18 }}>
                      {a.title}
                    </span>
                    <span className="meta" style={{ display: "block" }}>
                      {a.category} · {a.readTime} min read
                    </span>
                  </span>
                  <span className="meta" style={{ whiteSpace: "nowrap" }}>
                    {a.date}
                  </span>
                </Link>
              ))}
            </section>
          );
        })}
      {filtered.length === 0 && <p className="mutedtext">No articles match.</p>}
    </div>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="measure" style={{ padding: "70px 20px 0", maxWidth: 620, margin: "0 auto" }}>
      <div className="kicker" style={{ marginBottom: 14 }}>Contact</div>
      <h1 className="serif" style={{ fontSize: 38, margin: "0 0 12px" }}>
        Say hello.
      </h1>
      <p className="mutedtext" style={{ margin: "0 0 32px" }}>
        Questions, collaboration ideas, or disagreement with something I
        wrote: all welcome.
      </p>
      {sent ? (
        <div className="card" style={{ padding: 28, textAlign: "center" }}>
          <p style={{ margin: 0, color: "var(--accent)", fontWeight: 600 }}>
            Message sent. I'll reply within a few days.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          style={{ display: "grid", gap: 14 }}
        >
          <input className="input" placeholder="Your name" required />
          <input className="input" type="email" placeholder="Your email" required />
          <textarea className="textarea" style={{ minHeight: 140 }} placeholder="Your message" required />
          <div>
            <button className="btn" type="submit">Send message</button>
          </div>
        </form>
      )}
      <div style={{ marginTop: 40 }}>
        <h2 className="serif" style={{ fontSize: 20, margin: "0 0 12px" }}>Direct links</h2>
        <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
          {["hello@thinkingjournal.example", "LinkedIn", "GitHub"].map((l) => (
            <li key={l} style={{ padding: "10px 0", borderTop: "1px solid var(--border)" }}>
              <a href="#" onClick={(e) => e.preventDefault()} className="navlink">{l}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Admin                                                               */
/* ------------------------------------------------------------------ */

function Admin() {
  const [view, setView] = useState("overview");
  const [posts, setPosts] = useState(
    ARTICLES.map((a) => ({ ...a, status: "Published" }))
  );
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(null);

  const totalViews = posts.reduce((s, p) => s + p.views, 0);
  const saved = () => {
    if (!draft.title.trim()) return;
    if (editing !== null && editing !== "new") {
      setPosts(posts.map((p) => (p.id === editing ? { ...p, ...draft } : p)));
    } else {
      const id = draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50);
      const words = (draft.body || "").split(/\s+/).length;
      setPosts([
        {
          ...draft,
          id: id || `draft-${Date.now()}`,
          body: draft.body || "*(Empty draft)*",
          excerpt: draft.excerpt || "Draft excerpt.",
          date: new Date().toISOString().slice(0, 10),
          readTime: Math.max(1, Math.round(words / 200)),
          views: 0,
          likes: 0,
          featured: false,
          status: draft.status || "Draft",
          readTime: Math.max(1, Math.round((draft.body || "").split(/\s+/).length / 200)),
        },
        ...posts,
      ]);
    }
    setDraft(null);
    setEditing(null);
    setView("articles");
  };

  const startNew = () => {
    setDraft({
      title: "", subtitle: "", category: CATEGORIES[0], excerpt: "", body: "", tags: [], status: "Draft",
    });
    setEditing("new");
    setView("editor");
  };
  const startEdit = (p) => {
    setDraft({ ...p });
    setEditing(p.id);
    setView("editor");
  };

  const shell = (
    <div className="container" style={{ paddingTop: 50, maxWidth: 1000 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 30, flexWrap: "wrap", gap: 12 }}>
        <h1 className="serif" style={{ fontSize: 34, margin: 0 }}>Dashboard</h1>
        <div style={{ display: "flex", gap: 14 }}>
          {["overview", "articles"].map((v) => (
            <button key={v} onClick={() => setView(v)} className="btn" style={view === v ? {} : { background: "transparent", color: "var(--ink)", borderColor: "var(--border)" }}>
              {v === "overview" ? "Overview" : "Articles"}
            </button>
          ))}
        </div>
        <button className="btn" onClick={startNew}>+ New article</button>
      </div>

      {view === "overview" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 36 }}>
            {[
              ["Total articles", posts.length],
              ["Total views", (totalViews / 1000).toFixed(1) + "K"],
              ["Subscribers", "340"],
              ["Comments", String(posts.reduce((s, p) => s + listComments(p.id).length, 0) + 84)],
            ].map(([label, val]) => (
              <div key={label} className="card" style={{ padding: "22px 20px" }}>
                <div className="kicker">{label}</div>
                <div className="serif" style={{ fontSize: 32, margin: "6px 0 0" }}>{val}</div>
              </div>
            ))}
          </div>
          <h2 className="serif" style={{ fontSize: 22, margin: "0 0 14px" }}>
            Views by article
          </h2>
          {posts.map((p) => (
            <div key={p.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
                <span style={{ fontFamily: "Georgia, serif" }}>{p.title}</span>
                <span className="meta">{p.views.toLocaleString()} views</span>
              </div>
              <div style={{ height: 6, background: "var(--beige)", borderRadius: 3 }}>
                <div
                  style={{
                    height: 6,
                    background: "var(--accent)",
                    borderRadius: 3,
                    width: `${Math.min(100, (p.views / 3900) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </>
      )}

      {view === "articles" && (
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 640 }}>
            <thead>
              <tr>
                {["Title", "Category", "Status", "Views", "Featured", ""].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", borderBottom: "2px solid var(--border)", letterSpacing: ".06em", textTransform: "uppercase", fontSize: 11 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", fontFamily: "Georgia, serif", fontSize: 15 }}>
                    {p.title || "(Untitled draft)"}
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>{p.category}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                    <span className="pill" style={{ borderColor: p.status === "Published" ? "var(--accent)" : "var(--muted)", color: p.status === "Published" ? "var(--accent)" : "var(--muted)" }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>{p.views.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: "4px 10px" }}
                      onClick={() => setPosts(posts.map((x) => (x.id === p.id ? { ...x, featured: !x.featured } : x)))}
                    >
                      {p.featured ? "★" : "☆"}
                    </button>
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                    <button className="btn btn-ghost" style={{ padding: "5px 10px", marginRight: 6 }} onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: "5px 10px" }}
                      onClick={() => {
                        if (confirm(`Delete "${p.title}"?`)) {
                          setPosts(posts.filter((x) => x.id !== p.id));
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === "editor" && draft && (
        <div style={{ display: "grid", gap: 14, maxWidth: 760 }}>
          <input className="input serif" style={{ fontSize: 26, fontFamily: "Georgia, serif" }} placeholder="Article title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <input className="input" placeholder="Subtitle" value={draft.subtitle} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} />
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <select className="select" style={{ maxWidth: 220 }} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select className="select" style={{ maxWidth: 180 }} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
              <option>Draft</option>
              <option>Scheduled</option>
              <option>Published</option>
            </select>
          </div>
          <input className="input" placeholder="Excerpt" value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} />
          <input className="input" placeholder="Tags (comma-separated)" value={draft.tags.join(", ")} onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
          <textarea
            className="textarea mono"
            style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, minHeight: 300 }}
            placeholder={"Write in Markdown…\n\nSupports ## headings, > quotes, | tables |, ```code```, $$ LaTeX $$, and numbered lists."}
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          />
          <div className="meta">Autosaved just now · Markdown, LaTeX, code blocks supported</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={saved}>Save</button>
            <button className="btn btn-ghost" onClick={() => { setDraft(null); setEditing(null); setView("articles"); }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
  return shell;
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const [dark, setDark] = useState(false);
  return (
    <>
      <style>{css}</style>
      <div className={`tj ${dark ? "dark" : ""}`}>
        <HashRouter>
          <Nav dark={dark} setDark={setDark} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Footer />
        </HashRouter>
      </div>
    </>
  );
}
