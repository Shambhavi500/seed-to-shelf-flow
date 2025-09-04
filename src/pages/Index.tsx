import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import SupplyChainFlow from "@/components/SupplyChainFlow";
import StakeholderDashboard from "@/components/StakeholderDashboard";
import { Shield, Zap, Globe, Lock } from "lucide-react";

const Index = () => {
  const [activeRole, setActiveRole] = useState("farmer");
  const [products, setProducts] = useState([
    {
      id: "AGRI-001",
      name: "Premium Wheat",
      quantity: 500,
      basePrice: 25,
      currentPrice: 32,
      harvestDate: "2024-08-15",
      quality: "A" as const,
      status: "Available for Consumers",
      farmer: "Rajesh Singh",
      distributor: "AgriTrans Ltd",
      retailer: "FreshMart Store",
      location: "Punjab, India"
    },
    {
      id: "AGRI-002", 
      name: "Organic Rice",
      quantity: 300,
      basePrice: 40,
      currentPrice: 45,
      harvestDate: "2024-08-20",
      quality: "A" as const,
      status: "In Transit",
      farmer: "Priya Sharma",
      distributor: "GreenLogistics",
      location: "Haryana, India"
    },
    {
      id: "AGRI-003",
      name: "Fresh Corn",
      quantity: 200,
      basePrice: 18,
      currentPrice: 18,
      harvestDate: "2024-08-25",
      quality: "B" as const,
      status: "Available for Distribution",
      farmer: "Kumar Patel",
      location: "Gujarat, India"
    }
  ]);

  const handleProductAdd = (newProduct: any) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleProductAction = (productId: string, action: string) => {
    // Simulate blockchain transaction
    console.log(`Action: ${action} on Product: ${productId}`);
  };

  const features = [
    {
      icon: Shield,
      title: "Tamper-Proof Records",
      description: "Every transaction is recorded on blockchain, ensuring data integrity"
    },
    {
      icon: Zap,
      title: "Real-Time Tracking", 
      description: "Track products instantly from farm to consumer"
    },
    {
      icon: Globe,
      title: "Complete Transparency",
      description: "Full visibility into pricing, origin, and quality at each step"
    },
    {
      icon: Lock,
      title: "Secure & Verified",
      description: "Cryptographically secured smart contracts ensure authenticity"
    }
  ];

  const filteredProducts = products.filter(product => {
    switch (activeRole) {
      case "farmer":
        return true; // Farmers can see all their products
      case "distributor":
        return product.status === "Available for Distribution" || product.status === "In Transit";
      case "retailer":
        return product.status === "In Transit" || product.status === "Available for Consumers";
      case "consumer":
        return product.status === "Available for Consumers";
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header activeRole={activeRole} onRoleChange={setActiveRole} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-12">
          <div className="inline-flex items-center space-x-2 bg-trust/10 text-trust px-4 py-2 rounded-full">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Blockchain-Powered Agriculture</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Complete Supply Chain
            <span className="block gradient-primary bg-clip-text text-transparent">
              Transparency
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track agricultural produce from farmer to consumer with immutable blockchain records, 
            ensuring transparency, quality, and fair pricing at every step.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card hover:shadow-soft transition-smooth text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard */}
        <Tabs value="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Products ({filteredProducts.length})</span>
                      <Badge variant="outline" className="capitalize">
                        {activeRole} View
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          userRole={activeRole}
                          onAction={handleProductAction}
                        />
                      ))}
                    </div>
                    {filteredProducts.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No products available for {activeRole}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <StakeholderDashboard 
                  role={activeRole}
                  onProductAdd={handleProductAdd}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="supply-chain" className="space-y-6">
            <SupplyChainFlow 
              productId={products[0]?.id}
              currentStage={products[0]?.status || "Available for Distribution"}
            />
            
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Blockchain Transaction Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "Product Registered", user: "Farmer: Rajesh Singh", time: "2 hours ago", status: "success" },
                    { action: "Transportation Started", user: "Distributor: AgriTrans Ltd", time: "1 hour ago", status: "pending" },
                    { action: "Quality Verification", user: "System", time: "30 mins ago", status: "success" },
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{log.action}</p>
                        <p className="text-xs text-muted-foreground">{log.user}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={log.status === "success" ? "default" : "secondary"}
                          className={log.status === "success" ? "bg-success text-success-foreground" : ""}
                        >
                          {log.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-success mb-2">127</div>
                  <div className="text-sm text-muted-foreground">Total Products Tracked</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-trust mb-2">₹2.4L</div>
                  <div className="text-sm text-muted-foreground">Total Value Transacted</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-warning mb-2">98.5%</div>
                  <div className="text-sm text-muted-foreground">Supply Chain Accuracy</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
