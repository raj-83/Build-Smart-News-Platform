
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Stock {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

interface PortfolioSectionProps {
  portfolio: Stock[];
}

export const PortfolioSection = ({ portfolio }: PortfolioSectionProps) => {
  const calculateGainLoss = (stock: Stock) => {
    const gainLoss = (stock.currentPrice - stock.avgPrice) * stock.quantity;
    const percentage = ((stock.currentPrice - stock.avgPrice) / stock.avgPrice * 100).toFixed(2);
    return { gainLoss, percentage };
  };

  return (
    <div className="space-y-4">
      {portfolio.map((stock) => {
        const { gainLoss, percentage } = calculateGainLoss(stock);
        const isPositive = gainLoss >= 0;
        
        return (
          <Card key={stock.symbol} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {stock.symbol}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{stock.name}</p>
                </div>
                <Badge variant={isPositive ? "default" : "destructive"} className="flex items-center gap-1">
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {percentage}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-semibold text-gray-900">{stock.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg Price</p>
                  <p className="font-semibold text-gray-900">₹{stock.avgPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Price</p>
                  <p className="font-semibold text-gray-900">₹{stock.currentPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Investment</p>
                  <p className="font-semibold text-gray-900">₹{(stock.quantity * stock.avgPrice).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">P&L</p>
                  <p className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{Math.abs(gainLoss).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
