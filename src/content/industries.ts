/**
 * Industry page content.
 *
 * Each page is written from that industry's actual operating reality: where
 * leads come from, what the follow-up window looks like, how appointments or
 * estimates are resourced, and why attribution breaks. No statistics, no
 * customer names, no regulatory or compliance claims — where rules apply, the
 * page says the operator must confirm them rather than asserting what they are.
 */
import type { Faq } from "@/components/qwa/content/content-page";

export type IndustrySlug = "dental" | "medspa" | "hvac" | "plumbing" | "solar";

export type IndustryContent = {
  slug: IndustrySlug;
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  h1: string;
  answer: string;
  support: string;
  leadSources: { heading: string; lede: string; items: { title: string; detail: string }[] };
  speed: { heading: string; lede: string; points: string[] };
  booking: { heading: string; lede: string; steps: { title: string; detail: string }[] };
  attribution: { heading: string; lede: string; points: string[] };
  modules: { heading: string; lede: string; items: { title: string; detail: string }[] };
  faqs: Faq[];
  related: { label: string; href: string; detail: string }[];
  cta: { title: string; lede: string; note: string };
};

export const industries: Record<IndustrySlug, IndustryContent> = {
  dental: {
    slug: "dental",
    navLabel: "Dental",
    eyebrow: "Industry · Dental practices",
    title: "AI for Dental Practices — Lead Response and Scheduling | QWA",
    description:
      "How QWA handles dental new-patient enquiries: instant response to calls and forms, insurance and treatment questions routed correctly, chair-time-aware scheduling, recall reactivation and attribution to production.",
    h1: "QWA for dental practices",
    answer:
      "For a dental practice, QWA answers every new-patient enquiry the moment it arrives — call, form, chat or ad lead — captures the treatment interest and scheduling constraints, books into real chair availability, and keeps recall and treatment-plan follow-up running as a system rather than as front-desk memory.",
    support:
      "The front desk is the bottleneck by design: the same people answering the phone are checking patients in, handling payments and chasing recalls. New-patient enquiries lose to whoever is physically standing at the counter.",
    leadSources: {
      heading: "Where dental enquiries actually come from",
      lede: "The channel mix decides where the leaks are, and in dental it is unusually phone-heavy.",
      items: [
        {
          title: "Phone calls during clinic hours",
          detail:
            "The highest-intent channel, and the one most likely to ring out while the desk is with a patient.",
        },
        {
          title: "After-hours and weekend calls",
          detail:
            "Pain-driven enquiries arrive when the practice is closed and reach voicemail, which most callers do not use.",
        },
        {
          title: "Website and treatment-page forms",
          detail:
            "Implant, orthodontic and cosmetic pages produce considered enquiries that expect a knowledgeable reply.",
        },
        {
          title: "Local search and map listings",
          detail:
            "Click-to-call from a listing lands as an unqualified call with no context unless the number is tracked.",
        },
        {
          title: "Paid search and social lead forms",
          detail:
            "Campaign-specific offers that need a fast, on-topic response before the patient contacts the next practice.",
        },
        {
          title: "Referrals and existing patients",
          detail:
            "Referred patients and treatment-plan follow-ups that need to be recognised, not treated as cold enquiries.",
        },
      ],
    },
    speed: {
      heading: "Speed to lead and follow-up in a clinical day",
      lede: "The operating constraint is that the people who answer enquiries are also delivering care.",
      points: [
        "Missed calls are triggered into an immediate text back on the same number, so a pain call does not become a call to the practice down the road.",
        "After-hours enquiries get a real conversation and a held or booked slot ready for the morning.",
        "Treatment-specific questions are answered at the level the practice authorises, and anything clinical is escalated to a person rather than guessed at.",
        "Follow-up on unconverted enquiries runs on a defined cadence instead of on whoever remembers.",
        "Existing patients are recognised by number and continue their record rather than opening a new one.",
        "Every enquiry, response time and outcome is recorded, including the ones that were never answered.",
      ],
    },
    booking: {
      heading: "From enquiry to a booked chair",
      lede: "Booking is only useful when the slot is genuinely available for that treatment with that provider.",
      steps: [
        {
          title: "Treatment interest captured",
          detail:
            "New patient or existing, treatment sought, urgency and any pain indication are captured in conversation.",
        },
        {
          title: "Administrative questions handled",
          detail:
            "Insurance, payment options and new-patient paperwork are addressed using only what the practice has approved in writing.",
        },
        {
          title: "Correct appointment type selected",
          detail:
            "Exam, hygiene, consultation or emergency each carry their own duration and provider requirement.",
        },
        {
          title: "Chair and provider availability read",
          detail:
            "Live availability is checked against the right operatory and clinician rather than a generic calendar.",
        },
        {
          title: "Appointment booked and confirmed",
          detail:
            "The slot is written to the practice system with the conversation and source attached, and confirmed immediately.",
        },
        {
          title: "Reminders and forms",
          detail:
            "Reminders run on the practice's cadence, with new-patient forms sent ahead of the visit where configured.",
        },
        {
          title: "No-show and cancellation handling",
          detail:
            "A missed or cancelled appointment triggers a defined rebooking sequence, and the freed slot can be offered to a waitlist.",
        },
        {
          title: "Attendance written back",
          detail:
            "Kept, cancelled or no-show is recorded on the patient record so source quality is judged on attendance.",
        },
      ],
    },
    attribution: {
      heading: "Why dental marketing is hard to attribute",
      lede: "The join between spend and production breaks in specific, fixable places.",
      points: [
        "Most conversions happen on the phone, and untracked numbers sever the link to the campaign that produced the call.",
        "Practice management systems record production but rarely record where the patient came from.",
        "High-value treatment is often accepted weeks after the first visit, well outside a default attribution window.",
        "The same patient generates multiple appointments, so per-appointment reporting understates lifetime contribution.",
        "Referrals and word of mouth are genuinely unattributable and should be reported as such, not redistributed.",
        "Recall-driven visits get credited to acquisition campaigns unless reactivation is measured separately.",
      ],
    },
    modules: {
      heading: "Which QWA modules a practice uses",
      lede: "A practice typically starts with response and scheduling, then adds measurement.",
      items: [
        {
          title: "Voice + Conversations",
          detail:
            "Answers overflow and after-hours calls, handles routine questions and transfers clinical ones with context.",
        },
        {
          title: "Revenue Engine",
          detail:
            "Holds one record per patient across calls, forms, appointments and outcomes.",
        },
        {
          title: "Revenue Attribution",
          detail:
            "Joins tracked calls and campaigns to booked and attended treatment with stated coverage.",
        },
        {
          title: "Business Intelligence",
          detail:
            "Reports new-patient flow, attendance and source performance from the practice's own data.",
        },
      ],
    },
    faqs: [
      {
        question: "Can it answer clinical questions from patients?",
        answer:
          "No, and it should not. Clinical questions are escalated to a member of the practice with the conversation attached. The assistant handles scheduling, administrative and general practice information that the practice has approved.",
      },
      {
        question: "Does it work with our practice management system?",
        answer:
          "Availability and appointments are read from and written to your scheduling system through an adapter configured during setup. Which systems can be connected, and how deeply, is confirmed before any commitment.",
      },
      {
        question: "How does it handle emergency or pain calls?",
        answer:
          "Urgency is identified in the conversation and routed by the rules you define — immediate transfer during hours, or an emergency path and priority slot after hours.",
      },
      {
        question: "What about patient privacy and health information?",
        answer:
          "Data handling, consent, recording and retention must be configured to the rules that apply to your practice and jurisdiction. QWA supports the configuration; confirming the applicable requirements is the practice's decision, and we will not assert compliance on your behalf.",
      },
      {
        question: "Will it replace our front desk?",
        answer:
          "It removes the enquiries that do not need a person — routine questions, after-hours calls, overflow, reminders and rebooking — so the desk can be with patients. Escalations still reach your team.",
      },
      {
        question: "How do we know it produced new patients?",
        answer:
          "Enquiry, response time, booking, attendance and outcome are recorded on one record per patient, and campaign identifiers travel with them, so new-patient flow is read from your own data rather than from an estimate.",
      },
    ],
    related: [
      {
        label: "AI appointment setting",
        href: "/solutions/ai-appointment-setting",
        detail: "The booking mechanics behind chair-time-aware scheduling.",
      },
      {
        label: "AI voice agent",
        href: "/solutions/ai-voice-agent",
        detail: "Answer overflow and after-hours calls without voicemail.",
      },
      {
        label: "Customer reactivation",
        href: "/solutions/customer-reactivation",
        detail: "Recall and lapsed-patient outreach, measured separately.",
      },
    ],
    cta: {
      title: "See a new-patient enquiry handled end to end.",
      lede: "We take one real enquiry path — missed call to booked, attended appointment — and show where your practice loses it today.",
      note: "No sales sequence. A reply within one business day.",
    },
  },

  medspa: {
    slug: "medspa",
    navLabel: "Med spa",
    eyebrow: "Industry · Med spas and aesthetics",
    title: "AI for Med Spas — Consultation Booking and Follow-Up | QWA",
    description:
      "How QWA handles med spa enquiries: instant response to social and paid leads, treatment-specific qualification, consultation booking, package and membership follow-up, and attribution from ad spend to treatment revenue.",
    h1: "QWA for med spas and aesthetics",
    answer:
      "For a med spa, QWA answers treatment enquiries from social, paid and web the moment they land, qualifies the treatment interest and candidacy questions it is permitted to ask, books consultations into the right provider's calendar, and keeps package, membership and re-treatment follow-up running on a defined cadence.",
    support:
      "Aesthetics demand is discretionary and comparison-heavy. The buyer is usually messaging several clinics at once, often late at night, and the first substantive reply frequently decides who gets the consultation.",
    leadSources: {
      heading: "Where med spa enquiries come from",
      lede: "This is the most social-led mix of any industry QWA serves, and the least phone-led.",
      items: [
        {
          title: "Instagram and TikTok DMs",
          detail:
            "High-volume, informal, often after midnight, and easily lost between comments and content management.",
        },
        {
          title: "Paid social lead forms",
          detail:
            "Offer-driven leads that expect an immediate, treatment-specific reply while the ad is still in mind.",
        },
        {
          title: "Treatment page forms",
          detail:
            "Considered enquiries about a specific modality, where a generic reply reads as a downgrade.",
        },
        {
          title: "Local search and click-to-call",
          detail:
            "Ready-to-book callers who will simply call the next clinic if the phone is not answered.",
        },
        {
          title: "Referrals and existing clients",
          detail:
            "Returning clients enquiring about a new treatment who should be recognised, not requalified from scratch.",
        },
        {
          title: "Events and promotions",
          detail:
            "Time-boxed campaigns that generate a spike the front desk cannot absorb in real time.",
        },
      ],
    },
    speed: {
      heading: "Speed to lead when the buyer is comparing clinics",
      lede: "The window here is short and the competition is one message away.",
      points: [
        "DM and lead-form enquiries receive a substantive, treatment-specific reply within seconds, on the same channel.",
        "Late-night enquiries are handled at the time they arrive, which is when most aesthetics research happens.",
        "Pricing questions are answered only within the ranges the clinic authorises, or routed to consultation where policy requires it.",
        "Candidacy and medical questions are escalated to a qualified team member rather than answered by automation.",
        "Follow-up on unbooked consultations runs on a defined, capped cadence across the channel the client used.",
        "Every enquiry and its outcome is recorded per client, including which treatment was asked about.",
      ],
    },
    booking: {
      heading: "From enquiry to a booked consultation",
      lede: "Provider skill and room or device availability determine whether the slot is real.",
      steps: [
        {
          title: "Treatment interest captured",
          detail:
            "Which treatment, whether the client has had it before, and what outcome they are looking for.",
        },
        {
          title: "Permitted qualification",
          detail:
            "Only the non-clinical questions the clinic has approved are asked; anything medical is flagged for the provider.",
        },
        {
          title: "Consultation type selected",
          detail:
            "Virtual or in-person, and whether the treatment can be delivered on the same visit.",
        },
        {
          title: "Provider and device availability",
          detail:
            "Availability is read for the right injector, practitioner or device, with the correct duration.",
        },
        {
          title: "Consultation booked",
          detail:
            "The appointment is written with source, treatment interest and conversation history attached.",
        },
        {
          title: "Pre-care and confirmation",
          detail:
            "Confirmation and any pre-appointment guidance the clinic supplies are sent on the client's channel.",
        },
        {
          title: "Deposit or policy handling",
          detail:
            "Where the clinic requires a deposit or cancellation policy acknowledgement, it is surfaced before the slot is held.",
        },
        {
          title: "Attendance and conversion recorded",
          detail:
            "Attended, converted to treatment, or lapsed is recorded so consultation quality can be read by source.",
        },
      ],
    },
    attribution: {
      heading: "Why aesthetics attribution is unusually messy",
      lede: "Social-led demand and long consideration windows break most default reporting.",
      points: [
        "DM conversations rarely carry a campaign identifier unless the click path is instrumented deliberately.",
        "Buyers research for weeks and convert on a branded search, which credits brand rather than the campaign that created the interest.",
        "Clients book multiple treatments over time, so first-visit revenue understates what the source produced.",
        "Package and membership revenue is recognised across months, which does not align with a click-level window.",
        "In-clinic upsells at the consultation are invisible to the ad platform entirely.",
        "Multiple platforms claim the same booking, so unreconciled reporting overstates every channel at once.",
      ],
    },
    modules: {
      heading: "Which QWA modules a med spa uses",
      lede: "Response and booking first; creative and attribution once the flow is stable.",
      items: [
        {
          title: "Voice + Conversations",
          detail:
            "Handles DMs, texts and calls as one thread per client, at the hours enquiries actually arrive.",
        },
        {
          title: "Creative Studio",
          detail:
            "Produces the treatment-specific creative volume aesthetics campaigns consume.",
        },
        {
          title: "Revenue Attribution",
          detail:
            "Joins social and paid campaigns to booked consultations and treatment revenue with coverage stated.",
        },
        {
          title: "Revenue Engine",
          detail:
            "Keeps one record per client across enquiry, consultation, treatment and repeat visits.",
        },
      ],
    },
    faqs: [
      {
        question: "Can it answer treatment or candidacy questions?",
        answer:
          "It answers only the general, non-medical information the clinic has approved. Candidacy, contraindications and anything clinical are escalated to a qualified team member with the conversation attached.",
      },
      {
        question: "Will it quote prices?",
        answer:
          "Only within the ranges you authorise. Many clinics prefer pricing to be handled at consultation, and that policy can be enforced in the conversation logic.",
      },
      {
        question: "Does it handle Instagram and TikTok DMs?",
        answer:
          "Messaging channels are connected through adapters and attach to the same client record as calls, texts and forms. Which platforms can be connected is confirmed during setup.",
      },
      {
        question: "How does it handle deposits and cancellation policies?",
        answer:
          "Your policy is surfaced in the booking conversation before the slot is held, and the acknowledgement is recorded on the appointment.",
      },
      {
        question: "What about client privacy and before-and-after content?",
        answer:
          "Consent, data handling and any advertising rules that apply to aesthetic treatments in your jurisdiction must be confirmed by the clinic. QWA supports configuring the workflow; it does not make regulatory determinations for you.",
      },
      {
        question: "Can it re-engage clients who never rebooked?",
        answer:
          "Yes — lapsed clients past their expected re-treatment interval can be segmented and contacted on a capped, consented cadence, with recovered revenue reported separately from new demand.",
      },
    ],
    related: [
      {
        label: "AI lead response",
        href: "/solutions/ai-lead-response",
        detail: "The instant first reply that decides who gets the consultation.",
      },
      {
        label: "Customer reactivation",
        href: "/solutions/customer-reactivation",
        detail: "Bring lapsed clients back on a capped, consented cadence.",
      },
      {
        label: "Creative Studio",
        href: "/products/creative-studio",
        detail: "Treatment-specific creative at the volume social demands.",
      },
    ],
    cta: {
      title: "See a midnight DM turn into a booked consultation.",
      lede: "We follow one real enquiry from social to consultation to treatment and show where the thread breaks today.",
      note: "No sales sequence. A reply within one business day.",
    },
  },

  hvac: {
    slug: "hvac",
    navLabel: "HVAC",
    eyebrow: "Industry · HVAC contractors",
    title: "AI for HVAC Contractors — Call Handling and Dispatch-Ready Booking | QWA",
    description:
      "How QWA handles HVAC demand: instant response to service calls, emergency triage, install estimate booking, maintenance plan follow-up, and attribution from spend to completed jobs across seasonal peaks.",
    h1: "QWA for HVAC contractors",
    answer:
      "For an HVAC contractor, QWA answers every service and install enquiry as it arrives, separates emergency no-heat and no-cool calls from quotable install work, captures the address, system and access detail dispatch needs, books into real crew availability, and keeps maintenance-plan and unsold-estimate follow-up running through the season.",
    support:
      "HVAC demand is weather-driven and brutally spiky. On the first freeze the phones ring faster than any office can answer them, and the calls that go unanswered are the highest-margin emergency work of the year.",
    leadSources: {
      heading: "Where HVAC demand arrives",
      lede: "Volume is concentrated in short weather-driven windows, which is exactly when capacity is shortest.",
      items: [
        {
          title: "Emergency service calls",
          detail:
            "No heat or no cool, urgent, phone-first, and lost within minutes to whichever contractor answers.",
        },
        {
          title: "Local search and map click-to-call",
          detail:
            "High-intent calls with no context unless tracking numbers are in place.",
        },
        {
          title: "Website and quote request forms",
          detail:
            "Replacement and install enquiries that need an estimate visit rather than a dispatch.",
        },
        {
          title: "Paid search during weather events",
          detail:
            "Expensive, time-critical clicks where a slow response wastes the entire spend.",
        },
        {
          title: "Maintenance plan members",
          detail:
            "Existing customers who should be recognised and prioritised by their agreement, not queued as new leads.",
        },
        {
          title: "Home service marketplaces and referrals",
          detail:
            "Third-party leads sold to several contractors at once, where response order effectively decides the winner.",
        },
      ],
    },
    speed: {
      heading: "Speed to lead when the phones are overwhelmed",
      lede: "The goal is that no call goes unanswered during a spike, and no estimate goes unfollowed after it.",
      points: [
        "Overflow calls are answered immediately rather than queuing, with emergencies triaged first.",
        "Missed calls trigger an instant text back so the customer does not simply dial the next contractor.",
        "After-hours and weekend calls are triaged against your on-call rules instead of reaching an answering service with no context.",
        "Maintenance-plan members are identified by number and handled on their agreed priority.",
        "Unsold estimates enter a defined follow-up cadence instead of sitting in a technician's truck.",
        "Response time and outcome are recorded per call, including the ones that were never answered during the peak.",
      ],
    },
    booking: {
      heading: "From call to a dispatch-ready job",
      lede: "A booking is only useful to dispatch if the address, system and access detail are complete.",
      steps: [
        {
          title: "Emergency triage",
          detail:
            "No heat, no cool, water leak, gas smell and similar conditions are separated and routed by your safety rules first.",
        },
        {
          title: "Service area confirmed",
          detail:
            "The address is checked against your service area before any time is offered.",
        },
        {
          title: "Job type identified",
          detail:
            "Repair, maintenance, replacement estimate or warranty work, each with its own duration and skill requirement.",
        },
        {
          title: "System and access detail captured",
          detail:
            "Equipment type, age where known, symptom description, property access and any gate or pet notes.",
        },
        {
          title: "Crew availability read",
          detail:
            "Live availability is checked for a technician with the right skill in the right zone, with travel time respected.",
        },
        {
          title: "Arrival window booked",
          detail:
            "The customer is given a realistic window rather than an exact minute, written to the field system.",
        },
        {
          title: "Confirmation and en-route updates",
          detail:
            "Confirmation and reminder messaging run on your cadence, with the customer able to reply on the same thread.",
        },
        {
          title: "Outcome and follow-up",
          detail:
            "Completed, quoted or unsold is recorded; unsold estimates enter follow-up and eligible jobs are offered a maintenance plan.",
        },
      ],
    },
    attribution: {
      heading: "Why HVAC spend is hard to tie to jobs",
      lede: "The chain breaks between the call, the truck and the invoice.",
      points: [
        "Almost everything converts by phone, so untracked numbers destroy the link to the campaign.",
        "The job is completed and invoiced in a field system that usually holds no marketing source.",
        "Replacement decisions can take weeks between the first repair call and the install sale.",
        "One customer produces repair, maintenance and eventual replacement revenue across years, which per-lead reporting misses.",
        "Weather spikes distort week-to-week comparisons, so a good week can look like a good campaign.",
        "Marketplace and shared leads are claimed by every channel that touched them unless revenue is reconciled once.",
      ],
    },
    modules: {
      heading: "Which QWA modules a contractor uses",
      lede: "Call handling first, because that is where the season is won or lost.",
      items: [
        {
          title: "Voice + Conversations",
          detail:
            "Absorbs peak and after-hours call volume with emergency triage and warm transfer.",
        },
        {
          title: "Revenue Engine",
          detail:
            "One record per property and customer across calls, jobs, estimates and repeat service.",
        },
        {
          title: "Customer Acquisition",
          detail:
            "Ties campaign spend to booked and completed work rather than to raw call counts.",
        },
        {
          title: "Revenue Attribution",
          detail:
            "Reconciles marketing-attributed revenue against invoiced job revenue with coverage stated.",
        },
      ],
    },
    faqs: [
      {
        question: "How are emergency calls handled?",
        answer:
          "Emergency conditions are identified first and routed by the safety and on-call rules you define — immediate transfer, priority dispatch, or an explicit instruction you supply. The assistant does not improvise safety guidance.",
      },
      {
        question: "Can it book into our dispatch software?",
        answer:
          "Availability and jobs are read from and written to your field service system through an adapter configured during setup, respecting skill, zone and travel time. Which systems connect is confirmed before commitment.",
      },
      {
        question: "What happens during a weather spike?",
        answer:
          "Call capacity does not depend on staffing, so every caller is answered and triaged. Where crew availability genuinely runs out, callers are given accurate options rather than an open-ended promise.",
      },
      {
        question: "Does it handle maintenance plan members differently?",
        answer:
          "Yes. Members are identified by phone number or address and handled on the priority and terms of their agreement rather than as new enquiries.",
      },
      {
        question: "Can it quote prices over the phone?",
        answer:
          "Only where you authorise fixed pricing such as diagnostic fees. Repair and replacement pricing that depends on inspection is routed to an estimate rather than guessed at.",
      },
      {
        question: "How do we see which marketing produced completed jobs?",
        answer:
          "Tracked calls and campaign identifiers travel with the job through booking to completion, and attributed revenue is reconciled against invoiced revenue with the unattributed share reported rather than hidden.",
      },
    ],
    related: [
      {
        label: "AI voice agent",
        href: "/solutions/ai-voice-agent",
        detail: "Answer every call through the peak without adding headcount.",
      },
      {
        label: "Revenue attribution",
        href: "/solutions/revenue-attribution",
        detail: "Join spend to completed, invoiced work.",
      },
      {
        label: "Plumbing",
        href: "/industries/plumbing",
        detail: "The same dispatch problem with a shorter decision window.",
      },
    ],
    cta: {
      title: "See what an unanswered peak-hour call costs.",
      lede: "We map one emergency call and one install estimate end to end against your dispatch rules and service area.",
      note: "No sales sequence. A reply within one business day.",
    },
  },

  plumbing: {
    slug: "plumbing",
    navLabel: "Plumbing",
    eyebrow: "Industry · Plumbing contractors",
    title: "AI for Plumbing Companies — Emergency Call Capture and Booking | QWA",
    description:
      "How QWA handles plumbing demand: emergency triage on every call, service area and job-type qualification, dispatch-ready booking, unsold estimate follow-up, and attribution from spend to completed jobs.",
    h1: "QWA for plumbing companies",
    answer:
      "For a plumbing company, QWA answers every inbound call and form immediately, triages emergencies against your own safety and on-call rules, confirms service area and job type, captures the access and fixture detail a technician needs, and books into live crew availability — then follows up on the estimates that were never sold.",
    support:
      "Plumbing has the shortest decision window in home services. A customer standing over a leak calls three companies in five minutes and hires the first one that answers with a real arrival time.",
    leadSources: {
      heading: "Where plumbing calls come from",
      lede: "Emergency-weighted, phone-dominant, and largely won on answer speed.",
      items: [
        {
          title: "Emergency calls",
          detail:
            "Burst pipes, backups, no hot water and active leaks — immediate, high-intent, and lost in minutes.",
        },
        {
          title: "Local search and map click-to-call",
          detail:
            "The default path for an urgent search, arriving with no context unless numbers are tracked.",
        },
        {
          title: "Scheduled and planned work",
          detail:
            "Fixture replacement, repipes and renovation work that needs an estimate rather than a dispatch.",
        },
        {
          title: "Property managers and commercial accounts",
          detail:
            "Repeat callers with account terms, multiple properties and their own approval process.",
        },
        {
          title: "Home service marketplaces",
          detail:
            "Shared leads where response order effectively decides who gets the job.",
        },
        {
          title: "Past customers and referrals",
          detail:
            "Returning callers who should be recognised by address and history rather than requalified.",
        },
      ],
    },
    speed: {
      heading: "Speed to lead when every minute is a competitor",
      lede: "Answer rate matters more here than anywhere else in home services.",
      points: [
        "Every call is answered on the first ring, including during the hour when three emergencies land at once.",
        "Missed calls trigger an immediate text back with a path to book, because an urgent caller will not call twice.",
        "Overnight and weekend calls follow your on-call rules rather than an answering service with no dispatch visibility.",
        "Property managers and account customers are recognised and handled on their agreed terms.",
        "Unsold estimates get a defined follow-up cadence instead of relying on the technician to remember.",
        "Answer rate, response time and outcome are recorded per call so peak-hour losses are visible.",
      ],
    },
    booking: {
      heading: "From call to a dispatch-ready job",
      lede: "The detail captured on the call determines whether the truck arrives able to do the work.",
      steps: [
        {
          title: "Emergency triage first",
          detail:
            "Active leaks, sewage backups, gas concerns and no-water conditions are separated and routed by your rules before anything else.",
        },
        {
          title: "Safety instruction where authorised",
          detail:
            "Only the guidance you have approved in writing — such as locating a shut-off valve — is given; anything else is transferred.",
        },
        {
          title: "Service area and property type",
          detail:
            "Address is validated against your service area, and residential, commercial or managed property is identified.",
        },
        {
          title: "Job type and fixture detail",
          detail:
            "Symptom, fixture, access, water shut-off location and parking or entry notes are captured for dispatch.",
        },
        {
          title: "Crew availability read",
          detail:
            "Live availability is checked for the right skill and zone, with travel time and job duration respected.",
        },
        {
          title: "Arrival window booked",
          detail:
            "A realistic window is offered and written to the field system with the full call context.",
        },
        {
          title: "Confirmation and updates",
          detail:
            "Confirmation, reminders and reschedule handling run on the same thread the customer called from.",
        },
        {
          title: "Outcome and estimate follow-up",
          detail:
            "Completed, quoted or unsold is recorded, and unsold estimates enter a capped follow-up sequence.",
        },
      ],
    },
    attribution: {
      heading: "Why plumbing marketing is hard to measure",
      lede: "The same structural breaks as other trades, compressed into a much shorter window.",
      points: [
        "Nearly all conversion is voice, so untracked numbers make campaign-level measurement impossible.",
        "Jobs are invoiced in a field system that rarely carries the marketing source.",
        "Emergency demand is event-driven, so spend comparisons across weeks are misleading without volume context.",
        "Repeat and account work is credited to acquisition unless retention is measured separately.",
        "Marketplace leads are claimed by the marketplace and by paid search simultaneously.",
        "Estimates that sell weeks later fall outside default attribution windows and disappear from reporting.",
      ],
    },
    modules: {
      heading: "Which QWA modules a plumbing company uses",
      lede: "The stack is deliberately narrow: answer everything, book accurately, measure honestly.",
      items: [
        {
          title: "Voice + Conversations",
          detail:
            "Answers every call including simultaneous emergencies, with triage and warm transfer.",
        },
        {
          title: "Revenue Engine",
          detail:
            "One record per property and customer across emergency, scheduled and account work.",
        },
        {
          title: "Revenue Attribution",
          detail:
            "Joins tracked calls to invoiced jobs and reconciles against the field system.",
        },
        {
          title: "Business Intelligence",
          detail:
            "Reports answer rate, booking rate and completed revenue by source from your own records.",
        },
      ],
    },
    faqs: [
      {
        question: "Can it triage an emergency correctly?",
        answer:
          "It identifies the conditions you define as emergencies and routes them by your rules, including immediate transfer. It only gives the safety guidance you have authorised in writing and does not improvise beyond it.",
      },
      {
        question: "What happens when three emergency calls land at once?",
        answer:
          "All are answered simultaneously and triaged; capacity does not depend on how many people are free. Where crews are genuinely unavailable, callers are told accurately rather than promised a window that cannot be met.",
      },
      {
        question: "Does it know our service area?",
        answer:
          "Addresses are validated against the service area you configure before any arrival window is offered, so out-of-area calls are handled by your rule rather than booked in error.",
      },
      {
        question: "Can it handle property managers and account customers?",
        answer:
          "Yes — recognised by number or address and handled on the terms, priority and approval process you configure for that account.",
      },
      {
        question: "Will it give pricing over the phone?",
        answer:
          "Only fixed items you authorise, such as a diagnostic or call-out fee. Work that depends on inspection is routed to an on-site estimate.",
      },
      {
        question: "How do we measure which marketing produced revenue?",
        answer:
          "Tracked calls and campaign identifiers travel with the job to completion, and attributed revenue is reconciled against invoiced revenue with coverage and the unattributed share reported.",
      },
    ],
    related: [
      {
        label: "AI voice agent",
        href: "/solutions/ai-voice-agent",
        detail: "Answer simultaneous emergency calls without a queue.",
      },
      {
        label: "AI lead response",
        href: "/solutions/ai-lead-response",
        detail: "Instant text back on every missed call.",
      },
      {
        label: "HVAC",
        href: "/industries/hvac",
        detail: "The same dispatch model under seasonal demand spikes.",
      },
    ],
    cta: {
      title: "See what happens to your third simultaneous call.",
      lede: "We run an emergency call and a planned estimate through your triage, service area and dispatch rules.",
      note: "No sales sequence. A reply within one business day.",
    },
  },

  solar: {
    slug: "solar",
    navLabel: "Solar",
    eyebrow: "Industry · Solar installers",
    title: "AI for Solar Installers — Lead Qualification and Consultation Booking | QWA",
    description:
      "How QWA handles solar demand: instant response to high-cost leads, homeownership and roof qualification, consultation and site survey booking, long-cycle nurture, and attribution from spend to signed contracts.",
    h1: "QWA for solar installers",
    answer:
      "For a solar installer, QWA answers every enquiry immediately, qualifies the basics that decide whether an appointment is worth a consultant's time — homeownership, roof situation, utility and timeline — books consultations and site surveys into real availability, and keeps the long nurture cycle running between first contact and a signed contract.",
    support:
      "Solar has the most expensive leads and the longest consideration cycle in this set. A lead that is not answered quickly is wasted spend, and a lead that is answered but never nurtured is wasted twice.",
    leadSources: {
      heading: "Where solar leads come from",
      lede: "Expensive, competitive and heavily intermediated, which puts a premium on both speed and qualification.",
      items: [
        {
          title: "Paid search and paid social",
          detail:
            "High cost per lead where slow response directly destroys the media budget.",
        },
        {
          title: "Purchased and shared leads",
          detail:
            "Aggregator leads sold to several installers, effectively won by whoever calls first.",
        },
        {
          title: "Website and savings-estimate forms",
          detail:
            "Self-serve calculators and quote requests that arrive with partial information.",
        },
        {
          title: "Door-to-door and canvassing",
          detail:
            "Field-captured contacts that need to enter the same record and follow-up cadence as digital leads.",
        },
        {
          title: "Referrals from existing customers",
          detail:
            "The cheapest and highest-converting source, usually the least systematically worked.",
        },
        {
          title: "Events and community programmes",
          detail:
            "Batch contacts collected in a single day that must be followed up before interest cools.",
        },
      ],
    },
    speed: {
      heading: "Speed to lead on expensive, shared leads",
      lede: "Response speed is the only variable an installer controls on a lead several competitors also bought.",
      points: [
        "Aggregator and paid leads are contacted within seconds of delivery, by call and message, not by a queue.",
        "Basic qualification happens in the first conversation, so consultants only spend time on viable appointments.",
        "Unqualified leads are declined politely and recorded with a reason rather than being pushed to an appointment.",
        "Long-cycle leads enter a defined, capped nurture sequence instead of a one-off callback attempt.",
        "Canvassed and event contacts join the same record and cadence as digital leads.",
        "Cost per qualified appointment is measurable because qualification state is recorded on every lead.",
      ],
    },
    booking: {
      heading: "From lead to a consultation worth attending",
      lede: "Qualification comes before scheduling, because an unqualified site visit is the most expensive outcome available.",
      steps: [
        {
          title: "Immediate contact",
          detail:
            "The lead is contacted on delivery across the channels it supplied, before competitors reach it.",
        },
        {
          title: "Homeownership and authority",
          detail:
            "Whether the contact owns the property and whether all decision-makers should attend the consultation.",
        },
        {
          title: "Property and roof basics",
          detail:
            "Property type, roof age or condition where known, and shading or space constraints the customer can describe.",
        },
        {
          title: "Utility and consumption context",
          detail:
            "Utility provider and recent bill range where the customer is willing to share it, to size the conversation honestly.",
        },
        {
          title: "Timeline and motivation",
          detail:
            "Whether they are exploring or ready, which decides between a consultation now and a nurture track.",
        },
        {
          title: "Consultation or survey booked",
          detail:
            "Live availability is read for the right consultant or surveyor, with travel and duration respected.",
        },
        {
          title: "Confirmation and preparation",
          detail:
            "Confirmation, reminders and any documents you ask the homeowner to have ready are sent ahead of the visit.",
        },
        {
          title: "Outcome and long-cycle nurture",
          detail:
            "Held, proposed, signed or stalled is recorded, and stalled deals enter a capped nurture cadence rather than being closed out.",
        },
      ],
    },
    attribution: {
      heading: "Why solar attribution rarely survives the sales cycle",
      lede: "Long cycles and multi-party sales break the joins that shorter-cycle businesses can rely on.",
      points: [
        "Months can pass between first click and signed contract, well outside default attribution windows.",
        "Purchased leads arrive already stripped of their original source detail.",
        "The sale involves several conversations across phone, home visit and email, often with more than one household member.",
        "Financing approval and permitting delay the revenue event long after the marketing spend.",
        "Cancellations after signature mean contract value and recognised revenue are different numbers.",
        "Field and digital sources are reported in separate systems, so the same household can be counted twice.",
      ],
    },
    modules: {
      heading: "Which QWA modules an installer uses",
      lede: "Speed and qualification first, then the nurture and measurement the long cycle demands.",
      items: [
        {
          title: "AI lead response",
          detail:
            "Contacts shared and paid leads within seconds and qualifies before a consultant is committed.",
        },
        {
          title: "Revenue Engine",
          detail:
            "One record per household across canvass, digital, consultation, proposal and contract.",
        },
        {
          title: "Customer Acquisition",
          detail:
            "Compares sources on cost per qualified appointment and per signed contract, not per raw lead.",
        },
        {
          title: "Revenue Attribution",
          detail:
            "Holds the long window open and reconciles attributed revenue against contracts that survived to install.",
        },
      ],
    },
    faqs: [
      {
        question: "Can it qualify homeowners before we send a consultant?",
        answer:
          "It captures the qualification criteria you define — ownership, property basics, utility context, timeline — and records the answers on the lead, so consultant time is spent on appointments that meet your own bar.",
      },
      {
        question: "How fast are purchased or shared leads contacted?",
        answer:
          "Contact is triggered by lead delivery rather than by someone becoming available, so outreach begins within seconds across the channels the lead supplied.",
      },
      {
        question: "Will it discuss savings, incentives or financing?",
        answer:
          "Only within the material you authorise. Savings estimates, incentive eligibility and financing terms depend on jurisdiction, utility and individual circumstances, so the default is to route those to a qualified consultant rather than to state them.",
      },
      {
        question: "How does it handle a long sales cycle?",
        answer:
          "Stalled and exploring leads enter a capped, consented nurture cadence with defined stop conditions, and the whole history stays on one record so the eventual consultation is not a cold start.",
      },
      {
        question: "Can canvassing and event contacts use the same system?",
        answer:
          "Yes. Field-captured contacts enter the same record structure and follow-up cadence as digital leads, which is usually where the largest recovery is available.",
      },
      {
        question: "How is marketing measured against signed contracts?",
        answer:
          "Source travels with the household record through consultation, proposal and contract, and attributed revenue is reconciled against contracts that survived to install, with cancellations itemised rather than ignored.",
      },
    ],
    related: [
      {
        label: "AI lead response",
        href: "/solutions/ai-lead-response",
        detail: "Contact shared leads before the other installers do.",
      },
      {
        label: "AI appointment setting",
        href: "/solutions/ai-appointment-setting",
        detail: "Book consultations and surveys into real availability.",
      },
      {
        label: "Revenue attribution",
        href: "/solutions/revenue-attribution",
        detail: "Keep a long window open without losing the join.",
      },
    ],
    cta: {
      title: "See a shared lead answered before your competitors.",
      lede: "We run one purchased lead through immediate contact, qualification and consultation booking against your own criteria.",
      note: "No sales sequence. A reply within one business day.",
    },
  },
};
