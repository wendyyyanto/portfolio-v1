import { useEffect, useRef, useState } from "react";
import { useMotion } from "./motion.js";

const EMAIL = "wendyyyanto@gmail.com";
const CV =
	"https://drive.google.com/file/d/1TrjcLEtVsBS6LPaCPVtvsXKRsvTJ8PQF/view?usp=sharing";

const timeline = [
	{
		kind: "Work",
		role: "Freelance Full-Stack Developer",
		org: "Organic Ministry",
		dates: "Oct 2025 to present",
		points: [
			"Built a church app, its CMS and the API behind both: NestJS, React Native with Expo, email through Resend, push through OneSignal."
		]
	},
	{
		kind: "Work",
		role: "Full-Stack Developer",
		org: "Bukit Vista Hospitality Services",
		dates: "Jun 2024 to Oct 2026",
		points: [
			"Built the notification service behind BVGO, the app Bukit Vista and a partner property use. It sends booking and report notifications through RabbitMQ and OneSignal, about 45,000 push a day (approx.) to about 800 users.",
			"Shipped 5 core features in BIGRR, the property-ops platform about 10 staff use daily.",
			"Built DataVista dashboards for Revenue, Ops and HR, with the queries written by hand: newsletter delivery and engagement, housekeeper presence, salary and reviews.",
			"Automated document generation and e-stamping for the marketing team with Eversign and ezMeterai. About 15 minutes of manual work per document became under 5 minutes in testing.",
			"Make.com and n8n automations, a Flutter mobile app, Datadog and UptimeRobot monitoring."
		]
	},
	{
		kind: "Work",
		role: "Frontend Intern",
		org: "Bukit Vista Hospitality Services",
		dates: "Aug 2023 to Nov 2023",
		points: [
			"Led a team of 2 on the ATLAS dashboard and shipped 3 visualizations.",
			"Rebuilt Property Notes in BIGRR-FE.",
			"Added Slack slash commands to Gaia-Interface, plus refactoring."
		]
	},
	{
		kind: "Study",
		role: "Bangkit Academy",
		org: "Mobile development cohort",
		dates: "2023",
		points: ["Final score 90.3."]
	},
	{
		kind: "Study",
		role: "Universitas Multimedia Nusantara",
		org: "B.Sc. Computer Science",
		dates: "2020 to 2024",
		points: ["GPA 3.69."]
	}
];

const screens = [
	["om-home.webp", "Home with events, resources and new teachings"],
	["om-teaching.webp", "Teachings by testament, topic and workshop"],
	["om-filter.png", "Narrowing a book down to its chapters"],
	["om-search.png", "Search by title, passage or teacher"],
	["om-ebooks.png", "E-books searchable by author and tag"]
];

const stack = [
	[
		"Backend",
		["Node.js", "Express", "NestJS", "RabbitMQ", "OneSignal", "Resend"]
	],
	[
		"Frontend",
		[
			"JavaScript",
			"TypeScript",
			"React",
			"Next.js",
			"Tailwind CSS",
			"MUI",
			"shadcn/ui",
			"Framer Motion",
			"GSAP"
		]
	],
	["Data", ["MySQL", "TypeORM", "Supabase"]],
	["Mobile", ["Flutter", "React Native", "Expo"]],
	["Automation and ops", ["Make.com", "n8n", "Docker", "Datadog"]]
];

const projects = [
	{
		name: "OM Mobile App",
		year: "2025 to present",
		desc: "Church app for teachings, events and e-books, with its CMS and NestJS API.",
		tags: ["NestJS", "React Native", "Expo", "Resend", "OneSignal"],
		slides: true
	},
	{
		name: "Jstudy",
		year: "2024",
		desc: "JavaScript learning platform in React and Supabase.",
		tags: ["React", "Supabase"]
	},
	{
		name: "AgroAI",
		year: "2023",
		desc: "Plant disease detection on device with TensorFlow Lite.",
		tags: ["TensorFlow Lite"]
	}
];

function Slides({ active }) {
	const [i, setI] = useState(0);
	useEffect(() => {
		if (!active || matchMedia("(prefers-reduced-motion: reduce)").matches)
			return;
		const t = setInterval(
			() => setI((n) => (n + 1) % screens.length),
			1200
		);
		return () => {
			clearInterval(t);
			setI(0);
		};
	}, [active]);
	return (
		<div className="slides">
			{screens.map(([src], k) => (
				<img
					key={src}
					className={k === i ? "is-on" : ""}
					src={`/img/${src}`}
					width="750"
					height="1624"
					alt=""
					loading="lazy"
					decoding="async"
				/>
			))}
		</div>
	);
}

