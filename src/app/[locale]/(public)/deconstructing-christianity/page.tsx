import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, Heart, Waypoints } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { PillarCta } from "@/components/pillar-cta";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DECONSTRUCTING_CHRISTIANITY_DESCRIPTION,
  DECONSTRUCTING_CHRISTIANITY_FAQS,
  DECONSTRUCTING_CHRISTIANITY_MODIFIED_AT,
  DECONSTRUCTING_CHRISTIANITY_PATH,
  DECONSTRUCTING_CHRISTIANITY_PUBLISHED_AT,
  DECONSTRUCTING_CHRISTIANITY_SECTIONS,
  DECONSTRUCTING_CHRISTIANITY_SEO_TITLE,
  DECONSTRUCTING_CHRISTIANITY_TITLE,
} from "@/lib/deconstructing-christianity";
import { indexableRobots, singleLocaleAlternates } from "@/lib/seo";
import { fullUrl, localizedHref, ogImageUrl } from "@/lib/url";
import { organizationRef, personRef } from "@/lib/schema-entities";

const PAGE_URL = fullUrl("en", DECONSTRUCTING_CHRISTIANITY_PATH);
const ABOUT_URL = fullUrl("en", "/about");
const PUBLISHED_DATE = new Date(
  `${DECONSTRUCTING_CHRISTIANITY_PUBLISHED_AT}T12:00:00.000Z`,
);
const MODIFIED_DATE = new Date(
  `${DECONSTRUCTING_CHRISTIANITY_MODIFIED_AT}T12:00:00.000Z`,
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (locale !== "en") {
    return {
      title: "Page not available in Spanish | Ashley Leon",
      robots: { index: false, follow: false },
    };
  }

  const image = ogImageUrl("en");

  return {
    title: DECONSTRUCTING_CHRISTIANITY_SEO_TITLE,
    description: DECONSTRUCTING_CHRISTIANITY_DESCRIPTION,
    authors: [{ name: "Ashley Leon", url: ABOUT_URL }],
    creator: "Ashley Leon",
    publisher: "Ashley Leon",
    robots: indexableRobots,
    alternates: singleLocaleAlternates(
      "en",
      DECONSTRUCTING_CHRISTIANITY_PATH,
    ),
    openGraph: {
      type: "article",
      locale: "en_US",
      siteName: "Ashley Leon",
      url: PAGE_URL,
      title: DECONSTRUCTING_CHRISTIANITY_SEO_TITLE,
      description: DECONSTRUCTING_CHRISTIANITY_DESCRIPTION,
      publishedTime: PUBLISHED_DATE.toISOString(),
      modifiedTime: MODIFIED_DATE.toISOString(),
      authors: [ABOUT_URL],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Ashley Leon — a guide to deconstructing Christianity",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: DECONSTRUCTING_CHRISTIANITY_SEO_TITLE,
      description: DECONSTRUCTING_CHRISTIANITY_DESCRIPTION,
      images: [image],
    },
  };
}

