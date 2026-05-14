create table enquiries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  contact_name text,
  company_name text,
  email text,
  workload_type text,             -- 'hpc_ai' | 'enterprise' | 'government' | 'web_app' | 'other'
  power_kw numeric,
  compliance_needs text[],        -- e.g. ['iso27001', 'cyber_essentials', 'gcloud', 'official_sensitive']
  location_pref text,             -- 'glasgow_city' | 'lanarkshire' | 'flexible'
  budget_monthly text,
  timeline text,
  mapped_service text,            -- 'colocation' | 'hpc_ai' | 'national_cloud' | 'connectivity' | 'design_build'
  routing_confidence text,        -- 'high' | 'medium' | 'low'
  brief_text text,                -- full generated brief markdown
  intelligence_context text,      -- AI Growth Zone / CoreWeave context injected
  status text default 'new'       -- 'new' | 'reviewed' | 'contacted'
);

-- Enable Row Level Security
alter table enquiries enable row level security;

-- Allow service role full access
create policy "Service role full access"
  on enquiries
  for all
  using (true);
