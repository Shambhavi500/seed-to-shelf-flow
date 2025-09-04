import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Package, TrendingUp, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface StakeholderDashboardProps {
  role: string;
  onProductAdd?: (product: any) => void;
  onProductUpdate?: (productId: string, updates: any) => void;
}

const StakeholderDashboard = ({ role, onProductAdd, onProductUpdate }: StakeholderDashboardProps) => {
  const { toast } = useToast();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    basePrice: "",
    quality: "",
    location: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const product = {
      id: `AGRI-${Date.now()}`,
      name: formData.name,
      quantity: parseInt(formData.quantity),
      basePrice: parseFloat(formData.basePrice),
      currentPrice: parseFloat(formData.basePrice),
      harvestDate: new Date().toLocaleDateString(),
      quality: formData.quality as "A" | "B" | "C",
      status: "Available for Distribution",
      farmer: "Current User",
      location: formData.location
    };

    onProductAdd?.(product);
    setIsAddingProduct(false);
    setFormData({ name: "", quantity: "", basePrice: "", quality: "", location: "" });
    
    toast({
      title: "Product Added to Blockchain",
      description: `${product.name} has been registered successfully!`,
      variant: "default",
    });
  };

  const getStats = () => {
    switch (role) {
      case "farmer":
        return [
          { label: "Products Registered", value: "12", icon: Package, color: "text-success" },
          { label: "Total Revenue", value: "₹24,500", icon: TrendingUp, color: "text-primary" },
          { label: "Avg. Quality Grade", value: "A", icon: AlertCircle, color: "text-warning" }
        ];
      case "distributor":
        return [
          { label: "Products in Transit", value: "8", icon: Package, color: "text-trust" },
          { label: "Transport Cost", value: "₹1,200", icon: TrendingUp, color: "text-primary" },
          { label: "Delivery Rate", value: "98%", icon: AlertCircle, color: "text-success" }
        ];
      case "retailer":
        return [
          { label: "Products in Store", value: "15", icon: Package, color: "text-warning" },
          { label: "Sales Today", value: "₹8,900", icon: TrendingUp, color: "text-success" },
          { label: "Customer Rating", value: "4.8", icon: AlertCircle, color: "text-primary" }
        ];
      default:
        return [];
    }
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-muted/50`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Role-specific Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {role === "farmer" && "Farm Management"}
              {role === "distributor" && "Distribution Center"}
              {role === "retailer" && "Store Management"}
              {role === "consumer" && "Product Verification"}
            </span>
            {role === "farmer" && (
              <Button
                onClick={() => setIsAddingProduct(!isAddingProduct)}
                size="sm"
                className="gradient-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {role === "farmer" && isAddingProduct && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Crop Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Wheat, Rice, Corn"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="100"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="basePrice">Base Price (₹/kg)</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, basePrice: e.target.value }))}
                    placeholder="20.00"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="quality">Quality Grade</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, quality: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Grade A - Premium</SelectItem>
                      <SelectItem value="B">Grade B - Standard</SelectItem>
                      <SelectItem value="C">Grade C - Basic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Farm Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Punjab, Haryana"
                  required
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="gradient-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Register on Blockchain
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsAddingProduct(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
          
          {role === "consumer" && (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 gradient-trust rounded-full mx-auto flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-trust-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Verify Product Authenticity</h3>
                <p className="text-muted-foreground">
                  Click on any product to see its complete supply chain history
                </p>
              </div>
              <Badge className="bg-trust/10 text-trust border-trust/20">
                Blockchain Verified
              </Badge>
            </div>
          )}
          
          {(role === "distributor" || role === "retailer") && (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 gradient-primary rounded-full mx-auto flex items-center justify-center">
                <Package className="w-10 h-10 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {role === "distributor" ? "Transport Products" : "Manage Inventory"}
                </h3>
                <p className="text-muted-foreground">
                  {role === "distributor" 
                    ? "Update product status and add handling costs"
                    : "Add retail margins and manage store inventory"
                  }
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StakeholderDashboard;