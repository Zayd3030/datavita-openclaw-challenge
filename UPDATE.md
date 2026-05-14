Add quick reply suggestion buttons to the chat interface.

After each agent message, display a row of clickable suggestion chips underneath it. When clicked, the chip text is sent as the user's message automatically.

The suggestions should be context-aware based on keywords in the agent's message:

- If the message mentions "workload" or "running": show chips ["AI/ML Training", "Standard Enterprise", "Government/Public Sector", "Web/App Hosting"]
- If the message mentions "power" or "kW": show chips ["Under 10kW", "10-50kW", "50-100kW", "100kW+"]
- If the message mentions "compliance" or "regulatory": show chips ["ISO 27001", "Cyber Essentials Plus", "G-Cloud", "None Required"]
- If the message mentions "location": show chips ["Glasgow City Centre", "Lanarkshire", "Flexible"]
- If the message mentions "timeline" or "budget": show chips ["3 months / Under £5k", "6 months / £5-15k", "12 months / £15k+", "Flexible"]

Style the chips as small rounded pills using the existing accent colour (#00c896) as the border and text, transparent background, hover state fills the background. Display them in a flex-wrap row beneath the agent message bubble. Hide them once the user has sent a reply.