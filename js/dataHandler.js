// Function to fetch the CSV data
async function fetchCSVData(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.status}`);
        }
        const csvText = await response.text();
        return csvText;
    } catch (error) {
        console.error('Error fetching CSV:', error);
        return null;
    }
}

// Function to parse the CSV data
function parseCSV(csvText) {
    const rows = csvText.split('\n').map(row => row.trim());
    const data = [];

    // Skip the first two rows (metadata) and start processing actual data
    for (let i = 3; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.split(',');

        if (cells.length < 17 || !cells[0] || !cells[1]) {
            console.warn(`Skipping invalid or incomplete row at index ${i}:`, row);
            continue;
        }

        const year = cells[0].trim();
        const month = cells[1].trim();
        const solidFuels = parseFloat(cells[2].trim()) || 0; // D7DW
        const gas = parseFloat(cells[3].trim()) || 0; // D7DU
        const electricity = parseFloat(cells[4].trim()) || 0; // D7DT
        const liquidFuels = parseFloat(cells[5].trim()) || 0; // D7DV

        // Combine year and month to create a full date (UK format)
        const date = `${month} ${year}`;

        data.push({
            date,
            solidFuels,
            gas,
            electricity,
            liquidFuels,
        });
    }

    return data;
}

// Function to calculate forecast for the next 12 months
function calculateForecast(data) {
    const forecast = [];
    const lastData = data[data.length - 1]; // Get the last data entry
    const lastDate = new Date(`${lastData.date} 1`); // Create a date object from the last entry
    const increments = {};

    // Calculate average increments for each fuel type
    ['solidFuels', 'gas', 'electricity', 'liquidFuels'].forEach(fuelType => {
        const recentData = data.slice(-12).map(d => d[fuelType]);
        const increment = (recentData[recentData.length - 1] - recentData[0]) / 12;
        increments[fuelType] = increment || 0; // Handle NaN or undefined cases
    });

    // Generate forecast for the next 12 months
    for (let i = 1; i <= 12; i++) {
        const nextDate = new Date(lastDate);
        nextDate.setMonth(nextDate.getMonth() + i);

        const forecastValues = {
            date: `${nextDate.toLocaleString('default', { month: 'long' })} ${nextDate.getFullYear()}`,
            solidFuels: lastData.solidFuels + increments.solidFuels * i,
            gas: lastData.gas + increments.gas * i,
            electricity: lastData.electricity + increments.electricity * i,
            liquidFuels: lastData.liquidFuels + increments.liquidFuels * i,
        };

        forecast.push(forecastValues);
    }

    return forecast;
}

// Export functions for use in other files
export { fetchCSVData, parseCSV, calculateForecast };
