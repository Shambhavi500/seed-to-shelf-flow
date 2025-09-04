import { Leaf, Shield, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  activeRole: string;
  onRoleChange: (role: string) => void;
}

const Header = ({ activeRole, onRoleChange }: HeaderProps) => {
  const roles = [
    { id: "farmer", label: "Farmer", icon: Leaf, color: "text-success" },
    { id: "distributor", label: "Distributor", icon: Users, color: "text-trust" },
    { id: "retailer", label: "Retailer", icon: Shield, color: "text-warning" },
    { id: "consumer", label: "Consumer", icon: CheckCircle, color: "text-primary" }
  ];

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AgriChain</h1>
              <p className="text-sm text-muted-foreground">Blockchain Supply Transparency</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-muted/50 rounded-lg p-1">
            {roles.map((role) => (
              <Button
                key={role.id}
                variant={activeRole === role.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onRoleChange(role.id)}
                className="flex items-center space-x-2 transition-spring"
              >
                <role.icon className={`w-4 h-4 ${activeRole === role.id ? 'text-primary-foreground' : role.color}`} />
                <span className="hidden sm:inline">{role.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;