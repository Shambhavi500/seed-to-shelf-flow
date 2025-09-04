import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, User, Truck, Store, ExternalLink, Copy } from "lucide-react";
import { formatHash, formatAddress } from "@/utils/blockchain";
import { useToast } from "@/hooks/use-toast";

interface VerificationData {
  verified: boolean;
  chainOfCustody: Array<{
    step: string;
    actor: string;
    timestamp: number;
    transactionHash: string;
    blockNumber: number;
    gasUsed: number;
  }>;
}

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  verificationData: VerificationData | null;
}

const VerificationModal = ({ 
  isOpen, 
  onClose, 
  productId, 
  productName, 
  verificationData 
}: VerificationModalProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
      duration: 2000,
    });
  };

  const getStepIcon = (step: string) => {
    if (step.includes("Registered")) return <User className="w-4 h-4" />;
    if (step.includes("Transportation")) return <Truck className="w-4 h-4" />;
    if (step.includes("Store")) return <Store className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStepColor = (step: string) => {
    if (step.includes("Registered")) return "text-success bg-success/10";
    if (step.includes("Transportation")) return "text-trust bg-trust/10";
    if (step.includes("Store")) return "text-warning bg-warning/10";
    return "text-primary bg-primary/10";
  };

  if (!verificationData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-trust/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-trust" />
            </div>
            <div>
              <div>Blockchain Verification</div>
              <div className="text-sm font-normal text-muted-foreground">
                {productName}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Verification Status */}
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-success" />
              <div>
                <h3 className="font-semibold text-success">Product Verified ✓</h3>
                <p className="text-sm text-muted-foreground">
                  This product's supply chain is authenticated on the blockchain
                </p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <span className="text-sm text-muted-foreground">Product ID</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{productId}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => copyToClipboard(productId, "Product ID")}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Verification Time</span>
              <p className="font-medium">{new Date().toLocaleString()}</p>
            </div>
          </div>

          {/* Chain of Custody */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Supply Chain History</h3>
            <div className="space-y-4">
              {verificationData.chainOfCustody.map((item, index) => (
                <div key={index} className="relative">
                  {index < verificationData.chainOfCustody.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-8 bg-border"></div>
                  )}
                  
                  <div className="flex space-x-4 p-4 bg-card border border-border rounded-lg hover:shadow-soft transition-smooth">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStepColor(item.step)}`}>
                      {getStepIcon(item.step)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{item.step}</h4>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(item.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        Actor: {formatAddress(item.actor)}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center space-x-1">
                          <span className="text-muted-foreground">Tx Hash:</span>
                          <code className="bg-muted px-1 rounded">{formatHash(item.transactionHash)}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => copyToClipboard(item.transactionHash, "Transaction Hash")}
                          >
                            <Copy className="w-2 h-2" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <span className="text-muted-foreground">Block:</span>
                          <code className="bg-muted px-1 rounded">#{item.blockNumber}</code>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <span className="text-muted-foreground">Gas:</span>
                          <code className="bg-muted px-1 rounded">{item.gasUsed.toLocaleString()}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blockchain Info */}
          <div className="p-4 bg-trust/5 border border-trust/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Verified on Ethereum Blockchain</h4>
                <p className="text-sm text-muted-foreground">
                  Immutable record stored on decentralized network
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: "Opening Etherscan",
                    description: "View transactions on blockchain explorer",
                    duration: 2000,
                  });
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Explorer
              </Button>
            </div>
          </div>

          <Button onClick={onClose} className="w-full">
            Close Verification
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationModal;