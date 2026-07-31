
from openai import OpenAI
from dotenv import load_dotenv
import os
import json
import json
import time
from openai import RateLimitError


load_dotenv()

# client = OpenAI(
#     api_key=os.getenv("OPENAI_API_KEY")
# )

client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)
            

def validateResult(thinking_steps):
    VALIDATOR_PROMPT = """
         You are a validator AI.
         Your job is to check wheather given resoning step is correct or not.
        
        Role:
        - If the step is correct, return only: VALID
        - If the step is incorrect, return only: INVALID: <short_desc>
        - Do not give extra explanations
    """
    
    response = client.responses.create(
        model = "gpt-4.1-mini",
        input = [
            {"role": "system", "content": VALIDATOR_PROMPT},
            {"role": "user", "content": thinking_steps}
        ]
    )
    
    return response.output_text
        
def ChainOfThoughtsPrompt():
    
    SYSTEM_PROMPT = """
        You are an AI assistance who works on START, THINK, EVALUATE and OUTPUT format.
        For a given user query first think and breakdown the problem into sub problems.
        You should always keep thinking and thinking before giving the actual output.
        Also, before outputting the final result to user you must check once if everything is correct.
        
        Rules:
        - Strictly follow the output JSON formate
        - Always follow the output in sequnce that is START, THINK and OUTPUT.
        - Always perform only one step at a time and wait for other step.
        - Always make sure to do multiple steps of thinking before giving out output.
        
        Output JSON formate:
        { "step": "START | THINK | EVALUATE | OUTPUT", "content": string"}
        
        Example: 
        User: Can you solve 3 + 4 * 10 - 4 * 3
        ASSISTANT: { "step: START", "contnt": "The user wants me to solve 3 + 4 * 10 - 4 * 3 maths problem" }
        ASSISTANT: { "step: THINK", "contnt": "This is typical math problem where we use BODMAS fomula for calculation" }
        ASSISTANT: {"step": "EVALUATE", "content": "Alright, Going good"}
        ASSISTANT: { "step: THINK", "contnt": "Lets breakdown the problem step by step" }
        ASSISTANT: {"step": "EVALUATE", "content": "Alright, Going good"}
        ASSISTANT: { "step: THINK", "contnt": "As per bodmas, first lets solve all multiplcations and divisions" }
        ASSISTANT: {"step": "EVALUATE", "content": "Alright, Going good"}
        ASSISTANT: { "step: THINK", "contnt": "So, first we need to solve 4 * 10 that is 40" }
        ASSISTANT: {"step": "EVALUATE", "content": "Alright, Going good"}
        ASSISTANT: { "step: THINK", "contnt": "Great, now the equation looks like 3 + 40 - 4 * 3" }
        ASSISTANT: {"step": "EVALUATE", "content": "Alright, Going good"}
        ASSISTANT: { "step: THINK", "contnt": "Now, I can see one more multiplication to be done that is 4 * 3 = 12" }
        ASSISTANT: {"step": "EVALUATE", "content": "Alright, Going good"}
        ASSISTANT: { "step: THINK", "contnt": "Great, now the equation looks like 3 + 40 - 12" }
        ASSISTANT: {"step": "EVALUATE", "content": "Alright, Going good"}
        ASSISTANT: { "step: THINK", "contnt": "As we have done all multiplications lets do the add and substrac" }
        ASSISTANT: {"step": "EVALUATE", "content": "Alright, Going good"}
        ASSISTANT: { "step: THINK", "contnt": "So, 3 + 40 = 43" }
        ASSISTANT: {"step": "EVALUATE", "content": "Alright, Going good"}
        ASSISTANT: { "step: THINK", "contnt": "new equations look like 43 - 12 which is 31" }
        ASSISTANT: {"step": "EVALUATE", "content": "Alright, Going good"}
        ASSISTANT: { "step: THINK", "contnt": "great, all steps are done and final result is 31" }
        ASSISTANT: {"step": "EVALUATE", "content": "Alright, Going good"}
        ASSISTANT: { "step: OUTPUT", "contnt": "3 + 4 * 10 - 4 * 3 = 31" }
        
          
    """ 
    
    messages = [
        
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        },
        # {
        #     "role": "user",
        #     "content": "Hey, Can you solve 4 * 6 - 12 * 34 / 7 * 21"
        # },
        {
            "role": "user",
            "content": "Write a Python code to find Prime Numbers"
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
        
        # Whenever thinking giving anser it will validate via another LLM
        # role: 'developer'   custom roles
        elif parseContent["step"] == "THINK":
            print(f'🧠 {parseContent["content"]}')
            
            validation = validateResult(parseContent["content"])
            
            if validation == "VALID":
                print(f"✅ Validator: {validation}")
            else:
                print(f"❌ Validator: {validation}")
            
            messages.append({
                "role": "developer",
                "content": json.dumps({
                    'step': "EVALUATE",
                    "content": validation
                })
            })
            continue

        elif parseContent["step"] == "OUTPUT":
            print(f'🤖 {parseContent["content"]}')
            break
        
        print("done...")            
        
if __name__ == "__main__":
    print(ChainOfThoughtsPrompt())
    

