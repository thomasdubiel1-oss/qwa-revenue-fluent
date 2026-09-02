import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, LegalSection, PendingReview } from "@/components/qwa/legal-page";
import { pageHead } from "@/config/seo";

const title = "Privacy — Quantum Web AI";
const description =
  "How Quantum Web AI collects, stores and uses information submitted through this website, including demo requests and campaign attribution.";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead({ path: "/privacy", title, description }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="What this website collects, and why."
      intro="This page describes the actual technical behaviour of quantumwebai.com. Sections marked for legal review require confirmation by the company and its counsel before launch."
    >
      <LegalSection heading="Information you give us">
        <p>
          The demo request form collects your work email, full name, company, website, monthly lead
          volume, primary goal, and optionally a phone number and free-text notes. These fields are
          submitted only when you press “Request demo” and are stored so a member of the team can
          respond to your request.
        </p>
      </LegalSection>

      <LegalSection heading="Campaign attribution">
        <p>
          When you arrive from a campaign link, the site records first-touch campaign parameters
          (utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid), the
          referring site, and the first page you landed on. This is held in your browser’s session
          storage — it is first-party, cleared when you close the tab, and attached to a demo
          request only if you submit one.
        </p>
        <p>
          Alongside a submitted request we also store the page and call-to-action you submitted
          from, your browser’s user agent string, and a one-way hashed signal derived from your
          network address that is used solely for rate limiting and duplicate detection. The address
          itself is not stored.
        </p>
      </LegalSection>

      <LegalSection heading="Cookies and third-party tracking">
        <p>
          This site currently sets no advertising cookies and loads no third-party analytics, tag
          manager, or tracking SDK. The only browser storage in use is the first-party session
          storage described above, plus a local preference record if you change your storage
          settings.
        </p>
        <PendingReview>
          If a measurement provider (for example GA4, Google Tag Manager or PostHog) is enabled at
          launch, this section and the consent interface must be updated to name the provider, its
          purpose, and its data transfers before the tag is activated.
        </PendingReview>
      </LegalSection>

      <LegalSection heading="How the information is used">
        <p>
          Demo request details are used to contact you about your request, to prepare for that
          conversation, and to understand which channels produce qualified interest. Records may be
          forwarded to the customer relationship management system the company uses to manage
          inbound requests.
        </p>
        <p>We do not sell personal data.</p>
      </LegalSection>

      <LegalSection heading="Retention">
        <p>
          The system is configured with an automated purge routine for submitted requests and
          related event records. The current default retention window is 730 days from submission.
        </p>
        <PendingReview>
          The retention period, the legal basis for processing, and any market-specific rights
          (including GDPR/UK GDPR and CCPA/CPRA disclosures) must be confirmed by counsel and stated
          here before launch.
        </PendingReview>
      </LegalSection>

      <LegalSection heading="Your choices">
        <p>
          You can decline to submit the form; nothing is stored until you do. To request access to,
          correction of, or deletion of a submitted request, contact us using the address published
          below.
        </p>
        <PendingReview>
          Contact address for privacy requests, the legal entity name and registered address, the
          governing jurisdiction, and any data protection representative must be supplied by the
          owner.
        </PendingReview>
      </LegalSection>
    </LegalPage>
  );
}
