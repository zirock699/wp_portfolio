document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("fuelCostChart").getContext("2d");

    let fuelData = [];
    let currentMode = "historical"; // Modes: "historical" or "forecast"
    let currentStartIndex = 0;

    const fuelTypes = {
        solidFuels: { id: "solidFuels", label: "Solid Fuels", color: "rgba(255, 99, 132, 0.7)", dataKey: "SolidFuels" },
        gas: { id: "gas", label: "Gas", color: "rgba(54, 162, 235, 0.7)", dataKey: "Gas" },
        electricity: { id: "electricity", label: "Electricity", color: "rgba(255, 206, 86, 0.7)", dataKey: "Electricity" },
        liquidFuels: { id: "liquidFuels", label: "Liquid Fuels", color: "rgba(75, 192, 192, 0.7)", dataKey: "LiquidFuels" },
    };
    //
    // const chart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels: [],
    //         datasets: [],
    //     },
    //     options: {
    //         responsive: true,
    //         plugins: {
    //             legend: { position: 'top' },
    //             title: { display: true, text: 'Fuel Costs Over Time' },
    //         },
    //         scales: {
    //             x: { title: { display: true, text: "Time (Month/Year)" } },
    //             y: { title: { display: true, text: "Price (pence)" } },
    //         },
    //     },
    // });
    Chart.register({
        id: 'noDataPlugin',
        beforeDraw(chart) {
            const { datasets } = chart.data;
            const hasData = datasets && datasets.some(dataset => dataset.data.length > 0);

            if (!hasData) {
                const ctx = chart.ctx;
                const { width, height } = chart;
                ctx.save();

                // Display a message in the middle of the chart
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#666';
                ctx.fillText(
                    'No data available. Please select at least one fuel type to see the graph.',
                    width / 2,
                    height / 2
                );

                ctx.restore();
            }
        },
    });


    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allow the chart to resize freely
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 15, // Reduce legend box size for small screens
                        font: {
                            size: 10, // Smaller font for the legend
                        },
                    },
                },
                title: {
                    display: true,
                    text: 'Fuel Costs Over Time',
                    font: {
                        size: 16, // Dynamic font size
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Time (Month/Year)",
                        font: {
                            size: 12,
                        },
                    },
                    ticks: {
                        font: {
                            size: 10, // Smaller font for x-axis labels
                        },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Price (pence)",
                        font: {
                            size: 12,
                        },
                    },
                    ticks: {
                        font: {
                            size: 10, // Smaller font for y-axis labels
                        },
                    },
                },
            },
            layout: {
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10,
                },
            },
        },
    });




    fetch("data/cleaned_fuel_prices.csv")
        .then(response => response.text())
        .then(data => processCSVData(data))
        .then(parsedData => {
            fuelData = parsedData;
            currentStartIndex = Math.max(0, fuelData.length - 12); // Start with the last 12 months
            updateChart(chart, getChartData(fuelData, currentStartIndex, "historical"));
        })
        .catch(error => console.error("Error loading data:", error));

    // Process CSV Data into JSON
    function processCSVData(csv) {
        const rows = csv.split("\n");
        const headers = rows[0].split(",");
        return rows.slice(1).map(row => {
            const values = row.split(",");
            return headers.reduce((acc, header, index) => {
                acc[header.trim()] = values[index] ? values[index].trim() : null;
                return acc;
            }, {});
        });
    }



    function getChartData(data, startIndex, mode) {
        const chartLabels = [];
        const datasets = [];
        const range = 12;

        if (mode === "forecast") {
            const lastDate = new Date(`${data[data.length - 1].Month} 1, ${data[data.length - 1].Year}`);
            for (let i = 1; i <= range; i++) {
                const forecastDate = new Date(lastDate);
                forecastDate.setMonth(lastDate.getMonth() + i);
                chartLabels.push(forecastDate.toLocaleString("en-GB", { month: "long", year: "numeric" }));
            }
        } else {
            for (let i = startIndex; i < Math.min(startIndex + range, data.length); i++) {
                chartLabels.push(`${data[i].Month} ${data[i].Year}`);
            }
        }

        Object.values(fuelTypes).forEach(fuel => {
            const checkbox = document.getElementById(fuel.id);
            if (checkbox.checked) {
                const fuelDataPoints = [];
                for (let i = 0; i < range; i++) {
                    if (mode === "forecast") {
                        fuelDataPoints.push(calculateForecast(data, i, fuel.dataKey));
                    } else if (data[startIndex + i]) {
                        fuelDataPoints.push(parseFloat(data[startIndex + i][fuel.dataKey]));
                    }
                }
                datasets.push({
                    label: fuel.label,
                    data: fuelDataPoints.map(val => parseFloat(val.toFixed(1))),
                    borderColor: fuel.color,
                    backgroundColor: fuel.color,
                    fill: false,
                });
            }
        });

        // Return empty datasets if no checkboxes are selected
        return { labels: chartLabels, datasets: datasets.length > 0 ? datasets : [] };
    }




    function updateChart(chart, chartData) {
        chart.data.labels = chartData.labels;
        chart.data.datasets = chartData.datasets;
        chart.update();
    }

    function setMode(mode, chart) {
        const historicalButton = document.getElementById("historicalMode");
        const forecastButton = document.getElementById("forecastMode");

        if (mode === "historical") {
            currentMode = "historical";
            currentStartIndex = Math.max(0, fuelData.length - 12);
            document.getElementById("navControls").style.display = "block"; // Enable navigation
            chart.options.plugins.title.text = "Fuel Costs Over Time (Historical Mode)";
            historicalButton.classList.add("active");
            forecastButton.classList.remove("active");
        } else if (mode === "forecast") {
            currentMode = "forecast";
            currentStartIndex = fuelData.length - 12; // Base forecast on last 12 months
            document.getElementById("navControls").style.display = "none"; // Disable navigation
            chart.options.plugins.title.text = "Fuel Costs Over Time (Forecast Mode)";
            forecastButton.classList.add("active");
            historicalButton.classList.remove("active");
        }

        updateChart(chart, getChartData(fuelData, currentStartIndex, mode));
    }



    // function calculateForecast(data, index, key) {
    //     const historicalData = data.slice(index - 12, index).map(entry => parseFloat(entry[key]));
    //     const avgChange = historicalData.reduce((sum, value, idx, array) => {
    //         if (idx > 0) sum += value - array[idx - 1];
    //         return sum;
    //     }, 0) / (historicalData.length - 1 || 1);
    //     return parseFloat(data[index][key]) + avgChange;
    // }
    function calculateForecast(data, forecastIndex, key) {
        // Use the last 12 months for forecasting
        const historicalData = data.slice(-12).map(entry => parseFloat(entry[key]));

        // Ensure the historical data is valid
        if (historicalData.length < 2) {
            console.error("Insufficient data for forecasting");
            return NaN;
        }

        // Calculate the average change per month
        let totalChange = 0;
        let count = 0;

        for (let i = 1; i < historicalData.length; i++) {
            const change = historicalData[i] - historicalData[i - 1];
            totalChange += change;
            count++;
        }

        const avgChange = totalChange / count; // Average monthly change

        // Ensure the average change is positive to reflect upward trends
        const adjustedAvgChange = avgChange < 0 ? Math.abs(avgChange) : avgChange;

        // Calculate the forecasted price
        const lastPrice = historicalData[historicalData.length - 1];
        return lastPrice + adjustedAvgChange * (forecastIndex + 1);
    }

    // Navigation Controls
    document.getElementById("prevButton").addEventListener("click", () => {
        if (currentStartIndex > 0) {
            currentStartIndex -= 12;
            updateChart(chart, getChartData(fuelData, currentStartIndex, "historical"));
        }
    });

    document.getElementById("nextButton").addEventListener("click", () => {
        if (currentStartIndex + 12 < fuelData.length) {
            currentStartIndex += 12;
            updateChart(chart, getChartData(fuelData, currentStartIndex, "historical"));
        }
    });

    // Mode Switching
    document.getElementById("historicalMode").addEventListener("click", () => setMode("historical", chart));
    document.getElementById("forecastMode").addEventListener("click", () => setMode("forecast", chart));

    // Filtering
    Object.values(fuelTypes).forEach(fuel => {
        document.getElementById(fuel.id).addEventListener("change", () => {
            // Get updated chart data based on selected checkboxes
            const chartData = getChartData(fuelData, currentStartIndex, currentMode);

            // Explicitly clear datasets if no data is available
            if (!chartData.datasets || chartData.datasets.length === 0) {
                chartData.datasets = [];
            }

            // Update the chart's data
            chart.data = chartData;

            // Force the chart to update and trigger the plugin
            chart.update();
        });
    });




    // Update Navigation Controls
    document.getElementById("prevButton").addEventListener("click", () => {
        if (currentStartIndex > 0) {
            currentStartIndex -= 12;
            updateChart(chart, getChartData(fuelData, currentStartIndex, "historical"));
            clearErrorMessage(); // Clear any previous errors
        } else {
            showErrorMessage("No data available before October 1990.");
        }
    });

    document.getElementById("nextButton").addEventListener("click", () => {
        if (currentStartIndex + 12 < fuelData.length) {
            currentStartIndex += 12;
            updateChart(chart, getChartData(fuelData, currentStartIndex, "historical"));
            clearErrorMessage(); // Clear any previous errors
        } else {
            showErrorMessage("No data available beyond the current month.");
        }
    });

// Functions for displaying and clearing error messages
    function showErrorMessage(message) {
        const errorMessageDiv = document.getElementById("errorMessage");

        // Set the message and make the error div visible
        errorMessageDiv.querySelector("p").textContent = message;
        errorMessageDiv.style.opacity = "1"; // Fully visible
        errorMessageDiv.style.display = "block";

        // Set a timeout to hide the message after 3 seconds
        setTimeout(() => {
            errorMessageDiv.style.opacity = "0"; // Start fade-out transition
            setTimeout(() => {
                errorMessageDiv.style.display = "none"; // Hide the element after fade-out
            }, 500); // Match the CSS transition duration
        }, 3000); // Show message for 3 seconds
    }



    function clearErrorMessage() {
        const errorMessageDiv = document.getElementById("errorMessage");
        errorMessageDiv.style.display = "none";
    }

});
