
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface NewsItem {
  id: string;
  headline: string;
  content: string;
  source: string;
  url: string;
  published_at: string;
  symbol: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  ai_summary: string;
  created_at: string;
}

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Transform the data to ensure sentiment is properly typed
      const transformedNews = (data || []).map(item => ({
        ...item,
        sentiment: (item.sentiment === 'positive' || item.sentiment === 'negative' || item.sentiment === 'neutral') 
          ? item.sentiment as 'positive' | 'negative' | 'neutral'
          : 'neutral' as const
      }));
      
      setNews(transformedNews);
    } catch (error: any) {
      toast({
        title: "Error fetching news",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterNewsByPortfolio = async (portfolioSymbols: string[]) => {
    if (!portfolioSymbols.length) {
      setFilteredNews(news);
      return;
    }

    const filtered = news.filter(item => 
      portfolioSymbols.includes(item.symbol) || 
      item.symbol === 'NIFTY' || 
      item.symbol === 'SENSEX'
    );
    
    setFilteredNews(filtered);
  };

  const generateAISummary = async (newsItems: NewsItem[]) => {
    // This would normally call OpenAI API, but for demo we'll simulate
    const positiveCount = newsItems.filter(item => item.sentiment === 'positive').length;
    const negativeCount = newsItems.filter(item => item.sentiment === 'negative').length;
    const neutralCount = newsItems.filter(item => item.sentiment === 'neutral').length;

    let overallSentiment = 'neutral';
    if (positiveCount > negativeCount) overallSentiment = 'positive';
    else if (negativeCount > positiveCount) overallSentiment = 'negative';

    return {
      sentiment: overallSentiment,
      summary: `Based on ${newsItems.length} news items: ${positiveCount} positive, ${negativeCount} negative, ${neutralCount} neutral. Overall market sentiment appears ${overallSentiment}.`,
      recommendation: overallSentiment === 'positive' 
        ? 'Consider maintaining or increasing positions in well-performing stocks.'
        : overallSentiment === 'negative'
        ? 'Exercise caution and consider defensive strategies.'
        : 'Maintain current positions and monitor developments closely.'
    };
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    filteredNews,
    loading,
    fetchNews,
    filterNewsByPortfolio,
    generateAISummary
  };
};
