import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bookmark, MapPin, Building, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Jobs = () => {
  const { toast } = useToast();
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  
  const jobs = [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$120k - $160k",
      tags: ["Easy Apply", "Actively hiring"],
      posted: "2 days ago"
    },
    {
      title: "Product Manager",
      company: "InnovateLabs",
      location: "Remote",
      salary: "$130k - $180k",
      tags: ["Promoted"],
      posted: "1 week ago"
    },
    {
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "New York, NY",
      salary: "$110k - $150k",
      tags: ["Easy Apply", "Actively hiring"],
      posted: "3 days ago"
    },
    {
      title: "UX Designer",
      company: "DesignHub",
      location: "Austin, TX",
      salary: "$90k - $120k",
      tags: ["Easy Apply"],
      posted: "5 days ago"
    }
  ];

  const handleSaveJob = (title: string) => {
    if (savedJobs.includes(title)) {
      setSavedJobs(savedJobs.filter(job => job !== title));
      toast({
        description: "Job removed from saved items",
      });
    } else {
      setSavedJobs([...savedJobs, title]);
      toast({
        description: "Job saved",
      });
    }
  };

  const handleApply = (title: string, company: string) => {
    toast({
      title: "Application started",
      description: `Applying to ${title} at ${company}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <Card className="p-4 sticky top-20">
              <h3 className="font-semibold mb-4">Search filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Job type</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      Full-time
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      Part-time
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      Contract
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Experience level</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      Entry level
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      Mid-Senior
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      Director
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-9 space-y-4">
            <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5">
              <h2 className="text-xl font-bold mb-2">Are you hiring?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Post a job to reach millions of professionals
              </p>
              <Button>Post a job</Button>
            </Card>

            <Card className="p-4">
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search jobs" className="pl-10" />
                </div>
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Location" className="pl-10" />
                </div>
                <Button>Search</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Showing {jobs.length} jobs based on your profile
              </p>
            </Card>

            <div className="space-y-3">
              {jobs.map((job, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4 flex-1">
                      <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </span>
                        </div>
                        <div className="flex gap-2 mb-2">
                          {job.tags.map((tag, i) => (
                            <Badge 
                              key={i} 
                              variant={tag === "Promoted" ? "default" : "secondary"}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{job.posted}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleSaveJob(job.title)}
                    >
                      <Bookmark 
                        className={`h-5 w-5 ${savedJobs.includes(job.title) ? 'fill-primary text-primary' : ''}`}
                      />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleApply(job.title, job.company)}
                    >
                      Apply
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleSaveJob(job.title)}
                    >
                      {savedJobs.includes(job.title) ? 'Saved' : 'Save'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
