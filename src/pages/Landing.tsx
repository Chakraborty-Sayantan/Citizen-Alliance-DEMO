import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Briefcase, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AuthForm from "@/components/AuthForm";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-card sticky top-0 z-50"
      >
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
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost">Join now</Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent>
                  <AuthForm />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button>Sign in</Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent>
                  <AuthForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h2 className="text-5xl font-bold mb-6 text-foreground">
              Welcome to your professional community
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with people who can help. Find the right job or internship. Learn the skills you need to succeed.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="text-lg px-8">
                    Join now
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent>
                <AuthForm />
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Build your network", delay: 0.1, text: "Connect with people and opportunities that matter to you" },
              { icon: Briefcase, title: "Get hired", delay: 0.2, text: "Discover jobs and internships at companies you want to work for" },
              { icon: BookOpen, title: "Learn skills", delay: 0.3, text: "Access courses and resources to advance your career" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: feature.delay }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Search Teaser */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-center"
          >
            Find the right job or internship
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto bg-card rounded-lg shadow-md p-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <Input placeholder="Job title or keyword" className="flex-1" disabled />
              <Input placeholder="Location" className="flex-1" disabled />
              <Button className="md:w-auto" disabled>Search</Button>
            </div>
            <div className="text-center mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto text-sm text-muted-foreground">
                    Sign in to see all available opportunities
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <AuthForm />
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Teaser */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-center"
          >
            See what's happening in your network
          </motion.h3>
          <div className="max-w-2xl mx-auto space-y-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-lg p-6 shadow-sm"
              >
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
              </motion.div>
            ))}
          </div>
          <p className="text-center mt-8">
            <Dialog>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline">Sign in to see more</Button>
                </motion.div>
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
            {[
              { title: "About", text: "Learn about our mission." },
              { title: "Careers", text: "Join our growing team." },
              { title: "Accessibility", text: "Our commitment to inclusion." },
              { title: "Terms", text: "Read our terms of service." },
              { title: "Privacy", text: "How we handle your data." },
              { title: "Ads Info", text: "Learn about our advertising." },
              { title: "Language", text: "Choose your language." }
            ].map((link, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <a href="#" className="font-semibold hover:text-primary">{link.title}</a>
                <p className="text-xs mt-1">{link.text}</p>
              </motion.div>
            ))}
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