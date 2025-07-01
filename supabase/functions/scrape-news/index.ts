
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NewsItem {
  headline: string;
  content: string;
  source: string;
  url: string;
  symbol: string;
  sentiment: string;
  ai_summary: string;
}

async function scrapeMoneycontrolNews(): Promise<NewsItem[]> {
  try {
    const response = await fetch('https://www.moneycontrol.com/news/business/stocks/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    const newsItems: NewsItem[] = [];
    const articles = doc?.querySelectorAll('li.clearfix') || [];
    
    for (let i = 0; i < Math.min(articles.length, 10); i++) {
      const article = articles[i];
      const titleElement = article.querySelector('h2 a');
      const contentElement = article.querySelector('p');
      
      if (titleElement && contentElement) {
        const headline = titleElement.textContent?.trim() || '';
        const content = contentElement.textContent?.trim() || '';
        const url = titleElement.getAttribute('href') || '';
        
        // Extract potential stock symbol from headline
        const symbolMatch = headline.match(/\b(TCS|INFY|RELIANCE|HDFC|ICICI|SBI|WIPRO|HCL|ADANI)\b/i);
        const symbol = symbolMatch ? symbolMatch[0].toUpperCase() : 'NIFTY';
        
        // Basic sentiment analysis based on keywords
        const positiveWords = ['growth', 'profit', 'gain', 'rise', 'surge', 'beat', 'strong', 'robust'];
        const negativeWords = ['loss', 'fall', 'decline', 'drop', 'weak', 'miss', 'concern', 'challenge'];
        
        const text = (headline + ' ' + content).toLowerCase();
        const positiveCount = positiveWords.filter(word => text.includes(word)).length;
        const negativeCount = negativeWords.filter(word => text.includes(word)).length;
        
        let sentiment = 'neutral';
        if (positiveCount > negativeCount) sentiment = 'positive';
        else if (negativeCount > positiveCount) sentiment = 'negative';
        
        newsItems.push({
          headline,
          content,
          source: 'Moneycontrol',
          url: url.startsWith('http') ? url : `https://www.moneycontrol.com${url}`,
          symbol,
          sentiment,
          ai_summary: `Market news about ${symbol} showing ${sentiment} sentiment based on content analysis.`
        });
      }
    }
    
    return newsItems;
  } catch (error) {
    console.error('Error scraping Moneycontrol:', error);
    return [];
  }
}

async function scrapeEconomicTimesNews(): Promise<NewsItem[]> {
  try {
    const response = await fetch('https://economictimes.indiatimes.com/markets/stocks/news', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    const newsItems: NewsItem[] = [];
    const articles = doc?.querySelectorAll('div[data-articleid]') || [];
    
    for (let i = 0; i < Math.min(articles.length, 10); i++) {
      const article = articles[i];
      const titleElement = article.querySelector('h3 a, h4 a');
      const contentElement = article.querySelector('p');
      
      if (titleElement) {
        const headline = titleElement.textContent?.trim() || '';
        const content = contentElement?.textContent?.trim() || headline;
        const url = titleElement.getAttribute('href') || '';
        
        // Extract potential stock symbol from headline
        const symbolMatch = headline.match(/\b(TCS|INFY|RELIANCE|HDFC|ICICI|SBI|WIPRO|HCL|ADANI)\b/i);
        const symbol = symbolMatch ? symbolMatch[0].toUpperCase() : 'NIFTY';
        
        // Basic sentiment analysis
        const positiveWords = ['growth', 'profit', 'gain', 'rise', 'surge', 'beat', 'strong', 'robust'];
        const negativeWords = ['loss', 'fall', 'decline', 'drop', 'weak', 'miss', 'concern', 'challenge'];
        
        const text = (headline + ' ' + content).toLowerCase();
        const positiveCount = positiveWords.filter(word => text.includes(word)).length;
        const negativeCount = negativeWords.filter(word => text.includes(word)).length;
        
        let sentiment = 'neutral';
        if (positiveCount > negativeCount) sentiment = 'positive';
        else if (negativeCount > positiveCount) sentiment = 'negative';
        
        newsItems.push({
          headline,
          content,
          source: 'Economic Times',
          url: url.startsWith('http') ? url : `https://economictimes.indiatimes.com${url}`,
          symbol,
          sentiment,
          ai_summary: `Market analysis for ${symbol} indicates ${sentiment} market sentiment.`
        });
      }
    }
    
    return newsItems;
  } catch (error) {
    console.error('Error scraping Economic Times:', error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting news scraping...');
    
    // Scrape news from multiple sources
    const [moneycontrolNews, economicTimesNews] = await Promise.all([
      scrapeMoneycontrolNews(),
      scrapeEconomicTimesNews()
    ]);
    
    const allNews = [...moneycontrolNews, ...economicTimesNews];
    console.log(`Scraped ${allNews.length} news items`);
    
    // Insert news into database
    let insertedCount = 0;
    for (const news of allNews) {
      try {
        const { error } = await supabase.from('news').insert([{
          headline: news.headline,
          content: news.content,
          source: news.source,
          url: news.url,
          symbol: news.symbol,
          sentiment: news.sentiment,
          ai_summary: news.ai_summary,
          published_at: new Date().toISOString(),
        }]);
        
        if (!error) {
          insertedCount++;
        } else {
          console.error('Error inserting news:', error);
        }
      } catch (insertError) {
        console.error('Error inserting individual news item:', insertError);
      }
    }

    console.log(`Successfully inserted ${insertedCount} news items`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        scraped: allNews.length, 
        inserted: insertedCount,
        sources: ['Moneycontrol', 'Economic Times']
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in scrape-news function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
