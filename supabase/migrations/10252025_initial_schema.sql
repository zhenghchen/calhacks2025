-- Create Investor table
CREATE TABLE IF NOT EXISTS investors (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone_number VARCHAR(20) UNIQUE,
    mandate jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Founder table
CREATE TABLE IF NOT EXISTS founders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT not null,
    pedigree TEXT,
    profile TEXT,
    repeat_founder BOOLEAN DEFAULT FALSE,
    social_capital TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raw_transcript TEXT,
    deep_research_raw_output TEXT,
    consumer_acquisition_cost DECIMAL(15, 2),
    stage VARCHAR(50),
    region VARCHAR(100),
    industry VARCHAR(100),
    revenue DECIMAL(15, 2),
    values TEXT,
    accept boolean default false,
    investor_id UUID REFERENCES investor(id) ON DELETE SET NULL,
    founder_id UUID REFERENCES founder(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for foreign keys to improve query performance
CREATE INDEX IF NOT EXISTS idx_companies_investor_id ON companies(investor_id);
CREATE INDEX IF NOT EXISTS idx_companies_founder_id ON companies(founder_id);

-- Create indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_companies_stage ON companies(stage);
CREATE INDEX IF NOT EXISTS idx_companies_region ON companies(region);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_investor_updated_at
    BEFORE UPDATE ON investors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_founder_updated_at
    BEFORE UPDATE ON founders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Investor table
-- Investors can view their own record
CREATE POLICY "Investors can view own record"
    ON investors
    FOR SELECT
    USING (auth.uid() = id);

-- Investors can update their own record
CREATE POLICY "Investors can update own record"
    ON investors
    FOR UPDATE
    USING (auth.uid() = id);

-- RLS Policies for Companies table
-- Investors can view only their companies
CREATE POLICY "Investors can view own companies"
    ON companies
    FOR SELECT
    USING (investor_id = auth.uid());

-- Investors can insert companies with themselves as investor
CREATE POLICY "Investors can insert own companies"
    ON companies
    FOR INSERT
    WITH CHECK (investor_id = auth.uid());

-- Investors can update only their companies
CREATE POLICY "Investors can update own companies"
    ON companies
    FOR UPDATE
    USING (investor_id = auth.uid());

-- Investors can delete only their companies
CREATE POLICY "Investors can delete own companies"
    ON companies
    FOR DELETE
    USING (investor_id = auth.uid());

-- RLS Policies for Founders table
-- Investors can view founders associated with their companies
CREATE POLICY "Investors can view founders of their companies"
    ON founders
    FOR SELECT
    USING (
        id IN (
            SELECT founder_id 
            FROM companies 
            WHERE investor_id = auth.uid()
        )
    );

-- Investors can update founders associated with their companies
CREATE POLICY "Investors can update founders of their companies"
    ON founders
    FOR UPDATE
    USING (
        id IN (
            SELECT founder_id 
            FROM companies 
            WHERE investor_id = auth.uid()
        )
    );

-- Investors can insert new founders (for their companies)
CREATE POLICY "Investors can insert founders"
    ON founders
    FOR INSERT
    WITH CHECK (true);