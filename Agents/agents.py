
from openai import OpenAI
from dotenv import load_dotenv
import os
import json
import json
import time
import aiohttp
import asyncio
from openai import RateLimitError
import subprocess
import platform

load_dotenv()


client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# This agent will give current weather
async def getWeatherDetailsByCity(cityname=None):
    url = f"https://wttr.in/{cityname.lower()}?format=%C+%t"

    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

# This agent will get user info
async def getGithubUserInfo(username=None):
    url = f"https://api.github.com/users/{username.lower()}"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            
            if response.status != 200:
                return {"error": f"GitHub API returned {response.status}"}
            
            data = await response.json()
            return {
                "login" : data.get("login"),
                "name" : data.get("name"),
                "location" :  data.get("location"),
                "public_repos" : data.get("public_repos"),
                "public_gists" : data.get("public_gists"),
                "user_view_type" : data.get("user_view_type")
            }
            
        return data

# Agent for creating folder and file and it will do code
async def execute_commands(cmd):
    try:
        # Use PowerShell on Windows
        if platform.system() == "Windows":
            process = await asyncio.create_subprocess_exec(
                "powershell",
                "-Command",
                cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
        else:
            process = await asyncio.create_subprocess_shell(
                cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )

        stdout, stderr = await process.communicate()

        stdout = stdout.decode("utf-8", errors="ignore").strip()
        stderr = stderr.decode("utf-8", errors="ignore").strip()

        if process.returncode != 0:
            return {
                "status": "error",
                "message": stderr
            }

        return {
            "status": "success",
            "message": stdout
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
    
async def create_file(filename=None, content=None):
    try:
        # Convert escaped newlines into real newlines
        content = content.replace("\\n", "\n")

        with open(filename, "w", encoding="utf-8") as file:
            file.write(content)

        return {
            "status": "success",
            "message": f"{filename} created successfully"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
        
         
TOOL_MAP = {
    "getWeatherDetailsByCity": getWeatherDetailsByCity,
    "getUserGithubUserInfo": getGithubUserInfo,
    "execute_commands": execute_commands,
      "create_file": create_file
}
        
def ChainOfThoughtsPrompt():
    
    SYSTEM_PROMPT = """
        You are an AI assistance who works on START, THINK, OBSERVE and OUTPUT format.
        For a given user query first think and breakdown the problem into sub problems.
        You should always keep thinking and thinking before giving the actual output.
        Also, before outputting the final result to user you must check once if everything is correct.
        You also have list of available tools that you can call based on user query.
        
        For every tool call that you make, wait for the OBSERVATION from the tol which response from the tool that you called.
        
        Available Tools:
        - getWeatherDetailsByCity(cityname: string): Return the current weather data
        - getUserGithubUserInfo(username: string): Returns the public information about the github user using github api
        - execute_commands(command: string): Takes a linux / unix command as arg and executes the command on user's machine and return the output 
        - create_file(filename: string, content: string): Creates a file with the provided content.
        
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
       
        # {
        #     "role": "user",
        #     "content": "What is the weather of Sirohi?"
        # },
        
        #  {
        #     "role": "user",
        #     "content": "Tell me name of github user manish079"
        # },
        
        #  {
        #     "role": "user",
        #     "content": "Create a folder todo_app and create a simple notes taking app using HTML, CSS and Javascript"
        # },
        
        {
            "role": 'user',
            "content": 'In the current directly, read the changes via git and push the changes to github with good commit message',
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
        # parseContent = json.loads(rawContent)
        
        try:
            parseContent = json.loads(rawContent)
        except json.JSONDecodeError:
            print("Invalid JSON received from model")
            messages.append({
                "role": "user",
                "content": "Return only a single valid JSON object. No explanation, no markdown."
            })
            continue   
        
        # pass history 
        messages.append({
            "role" : "assistant",
            "content": rawContent
        })
        
        if parseContent["step"] == "START":
            print(f'🔥 {parseContent.get("content", "")}')
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
    