export default async function DeconstructingChristianityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${PAGE_URL}#article`,
    headline: DECONSTRUCTING_CHRISTIANITY_TITLE,
    description: DECONSTRUCTING_CHRISTIANITY_DESCRIPTION,
    image: {
      "@type": "ImageObject",
      url: ogImageUrl("en"),
      width: 1200,
      height: 630,
    },
    url: PAGE_URL,
    inLanguage: "en-US",
    datePublished: PUBLISHED_DATE.toISOString(),
    dateModified: MODIFIED_DATE.toISOString(),
    author: personRef,
    publisher: organizationRef,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": PAGE_URL,
    },
    about: [
      { "@type": "Thing", name: "Christian deconstruction" },
      { "@type": "Thing", name: "Faith deconstruction" },
      { "@type": "Thing", name: "Religious deconstruction" },
      {
        "@type": "DefinedTerm",
        name: "The In-Between",
        description:
          "The conviction that the false binary is the wound — not either side of it.",
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: fullUrl("en", "/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Deconstructing Christianity",
        item: PAGE_URL,
      },
    ],
  };

  return (
    <main className="bg-background text-foreground">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <section className="relative isolate overflow-hidden border-b border-border bg-paper">
        <div
          aria-hidden="true"
          className="absolute -right-28 -top-36 h-[34rem] w-[34rem] rounded-full border border-primary/15"
        />
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-20 h-[24rem] w-[24rem] rounded-full border border-primary/20"
        />
        <div
          aria-hidden="true"
          className="absolute right-16 top-8 h-[14rem] w-[14rem] rounded-full bg-primary/[0.06]"
        />

        <div className="relative mx-auto max-w-[88rem] px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10 md:px-8 lg:px-12 lg:pb-24">
          <Breadcrumb>
            <BreadcrumbList className="font-[family-name:var(--font-lora)] text-xs uppercase tracking-[0.12em]">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={localizedHref("en", "/")}>Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Deconstructing Christianity</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-14 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-12 lg:items-end lg:gap-14">
            <div className="lg:col-span-8">
              <p className="editorial-eyebrow text-primary">
                A compassionate guide to faith deconstruction
              </p>
              <h1 className="mt-6 max-w-[15ch] font-[family-name:var(--font-cormorant-garamond)] text-[clamp(3rem,7.6vw,6.6rem)] font-light leading-[0.92] tracking-[-0.035em] text-balance">
                Deconstructing Christianity:
                <span className="mt-2 block italic text-primary">
                  What It Means and What Comes Next
                </span>
              </h1>
              <div className="mt-9 max-w-3xl border-l border-primary pl-5 sm:pl-7">
                <p className="font-[family-name:var(--font-lora)] text-lg leading-8 text-foreground/85 sm:text-xl sm:leading-9">
                  Deconstructing Christianity is the process of honestly
                  examining the beliefs, teachings, and structures you inherited
                  — asking what still feels true, what needs to be reinterpreted,
                  and what may need to be released. There is no single correct
                  ending. You might stay. You might rebuild something different.
                  You might walk away. Wherever you land, the process itself can
                  be sacred.
                </p>
              </div>
              <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2 font-[family-name:var(--font-lora)] text-sm text-muted-foreground">
                <span>
                  By{" "}
                  <Link
                    href={localizedHref("en", "/about")}
                    rel="author"
                    className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Ashley Leon
                  </Link>
                </span>
                <span aria-hidden="true">·</span>
                <time dateTime={DECONSTRUCTING_CHRISTIANITY_PUBLISHED_AT}>
                  July 13, 2026
                </time>
                <span aria-hidden="true">·</span>
                <span>Evergreen guide</span>
              </div>
            </div>

            <aside className="relative border-t border-border pt-7 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0">
              <Waypoints
                aria-hidden="true"
                className="h-9 w-9 text-primary"
                strokeWidth={1.25}
              />
              <p className="mt-5 font-[family-name:var(--font-cormorant-garamond)] text-2xl font-light italic leading-snug">
                A guide for questioning without being told where your questions
                must lead.
              </p>
              <p className="mt-4 font-[family-name:var(--font-lora)] text-sm leading-6 text-muted-foreground">
                This page offers education and reflection, not a diagnosis,
                theological verdict, or substitute for professional care.
              </p>
              <a
                href="#meaning"
                className="mt-7 inline-flex min-h-11 items-center gap-2 font-[family-name:var(--font-lora)] text-xs font-semibold uppercase tracking-[0.18em] text-primary underline decoration-primary/35 underline-offset-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Begin the guide
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
            </aside>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[88rem] grid-cols-1 gap-12 px-4 py-16 sm:px-6 md:px-8 lg:grid-cols-[14rem_minmax(0,48rem)] lg:gap-16 lg:px-12 lg:py-24 xl:gap-24">
        <aside className="hidden lg:block">
          <nav
            aria-label="On this page"
            className="sticky top-28 border-l border-border pl-6"
          >
            <p className="editorial-eyebrow-strong">In this guide</p>
            <ol className="mt-6 space-y-4">
              {DECONSTRUCTING_CHRISTIANITY_SECTIONS.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="group flex gap-3 font-[family-name:var(--font-lora)] text-sm leading-5 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span
                      aria-hidden="true"
                      className="font-[family-name:var(--font-cormorant-garamond)] italic text-primary/70"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{section.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="min-w-0">
          <p className="font-[family-name:var(--font-lora)] text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
            People often arrive at deconstruction looking for a definition and
            discover they are also looking for permission: permission to ask a
            question without rushing to an answer, to name harm without reducing
            an entire life to harm, and to change without deciding immediately
            what the change will be called. This guide offers language for that
            process while leaving the direction of it in your hands.
          </p>

          <section
            id="meaning"
            aria-labelledby="meaning-heading"
            className="scroll-mt-28 border-t border-border pt-14 mt-16"
          >
            <SectionHeading number="01" id="meaning-heading">
              What does deconstructing Christianity mean?
            </SectionHeading>
            <Answer>
              Christian deconstruction is the primary lens of this guide. It
              focuses specifically on beliefs, authority structures, and
              practices inherited within Christianity. Faith deconstruction and
              religious deconstruction are broader terms for a similar pattern
              of honest examination across faith traditions.
            </Answer>
            <Body>
              To deconstruct is to examine rather than automatically accept or
              automatically reject. It can involve asking where a belief came
              from, how it has been interpreted, who benefits from it, how it
              affects real lives, and whether it still aligns with conscience,
              experience, love, or justice.
            </Body>
            <Body>
              People use the language differently, so these are helpful working
              distinctions rather than rigid categories:
            </Body>
            <dl className="mt-8 divide-y divide-border border-y border-border">
              <DefinitionRow term="Faith deconstruction">
                A broader term for examining beliefs, spiritual practices, and
                sources of authority inherited through a faith tradition.
              </DefinitionRow>
              <DefinitionRow term="Religious deconstruction">
                Another broad term that can include religious institutions,
                systems, culture, and belonging—not only personal belief.
              </DefinitionRow>
              <DefinitionRow term="Christian deconstruction">
                The specific focus here, grounded in Ashley&apos;s lived
                experience. It may examine scripture, doctrine, leadership,
                community, or practice without assuming that every part will be
                discarded.
              </DefinitionRow>
            </dl>
            <Body>
              These terms overlap, but they are not interchangeable without
              distinction. This page stays centered on Christian deconstruction,
              where Ashley&apos;s own story and credibility are rooted, while
              acknowledging that people from other traditions may experience a
              structurally similar process. None of the phrases is a clinical
              label: the process can be intellectual, emotional, spiritual,
              relational, and embodied—often more than one at once.
            </Body>
          </section>

          <section
            id="why"
            aria-labelledby="why-heading"
            className="scroll-mt-28 border-t border-border pt-14 mt-16"
          >
            <SectionHeading number="02" id="why-heading">
              Why do people deconstruct their faith?
            </SectionHeading>
            <Answer>
              People may begin deconstructing when inherited teachings no longer
              align with lived experience, conscience, identity, evidence, or
              their understanding of love and justice. For some, religious harm
              is part of the story; for others, the process begins with
              questions, change, or a need for greater integrity.
            </Answer>
            <Body>
              There is no single event a person must experience before their
              questions count. Deconstruction may begin slowly—with a teaching
              that no longer makes sense—or suddenly, after a rupture in trust.
              Three tensions are especially central to Ashley&apos;s work:
            </Body>
            <div className="mt-8 border-y border-border">
              {[
                {
                  title: "Institutional control beneath unconditional language",
                  description:
                    "Seeing the gap between the language of unconditional love and the lived reality of conditions, obedience, and hierarchy—sometimes while still inside the institution.",
                },
                {
                  title: "Being told identity disqualifies belonging",
                  description:
                    "Experiencing love, spiritual investment, blessing, or protection as conditional because of sexuality, gender, identity, or another part of oneself.",
                },
                {
                  title: "The material and spiritual false binary",
                  description:
                    "Being taught that caring about money, stability, the body, or an actual human life is somehow less spiritual—and discovering that forced split was never the point.",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="grid gap-2 border-b border-border py-6 last:border-b-0 sm:grid-cols-[2.5rem_13rem_1fr] sm:gap-4"
                >
                  <span
                    aria-hidden="true"
                    className="font-[family-name:var(--font-cormorant-garamond)] text-xl italic text-primary"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-[family-name:var(--font-cormorant-garamond)] text-xl font-medium leading-tight">
                    {item.title}
                  </h3>
                  <p className="font-[family-name:var(--font-lora)] text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            <blockquote className="my-10 border-l border-primary pl-6 font-[family-name:var(--font-cormorant-garamond)] text-2xl font-light italic leading-snug text-foreground sm:text-3xl">
              “I remember telling someone I trusted — someone discipling me —
              that I’d fallen in love with a woman. Her response has stayed with
              me for over a decade: that God would still love me, but I would no
              longer be blessed. That I was no longer under God’s protection.
              That there was no longer a point investing in me spiritually if I
              was going to be “disobedient” in this one area. I was nineteen. I
              believed her, because a conditional God was the only God I’d ever
              been introduced to.”
              <footer className="mt-5 font-[family-name:var(--font-lora)] text-xs not-italic uppercase tracking-[0.18em] text-muted-foreground">
                Ashley Leon · a moment from her own deconstruction
              </footer>
            </blockquote>
            <Body>
              This moment is one reason the focus here is Christian
              deconstruction rather than a generalized account of every faith
              tradition. It shows how questions can begin in the gap between
              unconditional love as an ideal and conditional belonging as a
              lived reality.
            </Body>
          </section>

          <section
            id="in-between"
            aria-labelledby="in-between-heading"
            className="scroll-mt-28 mt-16 bg-book px-6 py-12 sm:px-10 sm:py-14"
          >
            <SectionHeading number="03" id="in-between-heading">
              The In-Between: the false binary is the wound
            </SectionHeading>
            <Answer>
              The In-Between names the conviction that the false binary itself
              is the wound — not either side of it. Most people are taught they
              must choose: stay devout or leave entirely, be spiritual or be
              practical, be gay or be godly, be certain or be lost. The
              In-Between is the belief that this forced choosing is the injury,
              and that healing means learning to live undivided in the tension,
              rather than collapsing into either extreme.
            </Answer>
            <blockquote className="my-10 border-l border-primary pl-6 font-[family-name:var(--font-cormorant-garamond)] text-3xl font-light italic leading-tight text-foreground sm:text-4xl">
              “The conviction that the false binary is the wound — not either
              side of it.”
              <footer className="mt-5 font-[family-name:var(--font-lora)] text-xs not-italic uppercase tracking-[0.18em] text-muted-foreground">
                Ashley Leon · The In-Between
              </footer>
            </blockquote>
            <Body>
              Primarily, The In-Between is a framework and teaching lens—the
              intellectual and spiritual core of Ashley&apos;s writing and
              teaching. It is also the name of her free community, where people
              can practice living this out together.
            </Body>
            <Body>
              It is not a compromise position or “meeting in the middle.” A
              person can hold real convictions inside the tension: Ashley does
              not believe sexuality separates someone from God, and she does not
              believe love should ever be transactional. The In-Between is about
              refusing false binaries, not refusing to have convictions.
            </Body>
          </section>

          <section
            id="experience"
            aria-labelledby="experience-heading"
            className="scroll-mt-28 border-t border-border pt-14 mt-16"
          >
            <SectionHeading number="04" id="experience-heading">
              What can faith deconstruction feel like?
            </SectionHeading>
            <Answer>
              Faith deconstruction can involve grief—including grief for the
              life imagined or relationships expected to last—alongside relief,
              disorientation, anger, loneliness, and guilt for still caring
              about ordinary needs such as stability, money, or the body. More
              than one feeling can be true at once.
            </Answer>
            <Body>
              A belief system can hold more than ideas. It can hold family
              history, holidays, music, friendship, vocation, language, and a
              picture of who you are. Examining it may therefore feel less like
              changing an opinion and more like renegotiating an entire world.
            </Body>
            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              <ExperienceCard
                icon={<Heart aria-hidden="true" className="h-6 w-6" />}
                title="Emotionally"
                items={[
                  "Grief can include things that never fully happened",
                  "Relief, disorientation, and anger may coexist",
                  "The body may carry feelings before words arrive",
                ]}
              />
              <ExperienceCard
                icon={<Waypoints aria-hidden="true" className="h-6 w-6" />}
                title="Relationally"
                items={[
                  "Family or friendships may feel newly complicated",
                  "A person may feel they belong nowhere",
                  "That shame can exist even without active rejection",
                ]}
              />
            </div>
            <blockquote className="my-10 border-l border-primary pl-6 font-[family-name:var(--font-cormorant-garamond)] text-2xl font-light italic leading-snug text-foreground sm:text-3xl">
              “It’s okay to grieve something that didn’t happen. You can grieve
              the story your mind thought was going to unfold. Sometimes the
              moment I get quiet with myself, the tears just come — like my body
              has been waiting for me to feel it.”
              <footer className="mt-5 font-[family-name:var(--font-lora)] text-xs not-italic uppercase tracking-[0.18em] text-muted-foreground">
                Ashley Leon
              </footer>
            </blockquote>
            <Body>
              The shame of feeling like you do not belong anywhere deserves to
              be named directly, even when no one is actively rejecting you.
              These are possibilities, not stages: relief does not erase grief,
              missing a community does not decide whether returning is right,
              and keeping a practice does not invalidate the questions that
              changed it.
            </Body>
          </section>

          <section
            id="leaving"
            aria-labelledby="leaving-heading"
            className="scroll-mt-28 border-t border-border pt-14 mt-16"
          >
            <SectionHeading number="05" id="leaving-heading">
              Does deconstruction always mean leaving Christianity?
            </SectionHeading>
            <Answer>
              No. Deconstruction is a process of examination, not a
              predetermined conclusion. Some people remain Christian with
              changed beliefs, some reconstruct a different spiritual life,
              some leave Christianity, and others stay in an unresolved or
              evolving middle.
            </Answer>
            <Body>
              One person may still use Christian language but relate to it in a
              new way. Another may keep ritual while releasing doctrine. Someone
              else may leave religion entirely. A person can also remain unsure
              for a long time without that uncertainty being a failure. Staying,
              rebuilding, walking away, and living without a final label are
              presented here with equal weight and equal respect; none is treated
              as the smarter or more evolved ending.
            </Body>
            <div className="mt-9 border-y border-border">
              {[
                ["Stay", "Continue identifying as Christian with changed beliefs or practices."],
                ["Rebuild", "Build a different relationship to spirituality, community, or the sacred."],
                ["Walk away", "Step away from Christianity or religion without needing to reject every part of the past."],
                ["Live in The In-Between", "Use no final label while beliefs, language, and belonging continue to evolve."],
              ].map(([title, description], index) => (
                <div
                  key={title}
                  className="grid gap-2 border-b border-border py-6 last:border-b-0 sm:grid-cols-[2.5rem_8rem_1fr] sm:gap-4"
                >
                  <span
                    aria-hidden="true"
                    className="font-[family-name:var(--font-cormorant-garamond)] text-xl italic text-primary"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-medium">
                    {title}
                  </h3>
                  <p className="font-[family-name:var(--font-lora)] text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
            <Body>
              Some people choose the self-description “deconstructed Christian.”
              Ashley does not use that label for herself; she describes her own
              position as living in The In-Between. The phrase can describe a
              process or be chosen as a personal identity, but it should not be
              assigned to someone or replace one fixed identity with another.
            </Body>
          </section>

          <section
            id="religious-harm"
            aria-labelledby="religious-harm-heading"
            className="scroll-mt-28 border-t border-border pt-14 mt-16"
          >
            <SectionHeading number="06" id="religious-harm-heading">
              Can religious harm be part of faith deconstruction?
            </SectionHeading>
            <Answer>
              Yes, religious harm can be part of deconstruction for some people,
              but it is not the only reason people question faith and it should
              not be assumed in every story. Harm may come from teachings,
              exclusion, coercion, spiritual authority, unsafe leadership, or
              pressure to abandon important parts of oneself.
            </Answer>
            <Body>
              Naming harm can clarify why certain beliefs or environments no
              longer feel safe. It can also be difficult when the same tradition
              carried beauty, relationship, or meaning. Both realities can be
              true without canceling each other out.
            </Body>
            <div className="mt-8 border-l-2 border-accent bg-accent/[0.08] px-6 py-6">
              <p className="font-[family-name:var(--font-lora)] text-sm leading-7 text-foreground/80">
                A guide, community, or workbook can support reflection, but none
                can diagnose or treat trauma. If distress is affecting your
                safety or daily life, consider seeking a qualified professional
                whose care respects your identity, agency, and spiritual
                boundaries.
              </p>
            </div>
          </section>

          <section
            id="next"
            aria-labelledby="next-heading"
            className="scroll-mt-28 border-t border-border pt-14 mt-16"
          >
            <SectionHeading number="07" id="next-heading">
              What may come next after faith deconstruction?
            </SectionHeading>
            <Answer>
              There is no universal timeline or correct next step after faith
              deconstruction. A helpful next move may be to slow down, name what
              feels true, set boundaries, explore reflective practices, find
              safer community, or seek qualified professional support when
              distress or trauma is present.
            </Answer>
            <ol className="mt-9 space-y-0 border-y border-border">
              <NextStep
                number="01"
                title="Release the deadline"
                description="You do not have to resolve your theology, identity, relationships, and future at the same time. Let the next honest question be enough."
              />
              <NextStep
                number="02"
                title="Name what is true now"
                description="Write down what you know, what you no longer believe, what you miss, and what remains uncertain. Temporary language is still useful language."
              />
              <NextStep
                number="03"
                title="Create boundaries that protect attention"
                description="Decide which conversations feel constructive, which environments feel safe, and what you are not available to defend or explain."
              />
              <NextStep
                number="04"
                title="Choose reflection without forcing an outcome"
                description="Journaling, reading, rest, ritual, movement, or conversation can help you listen for your own values rather than reproduce someone else's answer."
              />
              <NextStep
                number="05"
                title="Find support that respects your agency"
                description="Look for friends, community, facilitators, or qualified professionals who can stay present without deciding the destination for you."
              />
            </ol>
            <Body>
              Ashley&apos;s essay{" "}
              <Link
                href={localizedHref(
                  "en",
                  "/writing/deconstruction-and-beyond-a-story-of-loss-and-rebirth",
                )}
                className="text-foreground underline decoration-primary/45 underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                “Deconstruction and Beyond: A Story of Loss and Rebirth”
              </Link>{" "}
              offers a more personal reflection on what rebuilding can look like
              when it is allowed to be honest and unfinished.
            </Body>
          </section>

          <PillarCta
            kind="workbook"
            placement="after-next-steps"
            href={localizedHref("en", "/workbooks/rebuilding-reverence")}
            eyebrow="A reflective next step"
            title="Explore what remains meaningful—without rushing toward a conclusion."
            description="If you want a companion for exploring what still feels meaningful — without rushing toward an answer — Rebuilding Reverence offers reflective prompts for listening to yourself, naming what’s true, and moving forward with intention, whatever that ends up looking like for you."
            label="Explore Rebuilding Reverence"
            className="mt-16"
          />

          <section
            id="faq"
            aria-labelledby="faq-heading"
            className="scroll-mt-28 border-t border-border pt-14 mt-16"
          >
            <SectionHeading number="08" id="faq-heading">
              Questions people ask about deconstructing Christianity
            </SectionHeading>
            <p className="mt-6 font-[family-name:var(--font-lora)] text-base leading-7 text-muted-foreground">
              Short answers to common questions, with room for each person&apos;s
              experience to remain more complex than a definition.
            </p>
            <div className="mt-9 divide-y divide-border border-y border-border">
              {DECONSTRUCTING_CHRISTIANITY_FAQS.map((faq, index) => (
                <details key={faq.question} className="group">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 font-[family-name:var(--font-cormorant-garamond)] text-xl font-medium leading-tight marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden sm:text-2xl">
                    <span className="flex items-baseline gap-4">
                      <span
                        aria-hidden="true"
                        className="font-light italic text-primary/75"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-2xl font-light text-primary transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-6 pl-10 pr-8 font-[family-name:var(--font-lora)] text-base leading-7 text-muted-foreground">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="author-heading"
            className="mt-16 grid gap-7 border-y border-border py-9 sm:grid-cols-[8rem_1fr] sm:items-center"
          >
            <Image
              src="/profile4.jpeg"
              alt="Ashley Leon"
              width={240}
              height={300}
              sizes="128px"
              className="aspect-[4/5] w-32 object-cover object-[center_60%]"
            />
            <div>
              <p className="editorial-eyebrow text-primary">About the author</p>
              <h2
                id="author-heading"
                className="mt-3 font-[family-name:var(--font-cormorant-garamond)] text-3xl font-light"
              >
                Ashley Leon
              </h2>
              <p className="mt-3 font-[family-name:var(--font-lora)] text-sm leading-7 text-muted-foreground">
                Ashley is a writer, workshop facilitator, and certified holistic
                mind-body coach working at the intersection of faith
                deconstruction, queer spirituality, and emotional healing. Her
                work is affirming, non-doctrinal, and coaching-based—not therapy.
              </p>
              <Link
                href={localizedHref("en", "/about")}
                className="editorial-link mt-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                More about Ashley
                <span className="editorial-link-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </section>

          <PillarCta
            kind="community"
            placement="article-footer"
            href={localizedHref("en", "/community")}
            eyebrow="You do not have to name it alone"
            title="Practice living undivided in the tension—with company."
            description="The In-Between is a free community for practicing the conviction that the false choice itself is the wound. It offers honest reflection, real conversation, and belonging without a required conclusion."
            label="Join The In-Between"
            className="mt-16"
          />
        </article>
      </div>
    </main>
  );
}

function SectionHeading({
  number,
  id,
  children,
}: {
  number: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[2.5rem_1fr] gap-3 sm:grid-cols-[3.5rem_1fr] sm:gap-5">
      <span
        aria-hidden="true"
        className="pt-1 font-[family-name:var(--font-cormorant-garamond)] text-xl font-light italic text-primary"
      >
        {number}
      </span>
      <h2
        id={id}
        className="font-[family-name:var(--font-cormorant-garamond)] text-[clamp(2rem,5vw,3.25rem)] font-light leading-[1.02] tracking-[-0.02em] text-balance"
      >
        {children}
      </h2>
    </div>
  );
}

function Answer({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-7 font-[family-name:var(--font-lora)] text-lg font-medium leading-8 text-foreground sm:text-xl sm:leading-9">
      {children}
    </p>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 font-[family-name:var(--font-lora)] text-base leading-8 text-muted-foreground">
      {children}
    </p>
  );
}

function DefinitionRow({
  term,
  children,
}: {
  term: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 py-6 sm:grid-cols-[11rem_1fr] sm:gap-6">
      <dt className="font-[family-name:var(--font-cormorant-garamond)] text-xl font-medium text-foreground">
        {term}
      </dt>
      <dd className="font-[family-name:var(--font-lora)] text-sm leading-7 text-muted-foreground">
        {children}
      </dd>
    </div>
  );
}

function ExperienceCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="border border-border bg-paper p-6">
      <div className="text-primary">{icon}</div>
      <h3 className="mt-4 font-[family-name:var(--font-cormorant-garamond)] text-2xl font-medium">
        {title}
      </h3>
      <ul className="mt-4 space-y-3 font-[family-name:var(--font-lora)] text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden="true" className="text-primary">
              —
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NextStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <li className="grid gap-3 border-b border-border py-7 last:border-b-0 sm:grid-cols-[3rem_12rem_1fr] sm:gap-5">
      <span
        aria-hidden="true"
        className="font-[family-name:var(--font-cormorant-garamond)] text-xl italic text-primary"
      >
        {number}
      </span>
      <h3 className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-medium leading-tight">
        {title}
      </h3>
      <p className="font-[family-name:var(--font-lora)] text-sm leading-7 text-muted-foreground">
        {description}
      </p>
    </li>
  );
}
