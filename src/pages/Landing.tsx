import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Briefcase, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleJoin = () => {
    login();
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-primary">LinkLedge</h1>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search" 
                  className="w-64 pl-10 bg-secondary/50"
                  disabled
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleJoin}>Join now</Button>
              <Button onClick={handleJoin}>Sign in</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-5xl font-bold mb-6 text-foreground">
              Welcome to your professional community
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with people who can help. Find the right job or internship. 
              Learn the skills you need to succeed.
            </p>
            <Button size="lg" onClick={handleJoin} className="text-lg px-8">
              Join now
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Build your network</h3>
              <p className="text-muted-foreground">
                Connect with people and opportunities that matter to you
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get hired</h3>
              <p className="text-muted-foreground">
                Discover jobs and internships at companies you want to work for
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn skills</h3>
              <p className="text-muted-foreground">
                Access courses and resources to advance your career
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Search Teaser */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold mb-8 text-center">Find the right job or internship</h3>
          <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-md p-8">
            <div className="flex flex-col md:flex-row gap-4">
              <Input placeholder="Job title or keyword" className="flex-1" />
              <Input placeholder="Location" className="flex-1" />
              <Button className="md:w-auto">Search</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Sign in to see all available opportunities
            </p>
          </div>
        </div>
      </section>

      {/* Content Teaser */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold mb-8 text-center">See what's happening in your network</h3>
          <div className="max-w-2xl mx-auto space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg p-6 shadow-sm blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-muted"></div>
                  <div>
                    <div className="h-4 w-32 bg-muted rounded mb-2"></div>
                    <div className="h-3 w-24 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-8">
            <Button variant="outline" onClick={handleJoin}>
              Sign in to see more
            </Button>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About LinkLedge</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Accessibility</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Terms</a></li>
                <li><a href="#" className="hover:text-primary">Privacy</a></li>
                <li><a href="#" className="hover:text-primary">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Community Guidelines</a></li>
                <li><a href="#" className="hover:text-primary">Ads Info</a></li>
                <li><a href="#" className="hover:text-primary">Language</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 LinkLedge Corporation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
