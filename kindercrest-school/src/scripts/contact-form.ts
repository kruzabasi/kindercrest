type MessageState = 'empty' | 'short' | 'ready' | 'long';

type ContactFormValues = {
  email: string;
  message: string;
  name: string;
};

const getWordCount = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

const parseWordLimit = (value: string | undefined, fallback: number) => {
  const limit = Number(value);
  return Number.isFinite(limit) && limit > 0 ? limit : fallback;
};

const getMessageState = (words: number, minWords: number, maxWords: number): MessageState => {
  if (words > maxWords) return 'long';
  if (words >= minWords) return 'ready';
  if (words > 0) return 'short';
  return 'empty';
};

const getHelpText = (state: MessageState, words: number, minWords: number, maxWords: number) => {
  if (state === 'long') return `Please shorten your message to ${maxWords} words or fewer.`;
  if (state === 'ready') return 'This gives us enough context to respond clearly.';
  if (state === 'empty') return `Aim for ${minWords} to ${maxWords} words so we have enough context to respond well.`;

  const remainingWords = minWords - words;
  return `${remainingWords} more word${remainingWords === 1 ? '' : 's'} needed.`;
};

const setMessageValidity = (message: HTMLTextAreaElement, state: MessageState, minWords: number, maxWords: number) => {
  if (state === 'long') {
    message.setCustomValidity(`Please keep your message to ${maxWords} words or fewer.`);
    return;
  }

  if (state === 'short') {
    message.setCustomValidity(`Please write at least ${minWords} words.`);
    return;
  }

  message.setCustomValidity('');
};

const getFieldValue = (form: HTMLFormElement, name: keyof ContactFormValues) => {
  const field = form.elements.namedItem(name);

  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
    return field.value.trim();
  }

  return '';
};

const getContactFormValues = (form: HTMLFormElement): ContactFormValues => ({
  email: getFieldValue(form, 'email'),
  message: getFieldValue(form, 'message'),
  name: getFieldValue(form, 'name')
});

export const buildMailtoHref = (recipient: string, subject: string, values: ContactFormValues) => {
  const body = [`Name: ${values.name}`, `Email: ${values.email}`, '', 'Message:', values.message].join('\n');

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const initContactForm = (form: HTMLFormElement) => {
  const message = form.querySelector<HTMLTextAreaElement>('[data-message-field]');
  const count = form.querySelector<HTMLElement>('[data-message-count]');
  const help = form.querySelector<HTMLElement>('[data-message-help]');
  const status = form.querySelector<HTMLElement>('[data-form-status]');

  if (!message || !count || !help || !status) return;

  const fields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea'));
  const minWords = parseWordLimit(message.dataset.minWords, 12);
  const maxWords = parseWordLimit(message.dataset.maxWords, 180);
  const recipient = form.dataset.recipient ?? '';
  const subject = form.dataset.subject ?? 'Kindercrest Parent Enquiry';
  const successMessage =
    form.dataset.successMessage ?? 'Your email app should open with your message. If it does not, please email us directly.';
  let hasSubmitAttempt = false;

  const updateFieldStates = () => {
    fields.forEach((field) => {
      const label = field.closest('label');
      if (!label) return;

      label.dataset.invalid = hasSubmitAttempt && !field.validity.valid ? 'true' : 'false';
    });
  };

  const updateMessageState = () => {
    const words = getWordCount(message.value);
    const state = getMessageState(words, minWords, maxWords);

    count.textContent = `${words} / ${maxWords} words`;
    form.dataset.messageState = state;
    help.textContent = getHelpText(state, words, minWords, maxWords);
    setMessageValidity(message, state, minWords, maxWords);
    updateFieldStates();
  };

  fields.forEach((field) => {
    field.addEventListener('input', () => {
      status.textContent = '';
      updateMessageState();
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    hasSubmitAttempt = true;
    updateMessageState();

    if (!form.checkValidity()) {
      updateFieldStates();
      return;
    }

    updateFieldStates();
    const mailtoHref = buildMailtoHref(recipient, subject, getContactFormValues(form));
    const submitEvent = new CustomEvent('kindercrest:contact-submit', {
      cancelable: true,
      detail: { mailtoHref }
    });

    status.textContent = successMessage;

    if (form.dispatchEvent(submitEvent)) {
      window.location.href = mailtoHref;
    }
  });

  updateMessageState();
};

if (typeof document !== 'undefined') {
  document.querySelectorAll<HTMLFormElement>('[data-contact-form]').forEach(initContactForm);
}
