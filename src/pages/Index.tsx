import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import SupplyChainFlow from "@/components/SupplyChainFlow";
import StakeholderDashboard from "@/components/StakeholderDashboard";
import TransactionModal from "@/components/TransactionModal";
import VerificationModal from "@/components/VerificationModal";
import { Shield, Zap, Globe, Lock, Activity, TrendingUp, Package } from "lucide-react";
import { blockchain, Product, formatHash, getNetworkInfo } from "@/utils/blockchain";

const Index = () => {
  const { toast } = useToast();
  const [activeRole, setActiveRole] = useState("farmer");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionModal, setTransactionModal] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
    action: "transport" | "retail" | "verify";
  }>({
    isOpen: false,
    productId: "",
    productName: "",
    action: "transport"
  });
  const [verificationModal, setVerificationModal] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
    data: any;
  }>({
    isOpen: false,
    productId: "",
    productName: "",
    data: null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [blockchainStats, setBlockchainStats] = useState({
    totalProducts: 0,
    totalTransactions: 0,
    totalValue: 0,
    networkInfo: getNetworkInfo()
  });

  // Load products on component mount
  useEffect(() => {
    loadProducts();
    updateBlockchainStats();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const allProducts = await blockchain.getAllProducts();
      setProducts(allProducts);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products from blockchain",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBlockchainStats = async () => {
    try {
      const allProducts = await blockchain.getAllProducts();
      const allTransactions = await blockchain.getAllTransactions();
      const totalValue = allProducts.reduce((sum, product) => sum + (product.currentPrice * product.quantity), 0);
      
      setBlockchainStats({
        totalProducts: allProducts.length,
        totalTransactions: allTransactions.length,
        totalValue,
        networkInfo: getNetworkInfo()
      });
    } catch (error) {
      console.error("Failed to update stats:", error);
    }
  };

  const handleProductAdd = async (newProductData: any) => {
    setIsProcessing(true);
    try {
      const result = await blockchain.registerProduct({
        name: newProductData.name,
        quantity: newProductData.quantity,
        basePrice: newProductData.basePrice,
        harvestDate: newProductData.harvestDate,
        quality: newProductData.quality,
        farmer: `${newProductData.farmer || 'Current User'} (0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)})`,
        location: newProductData.location
      });

      if (result.success) {
        toast({
          title: "Product Registered on Blockchain! 🎉",
          description: `Transaction Hash: ${formatHash(result.transactionHash)}`,
          duration: 5000,
        });
        
        await loadProducts();
        await updateBlockchainStats();
      }
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Failed to register product on blockchain",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProductAction = (productId: string, action: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (action === "verify") {
      setTransactionModal({
        isOpen: true,
        productId,
        productName: product.name,
        action: "verify"
      });
    } else if (action === "transport") {
      setTransactionModal({
        isOpen: true,
        productId,
        productName: product.name,
        action: "transport"
      });
    } else if (action === "retail") {
      setTransactionModal({
        isOpen: true,
        productId,
        productName: product.name,
        action: "retail"
      });
    }
  };

  const handleTransactionSubmit = async (formData: any) => {
    setIsProcessing(true);
    try {
      const { productId, action } = transactionModal;
      let result;

      if (action === "verify") {
        const verificationData = await blockchain.verifyProduct(productId);
        setVerificationModal({
          isOpen: true,
          productId,
          productName: transactionModal.productName,
          data: verificationData
        });
        setTransactionModal({ ...transactionModal, isOpen: false });
        setIsProcessing(false);
        return;
      } else if (action === "transport") {
        const distributor = `${formData.actorName} (0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)})`;
        result = await blockchain.updateAsDistributor(
          productId,
          distributor,
          parseFloat(formData.handlingCost),
          formData.transportDetails
        );
      } else if (action === "retail") {
        const retailer = `${formData.actorName} (0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)})`;
        result = await blockchain.updateAsRetailer(
          productId,
          retailer,
          parseFloat(formData.retailMargin),
          formData.storeDetails
        );
      }

      if (result?.success) {
        toast({
          title: "Transaction Successful! ⛓️",
          description: `Blockchain updated. Tx: ${formatHash(result.transactionHash)}`,
          duration: 5000,
        });
        
        await loadProducts();
        await updateBlockchainStats();
        setTransactionModal({ ...transactionModal, isOpen: false });
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Failed to update blockchain",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading blockchain data...</p>
        </div>
      </div>
    );
  }

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

        {/* Blockchain Network Status */}
        <div className="bg-trust/5 border border-trust/20 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse-soft"></div>
              <div>
                <h3 className="font-semibold text-foreground">{blockchainStats.networkInfo.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Block #{blockchainStats.networkInfo.blockNumber.toLocaleString()} • {blockchainStats.networkInfo.gasPrice}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">{blockchainStats.totalTransactions} Transactions</div>
              <div className="text-xs text-muted-foreground">₹{blockchainStats.totalValue.toLocaleString()} Total Value</div>
            </div>
          </div>
        </div>
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
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Live Blockchain Transactions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {blockchainStats.totalTransactions > 0 ? (
                    <>
                      <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                        <div>
                          <p className="font-medium text-sm text-success">Product Registered</p>
                          <p className="text-xs text-muted-foreground">Latest: {products[0]?.farmer || 'Farmer'}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-success text-success-foreground">Confirmed</Badge>
                          <p className="text-xs text-muted-foreground mt-1">Block #{blockchainStats.networkInfo.blockNumber}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-trust/10 border border-trust/20 rounded-lg">
                        <div>
                          <p className="font-medium text-sm text-trust">Supply Chain Update</p>
                          <p className="text-xs text-muted-foreground">Transport & Quality Verification</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-trust text-trust-foreground">Processing</Badge>
                          <p className="text-xs text-muted-foreground mt-1">Gas: 45,231</p>
                        </div>
                      </div>
                      
                      <div className="text-center pt-4">
                        <p className="text-sm text-muted-foreground">
                          All transactions are cryptographically secured and immutable on blockchain
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No transactions yet. Add products to see blockchain activity.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Package className="w-6 h-6 text-success" />
                  </div>
                  <div className="text-3xl font-bold text-success mb-2">{blockchainStats.totalProducts}</div>
                  <div className="text-sm text-muted-foreground">Products Tracked</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-trust/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-trust" />
                  </div>
                  <div className="text-3xl font-bold text-trust mb-2">₹{Math.round(blockchainStats.totalValue / 1000)}K</div>
                  <div className="text-sm text-muted-foreground">Total Value Transacted</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-warning" />
                  </div>
                  <div className="text-3xl font-bold text-warning mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Supply Chain Accuracy</div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Blockchain Network Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network:</span>
                      <span className="font-medium">{blockchainStats.networkInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Block:</span>
                      <span className="font-medium">#{blockchainStats.networkInfo.blockNumber.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gas Price:</span>
                      <span className="font-medium">{blockchainStats.networkInfo.gasPrice}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Transactions:</span>
                      <span className="font-medium">{blockchainStats.totalTransactions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Block Time:</span>
                      <span className="font-medium">{blockchainStats.networkInfo.avgBlockTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network Status:</span>
                      <Badge className="bg-success text-success-foreground">
                        <div className="w-2 h-2 bg-success-foreground rounded-full mr-2"></div>
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Transaction Modal */}
        <TransactionModal
          isOpen={transactionModal.isOpen}
          onClose={() => setTransactionModal({ ...transactionModal, isOpen: false })}
          productId={transactionModal.productId}
          productName={transactionModal.productName}
          action={transactionModal.action}
          onSubmit={handleTransactionSubmit}
          isLoading={isProcessing}
        />

        {/* Verification Modal */}
        <VerificationModal
          isOpen={verificationModal.isOpen}
          onClose={() => setVerificationModal({ ...verificationModal, isOpen: false })}
          productId={verificationModal.productId}
          productName={verificationModal.productName}
          verificationData={verificationModal.data}
        />
      </main>
    </div>
  );
};

export default Index;
