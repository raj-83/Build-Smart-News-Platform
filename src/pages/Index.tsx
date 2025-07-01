
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, User, Newspaper, Briefcase, TrendingUp, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FilteredNewsSection } from "@/components/FilteredNewsSection";
import { PortfolioManager } from "@/components/PortfolioManager";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Smart News App
              </h1>
              <p className="text-gray-600 text-lg">
                AI-powered news analysis for your portfolio
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-xl">Welcome to Smart News App!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-100">
                Get AI-powered news analysis tailored to your portfolio. 
                Add stocks to your portfolio to see relevant news and market insights.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Tabs defaultValue="news" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
              <TabsTrigger value="news" className="flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                Smart News
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                AI Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="news">
              <FilteredNewsSection />
            </TabsContent>

            <TabsContent value="portfolio">
              <PortfolioManager />
            </TabsContent>

            <TabsContent value="insights">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    AI Market Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Market Overview</h3>
                      <p className="text-blue-800 text-sm">
                        Current market sentiment shows optimism with strong corporate earnings and stable policy environment. 
                        However, global economic uncertainties require careful monitoring.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">Sector Highlights</h3>
                      <ul className="text-green-800 text-sm space-y-1">
                        <li>• Financial sector shows strength with digital transformation</li>
                        <li>• Infrastructure and renewable energy present growth opportunities</li>
                        <li>• IT sector facing headwinds from global slowdown</li>
                      </ul>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-amber-900 mb-2">Recommendations</h3>
                      <p className="text-amber-800 text-sm">
                        Consider maintaining diversified holdings while monitoring for opportunities in emerging sectors. 
                        Stay informed about policy changes and global developments.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
