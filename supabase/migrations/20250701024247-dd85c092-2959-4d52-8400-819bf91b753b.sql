
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio table to store user's stock holdings
CREATE TABLE public.portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  average_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, symbol)
);

-- Create news table to store scraped news
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  headline TEXT NOT NULL,
  content TEXT,
  source TEXT NOT NULL,
  url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  symbol TEXT, -- Stock symbol this news relates to
  sentiment TEXT, -- AI generated sentiment: positive, negative, neutral
  ai_summary TEXT, -- AI generated summary
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user alerts table for personalized notifications
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, warning, success, error
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for portfolio
CREATE POLICY "Users can view own portfolio" ON public.portfolio
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own portfolio" ON public.portfolio
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own portfolio" ON public.portfolio
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own portfolio" ON public.portfolio
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for news (public read access)
CREATE POLICY "Anyone can view news" ON public.news
  FOR SELECT TO authenticated, anon USING (true);

-- Create RLS policies for alerts
CREATE POLICY "Users can view own alerts" ON public.alerts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON public.alerts
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample news data
INSERT INTO public.news (headline, content, source, url, published_at, symbol, sentiment, ai_summary) VALUES
('Reliance Industries Q3 Results: Revenue Up 12% YoY, Beats Estimates', 'Reliance Industries reported strong Q3 results with revenue growth of 12% year-on-year, beating analyst estimates. The company showed robust performance across petrochemicals and retail segments.', 'Economic Times', 'https://example.com/reliance-q3', NOW() - INTERVAL '2 hours', 'RELIANCE', 'positive', 'Strong quarterly performance indicates solid fundamentals and growth prospects.'),
('TCS Reports Steady Growth in Q3, Digital Transformation Demand Rises', 'Tata Consultancy Services announced steady growth in Q3 with increased demand for digital transformation services from global clients.', 'Moneycontrol', 'https://example.com/tcs-q3', NOW() - INTERVAL '4 hours', 'TCS', 'positive', 'Continued growth in high-margin digital services bodes well for future earnings.'),
('Infosys Maintains FY24 Guidance Despite Market Headwinds', 'Infosys maintains its FY24 revenue guidance despite challenging market conditions, showing confidence in its service delivery capabilities.', 'Business Standard', 'https://example.com/infy-guidance', NOW() - INTERVAL '6 hours', 'INFY', 'neutral', 'Stable guidance suggests resilient business model but growth may be limited.'),
('RBI Keeps Repo Rate Unchanged at 6.5%, Focus on Inflation Control', 'Reserve Bank of India maintains status quo on policy rates, focusing on inflation management and economic stability.', 'CNBC TV18', 'https://example.com/rbi-policy', NOW() - INTERVAL '8 hours', 'NIFTY', 'neutral', 'Stable monetary policy provides predictable environment for market participants.'),
('Nifty 50 Hits New All-Time High Amid Strong FII Inflows', 'Indian equity markets reach new peaks as foreign institutional investors continue to invest heavily in Indian markets.', 'Hindu Business Line', 'https://example.com/nifty-high', NOW() - INTERVAL '10 hours', 'NIFTY', 'positive', 'Strong foreign inflows indicate continued confidence in Indian market fundamentals.');
