// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAGQQ-gk0YwjwVAPLqPXVdfzGNMSLKZL3I",
    authDomain: "wp-portfolio-d8e69.firebaseapp.com",
    projectId: "wp-portfolio-d8e69",
    databaseURL: "https://wp-portfolio-d8e69-default-rtdb.firebaseio.com/",
    storageBucket: "wp-portfolio-d8e69.appspot.com",
    messagingSenderId: "69016885179",
    appId: "1:69016885179:web:d30fe16e47e556c672d69e",
    measurementId: "G-DKFWNXZJNV"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let correctAnswer = 0; // Store the correct answer for the captcha

// Function to generate a random math problem
const generateMathProblem = () => {
    const mathProblemElement = document.getElementById('mathProblem');
    const num1 = 6
    const num2 = 5
    correctAnswer = num1 + num2;

    if (mathProblemElement) {
        mathProblemElement.textContent = `Solve this: ${num1} + ${num2} = ?`;
    }
};

// Function to validate the math problem input
const validateCaptcha = () => {
    const captchaInput = document.getElementById('captcha');
    const submitButton = document.getElementById('submit');

    if (captchaInput && submitButton) {
        const userInput = parseInt(captchaInput.value.trim(), 10);
        if (userInput === correctAnswer) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }
};

// Function to handle form submission
const handleFormSubmission = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const form = e.target; // Reference to the form element
    const name = form.querySelector('#name').value;
    const email = form.querySelector('#email').value;
    const subject = form.querySelector('#subject').value;
    const message = form.querySelector('#message').value;
    const submit = form.querySelector('#submit');
    const responseDiv = document.querySelector('#formResponse');

    try {
        // Add form data to Firestore
        await addDoc(collection(db, 'contactForms'), { name, email, subject, message });

        // Show success message
        responseDiv.style.display = 'block';
        responseDiv.style.color = 'green';
        responseDiv.textContent = 'Your message has been sent successfully!';
        form.reset(); // Reset the form

        // Disable the submit button and generate a new math problem
        submit.disabled = true;
        generateMathProblem();
    } catch (error) {
        // Show error message
        responseDiv.style.display = 'block';
        responseDiv.style.color = 'red';
        responseDiv.textContent = `Error: ${error.message}`;
    }
};

// Attach event listener dynamically to the form
const attachFormListener = () => {
    const form = document.getElementById('contactForm');
    const captchaInput = document.getElementById('captcha');

    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }

    if (captchaInput) {
        captchaInput.addEventListener('input', validateCaptcha); // Add input validation for the captcha
    }

    // Generate the initial math problem
    generateMathProblem();
};

// Use a MutationObserver to detect dynamic loading
const observer = new MutationObserver(() => {
    attachFormListener();
});

// Observe the body for dynamic content changes
observer.observe(document.body, { childList: true, subtree: true });

// Initial attempt to attach the listener in case the form is already loaded
document.addEventListener('DOMContentLoaded', attachFormListener);
