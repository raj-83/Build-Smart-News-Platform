
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Stock {
  id?: string;
  symbol: string;
  name: string;
  quantity: number;
  average_price: number;
  user_id?: string;
}

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPortfolio = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolio(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching portfolio",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addStock = async (stock: Omit<Stock, 'id' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('portfolio')
        .insert([{
          ...stock,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setPortfolio(prev => [data, ...prev]);
      toast({
        title: "Stock added",
        description: `${stock.symbol} has been added to your portfolio.`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding stock",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateStock = async (id: string, updates: Partial<Stock>) => {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setPortfolio(prev => prev.map(stock => 
        stock.id === id ? data : stock
      ));
      
      toast({
        title: "Stock updated",
        description: "Your portfolio has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating stock",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteStock = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPortfolio(prev => prev.filter(stock => stock.id !== id));
      toast({
        title: "Stock removed",
        description: "Stock has been removed from your portfolio.",
      });
    } catch (error: any) {
      toast({
        title: "Error removing stock",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [user]);

  return {
    portfolio,
    loading,
    addStock,
    updateStock,
    deleteStock,
    refetch: fetchPortfolio
  };
};
