from flask import Flask, request, jsonify
from flask_cors import CORS

from graphs import build_graph
from debugger import AgentDebugger

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
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(
        debug=True,
        use_reloader=False, 
        host="0.0.0.0",
        port=5000,
    )