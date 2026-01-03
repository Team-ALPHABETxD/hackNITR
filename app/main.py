from graphs import agents, llm
from prompts import voice_assistant_prompt
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import pandas as pd
import joblib
from pydantic import BaseModel, Field

# Define Pydantic model for structured output
class VoiceAction(BaseModel):
    action: str = Field(description="The action to perform: navigate, fill_form, click, or speak")
    data: dict = Field(description="Data associated with the action. For click, include 'elementId'.")
    response_text: str = Field(description="Text to speak to the user")


# visualise the graph
from IPython.display import Image, display

def graph_flow_img():
    png_bytes = agents.get_graph().draw_mermaid_png()
    with open("graph.png", "wb") as f:
        f.write(png_bytes)


app = Flask(__name__)
CORS(app)

# @app.route('/analyse/report', methods=['POST'])
# def invoke_agents():
#     try:
#         user_details = request.get_json(force= True)
#         print(user_details)

#         res = agents.invoke({'crop_details': user_details})
#         # res = json.dumps(res)
#         print("final state: ", json.dumps(res))
#         # print("Weather: ", res["weather_details"])
#         # print("Weather: ", res.weather_details)
#         return jsonify(res)
#     except:
#         return jsonify({
#             "flag": "fail",
#             "msg": "Please try again..."
#         }), 500

import traceback, sys

@app.route('/analyse/report', methods=['POST'])
def invoke_agents():
    try:
        user_details = request.get_json(force=True)
        print("Incoming:", user_details, flush=True)

        print("Invoking agents...", flush=True)
        res = agents.invoke({'crop_details': user_details})

        print("Agents completed", flush=True)
        return jsonify(res)

    except Exception as e:
        traceback.print_exc(file=sys.stdout)
        return jsonify({
            "flag": "fail",
            "error": str(e)
        }), 500

@app.route('/voice/command', methods=['POST'])
def voice_command():
    try:
        data = request.get_json(force=True)
        user_input = data.get('text')
        current_page = data.get('page')
        form_data = data.get('formData', {})
        
        print(f"Voice Command: {user_input} on {current_page}", flush=True)
        print(f"Form Data: {form_data}", flush=True)
        
        prompt = voice_assistant_prompt(user_input, current_page, form_data)
        
        try:
             res = llm.with_structured_output(VoiceAction).invoke(prompt)
             return jsonify(res.dict())
        except Exception as e:
             print("Structured output failed, falling back:", e)
             res = llm.invoke(prompt)
             content = res.content
             if "```json" in content:
                 content = content.split("```json")[1].split("```")[0]
             elif "```" in content:
                 content = content.split("```")[1].split("```")[0]
             return jsonify(json.loads(content))

    except Exception as e:
        traceback.print_exc(file=sys.stdout)
        return jsonify({
            "action": "speak",
            "data": {},
            "response_text": "Sorry, I encountered an error. Please try again."
        }), 200

  

# def invoke_agents_():
#     try:
#         user_details = {
#         "Item": "Potatoes",
#         "average_rain_fall_mm_per_year": 1485.0,
#         "pesticides_tonnes": 121.0,
#         "avg_temp": 16.37,
#         "lat": 11.42,
#         "lon": 11.56,
#         "growth": "flowering",
#         "sowing_date": "2025-08-01",
#         "current_date": "2025-11-14",
#         "storage_availability": "No",
#         "disease_detect": False,
#         "crop_img": "graph.png"
#         }
        
#         print(user_details)

#         res = agents.invoke({'crop_details': user_details})
#         # res = json.dumps(res)
#         print("final state: ", json.dumps(res))
#         # print("Weather: ", res["weather_details"])
#         # print("Weather: ", res.weather_details)
#         # return jsonify(res)
#     except Exception as E: 
#         print(E)
#         print("Try again...")



# # graph_flow_img()
# invoke_agents_()

if __name__ == '__main__':
    app.run(debug = True, host="0.0.0.0", port=5000)