
# from openai import OpenAI
# from dotenv import load_dotenv
# import os
# import json
# import json
# import time
# import aiohttp
# import asyncio
# from openai import RateLimitError
# import subprocess
# import platform

# load_dotenv()


# client = OpenAI(
#     api_key=os.getenv("OPENAI_API_KEY")
# )

# def get_weather(city: None):
#     return "30 degree celcius"

        
# def init():
    
#     SYSTEM_PROMPT = """
#         You are an AI helpfull AI assistance who is specialized in resolving user query.
#         Your work on start, plan, action, observer mode.
#         For the given user query and avaibale tools, plan the steps by step execution, based on the planning, select the relevent tool from the available tools. and based on the tool selection you perform an action to call the tool. 
#         Wait for the observation and based on the observation from the tool call resolve the user query.
        
#         Rules:
#             - Strictly follow the output JSON formate
#             - Always perform only one step at a time and wait for other step.
#             - Carefully analyse the user query            
            
#             Output JSON formate:
#             {{
#                 "step" : "string",
#                 "content" : "string",
#                 "function" : "The name of function if the step is action",
#                 "input" : "The input parameter for ther function"
#             }}
        
#         Avaiable Tools:
        
        
        
#         Example:
#         User Query: What is the weahter of New York?
#         Output: {{"step": "plan", "content" : "User is interested in weather data of new york"}}
#         Output: {{"step": "plan", "content" : "From the avilable tools I should call get_weather"}}
#         Output: {{"step": "action", "function" : "get_weather", "input" : "new york"}}
#         Output: {{"step": "observe", "output": "12 Degree Cel"}}
#         Output: {{"step": "output", "content": "The weather for new york seems to be 12 degrees."}}
        
#     """ 
    
    
#     response = client.chat.completions.create(
#         model="gpt-4.1-mini",
#         response_format={"type" : "json_object"},
#         messages=[
#             {"role" : "system", "content": SYSTEM_PROMPT},
#             {"role": "user", "content": "What is the current weather of Pune"},
#             {"role": "assistant", "content": json.dumps({"steps" : "plan", "content" : "User wants to know the current weather of Pune."})},
#             {"role": "assistant", "content": json.dumps({"steps" : "plan", "content" : "From the available tools I should call get_weather to get current weather of Pune."})},
#             {"role": "assistant", "content": json.dumps({"step": "action", "function": "get_weather", "input": "Pune"})},
#             {"role": "assistant", "content": json.dumps({"step": "observe", "output": "The current temperature in Pune is 31 degrees Celsius with clear skies."})},
#         ]
#     )        
    
#     rawContent = response.choices[0].message.content
    
#     print(rawContent)



# if __name__ == "__main__":

#     init()
    



############ Automate Agent Resposne

from openai import OpenAI
from dotenv import load_dotenv
import os
import json
import json
import requests

load_dotenv()


client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def get_weather(city=None):
    
    print(f"🔮 Tool Called: get_weather {city}")
    
    url = f"https://wttr.in/{city.lower()}?format=%C+%t"
    response =  requests.get(url)
    
    if response.status_code == 200:
        return f"The weather in {city} is {response.text}"

def init():
    
    user_query = input("> ")
    
    available_tools = {
        "get_weather": {
            "fn": get_weather,
            "description": "Takes a city name as an input the current weather for the city"
        }
    }
    
    SYSTEM_PROMPT = """
        You are an AI helpfull AI assistance who is specialized in resolving user query.
        Your work on start, plan, action, observer mode.
        For the given user query and avaibale tools, plan the steps by step execution, based on the planning, select the relevent tool from the available tools. and based on the tool selection you perform an action to call the tool. 
        Wait for the observation and based on the observation from the tool call resolve the user query.
        
        Rules:
            - Strictly follow the output JSON formate
            - Always perform only one step at a time and wait for other step.
            - Carefully analyse the user query            
            
            Output JSON formate:
            {{
                "step" : "string",
                "content" : "string",
                "function" : "The name of function if the step is action",
                "input" : "The input parameter for ther function"
            }}
        
        Avaiable Tools:
            "get_weather": "Takes a city name as an input the current weather for the city"
        
        
        Example:
        User Query: What is the weahter of New York?
        Output: {{"step": "plan", "content" : "User is interested in weather data of new york"}}
        Output: {{"step": "plan", "content" : "From the avilable tools I should call get_weather"}}
        Output: {{"step": "action", "function" : "get_weather", "input" : "new york"}}
        Output: {{"step": "observe", "output": "12 Degree Cel"}}
        Output: {{"step": "output", "content": "The weather for new york seems to be 12 degrees."}}
        
    """ 
    
    messages = [
        {
            "role" : "system",
            "content": SYSTEM_PROMPT
        },
        {
            "role" : "user",
            "content": user_query
        }
    ]
    
    # Automate agent will work
    while True:
        
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            response_format={"type" : "json_object"},
            messages=messages
        )        
        
        rawContent = response.choices[0].message.content
        
        try:
            parseContent = json.loads(rawContent)
        except json.JSONDecodeError:
            print("Invalid JSON retrived from model")
            messages.append({
                "role": "user",
                "content": "Return only a single valid JSON object. No explanation, no markdown."
            })
            continue  
        
        messages.append({
            "role" : "assistant",
            "content": json.dumps(parseContent)
        })
        
        if parseContent.get("step") == "plan":
            print(f"🧠 {parseContent.get("content")}")
            continue
        if parseContent.get("step") == "action":
            tool_name = parseContent.get('function')
            tool_input = parseContent.get('input')
            
            if available_tools.get(tool_name, False):
                output = available_tools[tool_name].get("fn")(tool_input)
                messages.append({
                    "role" : "assistant",
                    "content": json.dumps({
                        "step": "observe",
                        "output": output
                    })
                })
                continue
        if parseContent.get("step") == "output":
            print(f"🤖 {parseContent.get("content")}")
            break
            
        print("done...")
            
if __name__ == "__main__":

    init()
    

