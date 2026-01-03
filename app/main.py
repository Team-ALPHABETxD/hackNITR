from graphs import build_graph
from debugger import AgentDebugger
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import pandas as pd
import joblib
import traceback
import sys

# visualise the graph
from IPython.display import Image, display

def graph_flow_img():
    # Note: agents is defined below in the main app part
    # This function might need to be moved or agents passed as argument
    pass


app = Flask(__name__)
CORS(app)

debugger = AgentDebugger()
agents = build_graph(debugger)


@app.route("/analyse/report", methods=["POST"])
def invoke_agents():
    try:
        debugger.clear()

        payload = request.get_json(force=True)
        print("Incoming:", payload, flush=True)

        result = agents.invoke({"crop_details": payload})

        debugger.pretty_print()

        return jsonify({
            "result": result,
            "trace": debugger.events
        })

    except Exception as e:
        traceback.print_exc(file=sys.stdout)
        return jsonify({
            "flag": "fail",
            "error": str(e)
        }), 500
  

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