import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Network = () => {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState([
    { name: "Alice Williams", title: "Marketing Manager at BrandCo", mutualConnections: 12 },
    { name: "Bob Smith", title: "Data Scientist at Analytics Inc", mutualConnections: 8 }
  ]);

  const [suggestions, setSuggestions] = useState([
    { name: "Carol Davis", title: "HR Director at PeopleCorp", mutualConnections: 15 },
    { name: "David Lee", title: "Sales Executive at SalesForce", mutualConnections: 6 },
    { name: "Emma Wilson", title: "Content Creator", mutualConnections: 22 },
    { name: "Frank Brown", title: "Financial Analyst at MoneyBank", mutualConnections: 9 },
    { name: "Grace Taylor", title: "Operations Manager", mutualConnections: 11 },
    { name: "Henry Martinez", title: "Business Consultant", mutualConnections: 18 }
  ]);

  const handleAccept = (name: string) => {
    setInvitations(invitations.filter(inv => inv.name !== name));
    toast({
      title: "Connection accepted",
      description: `You are now connected with ${name}`,
    });
  };

  const handleIgnore = (name: string) => {
    setInvitations(invitations.filter(inv => inv.name !== name));
    toast({
      description: "Invitation ignored",
    });
  };

  const handleConnect = (name: string) => {
    setSuggestions(suggestions.filter(sug => sug.name !== name));
    toast({
      title: "Invitation sent",
      description: `Connection request sent to ${name}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Manage my network</h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Connections</span>
                  <span className="ml-auto text-sm">500+</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span className="text-sm">Invitations</span>
                  <span className="ml-auto text-sm">{invitations.length}</span>
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-9 space-y-6">
            {invitations.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Invitations ({invitations.length})</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {invitations.map((person, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="text-lg">
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold">{person.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{person.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {person.mutualConnections} mutual connections
                          </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={() => handleAccept(person.name)}
                      >
                        Accept
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleIgnore(person.name)}
                      >
                        Ignore
                      </Button>
                    </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold mb-4">People you may know</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map((person, index) => (
                  <Card key={index} className="p-4">
                    <div className="text-center">
                      <Avatar className="h-20 w-20 mx-auto mb-3">
                        <AvatarFallback className="text-xl">
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h4 className="font-semibold mb-1">{person.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2 min-h-[2.5rem]">
                        {person.title}
                      </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {person.mutualConnections} mutual connections
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleConnect(person.name)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Network;
