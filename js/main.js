
document.addEventListener("DOMContentLoaded", () => {
    const messages = [
        // Tips
        "Did you know? You can explore my <a href='qualifications.html' class='highlight'>qualifications</a> in detail on the 'Qualifications' page!",
        "Check out my <a href='skills.html' class='highlight'>latest skills</a> and tools in the 'Skills' section.",
        "Want to collaborate? Head to the <a href='contact.html' class='highlight'>Contact Me</a> page!",
        "Learn about my <a href='about.html' class='highlight'>journey and values</a> on the 'About Me' page.",
        "Hover over icons for <span class='highlight'>hidden tips</span> throughout the site!",
        "Pro tip: <span class='highlight'>The navigation bar</span> is mobile-friendly!",
        "Don’t miss the <a href='faq.html' class='highlight'>FAQ section</a> for quick answers.",
        "Discover <span class='highlight'>projects I've worked on</span> in the portfolio section!",
        "Click the <span class='highlight'>hamburger menu</span> on smaller screens for quick navigation!",
        "Want to know my inspirations? Visit the <a href='interests.html' class='highlight'>Interests</a> page!",
        "Stay tuned for updates in my <span class='highlight'>blog section</span> (coming soon!).",
        "Good design isn't optional – explore the <span class='highlight'>importance of usability</span> in web development.",

        // Facts
        "Fact: <span class='highlight'>75%</span> of users judge a company's credibility based on their website design.",
        "A <span class='highlight'>1-second</span> delay in page load time can reduce conversions by <span class='highlight'>7%</span>!",
        "Mobile-friendly websites improve user retention by <span class='highlight'>67%</span>.",
        "Fact: A well-designed website can boost business credibility by <span class='highlight'>57%</span>.",
        "Optimized websites see <span class='highlight'>2x</span> higher engagement and conversion rates.",
        "Fact: Businesses without a website lose <span class='highlight'>30%</span> of potential customers.",
        "Websites with responsive design generate <span class='highlight'>30%</span> more traffic than non-responsive sites.",
        "Fact: <span class='highlight'>53%</span> of mobile users abandon a site if it takes more than 3 seconds to load.",
        "High-quality visuals can boost engagement by <span class='highlight'>94%</span>!",
        "Fact: An <span class='highlight'>outdated</span> website can lose you up to <span class='highlight'>50%</span> of potential leads.",
        "Did you know? A secure website increases customer trust by <span class='highlight'>85%</span>.",
        "Fact: Websites optimized for SEO receive <span class='highlight'>10x</span> more organic traffic than those that aren't.",
        "Every <span class='highlight'>$1</span> invested in user experience (UX) returns up to <span class='highlight'>$100</span> in benefits.",
        "Fact: <span class='highlight'>88%</span> of users are unlikely to return to a website after a bad experience.",
        "Nearly <span class='highlight'>50%</span> of small businesses still don't have a website – are you one of them?",
        "Website visitors form an opinion in <span class='highlight'>0.05 seconds</span> – make it count!",
        "Fact: Websites with videos convert customers <span class='highlight'>80%</span> better than those without.",
        "Having a blog increases your website traffic by <span class='highlight'>55%</span> on average.",
        "Fact: <span class='highlight'>70%</span> of small business websites lack a call-to-action – make sure yours doesn't!",
        "Responsive websites are critical: Over <span class='highlight'>60%</span> of web traffic comes from mobile devices.",
        "Pages that load in under <span class='highlight'>2 seconds</span> perform better in search rankings.",
        "Fact: <span class='highlight'>Google prioritizes</span> websites that are mobile-friendly and fast.",
        "Did you know? Proper website security can prevent <span class='highlight'>90%</span> of cyberattacks."
    ];


    // Get the splash message element
    const splashMessage = document.querySelector(".splash-message");

    // Generate a random index and set the message content
    const randomIndex = Math.floor(Math.random() * messages.length);
    splashMessage.innerHTML = messages[randomIndex]; // Use innerHTML to support highlighting
});

function loadComponent(filePath, elementId, callback) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (callback) callback();  // Run callback function after loading
        })
        .catch(error => console.error(`Error loading ${filePath}:`, error));
}

