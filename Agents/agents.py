
from openai import OpenAI
from dotenv import load_dotenv
import os
import json
import json
import time
import aiohttp
import asyncio
from openai import RateLimitError

load_dotenv()


client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

async def getWeatherDetailsByCity(cityname=None):
    url = f"https://wttr.in/{cityname.lower()}?format=%C+%t"

    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

TOOL_MAP = {
    "getWeatherDetailsByCity": getWeatherDetailsByCity,
}
        
def ChainOfThoughtsPrompt():
    
    SYSTEM_PROMPT = """
        You are an AI assistance who works on START, THINK, OBSERVE and OUTPUT format.
        For a given user query first think and breakdown the problem into sub problems.
        You should always keep thinking and thinking before giving the actual output.
        Also, before outputting the final result to user you must check once if everything is correct.
        
        Rules:
        - Strictly follow the output JSON formate
        - Always follow the output in sequnce that is START, THINK and OUTPUT.
        - Always perform only one step at a time and wait for other step.
        - Always make sure to do multiple steps of thinking before giving out output.
        - For every tool call always wait for the OBSERVE which contanis the output from tool.
        
        Output JSON formate:
        { "step": "START | THINK | OUTPUT | OBSERVE | TOOL", "content": string", "tool_name" : "string", "input": "string"}
        
        Example: 
        User: Can you tell me weather of Pune?
        ASSISTANT: { "step": "START", "contnt": "The user is interested in the current weather details about Pune" }
        ASSISTANT: { "step": "THINK", "contnt": "Let me see if there is any avaibale tool for this query" }
        ASSISTANT: { "step": "THINK", "contnt": "I see theat there is a tool avaibale " }
        ASSISTANT: { "step": "THINK", "contnt": "I see there is a tool avaibale which return current weather data " }
        ASSISTANT: { "step": "THINK", "contnt": "I need to call getWeatherDetailsByCity for Pune to get weahter details" }
        ASSISTANT: { "step": "TOOL", "input": ""pune , "tool_name": "getWeatherDetailsByCity"}
        DEVELOPER: { "step": "OBSERVE", "content": "The weather of pune is cloudy with 28 cel"}
        ASSISTANT: { "step": "THINK", "content": "Great, I got the weather details of Pune"}
        ASSISTANT: { "step": "OUTPUT", "content": "The weather in Pune is 28 C with little cloudy, please bring umbrella"}
        
          
    """ 
    
    messages = [
        
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        },
        {
            "role": "user",
            "content": "What is the weather of Sirohi?"
        },
        
    ]
    
    while True:
        try:
            response = client.chat.completions.create(
                model="gpt-4.1-mini",
                # model="gemini-3.5-flash",
                messages=messages
            )        
        
        except RateLimitError:
            print("⏳ Rate limit reached. Waiting 5 seconds...")
            time.sleep(5)
            continue
    
    
        rawContent = response.choices[0].message.content
        parseContent = json.loads(rawContent)
        
        # pass history 
        messages.append({
            "role" : "assistant",
            "content": rawContent
        })
        
        if parseContent["step"] == "START":
            print(f'🔥 {parseContent["content"]}')
            messages.append({
                "role": "user",
                "content": "Continue"
            })
            continue
        
        
        elif parseContent["step"] == "THINK":
            print(f'🧠 {parseContent["content"]}')          
            continue
            
        elif parseContent["step"] == "TOOL":
            toolToCall = parseContent["tool_name"]

            if toolToCall not in TOOL_MAP:
                messages.append({
                    "role": "developer",
                    "content": f"There is no such tool as {toolToCall}"
                })
                continue

            responseFromTool = asyncio.run(
                TOOL_MAP[toolToCall](parseContent["input"])
            )

            print(f"🔮 {responseFromTool}")

            messages.append({
                "role": "developer",
                "content": json.dumps({
                    "step": "OBSERVE",
                    "content": responseFromTool
                })
            })

            continue

        elif parseContent["step"] == "OUTPUT":
            print(f'🤖 {parseContent["content"]}')
            break
        
        print("done...")            
        




if __name__ == "__main__":

    print(ChainOfThoughtsPrompt())
    

