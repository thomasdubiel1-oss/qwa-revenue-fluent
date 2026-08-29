/**
 * Solution page content.
 *
 * Buyer-intent pages, one per problem a revenue team actually searches for.
 * Everything here describes how the QWA system behaves. There are no customer
 * names, no performance statistics, no guarantees and no case studies: QWA has
 * published none, so none appear.
 */
import type { Faq } from "@/components/qwa/content/content-page";

export type SolutionSlug =
  | "ai-lead-response"
  | "ai-appointment-setting"
  | "ai-voice-agent"
  | "customer-reactivation"
  | "revenue-attribution";

export type SolutionContent = {
  slug: SolutionSlug;
  navLabel: string;
  eyebrow: string;
  /** Page title tag. */
  title: string;
  /** Meta description. */
  description: string;
  /** The single H1. */
  h1: string;
  /** Direct definition, first paragraph, no preamble. */
  answer: string;
  support: string;
  problem: { heading: string; lede: string; points: string[] };
  workflow: { heading: string; lede: string; steps: { title: string; detail: string }[] };
  useCases: { heading: string; lede: string; items: { title: string; detail: string }[] };
  integration: { heading: string; lede: string; items: { title: string; detail: string }[] };
  considerations: { heading: string; lede: string; points: string[] };
  faqs: Faq[];
  related: { label: string; href: string; detail: string }[];
  cta: { title: string; lede: string; note: string };
};

