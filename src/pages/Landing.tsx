import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Briefcase, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AuthForm from "@/components/AuthForm";
import { Skeleton } from "@/components/ui/skeleton";

const Landing = () => {
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost">Join now</Button>
                </DialogTrigger>
                <DialogContent>
                  <AuthForm />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Sign in</Button>
                </DialogTrigger>
                <DialogContent>
                  <AuthForm />
                </DialogContent>
              </Dialog>
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
              Connect with people who can help. Find the right job or
              internship. Learn the skills you need to succeed.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg px-8">
                  Join now
                </Button>
              </DialogTrigger>
              <DialogContent>
                <AuthForm />
              </DialogContent>
            </Dialog>
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
          <h3 className="text-3xl font-bold mb-8 text-center">
            Find the right job or internship
          </h3>
          <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-md p-8">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Job title or keyword"
                className="flex-1"
                disabled
              />
              <Input placeholder="Location" className="flex-1" disabled />
              <Button className="md:w-auto" disabled>
                Search
              </Button>
            </div>
            <div className="text-center mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm text-muted-foreground"
                  >
                    Sign in to see all available opportunities
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <AuthForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Content Teaser */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold mb-8 text-center">
            See what's happening in your network
          </h3>
          <div className="max-w-2xl mx-auto space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-8">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Sign in to see more</Button>
              </DialogTrigger>
              <DialogContent>
                <AuthForm />
              </DialogContent>
            </Dialog>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center flex-wrap gap-x-6 gap-y-4 mb-8 text-sm text-muted-foreground">
            <div>
              <a href="#" className="font-semibold hover:text-primary">About</a>
              <p className="text-xs mt-1">Learn about our mission.</p>
            </div>
            <div>
              <a href="#" className="font-semibold hover:text-primary">Careers</a>
              <p className="text-xs mt-1">Join our growing team.</p>
            </div>
            <div>
              <a href="#" className="font-semibold hover:text-primary">Accessibility</a>
              <p className="text-xs mt-1">Our commitment to inclusion.</p>
            </div>
            <div>
              <a href="#" className="font-semibold hover:text-primary">Terms</a>
              <p className="text-xs mt-1">Read our terms of service.</p>
            </div>
            <div>
              <a href="#" className="font-semibold hover:text-primary">Privacy</a>
              <p className="text-xs mt-1">How we handle your data.</p>
            </div>
            <div>
              <a href="#" className="font-semibold hover:text-primary">Ads Info</a>
              <p className="text-xs mt-1">Learn about our advertising.</p>
            </div>
            <div>
              <a href="#" className="font-semibold hover:text-primary">Language</a>
              <p className="text-xs mt-1">Choose your language.</p>
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