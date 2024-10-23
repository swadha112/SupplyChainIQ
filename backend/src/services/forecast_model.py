import sys
import pandas as pd
from fbprophet import Prophet
import io
try:
    # Read CSV data from stdin (sent by Node.js)
    csv_data = sys.stdin.read()

    # Convert CSV to DataFrame (adjust column names according to your data)
    data = pd.read_csv(io.StringIO(csv_data), names=['ds', 'y'])  # ds = date, y = quantity

    # Convert the 'ds' (date) column to datetime format explicitly using the correct format
    data['ds'] = pd.to_datetime(data['ds'], format='%d-%m-%Y')

    print("Data after conversion:", data.head())

    # Initialize and fit Prophet model
    model = Prophet()
    model.fit(data)

    # Make a future dataframe for predictions (e.g., 60 days into the future)
    future = model.make_future_dataframe(periods=60)

    # Predict
    forecast = model.predict(future)

    # Select relevant data (ds = date, yhat = predicted value)
    forecast_data = forecast[['ds', 'yhat']].tail(60)  # Return only the future predictions

    # Output the forecast data as JSON
    print(forecast_data.to_json(orient='records'))

except Exception as e:
    print("Error in forecasting:", str(e), file=sys.stderr)
