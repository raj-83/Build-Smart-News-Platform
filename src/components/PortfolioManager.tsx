
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { usePortfolio, Stock } from '@/hooks/usePortfolio';

export const PortfolioManager = () => {
  const { portfolio, loading, addStock, deleteStock } = usePortfolio();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStock, setNewStock] = useState({
    symbol: '',
    name: '',
    quantity: '',
    average_price: ''
  });

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    await addStock({
      symbol: newStock.symbol.toUpperCase(),
      name: newStock.name,
      quantity: parseInt(newStock.quantity),
      average_price: parseFloat(newStock.average_price)
    });
    setNewStock({ symbol: '', name: '', quantity: '', average_price: '' });
    setIsAddDialogOpen(false);
  };

  const calculateStats = () => {
    const totalInvestment = portfolio.reduce((sum, stock) => sum + (stock.quantity * stock.average_price), 0);
    // Simulate current prices (in real app, you'd fetch from API)
    const currentPrices = {
      'RELIANCE': 2850,
      'TCS': 3650,
      'INFY': 1580,
      'HDFC': 1650,
      'ICICI': 950
    };
    
    const currentValue = portfolio.reduce((sum, stock) => {
      const currentPrice = currentPrices[stock.symbol as keyof typeof currentPrices] || stock.average_price;
      return sum + (stock.quantity * currentPrice);
    }, 0);
    
    const totalGainLoss = currentValue - totalInvestment;
    const gainLossPercentage = totalInvestment ? ((totalGainLoss / totalInvestment) * 100).toFixed(2) : '0.00';

    return { totalInvestment, currentValue, totalGainLoss, gainLossPercentage };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Portfolio</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Stock</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddStock} className="space-y-4">
              <div>
                <Label htmlFor="symbol">Stock Symbol</Label>
                <Input
                  id="symbol"
                  value={newStock.symbol}
                  onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
                  placeholder="e.g., RELIANCE"
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={newStock.name}
                  onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                  placeholder="e.g., Reliance Industries Ltd"
                  required
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newStock.quantity}
                  onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
                  placeholder="Number of shares"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Average Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newStock.average_price}
                  onChange={(e) => setNewStock({ ...newStock, average_price: e.target.value })}
                  placeholder="Purchase price per share"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Stock
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">Total Investment</div>
              <div className="text-2xl font-bold">₹{stats.totalInvestment.toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">Current Value</div>
              <div className="text-2xl font-bold">₹{stats.currentValue.toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">Total P&L</div>
              <div className={`text-2xl font-bold flex items-center ${stats.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.totalGainLoss >= 0 ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
                ₹{Math.abs(stats.totalGainLoss).toLocaleString('en-IN')}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">Returns</div>
              <div className={`text-2xl font-bold ${stats.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.gainLossPercentage}%
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Portfolio Holdings */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading portfolio...</div>
        ) : portfolio.length === 0 ? (
          <Card className="bg-gray-50">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">Your portfolio is empty.</p>
              <p className="text-sm text-gray-500">Add stocks to start tracking your investments and get personalized news.</p>
            </CardContent>
          </Card>
        ) : (
          portfolio.map((stock, index) => (
            <motion.div
              key={stock.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                      <p className="text-sm text-gray-600">{stock.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{stock.quantity} shares</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => stock.id && deleteStock(stock.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Avg Price</p>
                      <p className="font-medium">₹{stock.average_price}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Investment</p>
                      <p className="font-medium">₹{(stock.quantity * stock.average_price).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Current Price</p>
                      <p className="font-medium">₹{stock.average_price * 1.02}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
