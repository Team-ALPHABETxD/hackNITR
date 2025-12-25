from graphs import agents


# visualise the graph
from IPython.display import Image, display

def graph_flow_img():
    png_bytes = agents.get_graph().draw_mermaid_png()
    with open("graph.png", "wb") as f:
        f.write(png_bytes)



def invoke_agents():
    user_details = {
        "crop": "potato",
        "lat": 11.42,
        "lon": 11.56,
        "growth": "flowering",
        "sowing_date": "2025-08-01",
        "current_date": "2025-11-14",
        "estimated_production": 1200,
        "storage_availability": "No",
        "disease_detect": False,
        "crop_img": "graph.png",
    }

    res = agents.invoke({'crop_details': user_details})
    print("final state: ", res)


# graph_flow_img()
invoke_agents()