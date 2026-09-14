// ===============================
// CONFIGURATION
// ===============================
// Paste your Google Apps Script Web App URL here after creating it.
// Example: https://script.google.com/macros/s/XXXXXXXX/exec
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbybCDY89cKOlhhoQmQMeX2MceQGhDVBfAKUJXGk4ic55Axtq4h_vHjbYyfKxxhBKbR3YA/exec";

// Add the VERIFIED Google review URL here.
// Do not invent or guess this URL.
const GOOGLE_REVIEW_URL = "ADD_GOOGLE_REVIEW_URL_HERE";

// Add a VERIFIED WhatsApp/mobile number in international format WITHOUT + or spaces.
// Example: "923001234567"
// Do not put the clinic landline here unless it is actually registered on WhatsApp.
const WHATSAPP_NUMBER = "923338383934";

// Add the VERIFIED Google Maps URL here.
// Do not invent or guess this URL.
const GOOGLE_MAPS_URL = "ADD_GOOGLE_MAPS_URL_HERE";

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll("#mainNav a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

function setStatus(element, message, type) {
  element.textContent = message;
  element.className = "form-status " + type;
}

function validConfig(value) {
  return value && !value.startsWith("ADD_");
}

// ===============================
// GOOGLE SHEETS: APPOINTMENTS
// ===============================
async function submitAppointmentToGoogleSheet(data) {
  if (!validConfig(GOOGLE_SCRIPT_URL)) {
    // Website still works as a demo until the Apps Script URL is added.
    console.warn("Google Sheets is not connected yet.");
    return { success: true, demo: true };
  }

  const response = await fetch(https://script.google.com/macros/s/AKfycbybCDY89cKOlhhoQmQMeX2MceQGhDVBfAKUJXGk4ic55Axtq4h_vHjbYyfKxxhBKbR3YA/exec, {
    method: "POST",
    body: JSON.stringify({
      type: "appointment",
      name: data.name,
      phone: data.phone,
      email: data.email,
      department: data.department,
      doctor: data.doctor,
      date: data.date,
      time: data.time,
      message: data.message
    })
  });

  return response.json();
}

// ===============================
// GOOGLE SHEETS: FEEDBACK
// ===============================
async function submitFeedbackToGoogleSheet(data) {
  if (!validConfig(GOOGLE_SCRIPT_URL)) {
    console.warn("Google Sheets is not connected yet.");
    return { success: true, demo: true };
  }

  const response = await fetch(https://script.google.com/macros/s/AKfycbybCDY89cKOlhhoQmQMeX2MceQGhDVBfAKUJXGk4ic55Axtq4h_vHjbYyfKxxhBKbR3YA/exec, {
    method: "POST",
    body: JSON.stringify({
      type: "feedback",
      name: data.name,
      email: data.email,
      rating: data.rating,
      message: data.message
    })
  });

  return response.json();
}

// ===============================
// APPOINTMENT FORM
// ===============================
const appointmentForm = document.getElementById("appointmentForm");
const appointmentStatus = document.getElementById("appointmentStatus");

appointmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!appointmentForm.checkValidity()) {
    appointmentForm.reportValidity();
    return;
  }

  const data = Object.fromEntries(new FormData(appointmentForm).entries());

  setStatus(appointmentStatus, "Sending appointment request...", "success");

  try {
    const result = await submitAppointmentToGoogleSheet(data);

    if (result.success) {
      appointmentForm.reset();
      setStatus(
        appointmentStatus,
        result.demo
          ? "Appointment form is working. Connect Google Sheets to save submissions."
          : "Appointment request submitted successfully. Thank you!",
        "success"
      );
    } else {
      throw new Error(result.message || "Submission failed");
    }
  } catch (error) {
    console.error(error);
    setStatus(
      appointmentStatus,
      "Unable to submit right now. Please call the clinic directly.",
      "error"
    );
  }
});

// ===============================
// STAR RATING
// ===============================
const starPicker = document.getElementById("starPicker");
const ratingValue = document.getElementById("ratingValue");

starPicker.querySelectorAll("button").forEach(button => {
  button.addEventListener("click", () => {
    const rating = Number(button.dataset.rating);
    ratingValue.value = rating;

    starPicker.querySelectorAll("button").forEach(star => {
      star.classList.toggle(
        "active",
        Number(star.dataset.rating) <= rating
      );
    });
  });
});

// ===============================
// FEEDBACK FORM
// ===============================
const feedbackForm = document.getElementById("feedbackForm");
const feedbackStatus = document.getElementById("feedbackStatus");

feedbackForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!feedbackForm.checkValidity()) {
    feedbackForm.reportValidity();
    return;
  }

  if (!ratingValue.value) {
    setStatus(feedbackStatus, "Please select a rating.", "error");
    return;
  }

  const data = Object.fromEntries(new FormData(feedbackForm).entries());

  setStatus(feedbackStatus, "Sending feedback...", "success");

  try {
    const result = await submitFeedbackToGoogleSheet(data);

    if (result.success) {
      feedbackForm.reset();
      ratingValue.value = "";
      starPicker.querySelectorAll("button").forEach(star => {
        star.classList.remove("active");
      });

      setStatus(
        feedbackStatus,
        result.demo
          ? "Feedback form is working. Connect Google Sheets to save submissions."
          : "Thank you! Your feedback was submitted successfully.",
        "success"
      );
    } else {
      throw new Error(result.message || "Submission failed");
    }
  } catch (error) {
    console.error(error);
    setStatus(
      feedbackStatus,
      "Unable to submit right now. Please try again later.",
      "error"
    );
  }
});

// ===============================
// GOOGLE REVIEW BUTTON
// ===============================
const googleReviewBtn = document.getElementById("googleReviewBtn");

if (validConfig(GOOGLE_REVIEW_URL)) {
  googleReviewBtn.href = GOOGLE_REVIEW_URL;
} else {
  googleReviewBtn.addEventListener("click", event => {
    event.preventDefault();
    alert("Add the verified Google Review URL in script.js first.");
  });
}

// ===============================
// GOOGLE MAPS BUTTON
// ===============================
const mapsBtn = document.getElementById("mapsBtn");

if (validConfig(GOOGLE_MAPS_URL)) {
  mapsBtn.href = GOOGLE_MAPS_URL;
} else {
  mapsBtn.addEventListener("click", event => {
    event.preventDefault();
    alert("Add the verified Google Maps URL in script.js first.");
  });
}

// ===============================
// WHATSAPP BUTTON
// ===============================
const whatsappBtn = document.getElementById("whatsappBtn");

if (validConfig(WHATSAPP_NUMBER)) {
  whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}`;
  whatsappBtn.target = "_blank";
  whatsappBtn.rel = "noopener";
  whatsappBtn.classList.remove("disabled");
  whatsappBtn.title = "Chat on WhatsApp";
} else {
  whatsappBtn.addEventListener("click", event => {
    event.preventDefault();
    alert("Add a verified WhatsApp number in script.js first.");
  });
}
