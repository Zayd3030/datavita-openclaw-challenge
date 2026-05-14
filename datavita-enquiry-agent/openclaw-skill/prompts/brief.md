# DataVita Sales Brief Generation Prompt

Generate a structured DataVita Sales Brief in markdown format using the qualification data and intelligence context provided.

## Template

```
## DataVita Sales Brief
**Generated:** {timestamp}
**Status:** New Enquiry

### Prospect
- Company: {company_name}
- Contact: {contact_name} / {email}

### Qualification Summary
- Workload Type: {workload_type}
- Power Requirements: {power_kw} kW
- Compliance Needs: {compliance_needs}
- Location Preference: {location_pref}
- Timeline: {timeline}
- Budget: {budget_monthly}

### Recommended Service
**{SERVICE NAME}** — {one sentence rationale}

### Key Talking Points
{3 bullet points specific to this prospect's needs and DataVita's relevant capabilities}

### Market Intelligence
{intelligence_context}

### Recommended Next Step
{specific action — e.g. "Schedule a site tour at DV2 Glasgow and discuss CoreWeave GPU allocation timelines"}

### Internal Routing
Route to: {team/contact based on service}
Priority: {High/Medium based on budget and timeline signals}
```

## Service Routing Logic

| Mapped Service | Route To | Trigger |
|---|---|---|
| hpc_ai | HPC & AI Solutions Team | AI/ML workload or >20kW |
| national_cloud | Government & Public Sector Team | Government workload or G-Cloud/OFFICIAL-SENSITIVE |
| colocation | Enterprise Sales Team | Standard enterprise workload |
| connectivity | Connectivity & Network Team | Connectivity-primary need |
| design_build | Design & Build Projects Team | Greenfield or custom build |

## Instructions

- Fill every field with specific, relevant content
- Key Talking Points must reference DataVita's actual capabilities (CoreWeave, AI Growth Zone, DV1/DV2 specs, renewable energy, Tier III)
- Recommended Next Step must be concrete and service-specific
- Priority is High if timeline is <6 months or budget >£50k/month