document.addEventListener("DOMContentLoaded", () => {
    // Load the header
    loadComponent("components/header.html", "header-component", () => {
        const hamburger = document.getElementById("hamburger");
        const navLinks = document.getElementById("nav-links");
        const closeNav = document.getElementById("close-nav");

        // Toggle navigation menu on hamburger click
        if (hamburger && navLinks) {
            hamburger.addEventListener("click", () => {
                navLinks.classList.add("active"); // Show the menu
            });
        }

        // Close navigation menu on close icon click
        if (closeNav && navLinks) {
            closeNav.addEventListener("click", () => {
                navLinks.classList.remove("active"); // Hide the menu
            });
        }

        // Optional: Close navigation when clicking outside the menu
        document.addEventListener("click", (event) => {
            if (!navLinks.contains(event.target) && event.target !== hamburger) {
                navLinks.classList.remove("active"); // Hide the menu
            }
        });

        const toggleSearch = document.getElementById("toggleSearch");
        const searchContainer = document.getElementById("searchContainer");
        const searchInput = document.getElementById("searchInput");
        const searchButton = document.getElementById("searchButton");

        // Define valid pages
        const validPages = ["index", "about", "skills", "qualifications", "interests", "contact"];

        // Function to validate if the page exists
        const validatePage = (pageName) => validPages.includes(pageName.toLowerCase());

        // Toggle search visibility
        toggleSearch.addEventListener("click", () => {
            searchContainer.classList.toggle("visible");
            if (searchContainer.classList.contains("visible")) {
                searchInput.focus(); // Focus on input when visible
            }
        });

        // Handle search button click
        searchButton.addEventListener("click", () => {
            const pageName = searchInput.value.trim();
            if (validatePage(pageName)) {
                window.location.href = `${pageName}.html`; // Redirect to the page
            } else {
                searchInput.classList.add("error"); // Add error styling
                setTimeout(() => searchInput.classList.remove("error"), 1000); // Remove error styling
            }
        });

        // Remove error styling on input change
        searchInput.addEventListener("input", () => {
            searchInput.classList.remove("error");
        });
    });

    // Load the footer
    loadComponent("components/footer.html", "footer-component");

    // Load the contact form
    loadComponent("components/contact-form.html", "contact-form-component", () => {
        const contactModal = document.getElementById("contactModal");
        const closeModal = document.getElementById("closeModal");
        const contactButtons = document.querySelectorAll(".contact-button");

        // Show modal when any contact button is clicked
        contactButtons.forEach(button => {
            button.addEventListener("click", () => {
                contactModal.style.display = "flex";
            });
        });

        // Hide modal when the close button is clicked
        closeModal.addEventListener("click", () => {
            contactModal.style.display = "none";
        });

        // Hide modal when clicking outside the modal content
        window.addEventListener("click", (event) => {
            if (event.target === contactModal) {
                contactModal.style.display = "none";
            }
        });
    });
});




document.addEventListener("DOMContentLoaded", () => {
    // Load the contact form and set up modal functionality
    loadComponent("components/contact-form.html", "contact-form-component", () => {
        const contactModal = document.getElementById("contactModal");
        const closeModal = document.getElementById("closeModal");
        const contactIcon = document.querySelector(".contact-icon"); // Select the icon in the header
        const contactButton = document.querySelector(".contact-button"); // Select the "Contact Me" button

        // Show modal when the contact icon is clicked
        if (contactIcon) {
            contactIcon.addEventListener("click", (event) => {
                event.preventDefault(); // Prevent page reload
                contactModal.style.display = "flex";
            });
        }

        // Show modal when the "Contact Me" button is clicked
        if (contactButton) {
            contactButton.addEventListener("click", (event) => {
                event.preventDefault(); // Prevent page reload
                contactModal.style.display = "flex";
            });
        }

        // Hide modal when the close button is clicked
        if (closeModal) {
            closeModal.addEventListener("click", () => {
                contactModal.style.display = "none";
            });
        }

        // Hide modal when clicking outside the modal content
        window.addEventListener("click", (event) => {
            if (event.target === contactModal) {
                contactModal.style.display = "none";
            }
        });
    });
});





document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.social-icons .icon').forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            const tooltip = icon.querySelector('.tooltip');
            const iconRect = icon.getBoundingClientRect();

            // Check if the tooltip will overflow above the viewport
            if (iconRect.top < tooltip.offsetHeight + 10) { // 10px buffer
                tooltip.style.bottom = 'auto';
                tooltip.style.top = '2.5rem';  // Position below icon if near top
            } else {
                tooltip.style.top = 'auto';
                tooltip.style.bottom = '2.5rem';  // Default position above icon
            }
        });
    });
});





