// Blockchain simulation for demo purposes
export interface BlockchainTransaction {
  id: string;
  productId: string;
  actor: string;
  action: string;
  timestamp: number;
  gasUsed: number;
  transactionHash: string;
  blockNumber: number;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  basePrice: number;
  currentPrice: number;
  harvestDate: string;
  quality: "A" | "B" | "C";
  status: string;
  farmer: string;
  distributor?: string;
  retailer?: string;
  location: string;
  blockchainHash: string;
}

// Simulate blockchain storage
class BlockchainSimulator {
  private products: Map<string, Product> = new Map();
  private transactions: BlockchainTransaction[] = [];
  private currentBlock = 1000000;

  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleProducts: Product[] = [
      {
        id: "AGRI-001",
        name: "Premium Wheat",
        quantity: 500,
        basePrice: 25,
        currentPrice: 32,
        harvestDate: "2024-08-15",
        quality: "A",
        status: "Available for Consumers",
        farmer: "Rajesh Singh (0x742d...a9c3)",
        distributor: "AgriTrans Ltd (0x89ab...def1)",
        retailer: "FreshMart Store (0x123f...567a)",
        location: "Punjab, India",
        blockchainHash: "0x" + Math.random().toString(16).substr(2, 64)
      },
      {
        id: "AGRI-002",
        name: "Organic Rice",
        quantity: 300,
        basePrice: 40,
        currentPrice: 45,
        harvestDate: "2024-08-20",
        quality: "A",
        status: "In Transit",
        farmer: "Priya Sharma (0x456b...789c)",
        distributor: "GreenLogistics (0xabc1...def4)",
        location: "Haryana, India",
        blockchainHash: "0x" + Math.random().toString(16).substr(2, 64)
      },
      {
        id: "AGRI-003",
        name: "Fresh Corn",
        quantity: 200,
        basePrice: 18,
        currentPrice: 18,
        harvestDate: "2024-08-25",
        quality: "B",
        status: "Available for Distribution",
        farmer: "Kumar Patel (0x789c...123d)",
        location: "Gujarat, India",
        blockchainHash: "0x" + Math.random().toString(16).substr(2, 64)
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
      this.addTransaction(product.id, product.farmer, "Product Registered", product.basePrice);
    });
  }

  private generateHash(): string {
    return "0x" + Math.random().toString(16).substr(2, 64);
  }

  private addTransaction(productId: string, actor: string, action: string, newPrice?: number): string {
    const transaction: BlockchainTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId,
      actor,
      action,
      timestamp: Date.now(),
      gasUsed: Math.floor(Math.random() * 50000) + 21000,
      transactionHash: this.generateHash(),
      blockNumber: this.currentBlock++
    };

    this.transactions.push(transaction);
    return transaction.transactionHash;
  }

  // Smart contract methods simulation
  async registerProduct(productData: Omit<Product, 'id' | 'blockchainHash' | 'currentPrice' | 'status'>): Promise<{ success: boolean; productId: string; transactionHash: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const productId = `AGRI-${Date.now()}`;
    const product: Product = {
      ...productData,
      id: productId,
      currentPrice: productData.basePrice,
      status: "Available for Distribution",
      blockchainHash: this.generateHash()
    };

    this.products.set(productId, product);
    const txHash = this.addTransaction(productId, productData.farmer, "Product Registered", productData.basePrice);

    return {
      success: true,
      productId,
      transactionHash: txHash
    };
  }

  async updateAsDistributor(productId: string, distributor: string, handlingCost: number, transportDetails: string): Promise<{ success: boolean; transactionHash: string }> {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const product = this.products.get(productId);
    if (!product || product.status !== "Available for Distribution") {
      return { success: false, transactionHash: "" };
    }

    product.distributor = distributor;
    product.currentPrice += handlingCost;
    product.status = "In Transit";
    
    const txHash = this.addTransaction(productId, distributor, `Transportation Started - ${transportDetails}`, product.currentPrice);

    return { success: true, transactionHash: txHash };
  }

  async updateAsRetailer(productId: string, retailer: string, retailMargin: number, storeDetails: string): Promise<{ success: boolean; transactionHash: string }> {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const product = this.products.get(productId);
    if (!product || product.status !== "In Transit") {
      return { success: false, transactionHash: "" };
    }

    product.retailer = retailer;
    product.currentPrice += retailMargin;
    product.status = "Available for Consumers";
    
    const txHash = this.addTransaction(productId, retailer, `Added to Store - ${storeDetails}`, product.currentPrice);

    return { success: true, transactionHash: txHash };
  }

  async getProduct(productId: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.products.get(productId) || null;
  }

  async getAllProducts(): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return Array.from(this.products.values());
  }

  async getProductHistory(productId: string): Promise<BlockchainTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return this.transactions.filter(tx => tx.productId === productId);
  }

  async getAllTransactions(): Promise<BlockchainTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...this.transactions].reverse(); // Most recent first
  }

  // Simulate blockchain verification
  async verifyProduct(productId: string): Promise<{ verified: boolean; chainOfCustody: any[] }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const product = this.products.get(productId);
    const history = await this.getProductHistory(productId);
    
    if (!product) {
      return { verified: false, chainOfCustody: [] };
    }

    const chainOfCustody = history.map(tx => ({
      step: tx.action,
      actor: tx.actor,
      timestamp: tx.timestamp,
      transactionHash: tx.transactionHash,
      blockNumber: tx.blockNumber,
      gasUsed: tx.gasUsed
    }));

    return {
      verified: true,
      chainOfCustody
    };
  }
}

// Export singleton instance
export const blockchain = new BlockchainSimulator();

// Utility functions
export const formatAddress = (address: string): string => {
  if (address.includes('(') && address.includes(')')) {
    return address; // Already formatted
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatHash = (hash: string): string => {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
};

export const getNetworkInfo = () => ({
  name: "Ethereum Mainnet (Simulated)",
  chainId: 1,
  blockNumber: 20000000 + Math.floor(Math.random() * 100000),
  gasPrice: "20 Gwei",
  avgBlockTime: "12 seconds"
});