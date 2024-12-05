document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("currencyConverterForm");
    const errorMessage = document.getElementById("errorMessage");
    const conversionResult = document.getElementById("conversionResult");
    const convertedAmount = document.getElementById("convertedAmount");
    const exchangeRate = document.getElementById("exchangeRate");
    const timestamp = document.getElementById("timestamp");
    const convertButton = document.getElementById("convertButton");
    const loadingIndicator = document.getElementById("loadingIndicator");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const sourceCurrency = document.getElementById("sourceCurrency").value;
        const destinationCurrency = document.getElementById("destinationCurrency").value;
        const amount = parseFloat(document.getElementById("amount").value);

        // Input validation
        if (amount <= 0 || isNaN(amount)) {
            errorMessage.textContent = "Error: Amount must be greater than 0.";
            errorMessage.style.display = "block";
            return;
        }
        if (amount > 1000000) {
            errorMessage.textContent = "Error: Amount exceeds the upper limit of 1,000,000.";
            errorMessage.style.display = "block";
            return;
        }

        errorMessage.style.display = "none";

        // Disable the button and show the loading indicator
        convertButton.disabled = true;
        loadingIndicator.style.display = "block";

        try {
            const response = await fetch(`https://www.floatrates.com/daily/${sourceCurrency.toLowerCase()}.json`);
            if (!response.ok) throw new Error("Failed to fetch exchange rate. Please try again later.");

            const rates = await response.json();
            if (!rates[destinationCurrency.toLowerCase()]) {
                throw new Error("Conversion not supported for the selected currencies.");
            }

            const rate = rates[destinationCurrency.toLowerCase()].rate;
            const lastUpdated = new Date(rates[destinationCurrency.toLowerCase()].date);
            const converted = (amount * rate).toFixed(2);

            // Update results
            convertedAmount.textContent = `${amount} ${sourceCurrency} = ${converted} ${destinationCurrency}`;
            exchangeRate.textContent = `1 ${sourceCurrency} = ${rate.toFixed(2)} ${destinationCurrency}`;
            timestamp.textContent = `Last Updated: ${lastUpdated.toLocaleString("en-GB", { timeZone: "Europe/London" })}`;

            conversionResult.style.display = "block";
        } catch (error) {
            errorMessage.textContent = `Error: ${error.message}`;
            errorMessage.style.display = "block";
        } finally {
            // Re-enable the button and hide the loading indicator
            convertButton.disabled = false;
            loadingIndicator.style.display = "none";
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const amountInput = document.getElementById("amount");

    // Function to format input as a real number (0.00)
    const formatAmount = () => {
        let value = amountInput.value.replace(/[^0-9.]/g, ""); // Allow only numbers and periods
        const parts = value.split(".");

        if (parts.length > 2) {
            value = parts[0] + "." + parts[1]; // Keep only the first decimal part
        }

        if (parts[1]?.length > 2) {
            value = parts[0] + "." + parts[1].slice(0, 2); // Limit to two decimal places
        }

        if (value === "") {
            value = "0.00";
        } else if (!value.includes(".")) {
            value += ".00";
        } else if (value.endsWith(".")) {
            value += "00";
        } else if (value.split(".")[1].length === 1) {
            value += "0"; // Ensure two decimal places
        }

        amountInput.value = value;
    };

    // Add event listener for formatting on blur and input
    amountInput.addEventListener("blur", formatAmount);
    amountInput.addEventListener("input", () => {
        if (!/^\d*\.?\d*$/.test(amountInput.value)) {
            amountInput.value = amountInput.value.replace(/[^0-9.]/g, "");
        }
    });

    // Ensure the input is formatted on page load
    formatAmount();
});

