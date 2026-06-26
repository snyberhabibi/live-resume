"use client";

import { motion } from "framer-motion";
import { CHAPTERS, type Chapter, type RoleEntry } from "@/content/chapters";
import { CHAPTER_ACCENT, CHAPTER_ACCENT_LIGHT } from "@/three/config";
import { useScene } from "@/three/store";
import { RevealWords, SPRING, SPRING_SNAPPY } from "./Reveal";
import { Scramble } from "./Scramble";

// theme-aware scrim (rgb(var(--scrim)) = paper in light, ink in dark)
const SCRIM =
  "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgb(var(--scrim))]/92 via-[rgb(var(--scrim))]/35 to-transparent";

function Eyebrow({ label, accent, left = false }: { label: string; accent: string; left?: boolean }) {
  return (
    <motion.p
      className={`mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.45em] text-readable-subtle sm:text-[11px] ${
        left ? "justify-start" : "justify-center"
      }`}
      style={{ color: accent }}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={SPRING}
    >
      <span className="h-px w-6 shrink-0" style={{ background: accent, opacity: 0.6 }} />
      <Scramble text={label} charMs={34} />
    </motion.p>
  );
}

function ScrollCue() {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-mono text-[8px] uppercase tracking-[0.45em] text-[var(--fg)]/55">
        Scroll
      </span>
      <span className="relative block h-9 w-px overflow-hidden bg-[var(--fg)]/15">
        <motion.span
          className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[var(--fg)]/60 to-transparent"
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    </div>
  );
}

function Headline({ lines, isHero, center }: { lines: string[]; isHero: boolean; center: boolean }) {
  const Tag = isHero ? "h1" : "h2";
  const size = isHero
    ? "text-[clamp(2.4rem,9vw,7rem)]"
    : center
      ? "text-[clamp(1.9rem,6vw,4.2rem)]"
      : "text-[clamp(1.5rem,4.4vw,3.1rem)]";
  return (
    <Tag className="mb-6 text-balance text-readable">
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <RevealWords
            text={line}
            delay={0.12 + i * 0.1}
            className={`block font-display font-semibold leading-[1.05] tracking-[-0.015em] text-[var(--fg)] ${size}`}
          />
        </span>
      ))}
    </Tag>
  );
}

// ─── the life-motto, as a small editor card ──────────────────────────────────
const KEYWORDS = new Set(["if", "else", "return", "const", "let", "var", "function", "new"]);
const LITERALS = new Set(["true", "false", "null", "undefined"]);

function CodeLine({ line, accent }: { line: string; accent: string }) {
  if (line.trim().startsWith("//")) {
    return <div className="italic text-[var(--fg)]/65">{line}</div>;
  }
  const tokens = line.match(/[A-Za-z_]\w*|[^A-Za-z_]+/g) ?? [line];
  return (
    <div>
      {tokens.map((tok, i) => {
        const next = tokens[i + 1] ?? "";
        let color: string | undefined;
        let weight: number | undefined;
        if (KEYWORDS.has(tok)) {
          color = accent;
          weight = 600;
        } else if (LITERALS.has(tok)) {
          color = "#2f8f86";
        } else if (/^[A-Za-z_]\w*$/.test(tok) && next.startsWith("(")) {
          color = "var(--fg)";
          weight = 500;
        } else if (/^[A-Za-z_]\w*$/.test(tok)) {
          color = "var(--fg)";
        } else {
          color = "var(--fg)";
        }
        return (
          <span key={i} style={{ color, fontWeight: weight, opacity: weight ? 1 : 0.78 }}>
            {tok}
          </span>
        );
      })}
    </div>
  );
}

function CodeCard({ code, accent }: { code: string[]; accent: string }) {
  return (
    <motion.div
      className="mx-auto mt-9 w-full max-w-sm overflow-hidden rounded-xl border border-[var(--fg)]/12 bg-[rgb(var(--scrim))]/85 text-left shadow-[0_18px_50px_-14px_rgba(0,0,0,0.35)] backdrop-blur-xl"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ ...SPRING, delay: 0.55 }}
    >
      <div className="flex items-center gap-1.5 border-b border-[var(--fg)]/10 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-[var(--fg)]/20" />
        <span className="h-2 w-2 rounded-full bg-[var(--fg)]/20" />
        <span className="h-2 w-2 rounded-full bg-[var(--fg)]/20" />
        <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--fg)]/60">
          life.ts
        </span>
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[12px] leading-[1.75] sm:text-[13px]">
        {code.map((line, i) => (
          <CodeLine key={i} line={line} accent={accent} />
        ))}
      </pre>
    </motion.div>
  );
}

