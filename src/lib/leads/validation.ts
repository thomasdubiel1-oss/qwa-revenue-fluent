export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const FREE_EMAIL = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
];

export type DemoFormValues = {
  email: string;
  name: string;
  company: string;
  website: string;
  monthlyLeads: string;
  primaryGoal: string;
  phone: string;
  notes: string;
  consent: boolean;
};

export function validateDemoForm(values: DemoFormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.email.trim()) errors["email"] = "Enter your work email.";
  else if (!EMAIL_RE.test(values.email.trim())) errors["email"] = "Enter a valid email address.";
  else if (FREE_EMAIL.includes(values.email.split("@")[1]?.toLowerCase() ?? ""))
    errors["email"] = "Please use your work email so we can prepare for the session.";

  if (values.name.trim().length < 2) errors["name"] = "Enter your full name.";
  if (values.company.trim().length < 2) errors["company"] = "Enter your company name.";

  const site = values.website.trim();
  if (!site) errors["website"] = "Enter your website.";
  else if (!/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(site.replace(/^https?:\/\//i, "")))
    errors["website"] = "Enter a valid domain, e.g. northline.com";

  if (!values.monthlyLeads) errors["monthlyLeads"] = "Select a monthly lead volume.";
  if (!values.primaryGoal) errors["primaryGoal"] = "Select your primary goal.";

  const phone = values.phone.trim();
  if (phone && phone.replace(/\D/g, "").length < 7) errors["phone"] = "Enter a reachable number.";

  if (values.notes.length > 1000) errors["notes"] = "Please keep this under 1000 characters.";
  if (!values.consent) errors["consent"] = "Please confirm we may contact you about this request.";

  return errors;
}

/** Minimum time a human plausibly needs to complete the form. */
export const MIN_FILL_MS = 2500;