export const solutions: Record<SolutionSlug, SolutionContent> = {
  "ai-lead-response": {
    slug: "ai-lead-response",
    navLabel: "AI lead response",
    eyebrow: "Solution · Speed to lead",
    title: "AI Lead Response — Answer Every Inbound Lead in Seconds | QWA",
    description:
      "AI lead response answers inbound form, call, chat and ad leads within seconds, qualifies them in conversation, and hands a complete record to your team. See the workflow, integrations and implementation considerations.",
    h1: "AI lead response",
    answer:
      "AI lead response is an automated first reply to every inbound enquiry — form fill, missed call, chat, DM or ad lead — sent within seconds of the signal arriving, followed by a qualifying conversation that captures intent, timing and contact details before a human ever picks it up. In QWA it runs on the same record the rest of the revenue system uses, so the reply, the qualification and the eventual outcome stay attached to one lead.",
    support:
      "Most lost inbound revenue is not a closing problem. It is a latency problem: the enquiry arrives, nobody is free, and by the time someone replies the buyer has already spoken to a competitor. Response speed is the one variable a team can control on every single lead.",
    problem: {
      heading: "Where inbound leads actually leak",
      lede: "Before automating anything, it helps to name the specific failure points a first-response system has to close.",
      points: [
        "Leads arrive outside staffed hours, on weekends, or during a rush when nobody can break away.",
        "The first reply goes out hours later with no context, so the conversation restarts from zero.",
        "Missed calls never become anything: no voicemail, no text back, no record that the call happened.",
        "Follow-up depends on an individual remembering, so the second and third attempts are inconsistent.",
        "Channels are fragmented — a form lead, a call and a DM from the same person look like three leads.",
        "Nobody can see, after the fact, how long the first response actually took or which leads never got one.",
      ],
    },
    workflow: {
      heading: "How the response workflow runs",
      lede: "Every step below writes to the same lead record, which is what makes the response measurable rather than merely fast.",
      steps: [
        {
          title: "Signal captured",
          detail:
            "A form submission, inbound call, chat message, ad lead or marketplace enquiry is captured with its source, campaign and page context intact.",
        },
        {
          title: "Identity resolved",
          detail:
            "Phone, email and device signals are matched against existing contacts so a returning buyer continues an existing record instead of opening a duplicate one.",
        },
        {
          title: "First response sent",
          detail:
            "An immediate reply goes out on the channel the buyer used, referencing what they actually asked about rather than a generic acknowledgement.",
        },
        {
          title: "Qualification in conversation",
          detail:
            "The conversation collects the fields your team needs — service required, timing, location, budget range where appropriate — in the buyer's own words.",
        },
        {
          title: "Routing decision",
          detail:
            "Qualified leads are routed by rules you set: booked directly, escalated to a named rep, or queued with a priority and a stated reason.",
        },
        {
          title: "Handoff with full context",
          detail:
            "Whoever picks it up sees the entire thread, the qualification answers and the original source — no re-asking, no cold start.",
        },
        {
          title: "Follow-up sequence",
          detail:
            "Unanswered leads receive a defined follow-up cadence across channels, with stop conditions when the buyer replies, books or opts out.",
        },
        {
          title: "Outcome written back",
          detail:
            "Booked, disqualified, closed or lost is recorded against the same lead, so response behaviour can be compared to what actually converted.",
        },
      ],
    },
    useCases: {
      heading: "Where teams apply it first",
      lede: "The pattern is the same; the operational detail differs by how the lead arrives.",
      items: [
        {
          title: "After-hours and weekend enquiries",
          detail:
            "Leads that arrive when the office is closed get a real conversation immediately and a booked or triaged outcome waiting the next morning.",
        },
        {
          title: "Missed and abandoned calls",
          detail:
            "An unanswered call triggers an immediate text back on the same number, converting a dropped call into a live thread instead of a blank line in a call log.",
        },
        {
          title: "Paid search and social lead forms",
          detail:
            "Lead-form submissions are answered before the buyer has left the platform, with campaign and creative carried through to the conversation record.",
        },
        {
          title: "High-volume seasonal spikes",
          detail:
            "When volume triples in a week, first-response time stays flat because the first touch is not competing for staff attention.",
        },
        {
          title: "Multi-location routing",
          detail:
            "Leads are matched to the right location or team by service area and availability, rather than landing in one shared inbox to be sorted manually.",
        },
        {
          title: "Web chat continuity",
          detail:
            "A chat that ends without a booking continues by text or email on the same record instead of disappearing when the tab closes.",
        },
      ],
    },
    integration: {
      heading: "What it connects to",
      lede: "QWA reads and writes through adapters. Nothing is assumed to be connected, and each connection is configured explicitly.",
      items: [
        {
          title: "Web forms and landing pages",
          detail:
            "Form submissions post into the lead record with UTM parameters, referrer and the page the buyer converted on.",
        },
        {
          title: "Telephony and SMS",
          detail:
            "Inbound calls, missed-call events and text threads attach to the same contact, so voice and messaging are one conversation.",
        },
        {
          title: "CRM and scheduling",
          detail:
            "Leads, activities and booked appointments sync to your system of record and calendar rather than living in a separate tool.",
        },
        {
          title: "Ad platforms",
          detail:
            "Campaign, ad set and creative identifiers travel with the lead so response and outcome can be read back against spend.",
        },
      ],
    },
    considerations: {
      heading: "Implementation considerations",
      lede: "Worth deciding before launch rather than after the first week of live traffic.",
      points: [
        "Define what qualified means in your business, in writing, before the conversation logic is configured — automation cannot resolve an ambiguous definition.",
        "Agree the escalation rule: which conditions must hand off to a person immediately, and who owns the queue when they do.",
        "Set messaging consent, opt-out handling and quiet hours to match the rules that apply to your industry and jurisdiction.",
        "Decide the follow-up cadence and its stop conditions up front; an unbounded sequence damages more pipeline than it recovers.",
        "Confirm the source of truth for contacts so the first response never creates a duplicate record in the CRM.",
        "Instrument first-response time from day one, including leads that received no response, so improvement can be observed rather than assumed.",
      ],
    },
    faqs: [
      {
        question: "How fast is an AI first response?",
        answer:
          "The reply is triggered by the inbound event itself rather than by someone becoming available, so it goes out within seconds of the lead being captured. Actual delivery time also depends on the channel provider — SMS and email carriers add their own latency.",
      },
      {
        question: "Does the buyer know they are talking to an assistant?",
        answer:
          "That is your configuration choice, and QWA supports stating it plainly. We recommend disclosure: it sets accurate expectations and avoids the awkward moment when a buyer asks a question the assistant should hand to a person.",
      },
      {
        question: "What happens when the conversation goes off-script?",
        answer:
          "Conditions you define — pricing negotiation, complaints, clinical or legal questions, anything ambiguous — escalate to a human with the full thread attached. The escalation itself is recorded on the lead.",
      },
      {
        question: "Will it create duplicate records in our CRM?",
        answer:
          "Identity is resolved against existing contacts by phone and email before anything is written, and the CRM stays the system of record. Duplicate prevention depends on the matching rules agreed during setup.",
      },
      {
        question: "Can we keep humans as the first response for some leads?",
        answer:
          "Yes. Routing rules can send defined segments — named accounts, high-value services, specific locations — straight to a person while automation handles the rest.",
      },
      {
        question: "How is the impact measured?",
        answer:
          "First-response time, response coverage, qualification rate, booking rate and closed outcome are all recorded on the same lead record, so the effect is read from your own data rather than from a benchmark.",
      },
    ],
    related: [
      {
        label: "AI appointment setting",
        href: "/solutions/ai-appointment-setting",
        detail: "Turn a qualified conversation into a confirmed slot on the right calendar.",
      },
      {
        label: "AI voice agent",
        href: "/solutions/ai-voice-agent",
        detail: "Answer the calls that first response cannot resolve in text.",
      },
      {
        label: "Revenue Engine",
        href: "/products/revenue-engine",
        detail: "The closed-loop system the response record belongs to.",
      },
    ],
    cta: {
      title: "See your own first-response gap.",
      lede: "We walk one real inbound path end to end — capture, reply, qualification, routing and outcome — and show exactly where the time goes today.",
      note: "No sales sequence. A reply within one business day.",
    },
  },

  "ai-appointment-setting": {
    slug: "ai-appointment-setting",
    navLabel: "AI appointment setting",
    eyebrow: "Solution · Booked appointments",
    title: "AI Appointment Setting — Book Qualified Leads Automatically | QWA",
    description:
      "AI appointment setting qualifies inbound leads, offers real availability, books directly into your calendar and manages reminders, reschedules and no-show recovery. Workflow, integrations and rollout considerations.",
    h1: "AI appointment setting",
    answer:
      "AI appointment setting takes a qualified lead and converts it into a confirmed appointment without a human coordinating the back-and-forth: it checks live availability, offers slots that fit the service and the provider, writes the booking to your calendar, and then manages confirmation, reminders, reschedules and no-show recovery on the same record.",
    support:
      "Booking is where most conversational automation quietly stops. Getting a reply is straightforward; getting a slot that is genuinely available, correctly resourced and actually kept is the part that decides whether the pipeline is real.",
    problem: {
      heading: "Why booking breaks after the first reply",
      lede: "The gap between an interested lead and a kept appointment is operational, not conversational.",
      points: [
        "Availability lives in a calendar the messaging tool cannot see, so offered times are guesses.",
        "Different services need different durations, rooms, equipment or qualified staff, and generic booking links ignore that.",
        "Scheduling turns into a multi-message negotiation that stalls overnight and dies by morning.",
        "Confirmations and reminders are inconsistent, so no-show rates vary by who happened to send them.",
        "A cancellation frees a slot that nobody refills, because no waitlist is watching.",
        "Nobody can trace which source produced appointments that were kept, only appointments that were made.",
      ],
    },
    workflow: {
      heading: "How the booking workflow runs",
      lede: "Availability, resourcing and reminders are handled as one sequence so the appointment is real when it is written.",
      steps: [
        {
          title: "Qualification confirmed",
          detail:
            "Service type, urgency, location and any prerequisite answers are captured before slots are offered, so the booking is resourced correctly.",
        },
        {
          title: "Availability read live",
          detail:
            "Open slots are read from the actual calendar with the correct duration, provider skill and location filter applied.",
        },
        {
          title: "Slots offered in conversation",
          detail:
            "The buyer is given a small set of specific times rather than a link to a blank calendar, and can answer in plain language.",
        },
        {
          title: "Appointment written",
          detail:
            "The booking is created on the right calendar with the contact, service, source and conversation history attached.",
        },
        {
          title: "Confirmation and reminders",
          detail:
            "Confirmation goes out immediately, followed by reminders on the schedule you define, on the channel the buyer used.",
        },
        {
          title: "Reschedule and cancellation handling",
          detail:
            "Changes are handled in conversation, the calendar is updated, and the freed slot returns to availability rather than sitting empty.",
        },
        {
          title: "No-show recovery",
          detail:
            "A missed appointment triggers a defined recovery sequence within a set window instead of becoming a manual callback list.",
        },
        {
          title: "Outcome recorded",
          detail:
            "Kept, rescheduled, cancelled or no-show is written back to the lead, so source quality can be judged on attendance rather than bookings.",
        },
      ],
    },
    useCases: {
      heading: "Common booking patterns",
      lede: "The workflow adapts to how the appointment is resourced.",
      items: [
        {
          title: "Consultations and assessments",
          detail:
            "Discovery appointments where the qualifying answers determine who should take the meeting and how long it needs.",
        },
        {
          title: "In-home estimates",
          detail:
            "Slots constrained by service area and travel time, offered as windows rather than exact minutes.",
        },
        {
          title: "Provider-specific scheduling",
          detail:
            "Bookings that must land with a specific clinician, technician or specialist, with the right duration for that service.",
        },
        {
          title: "Multi-location routing",
          detail:
            "Leads matched to the nearest location with genuine availability, rather than to whichever calendar was checked first.",
        },
        {
          title: "Waitlist and cancellation fill",
          detail:
            "When a slot frees up, contacts who wanted an earlier time are offered it automatically within your rules.",
        },
        {
          title: "Reminder and confirmation cadence",
          detail:
            "A defined sequence before each appointment, with the reply captured so an at-risk booking can be seen in advance.",
        },
      ],
    },
    integration: {
      heading: "What it connects to",
      lede: "Booking accuracy depends entirely on the quality of these connections, so each is explicit.",
      items: [
        {
          title: "Calendars and scheduling systems",
          detail:
            "Live availability, service durations, buffers and provider assignment are read from the system your team already runs on.",
        },
        {
          title: "CRM and contact records",
          detail:
            "The appointment attaches to the existing contact, with the conversation and source history intact.",
        },
        {
          title: "Messaging and voice",
          detail:
            "Offers, confirmations and reminders go out on the channel the buyer is already using.",
        },
        {
          title: "Attribution",
          detail:
            "Source and campaign travel with the appointment so kept-appointment rate can be read by channel.",
        },
      ],
    },
    considerations: {
      heading: "Implementation considerations",
      lede: "Most booking automation fails on operational detail, not on language.",
      points: [
        "Clean the calendar model first: service durations, buffers, travel time and provider skills must be accurate before anything books against them.",
        "Decide which services may be booked automatically and which require a human to confirm resourcing.",
        "Set the double-booking safeguard explicitly, including what happens when two conversations reach for the same slot.",
        "Define reminder timing and channel per service; the right cadence for a same-week estimate is not the right cadence for a month-out consultation.",
        "Agree the no-show policy — window, number of attempts, and when the lead returns to the normal follow-up cadence.",
        "Confirm consent and record-keeping requirements for reminders in your industry before enabling outbound messages.",
      ],
    },
    faqs: [
      {
        question: "Does it book directly into our existing calendar?",
        answer:
          "Yes — availability is read from and appointments are written to the scheduling system you already use, with the service duration, buffer and provider rules you configure.",
      },
      {
        question: "How does it avoid double-booking?",
        answer:
          "Availability is checked at the moment of booking rather than from a cached list, and concurrency rules decide what happens when two conversations reach for the same slot. Accuracy depends on the calendar integration being the single source of truth.",
      },
      {
        question: "Can it handle reschedules and cancellations?",
        answer:
          "Yes. Changes are handled in the same thread, the calendar is updated, and the freed slot is returned to availability where your rules allow it to be reoffered.",
      },
      {
        question: "What happens on a no-show?",
        answer:
          "A recovery sequence you define runs within a set window, and the no-show is recorded on the lead so attendance can be analysed by source and service.",
      },
      {
        question: "Which appointments should stay manual?",
        answer:
          "Anything where resourcing is judgement-based — complex multi-provider work, sensitive cases, or services with prerequisites that cannot be confirmed in conversation. Those are routed to a person with the qualification already captured.",
      },
      {
        question: "How is booking performance measured?",
        answer:
          "Booking rate, kept-appointment rate, reschedule rate and no-show rate are recorded per source and service on the same records, so the numbers come from your own operation.",
      },
    ],
    related: [
      {
        label: "AI lead response",
        href: "/solutions/ai-lead-response",
        detail: "The first-response layer that qualifies the lead before booking.",
      },
      {
        label: "AI voice agent",
        href: "/solutions/ai-voice-agent",
        detail: "Book by phone when the buyer would rather talk than type.",
      },
      {
        label: "Voice + Conversations",
        href: "/products/voice",
        detail: "The conversational product behind booking across channels.",
      },
    ],
    cta: {
      title: "Book an appointment through the system that books yours.",
      lede: "We map your services, durations and routing rules against a live booking path and show where slots are currently lost.",
      note: "No sales sequence. A reply within one business day.",
    },
  },

  "ai-voice-agent": {
    slug: "ai-voice-agent",
    navLabel: "AI voice agent",
    eyebrow: "Solution · Voice",
    title: "AI Voice Agent — Answer Every Call and Keep the Context | QWA",
    description:
      "An AI voice agent answers inbound calls, handles routine enquiries, qualifies callers, books appointments and escalates to a person with full context. Workflow, telephony integration and rollout considerations.",
    h1: "AI voice agent",
    answer:
      "An AI voice agent answers inbound phone calls in natural speech, handles the routine part of the conversation — who is calling, what they need, when they need it — and either resolves the call, books an appointment, or transfers to a person with the context already gathered. In QWA the call is written to the same lead record as the buyer's form fills, texts and appointments, so voice stops being a separate silo.",
    support:
      "Phone remains the highest-intent inbound channel in most service businesses, and it is the one most often mishandled: unanswered at peak, unanswered after hours, and almost never recorded as anything a revenue system can read.",
    problem: {
      heading: "What goes wrong on the phone",
      lede: "Voice failures are structural rather than occasional.",
      points: [
        "Calls arrive in bursts, and the busiest hour is usually the least staffed.",
        "After-hours callers reach voicemail, and most do not leave one.",
        "The caller repeats information they already gave on the website or in a text.",
        "Call outcomes live in a phone system, disconnected from the lead and the CRM.",
        "Nobody can tell which campaigns produce calls that turn into booked work.",
        "Quality varies by who answers, and there is no consistent record of what was promised.",
      ],
    },
    workflow: {
      heading: "How a call is handled",
      lede: "Every stage produces a record, which is what makes voice measurable alongside every other channel.",
      steps: [
        {
          title: "Call answered",
          detail:
            "The agent answers on the first ring, at any hour, and states plainly what it can help with.",
        },
        {
          title: "Caller identified",
          detail:
            "The number is matched to an existing contact, so a returning caller continues their history instead of starting over.",
        },
        {
          title: "Intent captured",
          detail:
            "The reason for the call is captured in the caller's own words and classified against the intents you define.",
        },
        {
          title: "Qualification",
          detail:
            "Service, urgency, location and any required detail are gathered conversationally, with the caller able to interrupt and correct.",
        },
        {
          title: "Resolution or booking",
          detail:
            "Routine requests are answered directly; qualified callers are offered live availability and booked on the spot.",
        },
        {
          title: "Escalation with context",
          detail:
            "Defined conditions transfer to a person — warm, with the summary and captured fields already on screen.",
        },
        {
          title: "Post-call record",
          detail:
            "A transcript, structured summary and outcome are written to the lead, along with the source that produced the call.",
        },
        {
          title: "Follow-up",
          detail:
            "Unresolved calls enter a defined follow-up sequence on the channel the caller prefers, with stop conditions.",
        },
      ],
    },
    useCases: {
      heading: "Where a voice agent earns its place",
      lede: "Start with the calls that are currently lost rather than the calls that already work.",
      items: [
        {
          title: "Overflow during peak hours",
          detail:
            "Calls that would ring out or queue are answered immediately, with the option to transfer once a person is free.",
        },
        {
          title: "After-hours coverage",
          detail:
            "Evening and weekend callers get a real conversation and a booked slot rather than voicemail.",
        },
        {
          title: "Missed-call recovery",
          detail:
            "An unanswered call triggers an immediate callback or text, so the enquiry does not end at a dial tone.",
        },
        {
          title: "Routine enquiry handling",
          detail:
            "Hours, location, service scope, appointment status and similar questions are answered without occupying staff.",
        },
        {
          title: "Qualified transfer",
          detail:
            "High-intent callers reach a person having already given the details the person would have had to ask for.",
        },
        {
          title: "Outbound follow-up calls",
          detail:
            "Defined, consented follow-up calls on leads that went quiet, with every attempt recorded on the lead.",
        },
      ],
    },
    integration: {
      heading: "What it connects to",
      lede: "Voice only stops being a silo when these connections are real.",
      items: [
        {
          title: "Telephony and call routing",
          detail:
            "Numbers, hunt groups, transfer targets and business-hours rules are configured against your existing phone estate.",
        },
        {
          title: "Calendar and scheduling",
          detail:
            "Live availability is read during the call so a booking made by voice is a booking that exists.",
        },
        {
          title: "CRM and contact history",
          detail:
            "Transcripts, summaries and outcomes attach to the contact rather than sitting in a call log.",
        },
        {
          title: "Attribution and call tracking",
          detail:
            "Tracking numbers and campaign identifiers carry into the call record, so calls can be read back against spend.",
        },
      ],
    },
    considerations: {
      heading: "Implementation considerations",
      lede: "Voice is the least forgiving channel; these decisions matter more here than anywhere else.",
      points: [
        "Decide disclosure up front. Stating that the caller is speaking with an assistant is both the honest default and the simpler compliance position.",
        "Define the escalation list precisely — emergencies, complaints, clinical, legal or financial questions — and test that each one transfers reliably.",
        "Check call recording, consent and retention requirements for every jurisdiction you take calls from before going live.",
        "Set a hard fallback: if the agent cannot understand the caller after a defined number of attempts, it must transfer or take a callback, never loop.",
        "Constrain the agent to information you can stand behind. It should decline to speculate on price, timing or outcomes it cannot verify.",
        "Roll out by call type — after-hours first, then overflow — so quality can be reviewed on real transcripts before widening scope.",
      ],
    },
    faqs: [
      {
        question: "Will callers be told they are speaking with an AI agent?",
        answer:
          "That is configurable, and disclosure is the recommended default. It sets accurate expectations and keeps you on the right side of consent and recording rules in most jurisdictions.",
      },
      {
        question: "What happens if the agent cannot handle the call?",
        answer:
          "Defined escalation conditions and a hard fallback both route the caller to a person or a scheduled callback, with the conversation summary attached. The agent does not loop on a request it cannot resolve.",
      },
      {
        question: "Can it transfer to the right person?",
        answer:
          "Yes, using the routing rules you configure — by service, location, availability or account ownership — and the receiving person sees what has already been captured.",
      },
      {
        question: "Does it work with our existing phone numbers?",
        answer:
          "It is configured against your existing telephony, including tracking numbers, so you do not have to republish numbers or change how calls reach you.",
      },
      {
        question: "Are calls recorded and transcribed?",
        answer:
          "Recording and transcription are configurable and must be set to match the consent and retention rules that apply to you. Where enabled, the transcript and a structured summary attach to the lead record.",
      },
      {
        question: "How does voice connect to the rest of the pipeline?",
        answer:
          "The call is written to the same record as the buyer's forms, texts and appointments, so a call is not a separate lead and can be reported alongside every other channel.",
      },
    ],
    related: [
      {
        label: "Voice + Conversations",
        href: "/products/voice",
        detail: "The product surface behind voice, SMS and messaging continuity.",
      },
      {
        label: "AI appointment setting",
        href: "/solutions/ai-appointment-setting",
        detail: "Turn the call into a slot that is genuinely available.",
      },
      {
        label: "AI lead response",
        href: "/solutions/ai-lead-response",
        detail: "The immediate first touch on every non-voice channel.",
      },
    ],
    cta: {
      title: "Listen to how your calls could be handled.",
      lede: "We walk a real call path — answer, qualify, book, escalate, record — against your routing rules and hours.",
      note: "No sales sequence. A reply within one business day.",
    },
  },

  "customer-reactivation": {
    slug: "customer-reactivation",
    navLabel: "Customer reactivation",
    eyebrow: "Solution · Reactivation",
    title: "Customer Reactivation — Recover Dormant Leads and Past Customers | QWA",
    description:
      "Customer reactivation re-engages dormant leads and past customers with segmented, consented outreach and measures what actually returned. Workflow, segmentation, integrations and implementation considerations.",
    h1: "Customer reactivation",
    answer:
      "Customer reactivation is the systematic re-engagement of contacts you already own — leads that never closed, quotes that went quiet, and customers who have not returned within their expected interval — using segmented, consented outreach that is measured by the revenue it actually recovers rather than by messages sent.",
    support:
      "Most databases contain more addressable demand than the current month's advertising. The difference is that reactivation demand is unstructured: it is spread across old records, partial histories and channels the business stopped using.",
    problem: {
      heading: "Why databases go quiet",
      lede: "Reactivation fails for reasons that have little to do with the message.",
      points: [
        "Nobody owns the dormant list, so it is worked in bursts when pipeline is thin and ignored otherwise.",
        "Segments are crude — one broad blast to everyone who ever enquired, which trains people to ignore you.",
        "Contact history is incomplete, so outreach references the wrong service or an interaction that never happened.",
        "Consent and opt-out state is unclear, which makes the whole exercise risky.",
        "Replies land in an inbox nobody is watching, so the ones that do respond are handled slowly.",
        "Recovered revenue is never separated from new revenue, so the effort cannot be justified again next quarter.",
      ],
    },
    workflow: {
      heading: "How a reactivation cycle runs",
      lede: "Segmentation and consent come before messaging; measurement comes before the next cycle.",
      steps: [
        {
          title: "Eligible population defined",
          detail:
            "Contacts are selected by real signals — last interaction, stage reached, service history, expected return interval — not by a single date cutoff.",
        },
        {
          title: "Consent and suppression applied",
          detail:
            "Opt-outs, do-not-contact flags, active opportunities and recent conversations are removed before anything is queued.",
        },
        {
          title: "Segments built",
          detail:
            "The population is split by why it went quiet, because a lost quote and a lapsed customer need different conversations.",
        },
        {
          title: "Outreach sequenced",
          detail:
            "Each segment gets a short, specific sequence across the channels that contact previously engaged on, with defined limits.",
        },
        {
          title: "Replies handled immediately",
          detail:
            "Responses enter the same first-response and qualification path as fresh inbound, so a warm reply is not left waiting.",
        },
        {
          title: "Booking or requalification",
          detail:
            "Interested contacts are booked or requalified; the rest are returned to the database with an updated state and reason.",
        },
        {
          title: "Suppression updated",
          detail:
            "Opt-outs, bad numbers and explicit no-thank-yous are written back so the next cycle never repeats the same contact.",
        },
        {
          title: "Recovered revenue reported",
          detail:
            "Outcomes are attributed to the reactivation cycle and reported separately from new-demand revenue.",
        },
      ],
    },
    useCases: {
      heading: "Segments worth building first",
      lede: "Each of these behaves differently and deserves its own conversation.",
      items: [
        {
          title: "Quoted, never closed",
          detail:
            "Contacts who received a price and went quiet, approached with a check-in rather than a repeat of the quote.",
        },
        {
          title: "Booked, never attended",
          detail:
            "No-shows and cancellations that were never rebooked, offered a straightforward path back to a slot.",
        },
        {
          title: "Lapsed customers",
          detail:
            "Past customers past their expected return interval, contacted with reference to what they actually bought.",
        },
        {
          title: "Unworked historical leads",
          detail:
            "Records that were never contacted properly the first time, treated as fresh rather than as follow-up.",
        },
        {
          title: "Seasonal and cyclical demand",
          detail:
            "Contacts whose need recurs on a predictable cycle, reached ahead of the window rather than after it.",
        },
        {
          title: "Service-specific upgrades",
          detail:
            "Existing customers eligible for an adjacent service, contacted only where the history genuinely supports it.",
        },
      ],
    },
    integration: {
      heading: "What it connects to",
      lede: "Reactivation quality is a data problem before it is a messaging problem.",
      items: [
        {
          title: "CRM and customer history",
          detail:
            "Stage, last interaction, service history and ownership determine eligibility and the wording of the approach.",
        },
        {
          title: "Messaging and voice",
          detail:
            "Outreach runs on the channels each contact previously engaged on, with consent state enforced per channel.",
        },
        {
          title: "Scheduling",
          detail:
            "An interested reply can reach live availability immediately instead of entering another wait.",
        },
        {
          title: "Attribution and reporting",
          detail:
            "Recovered revenue is tagged to the cycle and segment so the programme can be evaluated honestly.",
        },
      ],
    },
    considerations: {
      heading: "Implementation considerations",
      lede: "Reactivation is the easiest programme to damage a brand with. These constraints are not optional.",
      points: [
        "Verify consent per channel and per jurisdiction before the first send, and treat an unclear record as no consent.",
        "Apply frequency caps across the whole system so a reactivation sequence cannot stack on top of other outreach.",
        "Make opt-out immediate, honoured on every channel, and written back to the record that drives eligibility.",
        "Keep sequences short and specific; length is what turns reactivation into complaints.",
        "Start with one segment, review the transcripts, then widen — a full-database launch cannot be un-sent.",
        "Report recovered revenue separately from new demand, or the programme will be credited with revenue it did not create.",
      ],
    },
    faqs: [
      {
        question: "Which contacts should be excluded?",
        answer:
          "Anyone without valid consent for the channel, anyone with an active opportunity or recent conversation, prior opt-outs, and records where the history is too incomplete to write an accurate message.",
      },
      {
        question: "How is this different from an email blast?",
        answer:
          "Eligibility is built from interaction history rather than a list export, segments get different conversations, replies enter the live qualification path immediately, and outcomes are attributed back to the cycle.",
      },
      {
        question: "What stops it from annoying customers?",
        answer:
          "Frequency caps across the whole system, short sequences with explicit stop conditions, immediate opt-out handling, and suppression written back so the next cycle does not repeat a contact.",
      },
      {
        question: "How is recovered revenue attributed?",
        answer:
          "Outcomes from reactivated contacts are tagged to the cycle and segment and reported separately from new demand, so the programme is judged on incremental revenue rather than total revenue.",
      },
      {
        question: "How often should a cycle run?",
        answer:
          "That depends on your purchase interval and database size. The rule that matters is that a contact's frequency cap is enforced globally, whatever cadence the cycle runs on.",
      },
      {
        question: "Does it need clean data to work?",
        answer:
          "It needs accurate consent state and enough interaction history to write a specific message. Where history is thin, the contact belongs in a segment that is approached as new rather than as returning.",
      },
    ],
    related: [
      {
        label: "Revenue attribution",
        href: "/solutions/revenue-attribution",
        detail: "Separate recovered revenue from new demand, credibly.",
      },
      {
        label: "AI lead response",
        href: "/solutions/ai-lead-response",
        detail: "Handle reactivation replies at the same speed as fresh inbound.",
      },
      {
        label: "Revenue Engine",
        href: "/products/revenue-engine",
        detail: "Where the reactivation loop closes back into the record.",
      },
    ],
    cta: {
      title: "Find the revenue already in your database.",
      lede: "We size the addressable segments in your own records, with consent state applied, before anything is sent.",
      note: "No sales sequence. A reply within one business day.",
    },
  },

  "revenue-attribution": {
    slug: "revenue-attribution",
    navLabel: "Revenue attribution",
    eyebrow: "Solution · Attribution",
    title: "Revenue Attribution — Connect Spend to Closed Revenue | QWA",
    description:
      "Revenue attribution joins ad spend, calls, conversations and appointments to closed revenue with stated coverage and an explainable model. Workflow, integrations, limits and implementation considerations.",
    h1: "Revenue attribution",
    answer:
      "Revenue attribution is the practice of joining every touch a buyer made — ad click, call, conversation, appointment, rep — to the revenue that eventually closed, then reconciling that picture against the money actually recorded in your system of record. Done properly it produces a figure with stated coverage and a visible model, not a dashboard number nobody can defend.",
    support:
      "Attribution arguments are rarely about the model. They are about joins: the call that was never linked to the click, the sale that was never linked to the lead, the offline close that never made it back into the platform.",
    problem: {
      heading: "Why attribution loses credibility",
      lede: "Each of these produces a number that is technically calculated and practically unusable.",
      points: [
        "Ad platforms report their own conversions, so the same sale is claimed several times.",
        "Phone calls break the digital chain, and call tracking is not joined to the CRM outcome.",
        "Offline closes never return to the platform that generated the lead.",
        "Identity is fragmented, so one buyer looks like several anonymous journeys.",
        "The model is a black box, so nobody can test whether they agree with it.",
        "Coverage is never stated, so a figure built from 40% of revenue is presented as if it were all of it.",
      ],
    },
    workflow: {
      heading: "How attribution is built",
      lede: "The order matters: joins first, model second, reconciliation last.",
      steps: [
        {
          title: "Events collected",
          detail:
            "Clicks, sessions, form fills, calls, messages, appointments and CRM stage changes are captured with their identifiers.",
        },
        {
          title: "Identity resolved",
          detail:
            "Deterministic matches — phone, email, CRM id — are kept separate from probabilistic ones so confidence can be stated later.",
        },
        {
          title: "Journey assembled",
          detail:
            "Touches are ordered into one continuous record per buyer, across sessions, channels and devices.",
        },
        {
          title: "Model applied",
          detail:
            "An explicit contribution model with a stated window distributes credit, and the model travels with every figure it produces.",
        },
        {
          title: "Revenue joined",
          detail:
            "Closed revenue from CRM, commerce or payments is attached to the journey that produced it, in currency.",
        },
        {
          title: "Reconciliation",
          detail:
            "Attributed revenue is matched line by line against booked revenue; gaps, refunds and timing differences are itemised rather than netted away.",
        },
        {
          title: "Coverage stated",
          detail:
            "Every report publishes what share of revenue it could join, so a partial picture is never presented as a complete one.",
        },
        {
          title: "Fed back into decisions",
          detail:
            "Outcomes return to acquisition, creative and routing so attribution changes the next decision rather than ending in a monthly deck.",
        },
      ],
    },
    useCases: {
      heading: "Questions it is built to answer",
      lede: "Each of these needs a joined record; none can be answered from platform reporting alone.",
      items: [
        {
          title: "Which channels produce revenue, not leads",
          detail:
            "Comparing sources on closed revenue and margin rather than on form fills and cost per lead.",
        },
        {
          title: "What phone calls are worth",
          detail:
            "Joining tracked calls to the appointment and the sale, so voice is valued on outcome instead of volume.",
        },
        {
          title: "Which creative actually converts",
          detail:
            "Carrying creative identifiers all the way to closed revenue rather than stopping at click-through rate.",
        },
        {
          title: "Where budget is duplicated",
          detail: "Identifying revenue claimed by more than one platform and reporting it once.",
        },
        {
          title: "How long the cycle really takes",
          detail:
            "Measuring the real interval from first touch to close, which sets the correct attribution window.",
        },
        {
          title: "What reactivation recovered",
          detail:
            "Separating recovered revenue from new demand so both programmes are judged fairly.",
        },
      ],
    },
    integration: {
      heading: "What it connects to",
      lede: "Attribution is only as good as the systems it can read and reconcile against.",
      items: [
        {
          title: "Ad platforms",
          detail:
            "Campaign, ad set and creative identifiers, plus spend, imported for comparison against joined revenue.",
        },
        {
          title: "Telephony and call tracking",
          detail:
            "Call events tied to the session and the contact so the phone does not break the chain.",
        },
        {
          title: "CRM and scheduling",
          detail:
            "Stage changes, appointments and closed-won records supply the outcome side of the join.",
        },
        {
          title: "Commerce, payments and finance",
          detail:
            "Booked revenue, refunds and adjustments provide the ledger that attributed revenue is reconciled against.",
        },
      ],
    },
    considerations: {
      heading: "Implementation considerations",
      lede: "Stating the limits is what makes the number usable.",
      points: [
        "Agree the model and window with finance and marketing before publishing figures, and version the decision.",
        "Publish coverage alongside every report; an unstated denominator is how attribution loses trust.",
        "Keep deterministic and probabilistic matches distinguishable rather than blending them into one confidence-free number.",
        "Expect a permanent unattributed remainder — walk-ins, word of mouth, blocked tracking — and report it instead of redistributing it.",
        "Freeze closed periods so historical figures stop moving after finance has signed them.",
        "Treat attribution as an estimate that informs decisions, not as an accounting record; reconciliation is what keeps it honest.",
      ],
    },
    faqs: [
      {
        question: "Which attribution model does QWA use?",
        answer:
          "The model is a configuration, not a fixed rule. Whichever model and window you select travels with every figure it produces, and any figure can be re-run under a different model without altering the underlying events.",
      },
      {
        question: "How are phone calls attributed?",
        answer:
          "Call events are joined to the session, contact and campaign that produced them, and then to the appointment and closed revenue that followed, so calls are valued on outcome rather than on volume.",
      },
      {
        question: "What about revenue that closes offline?",
        answer:
          "Offline closes are joined through the CRM or payment record against the same contact, which is why the identity layer matters more than the model.",
      },
      {
        question: "Will attributed revenue match our finance numbers exactly?",
        answer:
          "No, and any vendor promising that is describing accounting rather than attribution. Attributed revenue is reconciled line by line against booked revenue, and the differences — timing, refunds, partial joins, unattributed revenue — are itemised.",
      },
      {
        question: "Why does coverage matter more than the model?",
        answer:
          "A sophisticated model applied to half your revenue is less useful than a simple model applied to nearly all of it. Coverage tells you how much of the picture the figure is based on.",
      },
      {
        question: "Does this replace our ad platform reporting?",
        answer:
          "It reconciles against it. Platform reporting stays useful for in-platform optimisation; joined revenue is what should decide budget between platforms.",
      },
    ],
    related: [
      {
        label: "Revenue Attribution product",
        href: "/products/attribution",
        detail: "The reconciliation layer in full technical detail.",
      },
      {
        label: "Business Intelligence",
        href: "/products/business-intelligence",
        detail: "Where the reconciled figures are reported and governed.",
      },
      {
        label: "Customer reactivation",
        href: "/solutions/customer-reactivation",
        detail: "Separate recovered revenue from newly created demand.",
      },
    ],
    cta: {
      title: "Trace one closed deal end to end.",
      lede: "We follow a single closed-won record backwards through the joins, the model and the reconciliation, and show where your current picture breaks.",
      note: "No sales sequence. A reply within one business day.",
    },
  },
};