// ─── experience role cards ────────────────────────────────────────────────────
function RoleCard({ role, accent, delay }: { role: RoleEntry; accent: string; delay: number }) {
  return (
    <motion.article
      className="border-l border-[var(--fg)]/15 py-1 pl-4"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ ...SPRING, delay }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <h3 className="font-display text-[15px] font-semibold text-[var(--fg)] sm:text-[17px]">
          {role.company}
        </h3>
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-[var(--fg)]/65">
          {role.period}
          {role.current && (
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: accent }} />
          )}
        </span>
      </div>
      <p
        className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] sm:text-[12px]"
        style={{ color: accent }}
      >
        {role.role}
        {role.note && <span className="ml-2 text-[var(--fg)]/60 normal-case">· {role.note}</span>}
      </p>
      <ul className="space-y-1">
        {role.bullets.map((b, i) => (
          <li
            key={i}
            className="flex gap-2 text-[12px] leading-relaxed text-[var(--fg)]/80 sm:text-[13px]"
          >
            <span className="shrink-0" style={{ color: accent }}>
              ·
            </span>
            <span className="min-w-0">{b}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

// ─── the record (stats) ───────────────────────────────────────────────────────
function Stats({ stats, accent }: { stats: { value: string; label: string }[]; accent: string }) {
  return (
    <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...SPRING, delay: 0.4 + i * 0.1 }}
        >
          <div
            className="font-display text-[clamp(2rem,5vw,3.2rem)] font-bold leading-none text-readable"
            style={{ color: accent }}
          >
            {s.value}
          </div>
          <div className="mx-auto mt-2 max-w-[10rem] text-[11px] leading-snug text-[var(--fg)]/75 sm:text-[12px]">
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── the toolbelt (skill groups) ──────────────────────────────────────────────
function Skills({
  skills,
  accent,
}: {
  skills: { group: string; items: string[] }[];
  accent: string;
}) {
  return (
    <div className="mt-6 grid max-w-2xl gap-5 sm:grid-cols-2">
      {skills.map((g, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...SPRING_SNAPPY, delay: 0.4 + i * 0.08 }}
        >
          <p
            className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            {g.group}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {g.items.map((it) => (
              <span
                key={it}
                className="rounded-md border border-[var(--fg)]/12 bg-[rgb(var(--scrim))]/40 px-2.5 py-1 font-mono text-[11px] text-[var(--fg)]/80 backdrop-blur-sm"
              >
                {it}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Section({ chapter, index }: { chapter: Chapter; index: number }) {
  const light = useScene((s) => s.theme === "light");
  const accent = light ? CHAPTER_ACCENT_LIGHT[index] : CHAPTER_ACCENT[index];
  const isHero = index === 0;

  // ── CENTER sections: hero, approach, record, contact ──
  if (chapter.kind === "center") {
    const isContact = chapter.id === "contact";
    return (
      <section
        className={`relative flex min-h-[100svh] justify-center overflow-hidden px-6 sm:px-12 ${
          isContact ? "items-end pb-[8vh]" : "items-center"
        }`}
      >
        {isContact && <div aria-hidden className={`${SCRIM} h-[58%]`} />}
        {!isContact && (
          // soft paper halo lifts the centered text/code off the dark ink form
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 52% at 50% 50%, rgba(var(--scrim),0.68) 0%, rgba(var(--scrim),0.36) 42%, transparent 72%)",
            }}
          />
        )}
        <div className="relative z-[1] max-w-4xl text-center">
          {isHero && chapter.portrait && (
            <motion.img
              src={chapter.portrait}
              alt="Yusuf Rahman"
              width={112}
              height={112}
              className="mx-auto mb-6 h-24 w-24 rounded-full object-cover shadow-xl ring-1 ring-[var(--fg)]/25 sm:h-28 sm:w-28"
              style={{ objectPosition: "center 22%" }}
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.15 }}
            />
          )}
          {chapter.eyebrow && <Eyebrow label={chapter.eyebrow} accent={accent} />}
          <Headline lines={chapter.lines} isHero={isHero} center />

          {isHero && chapter.role && (
            <motion.p
              className="mt-3 font-mono text-[12px] uppercase tracking-[0.4em] text-[var(--fg)]/70 text-readable-subtle sm:text-[13px]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.5 }}
            >
              {chapter.role}
            </motion.p>
          )}

          {/* sub line - for non-hero centers shows directly under the headline */}
          {chapter.sub && !isHero && (
            <motion.p
              className={`mx-auto max-w-lg font-display text-readable ${
                isContact ? "text-base sm:text-xl" : "text-base italic sm:text-lg"
              }`}
              style={{ color: isContact ? "var(--fg)" : accent }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: 0.45 }}
            >
              {chapter.sub}
            </motion.p>
          )}

          {chapter.body && (
            <motion.p
              className="mx-auto mt-5 max-w-xl text-[14px] leading-relaxed text-readable-subtle text-[var(--fg)]/75 sm:text-[15px]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: 0.5 }}
            >
              {chapter.body}
            </motion.p>
          )}

          {chapter.code && <CodeCard code={chapter.code} accent={accent} />}
          {chapter.stats && <Stats stats={chapter.stats} accent={accent} />}

          {isContact && chapter.links && (
            <motion.div
              className="mt-9 flex justify-center gap-10 text-readable-subtle sm:gap-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: 0.7 }}
            >
              {chapter.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group relative font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--fg)]/75 transition-colors duration-500 hover:text-[var(--fg)] sm:text-[13px]"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {link.text}
                  <span
                    className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-500 group-hover:w-full"
                    style={{ background: accent }}
                  />
                </a>
              ))}
            </motion.div>
          )}
          {isContact && chapter.note && (
            <motion.p
              className="mt-7 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--fg)]/40"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: 0.9 }}
            >
              {chapter.note}
            </motion.p>
          )}
        </div>

        {isHero && (
          <motion.div
            className="absolute inset-x-0 bottom-8 z-[1] flex flex-col items-center gap-6 px-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 1.4 }}
          >
            {chapter.sub && (
              <p className="max-w-sm text-balance text-center font-display text-base text-[var(--fg)]/85 text-readable sm:max-w-xl sm:text-xl">
                {chapter.sub}
              </p>
            )}
            <ScrollCue />
          </motion.div>
        )}
      </section>
    );
  }

  // ── LEFT sections: experience, toolbelt ──
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      <div aria-hidden className={`${SCRIM} h-[92%]`} />
      <div className="relative z-[1] w-full max-w-4xl px-6 pb-16 sm:px-10 sm:pb-20 lg:px-[9%] lg:pb-24">
        {chapter.eyebrow && <Eyebrow label={chapter.eyebrow} accent={accent} left />}
        <Headline lines={chapter.lines} isHero={false} center={false} />

        {chapter.sub && (
          <motion.p
            className="mb-1 max-w-xl font-display text-[15px] italic text-readable-subtle sm:text-base"
            style={{ color: accent }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.35 }}
          >
            {chapter.sub}
          </motion.p>
        )}

        {chapter.roles && (
          <div className="mt-6 grid max-w-4xl gap-x-10 gap-y-6 sm:grid-cols-2">
            {chapter.roles.map((role, i) => (
              <RoleCard key={role.company} role={role} accent={accent} delay={0.4 + i * 0.08} />
            ))}
          </div>
        )}

        {chapter.skills && <Skills skills={chapter.skills} accent={accent} />}

        {chapter.persona && (
          <div className="mt-6 grid max-w-4xl items-center gap-6 lg:grid-cols-2 lg:gap-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              {chapter.portrait && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={chapter.portrait}
                  alt="Yusuf Rahman"
                  loading="lazy"
                  width={104}
                  height={104}
                  className="h-20 w-20 shrink-0 rounded-full object-cover shadow-lg ring-1 ring-[var(--fg)]/20 sm:h-24 sm:w-24"
                  style={{ objectPosition: "center 22%" }}
                />
              )}
              <ul className="space-y-2">
                {chapter.persona.map((p, i) => (
                  <motion.li
                    key={i}
                    className="flex gap-2.5 text-[13px] leading-relaxed text-readable-subtle text-[var(--fg)]/85 sm:text-[13.5px]"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...SPRING_SNAPPY, delay: 0.4 + i * 0.07 }}
                  >
                    <span className="shrink-0" style={{ color: accent }}>
                      ▸
                    </span>
                    <span>{p}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            {chapter.photo && (
              <motion.figure
                className="w-full max-w-md overflow-hidden rounded-2xl shadow-xl ring-1 ring-[var(--fg)]/12 lg:max-w-none"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, delay: 0.5 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={chapter.photo.src}
                  alt={chapter.photo.alt}
                  loading="lazy"
                  width={1000}
                  height={721}
                  className="block max-h-[42vh] w-full object-cover lg:max-h-[48vh]"
                />
                {chapter.photo.caption && (
                  <figcaption className="bg-[rgb(var(--scrim))]/75 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg)]/60 backdrop-blur">
                    {chapter.photo.caption}
                  </figcaption>
                )}
              </motion.figure>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export function Overlay() {
  return (
    <main className="relative z-10">
      {CHAPTERS.map((chapter, i) => (
        <Section key={chapter.id} chapter={chapter} index={i} />
      ))}
    </main>
  );
}
