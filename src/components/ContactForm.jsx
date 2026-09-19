import { useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useSiteContent } from "../context/SiteContentContext.jsx";

import { isSupabaseConfigured, supabase } from "../lib/supabaseClient.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const { t } = useLanguage();
  const { contact } = t;
  const { content } = useSiteContent();
  const orgEmail = content.organization.email;
  const [values, setValues] = useState({ name: "", email: "", message: "", company: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  function handleChange(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = t.lang === "ne" ? "कृपया आफ्नो नाम लेख्नुहोस्।" : "Please enter your name.";
    if (!values.email.trim()) {
      next.email = t.lang === "ne" ? "कृपया आफ्नो इमेल ठेगाना लेख्नुहोस्।" : "Please enter your email address.";
    } else if (!EMAIL_RE.test(values.email.trim())) {
      next.email = t.lang === "ne" ? "कृपया मान्य इमेल ठेगाना लेख्नुहोस्।" : "Please enter a valid email address.";
    }
    if (!values.message.trim()) next.message = t.lang === "ne" ? "कृपया सन्देश लेख्नुहोस्।" : "Please enter a message.";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (values.company) {
      setStatus(t.lang === "ne" ? "धन्यवाद।" : "Thank you.");
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);

    if (nextErrors.name) {
      nameRef.current?.focus();
      return;
    }
    if (nextErrors.email) {
      emailRef.current?.focus();
      return;
    }
    if (nextErrors.message) {
      messageRef.current?.focus();
      return;
    }

    setSubmitting(true);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("contact_messages").insert([
          {
            name: values.name.trim(),
            email: values.email.trim(),
            message: values.message.trim(),
          },
        ]);
        if (!error) {
          setStatus(
            t.lang === "ne"
              ? "तपाईंको सन्देश सफलतापूर्वक पठाइयो। धन्यवाद!"
              : "Your message has been sent successfully. Thank you!"
          );
          setValues({ name: "", email: "", message: "", company: "" });
          setSubmitting(false);
          return;
        }
      } catch (err) {
        console.error("Failed to save contact message:", err);
      }
    }

    const subject = encodeURIComponent(`Message from ${values.name} via Model Disabled Society Rasuwa website`);
    const body = encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`);
    window.location.href = `mailto:${orgEmail}?subject=${subject}&body=${body}`;
    setStatus(
      t.lang === "ne"
        ? `इमेल पठाउनको लागि तपाईंको इमेल एप खोलिँदै छ (${orgEmail})।`
        : `Opening your email application to send this to ${orgEmail}.`
    );
    setSubmitting(false);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="contact-form">

      <div className="field">
        <label htmlFor="contact-name">{contact.formName}</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          ref={nameRef}
          value={values.name}
          onChange={handleChange("name")}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
        />
        {errors.name ? (
          <p id="contact-name-error" className="field-error" role="alert">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="contact-email">{contact.formEmail}</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          ref={emailRef}
          value={values.email}
          onChange={handleChange("email")}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        {errors.email ? (
          <p id="contact-email-error" className="field-error" role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="contact-message">{contact.formMessage}</label>
        <textarea
          id="contact-message"
          name="message"
          rows="6"
          ref={messageRef}
          value={values.message}
          onChange={handleChange("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message ? (
          <p id="contact-message-error" className="field-error" role="alert">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot — hidden from sighted users and, via aria-hidden and
          tabIndex -1, from screen-reader and keyboard navigation too. */}
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={handleChange("company")}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? (t.lang === "ne" ? "पठाउँदै..." : "Sending...") : contact.formSubmit}
      </button>

      <p aria-live="polite" className="form-status">
        {status}
      </p>
    </form>
  );
}
