from graphs import agents
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import pandas as pd
import joblib

# visualise the graph
from IPython.display import Image, display

def graph_flow_img():
    png_bytes = agents.get_graph().draw_mermaid_png()
    with open("graph.png", "wb") as f:
        f.write(png_bytes)


app = Flask(__name__)
CORS(app)

@app.route('/analyse/report', methods=['POST'])
def invoke_agents():
    try:
        user_details = request.get_json(force= True)
        print(user_details)

        res = agents.invoke({'crop_details': user_details})
        # res = json.dumps(res)
        print("final state: ", json.dumps(res))
        # print("Weather: ", res["weather_details"])
        # print("Weather: ", res.weather_details)
        return jsonify(res)
    except:
        return jsonify({
            "flag": "fail",
            "msg": "Please try again..."
        })
    

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