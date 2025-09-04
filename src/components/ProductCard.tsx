import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wheat, MapPin, Calendar, DollarSign, Star, Truck, Store, User } from "lucide-react";

interface ProductCardProps {
  product: {
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
  };
  userRole: string;
  onAction?: (productId: string, action: string) => void;
}

const ProductCard = ({ product, userRole, onAction }: ProductCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available for distribution": return "bg-success text-success-foreground";
      case "in transit": return "bg-trust text-trust-foreground";
      case "available for consumers": return "bg-warning text-warning-foreground";
      case "delivered": return "bg-muted text-muted-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getQualityStars = (quality: string) => {
    const count = quality === "A" ? 3 : quality === "B" ? 2 : 1;
    return Array.from({ length: count }, (_, i) => (
      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
    ));
  };

  const getActionButton = () => {
    if (userRole === "farmer" && product.status === "Available for Distribution") {
      return (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onAction?.(product.id, "view")}
          className="w-full"
        >
          View Details
        </Button>
      );
    }
    if (userRole === "distributor" && product.status === "Available for Distribution") {
      return (
        <Button 
          variant="default" 
          size="sm"
          onClick={() => onAction?.(product.id, "transport")}
          className="w-full"
        >
          <Truck className="w-4 h-4 mr-2" />
          Transport
        </Button>
      );
    }
    if (userRole === "retailer" && product.status === "In Transit") {
      return (
        <Button 
          variant="default" 
          size="sm"
          onClick={() => onAction?.(product.id, "retail")}
          className="w-full"
        >
          <Store className="w-4 h-4 mr-2" />
          Add to Store
        </Button>
      );
    }
    if (userRole === "consumer") {
      return (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onAction?.(product.id, "verify")}
          className="w-full"
        >
          <User className="w-4 h-4 mr-2" />
          Verify Chain
        </Button>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-card hover:shadow-soft transition-smooth animate-float">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Wheat className="w-5 h-5 text-primary" />
            <span>{product.name}</span>
          </CardTitle>
          <Badge className={getStatusColor(product.status)} variant="secondary">
            {product.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium">₹{product.currentPrice}/kg</p>
              {product.basePrice !== product.currentPrice && (
                <p className="text-xs text-muted-foreground">Base: ₹{product.basePrice}/kg</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{product.quantity} kg</p>
              <p className="text-xs text-muted-foreground">{product.location}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{product.harvestDate}</p>
              <p className="text-xs text-muted-foreground">Harvest Date</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {getQualityStars(product.quality)}
            </div>
            <div>
              <p className="font-medium">Grade {product.quality}</p>
              <p className="text-xs text-muted-foreground">Quality</p>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground space-y-1">
            <p><span className="font-medium">Farmer:</span> {product.farmer}</p>
            {product.distributor && (
              <p><span className="font-medium">Distributor:</span> {product.distributor}</p>
            )}
            {product.retailer && (
              <p><span className="font-medium">Retailer:</span> {product.retailer}</p>
            )}
          </div>
        </div>
        
        {getActionButton()}
      </CardContent>
    </Card>
  );
};

export default ProductCard;