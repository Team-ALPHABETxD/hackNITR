from dotenv import load_dotenv
import os
import requests
import base64

load_dotenv()
print(os.getenv('WEATHER_API'))

# def list_gemini_models():
#     url = f"https://generativelanguage.googleapis.com/v1/models?key={os.getenv('GEMINI_API_KEY')}"
#     res = requests.get(url)
#     print(res.json())







def get_weather_details(lat, lon):
    response = requests.get(f'{os.getenv('WEATHER_ENDPOINT')}?lat={lat}&lon={lon}&units=metric&appid={os.getenv('WEATHER_API')}')
    print(response.json())
    return response.json()





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


# list_gemini_models()


