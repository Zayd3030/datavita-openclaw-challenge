The chip detection priority is still wrong. The issue is acknowledgment lines contain location/kW keywords from the previous answer, overriding the actual question being asked.

Completely change the approach. Instead of keyword matching on the message text, track which question number the agent is on and show chips based on that:

- Question 1 (workload): show workload chips
- Question 2 (power — only for HPC/AI): show kW chips  
- Question 3 (compliance): show compliance chips
- Question 4 (location): show location chips
- Question 5 (timeline/budget): show timeline chips

Track question number in the useQualification hook as a simple counter that increments each time the agent sends a message after the user has replied. Start at 1 after the first user message.

This is more reliable than keyword matching because it doesn't get confused by acknowledgment text that references previous answers.

at the end give a bulletpoint sumamry before it generates the brief and when it is get rid of the typing animation and only keep the stay tuned animation