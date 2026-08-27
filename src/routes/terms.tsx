import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, LegalSection, PendingReview } from "@/components/qwa/legal-page";
import { pageHead } from "@/config/seo";

const title = "Terms — Quantum Web AI";
const description =
  "Terms governing use of the Quantum Web AI website, including demo requests and the accuracy of published product information.";

export const Route = createFileRoute("/terms")({
  head: () => pageHead({ path: "/terms", title, description }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of use for this website."
      intro="These terms cover this marketing website only. Sections marked for legal review require confirmation by the company and its counsel before launch."
    >
      <LegalSection heading="Scope">
        <p>
          This page governs your use of this website. It does not govern use of the Quantum Web AI
          platform itself, which is provided under a separate written agreement.
        </p>
      </LegalSection>

      <LegalSection heading="Demo requests">
        <p>
          Submitting the demo request form is a request for a conversation. It does not create a
          contract, reserve capacity, or commit either party to a purchase. Information you submit
          should be accurate and should not include confidential material belonging to a third
          party.
        </p>
      </LegalSection>

      <LegalSection heading="Product information">
        <p>
          Product descriptions, capabilities and outcome figures on this site describe the platform
          as designed and are provided for evaluation purposes. Specific results depend on your
          data, channels and configuration.
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <p>
          Do not attempt to disrupt the site, circumvent its rate limits or abuse-prevention
          measures, submit automated or fraudulent requests, or access non-public areas.
        </p>
      </LegalSection>

      <LegalSection heading="Intellectual property">
        <p>
          The content, design system and visual assets on this site belong to Quantum Web AI or its
          licensors and may not be reproduced without permission.
        </p>
      </LegalSection>

      <LegalSection heading="Legal terms requiring review">
        <PendingReview>
          Warranty disclaimers, limitation of liability, indemnification, governing law and venue,
          dispute resolution, the legal entity name and registered address, and the process for
          changes to these terms must be drafted or approved by counsel before launch.
        </PendingReview>
      </LegalSection>
    </LegalPage>
  );
}
