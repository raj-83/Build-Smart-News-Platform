
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, TrendingUp, TrendingDown, Minus, ExternalLink, Clock, Lightbulb, Zap } from 'lucide-react';
import { useNews, NewsItem } from '@/hooks/useNews';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

export const FilteredNewsSection = () => {
  const { news, filteredNews, loading, fetchNews, filterNewsByPortfolio } = useNews();
  const { portfolio } = usePortfolio();
  const { loading: aiLoading, analysis, generateAnalysis, triggerNewsRefresh } = useAIAnalysis();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const portfolioSymbols = portfolio.map(stock => stock.symbol);
    filterNewsByPortfolio(portfolioSymbols);
  }, [portfolio, news]);

  useEffect(() => {
    if (filteredNews.length > 0) {
      const headlines = filteredNews.map(item => item.headline);
      generateAnalysis(headlines, portfolio);
    }
  }, [filteredNews, portfolio]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // First scrape new news
      await triggerNewsRefresh();
      // Then fetch the updated news from database
      await fetchNews();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAIAnalysis = async () => {
    if (filteredNews.length > 0) {
      const headlines = filteredNews.map(item => item.headline);
      await generateAnalysis(headlines, portfolio);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Portfolio News Feed
        </h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleAIAnalysis}
            variant="outline"
            disabled={aiLoading || filteredNews.length === 0}
            className="flex items-center gap-2"
          >
            <Zap className={`w-4 h-4 ${aiLoading ? 'animate-pulse' : ''}`} />
            AI Analysis
          </Button>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh News
          </Button>
        </div>
      </div>

      {/* AI Analysis Card */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                AI Market Analysis
                {aiLoading && <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Overall Sentiment:</span>
                  <Badge className={getSentimentColor(analysis.overall_sentiment)}>
                    {getSentimentIcon(analysis.overall_sentiment)}
                    {analysis.overall_sentiment.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Market Outlook:</h4>
                  <p className="text-gray-700 text-sm">{analysis.market_outlook}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Portfolio Impact:</h4>
                  <p className="text-gray-700 text-sm">{analysis.portfolio_impact}</p>
                </div>
                {analysis.recommendations && analysis.recommendations.length > 0 && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertDescription className="text-blue-800">
                      <strong>AI Recommendations:</strong>
                      <ul className="mt-1 ml-4 list-disc">
                        {analysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm">{rec}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* News Items */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading news...</span>
            </div>
          ) : filteredNews.length === 0 ? (
            <Card className="bg-gray-50">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600 mb-4">
                  No news found for your portfolio stocks. Add some stocks to see relevant news!
                </p>
                <Button onClick={handleRefresh} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Scrape Latest News
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.headline}
                      </CardTitle>
                      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        {item.symbol}
                      </Badge>
                      <Badge variant="outline" className={getSentimentColor(item.sentiment)}>
                        {getSentimentIcon(item.sentiment)}
                        {item.sentiment}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(item.published_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">{item.content}</p>
                    {item.ai_summary && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-900 mb-1">AI Analysis:</p>
                        <p className="text-sm text-blue-800">{item.ai_summary}</p>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500">Source: {item.source}</span>
                      {item.url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            Read More
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
