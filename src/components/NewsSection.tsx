
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, TrendingUp } from "lucide-react";

const mockNews = [
  {
    id: 1,
    headline: "Reliance Industries Q3 Results: Revenue Up 12% YoY, Beats Estimates",
    source: "Economic Times",
    time: "2 hours ago",
    category: "Earnings",
    impact: "Positive",
    summary: "Reliance Industries reported strong Q3 results with revenue growth of 12% year-on-year, beating analyst estimates.",
    affectedStocks: ["RELIANCE"]
  },
  {
    id: 2,
    headline: "IT Sector Outlook: TCS and Infosys Expected to Show Steady Growth",
    source: "Moneycontrol",
    time: "4 hours ago",
    category: "Sector Analysis",
    impact: "Positive",
    summary: "Analysts predict steady growth for major IT companies as demand for digital services continues to rise.",
    affectedStocks: ["TCS", "INFY"]
  },
  {
    id: 3,
    headline: "RBI Monetary Policy: Repo Rate Kept Unchanged at 6.5%",
    source: "Business Standard",
    time: "6 hours ago",
    category: "Policy",
    impact: "Neutral",
    summary: "Reserve Bank of India maintains status quo on policy rates, focusing on inflation management.",
    affectedStocks: ["BANKBARODA", "SBIN", "HDFC"]
  },
  {
    id: 4,
    headline: "Nifty 50 Hits New All-Time High Amid Strong FII Inflows",
    source: "CNBC TV18",
    time: "8 hours ago",
    category: "Market",
    impact: "Positive",
    summary: "Indian equity markets reach new peaks as foreign institutional investors continue to invest heavily.",
    affectedStocks: ["NIFTY50"]
  },
  {
    id: 5,
    headline: "Oil Prices Impact: Petrol and Diesel Prices Expected to Rise",
    source: "Hindu Business Line",
    time: "10 hours ago",
    category: "Commodities",
    impact: "Mixed",
    summary: "Rising crude oil prices may lead to fuel price increases, affecting transportation and logistics sectors.",
    affectedStocks: ["RELIANCE", "BPCL", "IOC"]
  }
];

export const NewsSection = () => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Positive": return "bg-green-100 text-green-800";
      case "Negative": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Earnings": return "bg-blue-100 text-blue-800";
      case "Policy": return "bg-purple-100 text-purple-800";
      case "Market": return "bg-orange-100 text-orange-800";
      case "Sector Analysis": return "bg-indigo-100 text-indigo-800";
      case "Commodities": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Latest Market News</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Refresh News
        </Button>
      </div>

      <div className="grid gap-6">
        {mockNews.map((news) => (
          <Card key={news.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-lg font-semibold text-gray-900 leading-tight hover:text-blue-600 transition-colors">
                  {news.headline}
                </CardTitle>
                <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline" className={getCategoryColor(news.category)}>
                  {news.category}
                </Badge>
                <Badge variant="outline" className={getImpactColor(news.impact)}>
                  {news.impact}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {news.time}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">{news.summary}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Source:</span>
                  <span className="text-sm text-blue-600">{news.source}</span>
                </div>
                {news.affectedStocks.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-500">Stocks:</span>
                    {news.affectedStocks.slice(0, 3).map((stock) => (
                      <Badge key={stock} variant="secondary" className="text-xs">
                        {stock}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
