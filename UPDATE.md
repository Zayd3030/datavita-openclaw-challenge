The quick reply suggestion chips are not showing the right options at the right time. Fix the keyword detection logic in the chips component so it matches exactly:

When agent message contains "workload" OR "running" OR "planning to host":
→ show ["AI/ML Training", "Standard Enterprise", "Government/Public Sector", "Web/App Hosting"]

When agent message contains "power" OR "kW" OR "kilowatt" OR "footprint":
→ show ["Under 10kW", "10-50kW", "50-100kW", "100kW+"]

When agent message contains "compliance" OR "regulatory" OR "ISO" OR "G-Cloud" OR "Cyber Essentials":
→ show ["ISO 27001", "Cyber Essentials Plus", "G-Cloud", "OFFICIAL-SENSITIVE", "None Required"]

When agent message contains "location" OR "facility" OR "Glasgow" OR "Lanarkshire":
→ show ["Glasgow City Centre (DV2)", "Lanarkshire (DV1)", "Flexible"]

When agent message contains "timeline" OR "budget" OR "when" OR "monthly":
→ show ["3 months / ", "6 months", "12 months+", "Flexible Timeline"] and also give options for budget next to it for example "3 momths / under £5k etc"

Make all keyword checks case-insensitive. Show chips for the most recent agent message only. If no keywords match, show no chips. Do not show chips after the user has already replied to that message.