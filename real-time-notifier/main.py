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

# Schemas
class CropRegistry(pw.Schema):
    farmer_id: int
    crop_name: str
    lat: float
    lon: float

class DailyAdvice(pw.Schema):
    farmer_id: int
    crop_name: str
    latitude: float
    longitude: float
    temperature_2m_max: float
    wind_speed_10m_max: float
    relative_humidity_2m_max: float
    advice: str
    
class AdviceSchema(BaseModel):
    advices: list[str] = Field("Advices need to follow")
    risk: float = Field("Serverity score in 1-10")



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
    crop_name: str,
    temp: float,
    wind: float,
    humidity: float,
) -> str:
    prompt = f"""
    You are an experienced crop advisor.

    Crop: {crop_name}
    Temperature: {temp}°C
    Humidity: {humidity}%
    Wind Speed: {wind} km/h

    Give:
    1. 3 short advices
    2. Risk score (1-10)

    Respond as plain text.
    """
    try:
        res = llm.invoke(prompt)
        return res.content  # ✅ STRING ONLY
    except:
        return prompt



while(True):
    # Inputs
    crop_table = pw.io.csv.read(
        "./example.csv",
        schema=CropRegistry,
        mode="static",
    )
    # Pipeline
    weather_enriched = crop_table.select(
        farmer_id=pw.this.farmer_id,
        crop_name=pw.this.crop_name,
        weather=fetch_weather(pw.this.lat, pw.this.lon),
    )

    final_table = weather_enriched.select(
        farmer_id=pw.this.farmer_id,
        crop_name=pw.this.crop_name,
        temperature_2m_max=pw.this.weather[0],
        wind_speed_10m_max=pw.this.weather[1],
        relative_humidity_2m_max=pw.this.weather[2],
        latitude=pw.this.weather[3],
        longitude=pw.this.weather[4],
        advice=generate_treatment(
            pw.this.crop_name,
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