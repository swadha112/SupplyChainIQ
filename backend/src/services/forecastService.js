const { spawn } = require('child_process');
const path = require('path');

// This function calls the Python forecasting script and passes the logistics data for prediction
const generateForecast = (logisticsData) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('/opt/anaconda3/bin/python', [path.join(__dirname, 'forecast_model.py')]);

    // Convert logistics data to CSV-like string format
    const csvData = logisticsData
      .map(item => `${item.estimated_delivery},${item.quantity}`)  // Adjust fields to match your logistics data structure
      .join('\n'); // Join each row with a newline

    console.log('CSV Data being sent to Python:', csvData); // Log CSV data for debugging

    // Ensure we write the string (CSV) to the Python process
    pythonProcess.stdin.write(csvData);
    pythonProcess.stdin.end();

    let forecastResult = '';

    pythonProcess.stdout.on('data', (data) => {
      forecastResult += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(`Python process exited with code ${code}`);
      } else {
        resolve(JSON.parse(forecastResult)); // Assuming the forecast result is in JSON format
      }
    });
  });
};

module.exports = { generateForecast };
