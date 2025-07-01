
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddStockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStock: (stock: any) => void;
}

export const AddStockDialog = ({ isOpen, onClose, onAddStock }: AddStockDialogProps) => {
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    quantity: "",
    avgPrice: "",
    currentPrice: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newStock = {
      symbol: formData.symbol.toUpperCase(),
      name: formData.name,
      quantity: parseInt(formData.quantity),
      avgPrice: parseFloat(formData.avgPrice),
      currentPrice: parseFloat(formData.currentPrice)
    };

    onAddStock(newStock);
    setFormData({
      symbol: "",
      name: "",
      quantity: "",
      avgPrice: "",
      currentPrice: ""
    });
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Stock to Portfolio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="symbol">Stock Symbol</Label>
            <Input
              id="symbol"
              placeholder="e.g., RELIANCE"
              value={formData.symbol}
              onChange={(e) => handleChange("symbol", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              placeholder="e.g., Reliance Industries Ltd"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Number of shares"
              value={formData.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="avgPrice">Average Price (₹)</Label>
            <Input
              id="avgPrice"
              type="number"
              step="0.01"
              placeholder="Purchase price per share"
              value={formData.avgPrice}
              onChange={(e) => handleChange("avgPrice", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="currentPrice">Current Price (₹)</Label>
            <Input
              id="currentPrice"
              type="number"
              step="0.01"
              placeholder="Current market price"
              value={formData.currentPrice}
              onChange={(e) => handleChange("currentPrice", e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Stock
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
