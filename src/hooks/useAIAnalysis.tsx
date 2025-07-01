
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface AIAnalysisResult {
  overall_sentiment: 'positive' | 'negative' | 'neutral';
  market_outlook: string;
  portfolio_impact: string;
  recommendations: string[];
}

export const useAIAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const { toast } = useToast();

  const generateAnalysis = async (headlines: string[], portfolio: any[]) => {
    setLoading(true);
    try {
      console.log('Calling AI analysis with:', { headlines: headlines.length, portfolio: portfolio.length });
      
      const { data, error } = await supabase.functions.invoke('ai-analysis', {
        body: {
          headlines,
          portfolio: portfolio.map(stock => ({
            symbol: stock.symbol,
            name: stock.name,
            quantity: stock.quantity,
            average_price: stock.average_price
          }))
        }
      });

      if (error) {
        console.error('AI Analysis error:', error);
        throw error;
      }

      console.log('AI Analysis result:', data);
      setAnalysis(data);
      
      toast({
        title: "AI Analysis Complete",
        description: "Generated market analysis based on current news and your portfolio.",
      });

    } catch (error: any) {
      console.error('Error generating AI analysis:', error);
      toast({
        title: "Analysis Error",
        description: "Unable to generate AI analysis. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerNewsRefresh = async () => {
    try {
      console.log('Triggering news scraping...');
      
      const { data, error } = await supabase.functions.invoke('scrape-news', {
        body: {}
      });

      if (error) {
        console.error('News scraping error:', error);
        throw error;
      }

      console.log('News scraping result:', data);
      
      toast({
        title: "News Updated",
        description: `Successfully scraped ${data.scraped || 0} news articles from ${data.sources?.join(', ') || 'various sources'}.`,
      });

      return data;
    } catch (error: any) {
      console.error('Error refreshing news:', error);
      toast({
        title: "News Refresh Error",
        description: "Unable to refresh news. Please try again later.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    loading,
    analysis,
    generateAnalysis,
    triggerNewsRefresh
  };
};
