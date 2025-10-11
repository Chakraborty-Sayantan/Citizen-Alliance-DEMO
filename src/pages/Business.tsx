import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Building2, Users, TrendingUp, Target, BarChart3, Shield } from "lucide-react";

const Business = () => {
  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">LinkLedge for Business</h1>
          <p className="text-xl text-muted-foreground">
            Grow your brand, reach professionals, and achieve your business goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Company Pages</h3>
            <p className="text-muted-foreground">
              Build your brand presence and connect with professionals interested in your company
            </p>
          </Card>

          <Card className="p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Talent Solutions</h3>
            <p className="text-muted-foreground">
              Find, attract, and recruit the perfect candidates for your team
            </p>
          </Card>

          <Card className="p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Marketing Solutions</h3>
            <p className="text-muted-foreground">
              Reach your target audience with sponsored content and advertising
            </p>
          </Card>

          <Card className="p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sales Solutions</h3>
            <p className="text-muted-foreground">
              Build relationships and close deals with decision makers
            </p>
          </Card>

          <Card className="p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-muted-foreground">
              Track performance and gain insights into your business presence
            </p>
          </Card>

          <Card className="p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Learning Solutions</h3>
            <p className="text-muted-foreground">
              Upskill your team with professional development courses
            </p>
          </Card>
        </div>

        <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to grow your business?</h2>
            <p className="text-muted-foreground mb-6">
              Join millions of businesses already using LinkLedge to reach professionals and grow their brand
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">Get Started</Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Business;
