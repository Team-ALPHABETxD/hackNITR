# main.py
import pathway as pw
import requests
import json
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from pydantic import BaseModel, Field, ConfigDict
from typing import TypedDict, Optional, Dict
import time

load_dotenv()
llm = init_chat_model('groq:llama-3.1-8b-instant')

# Kafka
rdkafka_settings = {
    "bootstrap.servers": "kafka:9092",
}

EXAMPLE = f'''
Weather summary
Moderate temperature with given humidity and wind. Conditions are generally workable; watch moisture stress if humidity is low and disease risk if humidity is high.

Crop-wise plan and advice

Maize
Plan: Maintain soil moisture, light nitrogen top-dress.
Advice: Watch for leaf pests and avoid water stress at tasseling.

Potatoes
Plan: Regular irrigation, good drainage.
Advice: Monitor for late blight, avoid waterlogging.

Rice (paddy)
Plan: Keep shallow standing water, balanced nutrients.
Advice: Check for pests and reduce water if wind increases lodging risk.

Sorghum
Plan: Minimal irrigation, weed control.
Advice: Drought-tolerant but protect young plants from pests.

Soybeans
Plan: Moderate irrigation, ensure good aeration.
Advice: Avoid excess moisture, watch for fungal diseases.

Wheat
Plan: Light irrigation at critical stages.
Advice: Protect from rust and avoid excess nitrogen.

Cassava
Plan: Low input, good drainage.
Advice: Avoid waterlogging and control mites.

Sweet potatoes
Plan: Light but regular watering.
Advice: Prevent vine rot and manage weevils.

Plantains and others
Plan: Mulching and steady moisture.
Advice: Protect from wind damage and leaf diseases.

Yams
Plan: Well-drained soil, staking if needed.
Advice: Avoid excess water and monitor for tuber rot.
'''

# Schemas
class CropRegistry(pw.Schema):
    lat: float
    lon: float

class DailyAdvice(pw.Schema):
    latitude: float
    longitude: float
    temperature_2m_max: float
    wind_speed_10m_max: float
    relative_humidity_2m_max: float
    advice: str
    
# Weather UDF
@pw.udf
def fetch_weather(lat: float, lon: float) -> tuple:
    try:
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "daily": [
                "temperature_2m_max",
                "wind_speed_10m_max",
                "relative_humidity_2m_max",
            ],
            "timezone": "auto",
            "forecast_days": 1,
        }
        r = requests.get(url, params=params, timeout=10).json()
        print(
            r["daily"]["temperature_2m_max"][0],
            r["daily"]["wind_speed_10m_max"][0],
            r["daily"]["relative_humidity_2m_max"][0],
            r["latitude"],
            r["longitude"],
        )
        
        
        return (
            r["daily"]["temperature_2m_max"][0],
            r["daily"]["wind_speed_10m_max"][0],
            r["daily"]["relative_humidity_2m_max"][0],
            r["latitude"],
            r["longitude"],
        )
    except:
        print(10, 78, 96, lat, lon)
        return (10, 78, 96, lat, lon)

# LLM UDF
@pw.udf
def generate_treatment(
    temp: float,
    wind: float,
    humidity: float,
) -> str:
    prompt = f"""
    You are an experienced crop advisor.

    Temperature: {temp}°C
    Humidity: {humidity}%
    Wind Speed: {wind} km/h

    Give:
    1. A summary of the weather
    2. A short compact plan for each of crops given below 
    ['Maize', 'Potatoes', 'Rice, paddy', 'Sorghum', 'Soybeans', 'Wheat',
       'Cassava', 'Sweet potatoes', 'Plantains and others', 'Yams']
    3. Give advices individually by mentioning each type.
    4. Responses must be very much short and easy to understand

    Respond as plain text.
    """
    try:
        res = llm.invoke(prompt)
        return res.content  # ✅ STRING ONLY
    except:
        return EXAMPLE



while(True):
    # Inputs
    crop_table = pw.io.csv.read(
        "./lat_lon.csv",
        schema=CropRegistry,
        mode="static",
    )
    # Pipeline
    weather_enriched = crop_table.select(
        weather=fetch_weather(pw.this.lat, pw.this.lon),
    )

    final_table = weather_enriched.select(
        temperature_2m_max=pw.this.weather[0],
        wind_speed_10m_max=pw.this.weather[1],
        relative_humidity_2m_max=pw.this.weather[2],
        latitude=pw.this.weather[3],
        longitude=pw.this.weather[4],
        advice=generate_treatment(
            pw.this.weather[0],
            pw.this.weather[1],
            pw.this.weather[2],
        ),
    )

    # Outputs
    pw.io.kafka.write(
        final_table,
        rdkafka_settings,
        topic_name="daily_crop_treatment",
        format="json",
    )

    pw.io.csv.write(final_table, "./daily_treatment_output.csv")

    pw.debug.compute_and_print(final_table)
    pw.run()
    time.sleep(24 * 60 * 60)