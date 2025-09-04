import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Truck, Store, User, ArrowRight, CheckCircle } from "lucide-react";

interface SupplyChainFlowProps {
  productId?: string;
  currentStage: string;
}

const SupplyChainFlow = ({ productId, currentStage }: SupplyChainFlowProps) => {
  const stages = [
    {
      id: "farmer",
      title: "Farmer",
      icon: Leaf,
      description: "Product harvested and registered",
      status: "Available for Distribution",
      color: "text-success",
      bgColor: "bg-success/10",
      completed: true
    },
    {
      id: "distributor", 
      title: "Distributor",
      icon: Truck,
      description: "Product in transit to retailer",
      status: "In Transit",
      color: "text-trust",
      bgColor: "bg-trust/10",
      completed: currentStage !== "Available for Distribution"
    },
    {
      id: "retailer",
      title: "Retailer", 
      icon: Store,
      description: "Product available in store",
      status: "Available for Consumers",
      color: "text-warning",
      bgColor: "bg-warning/10",
      completed: currentStage === "Available for Consumers" || currentStage === "Delivered"
    },
    {
      id: "consumer",
      title: "Consumer",
      icon: User,
      description: "Product verified and delivered",
      status: "Delivered",
      color: "text-primary",
      bgColor: "bg-primary/10",
      completed: currentStage === "Delivered"
    }
  ];

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Supply Chain Flow</span>
          {productId && (
            <Badge variant="outline" className="ml-2">
              ID: {productId}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between space-x-4 overflow-x-auto pb-4">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center space-x-4 min-w-0 flex-1">
              <div className="flex-shrink-0 flex flex-col items-center space-y-3">
                <div 
                  className={`
                    w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500
                    ${stage.completed 
                      ? `${stage.bgColor} border-2 border-current ${stage.color}` 
                      : 'bg-muted border-2 border-border'
                    }
                  `}
                >
                  {stage.completed ? (
                    <CheckCircle className={`w-8 h-8 ${stage.color}`} />
                  ) : (
                    <stage.icon className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                
                <div className="text-center min-w-0">
                  <h3 className={`font-medium text-sm ${stage.completed ? stage.color : 'text-muted-foreground'}`}>
                    {stage.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {stage.description}
                  </p>
                  {currentStage === stage.status && (
                    <Badge 
                      className={`mt-2 ${stage.color} animate-pulse-soft`}
                      variant="outline"
                    >
                      Current
                    </Badge>
                  )}
                </div>
              </div>
              
              {index < stages.length - 1 && (
                <div className="flex-shrink-0 hidden sm:block">
                  <ArrowRight 
                    className={`w-6 h-6 ${
                      stages[index + 1].completed 
                        ? 'text-success' 
                        : 'text-muted-foreground'
                    } transition-colors duration-500`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-medium text-sm text-foreground mb-2">Blockchain Verification</h4>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-soft"></div>
            <span className="text-xs text-muted-foreground">
              All transactions recorded on immutable blockchain ledger
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplyChainFlow;