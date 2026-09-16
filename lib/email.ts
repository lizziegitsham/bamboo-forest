import { Resend } from "resend";

const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
const TO_EMAIL = process.env.CONTACT_TO_EMAIL;

// Constructed lazily (not at module load) so the API route can still be
// collected during `next build` when RESEND_API_KEY isn't set yet.
function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Plus-addressing (e.g. paul+corporate@example.com) — most inboxes (Gmail,
// Google Workspace, etc.) can filter on this into a separate folder/label
// without needing a dedicated mailbox per category. A light-touch way to
// keep enquiry types separable now, with room to split further later.
function taggedEmail(tag: string) {
  if (!TO_EMAIL) throw new Error("CONTACT_TO_EMAIL is not configured");
  const [local, domain] = TO_EMAIL.split("@");
  return `${local}+${tag}@${domain}`;
}

export interface ContactSubmission {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function sendContactNotification(submission: ContactSubmission) {
  if (!TO_EMAIL) {
    throw new Error("CONTACT_TO_EMAIL is not configured");
  }

  await getResendClient().emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: submission.email,
    subject: submission.subject
      ? `New enquiry: ${submission.subject}`
      : `New enquiry from ${submission.name}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
      ${submission.subject ? `<p><strong>Subject:</strong> ${escapeHtml(submission.subject)}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(submission.message).replace(/\n/g, "<br />")}</p>
    `,
  });
}

export interface CorporateEnquiry {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  attendees?: string;
  format: string;
  message?: string;
}

export async function sendCorporateEnquiryNotification(enquiry: CorporateEnquiry) {
  await getResendClient().emails.send({
    from: FROM_EMAIL,
    to: taggedEmail("corporate"),
    replyTo: enquiry.email,
    subject: `New corporate enquiry: ${enquiry.companyName}`,
    html: `
      <p><strong>Company:</strong> ${escapeHtml(enquiry.companyName)}</p>
      <p><strong>Contact name:</strong> ${escapeHtml(enquiry.contactName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(enquiry.email)}</p>
      ${enquiry.phone ? `<p><strong>Phone:</strong> ${escapeHtml(enquiry.phone)}</p>` : ""}
      ${enquiry.attendees ? `<p><strong>Number of attendees:</strong> ${escapeHtml(enquiry.attendees)}</p>` : ""}
      <p><strong>Preferred format:</strong> ${escapeHtml(enquiry.format)}</p>
      ${enquiry.message ? `<p><strong>Details:</strong></p><p>${escapeHtml(enquiry.message).replace(/\n/g, "<br />")}</p>` : ""}
    `,
  });
}

export interface PrivateLessonEnquiry {
  name: string;
  email: string;
  phone?: string;
  format: string;
  availability?: string;
  message?: string;
}

export async function sendPrivateLessonEnquiryNotification(enquiry: PrivateLessonEnquiry) {
  await getResendClient().emails.send({
    from: FROM_EMAIL,
    to: taggedEmail("private"),
    replyTo: enquiry.email,
    subject: `New private lesson enquiry: ${enquiry.name}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(enquiry.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(enquiry.email)}</p>
      ${enquiry.phone ? `<p><strong>Phone:</strong> ${escapeHtml(enquiry.phone)}</p>` : ""}
      <p><strong>Preferred format:</strong> ${escapeHtml(enquiry.format)}</p>
      ${enquiry.availability ? `<p><strong>Availability:</strong> ${escapeHtml(enquiry.availability)}</p>` : ""}
      ${enquiry.message ? `<p><strong>Details:</strong></p><p>${escapeHtml(enquiry.message).replace(/\n/g, "<br />")}</p>` : ""}
    `,
  });
}

export async function sendNewsletterSignupNotification(email: string) {
  if (!TO_EMAIL) {
    throw new Error("CONTACT_TO_EMAIL is not configured");
  }

  await getResendClient().emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: "New newsletter signup",
    html: `<p>New newsletter signup: <strong>${escapeHtml(email)}</strong></p>
      <p>TODO: connect this to a proper mailing list provider — for now signups only notify by email.</p>`,
  });
}

export async function sendNewsletterWelcomeEmail(email: string) {
  await getResendClient().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome to Bamboo Forest Martial Arts",
    html: `
      <p>Thanks for signing up!</p>
      <p>
        [Placeholder welcome pack — replace with the real content: a
        welcome message, what to expect from the emails, and any starter
        resources (e.g. class info, what to bring, a getting-started guide).]
      </p>
      <p>See you on the mat.</p>
    `,
  });
}
