import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { searchJobs, Job } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, ExternalLink, Search as SearchIcon } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

const Jobs = () => {
    const [query, setQuery] = useState("Software Engineer");
    const [location, setLocation] = useState("India");
    const [experience, setExperience] = useState("");
    const [employmentType, setEmploymentType] = useState("FULLTIME");
    const [datePosted, setDatePosted] = useState("all");

    // Construct the final search query including the experience level
    const finalQuery = `${query} ${experience}`.trim();

    const { data: jobs, isLoading, error, refetch } = useQuery<Job[]>({
        queryKey: ['jobs', finalQuery, location, employmentType, datePosted],
        queryFn: () => searchJobs({ 
            query: finalQuery, 
            location, 
            employment_type: employmentType,
            date_posted: datePosted 
        }),
        enabled: false,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        refetch();
    };
    
    useState(() => {
        refetch();
    });

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-6 py-6">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold">Find Your Next Opportunity</h1>
                    <p className="text-muted-foreground mt-2">
                        Explore thousands of job openings across India.
                    </p>
                </header>

                <Card className="mb-8">
                    <CardContent className="p-6">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="md:col-span-2">
                                <label htmlFor="query" className="block text-sm font-medium mb-1">Job title or keyword</label>
                                <Input
                                    id="query"
                                    placeholder="e.g., 'React Developer'"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
                                <Input
                                    id="location"
                                    placeholder="e.g., 'Mumbai'"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                            <div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    <SearchIcon className="mr-2 h-4 w-4" />
                                    {isLoading ? "Searching..." : "Find Jobs"}
                                </Button>
                            </div>
                        </form>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium">Job Type</label>
                                <Select value={employmentType} onValueChange={setEmploymentType}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select job type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FULLTIME">Full-time</SelectItem>
                                        <SelectItem value="PARTTIME">Part-time</SelectItem>
                                        <SelectItem value="CONTRACTOR">Contract</SelectItem>
                                        <SelectItem value="INTERN">Internship</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div>
                                <label className="text-sm font-medium">Date Posted</label>
                                <Select value={datePosted} onValueChange={setDatePosted}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Any time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Any time</SelectItem>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="3days">Last 3 days</SelectItem>
                                        <SelectItem value="week">Last 7 days</SelectItem>
                                        <SelectItem value="month">Last 30 days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div>
                                <label htmlFor="experience" className="block text-sm font-medium">Experience Level</label>
                                <Input
                                    id="experience"
                                    placeholder="e.g., 'Senior' or 'Entry-level'"
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                 {/* Job listings section remains the same as before */}
                 <div>
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i}>
                                    <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
                                    <CardContent className="space-y-4">
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-1/3" />
                                        <Skeleton className="h-10 w-full" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : error ? (
                        <Card className="text-center p-8">
                            <p className="text-destructive">Failed to load jobs. Please try again later.</p>
                        </Card>
                    ) : jobs && jobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job) => (
                                <Card key={job.job_id} className="flex flex-col">
                                    <CardHeader>
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={job.employer_logo || '/placeholder.svg'}
                                                alt={`${job.employer_name} logo`}
                                                className="w-12 h-12 rounded-lg border object-contain"
                                            />
                                            <div>
                                                <CardTitle className="text-lg">{job.job_title}</CardTitle>
                                                <CardDescription className="font-semibold text-primary">{job.employer_name}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow space-y-3">
                                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>{job.job_city}, {job.job_state}, {job.job_country}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                                            <Briefcase className="h-4 w-4" />
                                            <Badge variant="secondary">{job.job_employment_type?.replace("_", " ").toLowerCase()}</Badge>
                                        </div>
                                         <p className="text-sm text-muted-foreground line-clamp-3">
                                            {job.job_description}
                                        </p>
                                        <p className="text-xs text-muted-foreground pt-2">
                                            Posted {formatDistanceToNow(new Date(job.job_posted_at_datetime_utc))} ago
                                        </p>
                                    </CardContent>
                                    <div className="p-6 pt-0">
                                        <a href={job.job_apply_link} target="_blank" rel="noopener noreferrer" className="w-full">
                                            <Button className="w-full">
                                                Apply Now
                                                <ExternalLink className="ml-2 h-4 w-4" />
                                            </Button>
                                        </a>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center p-8">
                             <h3 className="text-xl font-semibold">No Jobs Found</h3>
                             <p className="text-muted-foreground mt-2">Try adjusting your search filters to find what you're looking for.</p>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Jobs;