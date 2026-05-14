Create an OpenClaw skill that connects to the live Vercel API.

In openclaw-skill/skill.yaml, create a skill that:
- Triggers when someone says "datavita enquiry" or "data centre enquiry" or "colocation"
- Sends the user's messages to the Vercel API at /api/qualify
- Returns the agent's responses back to the user in Telegram
- Maintains conversation history across messages in the session

In openclaw-skill/prompts/qualify.md, write a simple instruction:
"You are routing messages to the DataVita Enquiry Intelligence Agent. Forward all user messages to the qualification API and return responses verbatim."

The skill needs to pass the full conversation history as the messages array to POST /api/qualify, same format the web app uses.

Use the environment variable DATAVITA_API_URL for the Vercel base URL so it's configurable.