
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PortfolioStock {
  symbol: string;
  name: string;
  quantity: number;
  average_price: number;
}

interface NewsItem {
  headline: string;
  content: string;
  symbol: string;
  sentiment: string;
  published_at: string;
}

async function callOpenAI(prompt: string): Promise<string> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a financial analyst AI assistant. Provide concise, professional analysis of market news and portfolio impact. Keep responses under 200 words and focus on actionable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
}

function buildAnalysisPrompt(headlines: string[], portfolio: PortfolioStock[]): string {
  const portfolioText = portfolio.length > 0 
    ? `User's Portfolio: ${portfolio.map(stock => `${stock.symbol} (${stock.name})`).join(', ')}`
    : 'No portfolio information available';
    
  const headlinesText = headlines.length > 0 
    ? `Recent News Headlines:\n${headlines.map((h, i) => `${i + 1}. ${h}`).join('\n')}`
    : 'No recent news available';

  return `
${portfolioText}

${headlinesText}

Based on the above news headlines and portfolio information, provide:
1. Overall market sentiment (positive/negative/neutral)
2. Brief market outlook (2-3 sentences)
3. Portfolio impact analysis (if portfolio provided)
4. 2-3 actionable recommendations

Format your response as a JSON object with keys: overall_sentiment, market_outlook, portfolio_impact, recommendations (array of strings).
`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { headlines, portfolio } = await req.json()
    
    console.log('Received request with:', { 
      headlinesCount: headlines?.length || 0, 
      portfolioCount: portfolio?.length || 0 
    });

    // Build the prompt for OpenAI
    const prompt = buildAnalysisPrompt(headlines || [], portfolio || []);
    
    // Call OpenAI API
    const aiResponse = await callOpenAI(prompt);
    
    // Try to parse the AI response as JSON, fallback to structured response
    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch (parseError) {
      console.log('Failed to parse AI response as JSON, creating structured response');
      // Fallback: create a structured response from the AI text
      const lines = aiResponse.split('\n').filter(line => line.trim());
      analysis = {
        overall_sentiment: "neutral",
        market_outlook: aiResponse.substring(0, 200) + "...",
        portfolio_impact: portfolio.length > 0 
          ? "Analysis based on current market conditions and your portfolio holdings."
          : "Consider building a diversified portfolio to benefit from market opportunities.",
        recommendations: [
          "Monitor market developments closely",
          "Maintain diversified portfolio approach",
          "Consider rebalancing based on market conditions"
        ]
      };
    }

    // Ensure the response has the expected structure
    const structuredAnalysis = {
      overall_sentiment: analysis.overall_sentiment || "neutral",
      market_outlook: analysis.market_outlook || "Market conditions are mixed with various factors influencing performance.",
      portfolio_impact: analysis.portfolio_impact || (portfolio.length > 0 
        ? "Your portfolio positioning appears reasonable given current market conditions."
        : "Consider building a diversified portfolio across different sectors."),
      recommendations: Array.isArray(analysis.recommendations) 
        ? analysis.recommendations 
        : [
            "Monitor key economic indicators",
            "Maintain appropriate risk management",
            "Stay informed about sector-specific developments"
          ]
    };

    console.log('Generated analysis:', structuredAnalysis);

    return new Response(
      JSON.stringify(structuredAnalysis),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in ai-analysis function:', error);
    
    // Return a fallback response instead of an error
    const fallbackAnalysis = {
      overall_sentiment: "neutral",
      market_outlook: "Unable to generate AI analysis at this time. Market conditions remain mixed with various factors at play.",
      portfolio_impact: "Please try again later for detailed portfolio analysis.",
      recommendations: [
        "Monitor market developments closely",
        "Maintain diversified holdings",
        "Consider consulting with financial advisors"
      ]
    };

    return new Response(
      JSON.stringify(fallbackAnalysis),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  }
})
