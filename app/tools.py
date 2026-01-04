from dotenv import load_dotenv
import os
import requests
import base64
import joblib
import pandas as pd
import datetime
import json

load_dotenv()


def get_weather_details(lat, lon):
    response = requests.get(
        f"{os.getenv('WEATHER_ENDPOINT')}?lat={lat}&lon={lon}&units=metric&appid={os.getenv('WEATHER_API')}"
    )
    print(response.json())
    return response.json()


def predict_yeild(dtls):
    pipeline = joblib.load('./yeild_prediction/pipeline.pkl')
    dtls_df = pd.DataFrame([dtls])
    pred = pipeline.predict(dtls_df.iloc[:, 0:4])
    return float(pred[0])


# ================= EXISTING CROP IMAGE ANALYSIS (UNCHANGED) =================
def analyse_crop_img(image, prompt):
    try:
        img_url = image
        img_bytes = requests.get(img_url).content

        img_base64 = base64.b64encode(img_bytes).decode("utf-8")

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "inline_data": {
                                "mime_type": "image/png",
                                "data": img_base64
                            }
                        },
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        }

        endpoint = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={os.getenv('GEMINI_API_KEY')}"

        res = requests.post(endpoint, json=payload)
        print(res.json())
        print(res.json()['candidates'][0]['content']['parts'][0]['text'])
        return res

    except Exception as e:
        print("Exception: ", e)
        return 0


# ================= UPDATED SOIL IMAGE ANALYSIS (NUMERIC NPK) =================
def analyse_soil_img(image):
    """
    Detects whether image is soil.
    If not soil -> returns 'Not a Soil Image!'
    If soil -> estimates numeric N, P, K values (mg/kg).
    """

    try:
        img_url = image
        img_bytes = requests.get(img_url).content
        img_base64 = base64.b64encode(img_bytes).decode("utf-8")

        soil_prompt = """
You are an agricultural soil analysis expert.

STEP 1:
Determine whether the image clearly represents SOIL.
If the image is NOT soil (plants, crops, humans, machinery, sky, water, animals, food, objects),
respond with EXACTLY:
Not a Soil Image!

STEP 2 (ONLY IF IT IS SOIL):
Estimate soil nutrients using visual indicators such as color, texture, granularity, moisture, and organic matter.

You MUST return NUMERIC values ONLY.

Return the result STRICTLY in this JSON format:

{
  "is_soil": true,
  "N": <number between 0 and 500>,
  "P": <number between 0 and 300>,
  "K": <number between 0 and 800>,
  "pH": <number between 3.5 and 9.5>,
  "unit": "mg/kg",
  "confidence": <number between 0 and 1>,
  "notes": "Short visual-based explanation"
}

STRICT RULES (MANDATORY):
- N, P, K MUST be numbers (no words like low/medium/high)
- Do NOT return ranges
- Do NOT return strings for N, P, K
- Confidence must be a decimal (e.g., 0.62)
- If NOT soil, output ONLY: Not a Soil Image!
- No extra text outside JSON
"""

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "inline_data": {
                                "mime_type": "image/png",
                                "data": img_base64
                            }
                        },
                        {
                            "text": soil_prompt
                        }
                    ]
                }
            ]
        }

        endpoint = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={os.getenv('GEMINI_API_KEY')}"

        res = requests.post(endpoint, json=payload, timeout=20)
        text = res.json()["candidates"][0]["content"]["parts"][0]["text"].strip()

        if text == "Not a Soil Image!":
            return {
                "is_soil": False,
                "confidence": 1.0,
                "notes": "The image does not represent soil."
            }
        soil_data = json.loads(text)
        return soil_data
    
    except Exception as e:
        print("Exception: ", e)
        return "Not a Soil Image!"


def get_weather_forecast(lat, lon):
    d = datetime.datetime.now()
    ds = str(d).split(' ')[0]
    fd = d + datetime.timedelta(days=6)
    fds = str(fd).split(' ')[0]

    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": [
            "temperature_2m_max",
            "wind_speed_10m_max",
            "relative_humidity_2m_max",
            "surface_pressure_mean",
            "pressure_msl_mean",
            "apparent_temperature_max",
            "uv_index_max",
            "daylight_duration"
        ],
        "timezone": "auto",
        "start_date": ds,
        "end_date": fds,
    }

    res = requests.get(url, params=params)
    print(res.json())
    return res.json()


# TEST
analyse_soil_img(
    "https://www.eurokidsindia.com/blog/wp-content/uploads/2023/11/different-types-of-soils-and-their-charachterstics-870x570.jpg"
)