document.addEventListener("DOMContentLoaded", function() {
    const showMoreButton = document.getElementById("show-more");
    const hiddenSkills = document.querySelectorAll(".skill-card.hidden");

    showMoreButton.addEventListener("click", function() {
        hiddenSkills.forEach(skill => {
            skill.classList.toggle("hidden");
        });

        // Update button text
        if (showMoreButton.innerText === "Show More") {
            showMoreButton.innerText = "Show Less";
        } else {
            showMoreButton.innerText = "Show More";
        }
    });
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("./service-worker.js")
        .then(() => console.log("Service Worker registered successfully."))
        .catch((error) => console.error("Service Worker registration failed:", error));
}

document.addEventListener("DOMContentLoaded", () => {
    // Simulate splash screen duration
    const splashScreen = document.getElementById("splashScreen");

    // Wait for 3 seconds before hiding the splash screen
    setTimeout(() => {
        splashScreen.style.opacity = "0"; // Fade out
        splashScreen.style.transition = "opacity 0.5s";

        // Remove the splash screen from the DOM after the fade-out
        setTimeout(() => {
            splashScreen.style.display = "none";
        }, 500); // Match the fade-out duration
    }, 3000); // 3000ms = 3 seconds
});


// Open FAQ Popup
function openFaqPopup() {
    document.getElementById("faq-popup").classList.remove("hidden");
}

// Close FAQ Popup
function closeFaqPopup() {
    document.getElementById("faq-popup").classList.add("hidden");
}


document.addEventListener("DOMContentLoaded", () => {
    const robot = document.getElementById("robot");
    const robotMessage = document.getElementById("robot-message");

    if (!robot) {
        console.error("Robot element not found in the DOM.");
        return;
    }

    const messages = [
        // Tips
        "Did you know? You can explore my <a href='qualifications.html' class='highlight'>qualifications</a> in detail on the 'Qualifications' page!",
        "Check out my <a href='skills.html' class='highlight'>latest skills</a> and tools in the 'Skills' section.",
        "Want to collaborate? Head to the <a href='contact.html' class='highlight'>Contact Me</a> page!",
        "Learn about my <a href='about.html' class='highlight'>journey and values</a> on the 'About Me' page.",
        "Hover over icons for <span class='highlight'>hidden tips</span> throughout the site!",
        "Pro tip: <span class='highlight'>The navigation bar</span> is mobile-friendly!",
        "Don’t miss the <a href='faq.html' class='highlight'>FAQ section</a> for quick answers.",
        "Discover <span class='highlight'>projects I've worked on</span> in the portfolio section!",
        "Click the <span class='highlight'>hamburger menu</span> on smaller screens for quick navigation!",
        "Want to know my inspirations? Visit the <a href='interests.html' class='highlight'>Interests</a> page!",
        "Stay tuned for updates in my <span class='highlight'>blog section</span> (coming soon!).",
        "Good design isn't optional – explore the <span class='highlight'>importance of usability</span> in web development.",

        // Facts
        "Fact: <span class='highlight'>75%</span> of users judge a company's credibility based on their website design.",
        "A <span class='highlight'>1-second</span> delay in page load time can reduce conversions by <span class='highlight'>7%</span>!",
        "Mobile-friendly websites improve user retention by <span class='highlight'>67%</span>.",
        "Fact: A well-designed website can boost business credibility by <span class='highlight'>57%</span>.",
        "Optimized websites see <span class='highlight'>2x</span> higher engagement and conversion rates.",
        "Fact: Businesses without a website lose <span class='highlight'>30%</span> of potential customers.",
        "Websites with responsive design generate <span class='highlight'>30%</span> more traffic than non-responsive sites.",
        "Fact: <span class='highlight'>53%</span> of mobile users abandon a site if it takes more than 3 seconds to load.",
        "High-quality visuals can boost engagement by <span class='highlight'>94%</span>!",
        "Fact: An <span class='highlight'>outdated</span> website can lose you up to <span class='highlight'>50%</span> of potential leads.",
        "Did you know? A secure website increases customer trust by <span class='highlight'>85%</span>.",
        "Fact: Websites optimized for SEO receive <span class='highlight'>10x</span> more organic traffic than those that aren't.",
        "Every <span class='highlight'>$1</span> invested in user experience (UX) returns up to <span class='highlight'>$100</span> in benefits.",
        "Fact: <span class='highlight'>88%</span> of users are unlikely to return to a website after a bad experience.",
        "Nearly <span class='highlight'>50%</span> of small businesses still don't have a website – are you one of them?",
        "Website visitors form an opinion in <span class='highlight'>0.05 seconds</span> – make it count!",
        "Fact: Websites with videos convert customers <span class='highlight'>80%</span> better than those without.",
        "Having a blog increases your website traffic by <span class='highlight'>55%</span> on average.",
        "Fact: <span class='highlight'>70%</span> of small business websites lack a call-to-action – make sure yours doesn't!",
        "Responsive websites are critical: Over <span class='highlight'>60%</span> of web traffic comes from mobile devices.",
        "Pages that load in under <span class='highlight'>2 seconds</span> perform better in search rankings.",
        "Fact: <span class='highlight'>Google prioritizes</span> websites that are mobile-friendly and fast.",
        "Did you know? Proper website security can prevent <span class='highlight'>90%</span> of cyberattacks."
    ];

    const getRandomMessage = () => {
        // Pick a random index
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    };

    const shakeRobot = () => {
        robot.classList.add("shake");
        setTimeout(() => {
            robot.classList.remove("shake");
        }, 500); // Matches CSS animation duration
    };

    const showMessage = () => {
        const randomMessage = getRandomMessage(); // Get a random message
        robotMessage.innerHTML = randomMessage; // Set the message content
        robotMessage.classList.add("visible"); // Show the message
        setTimeout(() => {
            robotMessage.classList.remove("visible"); // Hide the message after 5 seconds
        }, 5000);
    };

    const robotLoop = () => {
        setTimeout(() => {
            shakeRobot();
            showMessage();
            robotLoop(); // Repeat the loop
        }, 15000); // Every 15 seconds
    };

    robotLoop();

    // Manual trigger on click
    robot.addEventListener("click", () => {
        shakeRobot();
        showMessage();
    });
});
