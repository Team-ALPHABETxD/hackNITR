import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
load_dotenv()
llm = init_chat_model('groq:llama-3.1-8b-instant')

from prompts import *
from tools import *
from states import *

# agents
def validator_agent(state:CropState) -> CropState:
    crop_details = state['crop_details']
    if(crop_details['disease_detect'] and crop_details['crop_img'] == ""):
        state['validated'] = {
            'flag': False,
            'reason': 'Data inadequate!'
        }
        return state
    
    img_verify = analyse_crop_img(crop_details['crop_img'],img_validator_prompt())
    if(img_verify == 0 and crop_details['disease_detect']):
        state['validated'] = {
            'flag': False,
            'reason': 'Image is not valided'
        }
        return state
    
    res = llm.with_structured_output(Validation).invoke(validator_prompt(crop_details))
    state['validated'] = res.dict()
    return state

def data_agent(state:CropState) -> CropState:
    crop_details = state['crop_details']
    lat = crop_details['lat']
    lon = crop_details['lon']

    weather_data = get_weather_details(lat=lat, lon=lon)
    res = llm.with_structured_output(Weather).invoke(weather_summary_prompt(weather_data))
    state['weather_details'] = res.dict()
    return state

def disease_detect_agent(state:CropState) -> CropState:
    res = llm.with_structured_output(Disease).invoke(predict_disease_prompt(state))
    state['disease_details'] = res.dict()
    return state

def disease_predict_agent(state:CropState) -> CropState:
    res = llm.with_structured_output(Disease).invoke(predict_disease_prompt(state))
    state['disease_details'] = res.dict()
    return state

def revenue_estimate_agent(state:CropState) -> CropState:
    res = llm.with_structured_output(Revenue).invoke(estimate_revenue_prompt(state))
    state['rev_strat_details'] = res.dict()
    return state

def planner_agent(state:CropState) -> CropState:
    res = llm.with_structured_output(Plan).invoke(planner_prompt(state))
    state['plan'] = res.dict()
    return state

def control_agent(state:CropState) -> CropState:
    res = llm.with_structured_output(Control).invoke(disease_control_prompt(state))
    state['control_strats'] = res.dict()
    return state

def collaborative_agent(state:CropState) -> CropState:
    state['collaborative_plan'] = "Collaborate to a nearby NGO"
    return state

# conditions
def validator_cond(state:CropState) -> bool:
    return state['validated']['flag']

def disease_cond(state:CropState) -> bool:
    return state['crop_details']['disease_detect']

def collaborative_cond(state:CropState) -> str:
    return state['plan']['decision']


# graph
from langgraph.graph import StateGraph, START, END

graph = StateGraph(CropState)
graph.add_node("validator_agent", validator_agent)
graph.add_node("data_agent", data_agent)
graph.add_node("disease_predict_agent", disease_predict_agent)
graph.add_node("disease_detect_agent", disease_detect_agent)
graph.add_node("revenue_estimate_agent", revenue_estimate_agent)
graph.add_node("planner_agent", planner_agent)
graph.add_node("collaborative_agent", collaborative_agent)
graph.add_node("control_agent", control_agent)


graph.add_edge(START, "validator_agent")
graph.add_conditional_edges("validator_agent", validator_cond, {True: "data_agent", False: END})
graph.add_conditional_edges("data_agent", disease_cond, {True: "disease_detect_agent", False: "disease_predict_agent"})
# graph.add_edge(["disease_detect_agent", "disease_predict_agent"], "planner_agent")
graph.add_edge("disease_detect_agent", "revenue_estimate_agent")
graph.add_edge("disease_predict_agent", "revenue_estimate_agent")
graph.add_edge("revenue_estimate_agent", "planner_agent")
graph.add_conditional_edges("planner_agent", collaborative_cond, 
    {
        "Sell":"collaborative_agent",
        "Disease Control": "control_agent",
        "Store": END
    })
graph.add_edge(["planner_agent", "collaborative_agent"], END)

agents = graph.compile()