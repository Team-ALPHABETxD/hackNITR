import json
def validator_prompt(dtls):
    prompt = f"""
    You are a validation engine.
    Just validate the following fields: 
        - Item
        - growth
        - sowing_date
    Given crop details:
    {dtls}

    RULES:
    - Output ONLY valid JSON.
    - If input is valid put "NONE" to the reason feild.
    - Do NOT include explanations.
    - Do NOT add any text outside the JSON.
    - Do NOT add fields not listed.
    """

    return prompt

def img_validator_prompt():
    prompt = f"""
    You are given an image url. Check it, if it's not an image of a crop, clearly showing any crop-disease, return 0 else return 1.

    RULES:
    - Output ONLY 1/0.
    - Do NOT include explanations.
    - Do NOT add any extra texts.
    - Do NOT add fields not listed.
    """
    return prompt

def weather_summary_prompt(dtls):
    prompt = f"""
    You are an experienced agent who helps farmer by providing intuitive, clear summary of the next 7 days weather.
    Here is the forecast data, write the summary and help farmers to make decision,
    {dtls}
    
    RULES:
    - Keep in mind it's Summary for Farmers, many of who may not be properly educated, so make it easily interpreteable
    - Dont make it too much lengthy, concise it within 2-3 lines.
    """

    return prompt

def predict_disease_prompt(dtls):
    crop_details = dtls['crop_details']
    weather_details = dtls.get('weather_details', {})
    prompt = f"""
    You are a crop disease prediction agent.

    Given these crop details:
    {crop_details}

    And these is weather forecast for next 7 days:
    {weather_details}

    Your job is to predict if a disease may occur or is already present.

    Rules:
    - Output ONLY JSON.
    - Fill all fields with meaningful values if a disease is predicted.
    - If no disease is predicted, set NA = true (Boolean) and leave other fields empty/defaults.
    - Do NOT add fields not listed. 
    """

    return prompt


def estimate_revenue_prompt(dtls):
    crop_details = dtls['crop_details']
    
    prompt = f"""
    You are a crop revenue estimation agent.

    Given these crop details:
    {crop_details}

    Your task:
    - Estimate revenue (rev) and expense (exp) for each plan:
    - Sell
    - Disease Control
    - Store

    Rules (VERY IMPORTANT):
    - Output ONLY valid JSON
    - All numbers MUST be final numeric values (no formulas, no calculations)
    - Do NOT include expressions like 1200 * 1.5
    - Do NOT include currency symbols
    - Use realistic market-based estimates based on the given location
    - Do NOT add extra fields

    Output schema:
    rev_stats: list of objects with:
    - name (string)
    - rev (number)
    - exp (number)
    """

    return prompt



def planner_prompt(dtls):
    crop_details = dtls['crop_details']
    weather_details = dtls.get('weather_details', {})
    disease_details = dtls.get('disease_details', {})
    revenue_details = dtls.get('rev_strat_details', {})

    prompt = f"""
    You are the planner agent help farmers by providing a proper plan analysing the crop details, weather details and disease details to increase their profit and reduce ultimate waste production.

    Your Job is to decide the best decision to take among ('Sell' / 'Disease Control' / 'Store') 

    Given these crop details:
    {crop_details}

    these is the revenue details:
    {revenue_details}
    
    these is weather forecast for next 7 days:
    {weather_details}

    And these disease analysis:
    {disease_details}
    

    RULES:
    - Output ONLY valid JSON.
    - Do NOT add any text outside the JSON.
    - Do NOT add fields not listed. 
    """
    return prompt


def disease_control_prompt(dtls):
    crop_details = dtls['crop_details']
    weather_details = dtls.get('weather_details', {})
    disease_details = dtls.get('disease_details', {})
    prompt = f"""
    You are a plant disease expert. You are given a crop details, weather details and disease analysis.
    Your job is to determine 5-10 detailed steps to follow for the disease control so that the crop production increased and waste production reduced.

    Given these crop details:
    {crop_details}

    these is weather forecast for next 7 days:
    {weather_details}

    And these disease analysis:
    {disease_details}

    RULES:
    - Output ONLY valid JSON.
    - Do NOT add any text outside the JSON.
    - Do NOT add fields not listed. 
    """

    return prompt
