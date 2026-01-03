from dotenv import load_dotenv
import os
import requests
import base64
import joblib
import pandas as pd
import datetime


load_dotenv()

# def list_gemini_models():
#     url = f"https://generativelanguage.googleapis.com/v1/models?key={os.getenv('GEMINI_API_KEY')}"
#     res = requests.get(url)
#     print(res.json())







def get_weather_details(lat, lon):
    response = requests.get(f"{os.getenv('WEATHER_ENDPOINT')}?lat={lat}&lon={lon}&units=metric&appid={os.getenv('WEATHER_API')}")
    print(response.json())
    return response.json()


def predict_yeild (dtls):
    pipeline = joblib.load('./yeild_prediction/pipeline.pkl')
    dtls_df = pd.DataFrame([dtls])    
    pred = pipeline.predict(dtls_df.iloc[:, 0:4])
    return float(pred[0])
    

def analyse_crop_img(image, prompt):

    try:

        img_url = image
        img_bytes = requests.get(img_url).content

        # 2. Convert to Base64
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
        ]}

        endpoint = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={os.getenv('GEMINI_API_KEY')}"

        res = requests.post(
        endpoint,
        json=payload,
        )
        print(res.json())
        print(res.json()['candidates'][0].content.parts.text)
        return res
    except Exception as e:
        print("Exception: ", e)
        return 0



def get_weather_forecast (lat, lon):
    d = datetime.datetime.now()
    ds = str(d).split(' ')[0]
    fd = d + datetime.timedelta(days=6)
    fds = str(fd).split(' ')[0]
    
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": ["temperature_2m_max", "wind_speed_10m_max", "relative_humidity_2m_max", "surface_pressure_mean", "pressure_msl_mean", "apparent_temperature_max", "uv_index_max", "daylight_duration"],
        "timezone": "auto",
        "start_date": ds,
        "end_date": fds,
    }
    
    res = requests.get(url, params=params)
    print(res.json())
    return res.json()
    

# list_gemini_models()
# get_weather_forecast()