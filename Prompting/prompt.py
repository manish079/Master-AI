
#Prompting styles
    #  - Alpaca Prompt
    # - Instruction: \n### Input:\n### Response
    
    # INST Formate(LLaMA-2)
    # [INST] What is an LRU Cache?[/INST]
    

# Prompt that used by everyone (Google/OpenAI)
# - ChatML
    # message = [
    #     {"role" : "user | assistant | system \ developer",
    #      "content" : "What is Microservices"
    #      }
    # ]
    
    

from openai import OpenAI
from dotenv import load_dotenv
import os
import json
load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# response = client.responses.create(
#     model = "gpt-5.6",
#     input="Write a short advice for lonely peoples"
# )
    
# print(json.dumps(response.model_dump(), indent=2))

# ALready counts token is again used as a cached token thier charge is less

'''
def main():
    response = client.responses.create(
        model = "gpt-4.1-mini",
        input = [
            {"role": "user", "content": "Hey, GPT, I am Manish Prajapat"},
            {"role": "assistant", "content": "Manish! How can I help you today"},
            {"role" : "user", "content": "What is my name?"},
            {"role" : "assistant", "content": "Your name is Manish Prajapat. How can I help you further. 😊"},
            {"role" : "user", "content": "Tell me story about me"},
        ]
    )
    
    return response.output_text
    
'''


# tools calling web search with stream 
'''
def main():
    response = client.responses.create(
        model = "gpt-4.1-mini",
        input = [
            {"role": "user", "content": "Hey, GPT, I am Manish Prajapat"},
            {"role": "assistant", "content": "Manish! How can I help you today"},
            {"role" : "user", "content": "What is my name?"},
            {"role" : "assistant", "content": "Your name is Manish Prajapat. How can I help you further. 😊"},
            {"role" : "user", "content": "What was today news in India."},
        ],
        tools = [
            { "type": "web_search" },
        ],
        stream=True,
    )
    
    for event in response:
        if event.type == "response.output_text.delta":
            print(event.delta, end="", flush=True)
'''

def main():
    response = client.responses.create(
        model = "gpt-4.1-mini",
        input="I need to solve the equation 3x + 11 = 14. Can you help me?",
        tools = [
            { "type": "code_interpreter",  "container": {"type": "auto"} },
        ],
        stream=True,
    )
    
    for event in response:
        if event.type == "response.output_text.delta":
            print(event.delta, end="", flush=True)



# OPENAI Compatibility (GEMINI/CLAUDE)
# We can use same openai

#everything will be same as openai code, just in client base_url will come
client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

def OpenAIGoogleCompatible():
    response = client.chat.completions.create(
        model="gemini-3.6-flash",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "Explain to me how AI works."
            }
        ],
        stream=True,
        extra_body={
            'extra_body': {
                "google": {
                "thinking_config": {
                    "thinking_level": "low",
                    "include_thoughts": True
                }
                }
            }
        }
    )

    for chunk in response:
        if not chunk.choices:
            continue

        content = chunk.choices[0].delta.content

        if content:
            print(content, end="", flush=True)

if __name__ == "__main__":
    # print(main())
    print(OpenAIGoogleCompatible())
    

