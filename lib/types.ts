// Database Types based on Supabase schema

export interface Investor {
  id: string; // UUID - references auth.users(id)
  phone_number?: string;
  mandate?: string;
  created_at: string; // timestamp with time zone
  updated_at: string; // timestamp with time zone
}

export interface Founder {
  id: string; // UUID
  name: string;
  pedigree?: string;
  profile?: string;
  repeat_founder: boolean;
  social_capital?: string;
  created_at: string; // timestamp with time zone
  updated_at: string; // timestamp with time zone
}

export interface Company {
  id: string; // UUID
  raw_transcript?: string;
  deep_research_raw_output?: string;
  consumer_acquisition_cost?: number; // DECIMAL(15, 2)
  stage?: string; // VARCHAR(50)
  region?: string; // VARCHAR(100)
  industry?: string; // VARCHAR(100)
  revenue?: number; // DECIMAL(15, 2)
  values?: string;
  accept: boolean;
  amount_raised?: number; // DECIMAL(15, 2)
  investor_id?: string; // UUID - references investors(id)
  founder_id?: string; // UUID - references founders(id)
  created_at: string; // timestamp with time zone
  updated_at: string; // timestamp with time zone
}

