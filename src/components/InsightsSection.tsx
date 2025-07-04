
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target } from "lucide-react";

interface Stock {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

interface InsightsSectionProps {
  portfolio: Stock[];
}

const mockInsights = [
  {
    id: 1,
    type: "positive",
    title: "Strong Q3 Results Expected for Reliance",
    description: "Based on recent news about Reliance's Q3 performance beating estimates, your RELIANCE holdings may see continued positive momentum.",
    impact: "High",
    affectedStocks: ["RELIANCE"],
    recommendation: "Consider holding or adding more on dips"
  },
  {
    id: 2,
    type: "neutral",
    title: "IT Sector Showing Resilience",
    description: "Your IT holdings (TCS, INFY) are positioned well for steady growth as digital transformation continues.",
    impact: "Medium",
    affectedStocks: ["TCS", "INFY"],
    recommendation: "Maintain current positions"
  },
  {
    id: 3,
    type: "warning",
    title: "RBI Policy Impact on Portfolio",
    description: "Unchanged repo rates maintain status quo, but watch for inflation data that could impact your overall portfolio valuation.",
    impact: "Low",
    affectedStocks: ["RELIANCE", "TCS", "INFY"],
    recommendation: "Monitor inflation trends closely"
  }
];

export const InsightsSection = ({ portfolio }: InsightsSectionProps) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "positive": return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return <Lightbulb className="w-5 h-5 text-blue-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive": return "border-l-green-500 bg-green-50";
      case "warning": return "border-l-yellow-500 bg-yellow-50";
      default: return "border-l-blue-500 bg-blue-50";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">AI-Powered Portfolio Insights</h2>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Lightbulb className="w-4 h-4" />
        <AlertDescription className="text-blue-800">
          These insights are generated by analyzing recent market news and their potential impact on your portfolio holdings.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {mockInsights.map((insight) => (
          <Card key={insight.id} className={`shadow-lg border-l-4 ${getInsightColor(insight.type)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {insight.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={getImpactColor(insight.impact)}>
                        {insight.impact} Impact
                      </Badge>
                      {insight.affectedStocks.map((stock) => (
                        <Badge key={stock} variant="secondary" className="text-xs">
                          {stock}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">{insight.description}</p>
              <div className="bg-white p-3 rounded-lg border">
                <p className="text-sm font-medium text-gray-700 mb-1">Recommendation:</p>
                <p className="text-sm text-gray-600">{insight.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio Summary Insights */}
      <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Portfolio Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">85/100</p>
              <p className="text-blue-100">Strong Performance</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Based on diversification,</p>
              <p className="text-sm text-blue-100">recent performance, and market outlook</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