export default function App() {
	const root = useRef(null);
	const [hover, setHover] = useState(null);
	const [open, setOpen] = useState(null);
	const grid = useRef(null);
	useMotion(root);

	const setSide = (w) =>
		grid.current.style.setProperty(
			"--side",
			`${Math.min(Math.max(w, 200), innerWidth * 0.4)}px`
		);
	const startResize = (e) => {
		e.preventDefault();
		const right = grid.current.getBoundingClientRect().right;
		const move = (ev) => setSide(right - ev.clientX);
		const up = () => {
			removeEventListener("pointermove", move);
			removeEventListener("pointerup", up);
		};
		addEventListener("pointermove", move);
		addEventListener("pointerup", up);
	};
	const keyResize = (e) => {
		const step = { ArrowLeft: 24, ArrowRight: -24 }[e.key];
		if (!step) return;
		e.preventDefault();
		setSide(grid.current.querySelector(".c-lead").offsetWidth + step);
	};

	return (
		<div ref={root}>
			<a className="skip" href="#main">
				Skip to content
			</a>

			<header className="nav">
				<a className="wordmark" href="#top">
					Wendyanto
				</a>
				<nav aria-label="Main" data-nav>
					<a href="#about">About</a>
					<a href="#experience">Experience</a>
					<a href="#projects">Projects</a>
					<a href="#stack">Stack</a>
					<a href="#contact">Contact</a>
				</nav>
			</header>

			<main id="main">
				<section
					id="top"
					className="hero"
					aria-label="Introduction"
					data-section
				>
					<div className="bgrid" ref={grid} data-bounds>
						<div className="cell c-h1">
							<h1 data-hero>
								I turn ideas into <em>working software,</em>{" "}
								from the backend to the screen.
							</h1>
							<figure className="card hero-card" data-drag>
								<img
									className="real"
									src="/img/wendy.jpg"
									width="1440"
									height="1440"
									alt="Wendyanto smiling, in a black t-shirt"
									fetchPriority="high"
									draggable="false"
								/>
								<img
									className="art"
									src="/img/wendy-art.jpg"
									width="640"
									height="857"
									alt=""
									aria-hidden="true"
									decoding="async"
								/>
							</figure>
						</div>
						<div
							className="resize"
							role="separator"
							aria-orientation="vertical"
							aria-label="Resize the info column"
							tabIndex={0}
							onPointerDown={startResize}
							onKeyDown={keyResize}
						/>
						<div className="cell c-lead" data-hero-in>
							<span className="lbl">[00] Summary</span>
							<p className="lead">
								Full-stack developer in Tangerang. I take a
								product from idea and API to the app or website
								people use.
							</p>
						</div>
						<div className="cell c-role" data-hero-in>
							<span className="lbl">[01] Role</span>
							<p className="val">Full-stack developer</p>
						</div>
						<div className="cell c-base" data-hero-in>
							<span className="lbl">[02] Base</span>
							<p className="val">Tangerang, Indonesia</p>
						</div>
						<div className="c-bottom" data-hero-in>
							<div className="cell c-status">
								<span className="lbl">[03] Status</span>
								<p className="val">Open to work</p>
								<p>Remote, hybrid, Tangerang</p>
							</div>
							<a className="btn" href={`mailto:${EMAIL}`}>
								Email me
							</a>
							<a className="btn" href="#projects">
								See my work
							</a>
						</div>
					</div>
				</section>

				<section
					id="about"
					className="section container"
					aria-labelledby="about-h"
					data-section
					data-bounds
				>
					<div className="head" data-reveal>
						<span className="idx measured">[01]</span>
						<h2 id="about-h">About</h2>
					</div>
					<div className="about">
						<p className="about-text" data-words>
							I'm Wendy, a full-stack developer in Tangerang. I
							like taking an idea from a rough problem to a
							working product: the API, the database, the app, and
							the screen. Most of my work runs in the background,
							so I like making it easy to see.
						</p>
						<figure className="card about-card" data-drag>
							<img
								className="real"
								src="/img/wendy.jpg"
								width="1440"
								height="1440"
								alt="Wendyanto smiling, in a black t-shirt"
								loading="lazy"
								decoding="async"
								draggable="false"
							/>
							<img
								className="art"
								src="/img/wendy-art.jpg"
								width="640"
								height="857"
								alt=""
								aria-hidden="true"
								decoding="async"
							/>
							<figcaption>
								Wendyanto, Tangerang. Drag the photo around.
							</figcaption>
						</figure>
					</div>
				</section>

				<section
					id="experience"
					className="section container"
					aria-labelledby="experience-h"
					data-section
				>
					<div className="head" data-reveal>
						<span className="idx measured">[02]</span>
						<h2 id="experience-h">Experience and study</h2>
					</div>
					<ol className="timeline" data-timeline>
						<span className="tl-line" aria-hidden="true">
							<i className="tl-fill" />
						</span>
						{timeline.map((j) => (
							<li className="tl-item" key={j.role + j.org}>
								<div>
									<span className="kind measured">
										{j.kind}
									</span>
									<h3>{j.role}</h3>
									<p className="org">{j.org}</p>
									<span className="dates measured">
										{j.dates}
									</span>
								</div>
								<ul className="plain">
									{j.points.map((p) => (
										<li key={p}>{p}</li>
									))}
								</ul>
							</li>
						))}
					</ol>
				</section>

				<section
					id="projects"
					className="section container"
					aria-labelledby="projects-h"
					data-section
				>
					<div className="head" data-reveal>
						<span className="idx measured">[03]</span>
						<h2 id="projects-h">Projects</h2>
					</div>
					<ul className="plist" data-plist>
						{projects.map((p, i) => (
							<li
								key={p.name}
								className={`prow${open === i ? " is-open" : ""}`}
								data-reveal
								onPointerEnter={(e) =>
									e.pointerType === "mouse" && setHover(i)
								}
								onPointerLeave={() => setHover(null)}
							>
								<button
									type="button"
									className="prow-btn"
									aria-expanded={open === i}
									onClick={() =>
										setOpen(open === i ? null : i)
									}
									onFocus={() => setHover(i)}
									onBlur={() => setHover(null)}
								>
									<span className="pidx measured">
										[0{i + 1}]
									</span>
									<span className="pmain">
										<span className="pname">{p.name}</span>
										<span className="ptags">
											{p.tags.map((t) => (
												<span key={t}>{t}</span>
											))}
										</span>
									</span>
									<span className="pyear measured">
										{p.year}
									</span>
								</button>
								<p className="pdetail">{p.desc}</p>
							</li>
						))}
					</ul>
					<div
						className={`pcard${hover === null ? "" : " is-on"}`}
						data-pcard
						aria-hidden="true"
					>
						{projects.map((p, i) => (
							<div
								key={p.name}
								className={`pitem${hover === i ? " is-on" : ""}`}
							>
								{p.slides && <Slides active={hover === i} />}
								<p>{p.desc}</p>
							</div>
						))}
					</div>
				</section>

				<section
					id="stack"
					className="section container"
					aria-labelledby="stack-h"
					data-section
				>
					<div className="head" data-reveal>
						<span className="idx measured">[04]</span>
						<h2 id="stack-h">What I build with</h2>
					</div>
					<ul className="stack">
						{stack.map(([t, items]) => (
							<li key={t} data-reveal>
								<h3>{t}</h3>
								<ul>
									{items.map((i) => (
										<li key={i}>{i}</li>
									))}
								</ul>
							</li>
						))}
					</ul>
				</section>
			</main>

			<footer className="contact" id="contact" data-section>
				<div className="container">
					<p className="statement" data-reveal>
						Have interesting idea to build?
					</p>
					<a className="email" href={`mailto:${EMAIL}`} data-reveal>
						{EMAIL}
					</a>
					<nav className="links" aria-label="Elsewhere" data-reveal>
						<a
							href="https://linkedin.com/in/wendyanto27"
							rel="noopener"
						>
							LinkedIn
						</a>
						<a href="https://github.com/wendyyyanto" rel="noopener">
							GitHub
						</a>
						<a href={CV} rel="noopener">
							Resume / CV
						</a>
					</nav>
					<p className="status" data-reveal>
						<i aria-hidden="true" />
						Open to work: remote, hybrid, Tangerang
					</p>
					<p className="legal">
						© 2026 Wendyanto. Tangerang, Indonesia.
					</p>
				</div>
			</footer>
		</div>
	);
}
