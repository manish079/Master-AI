
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


# OPENAI Compatibility (GEMINI/CLAUDE)
# We can use same openai
    
if __name__ == "__main__":
    print(main())

