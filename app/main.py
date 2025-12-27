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

@app.route('/analyse/report', methods=['GET'])
def invoke_agents():
    user_details = request.get_json()
    print(user_details)

    res = agents.invoke({'crop_details': user_details})
    # res = json.dumps(res)
    print("final state: ", json.dumps(res))
    # print("Weather: ", res["weather_details"])
    # print("Weather: ", res.weather_details)
    return jsonify(res)
    


graph_flow_img()
# invoke_agents()

if __name__ == '__main__':
    app.run(debug = True)