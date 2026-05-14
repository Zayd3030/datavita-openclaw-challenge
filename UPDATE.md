The chip detection is still showing workload chips when it should show kW chips. The issue is the message contains the word "workload" even when asking about power, so workload chips always win.

Fix this by changing the order of priority — check for the MOST SPECIFIC keywords first:

Check in this exact order:
1. "kW" OR "kilowatt" OR "footprint" OR "power density" OR "per rack" → show kW chips
2. "compliance" OR "regulatory" OR "ISO" OR "G-Cloud" OR "Cyber Essentials" OR "OFFICIAL-SENSITIVE" → show compliance chips  
3. "location" OR "facility" OR "Bothwell" OR "Lanarkshire" OR "DV1" OR "DV2" → show location chips
4. "timeline" OR "budget" OR "monthly" OR "deployment date" → show timeline chips
5. "workload" OR "planning to run" OR "planning to host" → show workload chips (LAST, lowest priority)

The kW check must come before the workload check. Stop checking after the first match.

The chip detection is reading the whole message including the agent's acknowledgment of the previous answer. Fix it by only checking the LAST paragraph or LAST sentence of the agent message for keyword matching — not the full message text.

Split the message by "\n\n" (double newline) and only run keyword detection on the last non-empty paragraph. This way "15kW is well within our capabilities" won't trigger kW chips when the actual question being asked is about compliance.