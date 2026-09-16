import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Prices",
  description: "Class pricing and membership options.",
};

interface Plan {
  name: string;
  price: string;
  period: string;
  featured: boolean;
  badge?: string;
  features: string[];
}

const PLANS: Plan[] = [
  {
    name: "One Weekly Class",
    price: "£40",
    period: "Per Month",
    featured: false,
    features: ["One fixed class per week*", "Access to subscriber resources", "Access to WhatsApp groups"],
  },
  {
    name: "Unlimited Weekly Classes",
    price: "£55",
    period: "Per Month",
    featured: true,
    badge: "Most Popular",
    features: ["Unlimited access to classes**", "Access to subscriber resources", "Access to WhatsApp groups"],
  },
  {
    name: "Personalised",
    price: "£80",
    period: "Per Month",
    featured: false,
    features: [
      "One private lesson a month***",
      "Unlimited access to classes**",
      "Access to subscriber resources",
      "Access to WhatsApp groups",
    ],
  },
];

const FAQS = [
  {
    question: "Is there a minimum contract length?",
    answer: "[Placeholder answer.]",
  },
  {
    question: "How do I pay?",
    answer: "[Placeholder — e.g. monthly by GoCardless direct debit.]",
  },
  {
    question: "Can I pause or cancel my membership?",
    answer: "[Placeholder — leave allowance and cancellation policy.]",
  },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="inline h-4 w-4 -translate-y-0.5">
      <path d="M4 10l4 4 8-8" />
    </svg>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`overflow-hidden rounded-lg ${
        plan.featured ? "border-2 border-[#5e703a] shadow-lg sm:-my-4" : "border border-black/10"
      }`}
    >
      <div className={`px-6 py-6 text-center ${plan.featured ? "bg-[#5e703a] text-white" : "bg-zinc-100"}`}>
        <h2 className="text-lg font-bold">{plan.name}</h2>
        {plan.badge && <p className="mt-1 text-xs font-semibold uppercase tracking-wide">{plan.badge}</p>}
      </div>
      <div className="bg-white px-6 py-6 text-center">
        <p className="text-3xl font-bold">{plan.price}</p>
        <p className="mt-1 text-sm text-zinc-500">{plan.period}</p>
      </div>
      <ul>
        {plan.features.map((feature, index) => (
          <li
            key={feature}
            className={`px-6 py-4 text-center text-sm text-zinc-600 ${index % 2 === 0 ? "bg-zinc-50" : "bg-white"}`}
          >
            <CheckIcon /> {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PricesPage() {
  return (
    <>
      <PageHero
        title="Bamboo Forest Pricing"
        subtitle="Pricing and terms and conditions for our offering at Bamboo Forest Martial Arts. Our pricing structure encourages students to train more and the flexibility helps students train when they can regardless of work, shifts and caring duties."
      />
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Link
          href="/contact"
          className="mt-4 inline-block rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Contact us
        </Link>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        <div className="mt-8 space-y-4 text-sm text-zinc-600">
          <p>
            * One fixed class per week — will get you one fixed class a week,
            so Thursday evening Improvers, or Push Hands, or Friday
            Improvers, and it doesn&apos;t move on a regular basis, though I
            can be flexible if you give me notice.
          </p>
          <p>
            ** Unlimited access to classes — will give you unlimited access
            to open classes (not courses, seminars, or private lessons). So
            you could do both the Thursday and Friday Improvers, the
            Thursday Improvers and Push Hands class, the Thursday classes
            and the Saturday Applied classes, etc. If you&apos;re on
            holiday, you could go big for a couple of weeks and then go
            away — the flexibility is yours to do with as you will.
          </p>
          <p>
            *** One inclusive monthly private lesson — these are only
            available in the daytime, ideally Wednesday and Thursday
            mornings, but if this is something you really want to do but
            can&apos;t make those times, message me and we&apos;ll see what
            we can fit in. Students who have regular private lessons find
            them very valuable for their learning and skill development.
            This represents a £5 discount over regular private lessons, and
            you&apos;ll get priority.
          </p>
        </div>

        <h2 className="mt-12 text-xl font-semibold">Additional Terms and Conditions</h2>
        <div className="mt-2 space-y-4 text-sm text-zinc-600">
          <p>
            The annualised monthly payments include 5 weeks a year leave.
            This will cover annual leave, potentially the Christmas break
            depending how it falls, and also sickness.
          </p>
          <p>
            In terms of your holiday etc, if you&apos;re paying the higher
            rate and able to take advantage of the flexibility, you could
            always use that to put in some extra training around your
            break. Whichever rate you&apos;re paying, you&apos;re paying
            for the space at the class, not attendance at the class.
          </p>
          <p>
            If you have a non-discretionary issue, serious illness,
            financial difficulty, or something similar, then let&apos;s
            have a conversation. These things lie beyond the scope of
            terms and conditions.
          </p>
        </div>

        <h2 className="mt-12 text-xl font-semibold">FAQ</h2>
        <div className="mt-4 divide-y divide-black/10">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group py-4">
              <summary className="cursor-pointer list-none font-medium marker:content-none hover:opacity-70">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm text-zinc-600">{faq.answer}</p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-sm text-zinc-500">
          Online booking and payment are coming soon — for now, get in touch via
          the contact page to book a class.
        </p>
      </section>
    </>
  );
}
