const form = document.getElementById('inquiryForm');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

form.addEventListener('submit', event => {
  const inquiry = form.inquiry.value;
  if (!inquiry) {
    event.preventDefault();
    alert('Please select the type of session you are inquiring about.');
    return;
  }

  const email = emailInput.value.trim();
  if (!email) {
    event.preventDefault();
    alert('Please enter your email so I can send your package details.');
    return;
  }

  event.preventDefault();
  const notice = document.getElementById('submitNotice');
  const submitButton = form.querySelector('button[type="submit"]');

  if (notice) {
    notice.textContent = 'Sending your inquiry…';
    notice.classList.add('visible');
  }

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
  }

  const formData = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to send inquiry.');
      }
      return response.json();
    })
    .then(() => {
      if (notice) {
        notice.textContent = 'Inquiry sent successfully.';
      }
      showConfirmation();
      form.reset();
    })
    .catch(err => {
      if (notice) {
        notice.textContent = 'Could not send the message from the page. Please email directly.';
      }
      console.error(err);
    })
    .finally(() => {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send inquiry';
      }
      setTimeout(() => {
        if (notice) {
          notice.classList.remove('visible');
          notice.textContent = '';
        }
      }, 4000);
    });
});

const modal = document.getElementById('confirmationModal');
const closeModal = document.getElementById('closeModal');

function showConfirmation() {
  if (!modal) return;
  modal.classList.add('visible');
  modal.setAttribute('aria-hidden', 'false');
}

function hideConfirmation() {
  if (!modal) return;
  modal.classList.remove('visible');
  modal.setAttribute('aria-hidden', 'true');
}

if (closeModal) {
  closeModal.addEventListener('click', hideConfirmation);
}

modal?.addEventListener('click', event => {
  if (event.target === modal) {
    hideConfirmation();
  }
});
