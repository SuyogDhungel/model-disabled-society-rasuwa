import { useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useSiteContent } from "../context/SiteContentContext.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Every field here has its own unique id/label pair — Sabal Nepal's audit
 * (SBL-03) found all five Contact-form fields sharing one duplicated id, so
 * only the first field ever got a working label. BDS Nepal's Contact form
 * (BDS-07) failed outright because its CAPTCHA couldn't be completed with a
 * keyboard or NVDA at all, so this form uses an invisible honeypot field
 * instead of any interactive challenge.
 *
 * There is no backend wired up yet (see the delivery notes), so a valid
 * submission opens the visitor's own email app with the message pre-filled,
 * addressed to the organisation's real email address, rather than silently
 * pretending to have sent it.
 */
export default function ContactForm() {
  const { t } = useLanguage();
  const { contact } = t;
  const { content } = useSiteContent();
  const orgEmail = content.organization.email;
  const [values, setValues] = useState({ name: "", email: "", message: "", company: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  function handleChange(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!values.email.trim()) {
      next.email = "Please enter your email address.";
    } else if (!EMAIL_RE.test(values.email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (!values.message.trim()) next.message = "Please enter a message.";
    return next;
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Honeypot: real visitors never see or fill this field. If it has a
    // value, quietly drop the submission rather than pretending it worked.
    if (values.company) {
      setStatus("Thank you.");
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

    const subject = encodeURIComponent(`Message from ${values.name} via the website`);
    const body = encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`);
    window.location.href = `mailto:${orgEmail}?subject=${subject}&body=${body}`;
    setStatus(`Opening your email app to send this to ${orgEmail}.`);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="contact-form">
      <p className="form-note">{contact.formNote}</p>

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

      <button type="submit" className="btn btn-primary">
        {contact.formSubmit}
      </button>

      <p aria-live="polite" className="form-status">
        {status}
      </p>
    </form>
  );
}
