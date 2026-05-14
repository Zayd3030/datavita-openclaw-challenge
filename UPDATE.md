Fix three issues with the qualification flow:



1. Double greeting message — the agent is sending two welcome messages when the conversation starts. Find where the initial message is triggered and make sure it only fires once. Check if there's both an initial message in the system prompt AND a separate greeting being sent on mount — remove the duplicate.



2. Slow first message — the first agent message is delayed. Check if there's an unnecessary API call or delay on load. The greeting should either be hardcoded as the first message (no API call needed) or the API call should fire immediately on mount with no setTimeout or delay.



3. Power/kW question is showing for Government/Public Sector — the agent should only ask about power requirements when the workload type is AI/ML Training or High Performance Compute. For Government/Public Sector, Standard Enterprise, and Web/App Hosting, skip the power question entirely and go straight to compliance. Update the system prompt to include this logic explicitly:

"Only ask about power requirements (kW) if the prospect has indicated AI/ML training, HPC, or GPU workloads. For all other workload types, skip directly from workload type to compliance requirements."



4. While you're fixing the system prompt — also tell the agent to never ask about power if the user has already indicated a non-HPC workload type in their previous answer.

Show me exactly what changed in each file.



Now also add these:



1. Contact capture at the start Before the first question, ask for name, company, and email. Makes the brief a real sales document. One extra step that makes the whole thing feel production-ready.







make the brief panel more readable as its all dumped in make readable and spaced out



 Brief quality score After generating the brief, show a "qualification confidence" score (High/Medium/Low) based on how complete the answers were. Adds an intelligence feel.



Animated brief generation While the brief is generating, show a live typing/streaming effect rather than a loader. Much more impressive visually.



DataVita service explainer cards When a service is recommended, show a small card with what that service actually is — power specs, use cases, location. Pulls from hardcoded DataVita data. Shows product knowledge.



Mobile responsive polish Make sure it looks good on phone. Judges may check on mobile.



Reset / New Enquiry button After a brief is generated, a clear "Start New Enquiry" button. Small thing, makes it feel finished.



Favicon  Change the browser tab to show "DataVita Enquiry Agent" with a proper favicon. Tiny detail judges notice.

