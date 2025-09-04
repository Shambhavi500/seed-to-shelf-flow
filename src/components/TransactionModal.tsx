import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Truck, Store, CheckCircle, ExternalLink } from "lucide-react";
import { formatHash, formatAddress } from "@/utils/blockchain";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  action: "transport" | "retail" | "verify";
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

const TransactionModal = ({ 
  isOpen, 
  onClose, 
  productId, 
  productName, 
  action, 
  onSubmit,
  isLoading = false 
}: TransactionModalProps) => {
  const [formData, setFormData] = useState({
    handlingCost: "",
    transportDetails: "",
    retailMargin: "",
    storeDetails: "",
    actorName: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({
      handlingCost: "",
      transportDetails: "",
      retailMargin: "",
      storeDetails: "",
      actorName: ""
    });
  };

  const getModalContent = () => {
    switch (action) {
      case "transport":
        return {
          title: "Transport Product",
          icon: <Truck className="w-5 h-5" />,
          color: "bg-trust",
          fields: (
            <>
              <div>
                <Label htmlFor="actorName">Distributor Company Name</Label>
                <Input
                  id="actorName"
                  value={formData.actorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, actorName: e.target.value }))}
                  placeholder="e.g., AgriTrans Logistics"
                  required
                />
              </div>
              <div>
                <Label htmlFor="handlingCost">Handling Cost (₹/kg)</Label>
                <Input
                  id="handlingCost"
                  type="number"
                  step="0.01"
                  value={formData.handlingCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, handlingCost: e.target.value }))}
                  placeholder="5.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="transportDetails">Transport Details</Label>
                <Textarea
                  id="transportDetails"
                  value={formData.transportDetails}
                  onChange={(e) => setFormData(prev => ({ ...prev, transportDetails: e.target.value }))}
                  placeholder="Truck ID: MH12AB1234, Driver: Ravi Kumar, Route: Punjab to Delhi"
                  required
                />
              </div>
            </>
          )
        };
      
      case "retail":
        return {
          title: "Add to Store",
          icon: <Store className="w-5 h-5" />,
          color: "bg-warning",
          fields: (
            <>
              <div>
                <Label htmlFor="actorName">Store Name</Label>
                <Input
                  id="actorName"
                  value={formData.actorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, actorName: e.target.value }))}
                  placeholder="e.g., FreshMart Delhi"
                  required
                />
              </div>
              <div>
                <Label htmlFor="retailMargin">Retail Margin (₹/kg)</Label>
                <Input
                  id="retailMargin"
                  type="number"
                  step="0.01"
                  value={formData.retailMargin}
                  onChange={(e) => setFormData(prev => ({ ...prev, retailMargin: e.target.value }))}
                  placeholder="10.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="storeDetails">Store Details</Label>
                <Textarea
                  id="storeDetails"
                  value={formData.storeDetails}
                  onChange={(e) => setFormData(prev => ({ ...prev, storeDetails: e.target.value }))}
                  placeholder="Store Address: Connaught Place, Delhi. Storage: Cold storage, Expiry: 30 days"
                  required
                />
              </div>
            </>
          )
        };
      
      default:
        return {
          title: "Verify Product",
          icon: <CheckCircle className="w-5 h-5" />,
          color: "bg-success",
          fields: null
        };
    }
  };

  const content = getModalContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${content.color} text-white`}>
              {content.icon}
            </div>
            <div>
              <div>{content.title}</div>
              <div className="text-sm font-normal text-muted-foreground">
                {productName}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Product ID:</span>
              <Badge variant="outline">{productId}</Badge>
            </div>
          </div>

          {action === "verify" ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-trust/10 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-trust" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Blockchain Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Click verify to check the complete supply chain history
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {content.fields}
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className={`flex-1 ${content.color} text-white hover:opacity-90`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {content.icon}
                      <span className="ml-2">Execute Transaction</span>
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {action === "verify" && (
            <Button 
              onClick={() => onSubmit({})}
              disabled={isLoading}
              className="w-full bg-trust text-trust-foreground hover:bg-trust/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying on Blockchain...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Verify Supply Chain
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;