import { useState } from "react";
import { format, isValid } from "date-fns";
import {  Dialog,  DialogContent,  DialogHeader,  DialogTitle,  DialogFooter,  DialogClose,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/lib/api";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {  Form, FormControl,  FormField,  FormItem,  FormLabel,  FormMessage,} from "@/components/ui/form";
import { X, CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {  Command,  CommandEmpty,  CommandGroup,  CommandInput,  CommandItem,  CommandList,} from "@/components/ui/command";
import { cn } from "@/lib/utils";


const dateRangeSchemaBase = z.object({
  _id: z.string().optional(),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.union([z.date(), z.literal("Present")]).optional(),
  isPresent: z.boolean().optional(),
});


const refinedDateRangeSchema = dateRangeSchemaBase.refine(data => {
  if (!data.isPresent) {
    return data.endDate instanceof Date;
  }
  return true;
}, {
  message: "End date is required",
  path: ["endDate"],
});


const experienceSchema = dateRangeSchemaBase.extend({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  description: z.string().optional(),
}).refine(data => {
  if (!data.isPresent) {
    return data.endDate instanceof Date;
  }
  return true;
}, {
  message: "End date is required",
  path: ["endDate"],
});

const educationSchema = dateRangeSchemaBase.extend({
  school: z.string().min(1, "School is required"),
  degree: z.string().min(1, "Degree is required"),
}).refine(data => {
  if (!data.isPresent) {
    return data.endDate instanceof Date;
  }
  return true;
}, {
  message: "End date is required",
  path: ["endDate"],
});

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
  skills: z.array(z.object({ value: z.string() })).optional(),
  experience: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
});


// --- Component ---
interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: User;
  onSave: (data: Partial<User>) => void;
}

const commonDegrees = [ "Associate of Arts (A.A.)", "Associate of Science (A.S.)", "Bachelor of Arts (B.A.)", "Bachelor of Science (B.S.)", "Bachelor of Fine Arts (B.F.A.)", "Bachelor of Business Administration (B.B.A.)", "Master of Arts (M.A.)", "Master of Science (M.S.)", "Master of Business Administration (M.B.A.)", "Juris Doctor (J.D.)", "Doctor of Medicine (M.D.)", "Doctor of Philosophy (Ph.D.)"];

const EditProfileDialog = ({ open, onOpenChange, profile, onSave }: EditProfileDialogProps) => {
  const parseDate = (date: string | Date | undefined) => {
    if (!date) return undefined;
    if (date === "Present") return "Present";
    const parsed = new Date(date);
    return isValid(parsed) ? parsed : undefined;
  };

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      title: profile.title || "",
      location: profile.location || "",
      about: profile.about || "",
      skills: profile.skills?.map((s) => ({ value: s })) || [],
      experience: profile.experience?.map(exp => ({ ...exp, startDate: parseDate(exp.startDate) as Date, endDate: parseDate(exp.endDate), isPresent: exp.endDate === 'Present' })) || [],
      education: profile.education?.map(edu => ({ ...edu, startDate: parseDate(edu.startDate) as Date, endDate: parseDate(edu.endDate), isPresent: edu.endDate === 'Present' })) || [],
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control: form.control, name: "experience" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control: form.control, name: "education" });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control: form.control, name: "skills" });
  const [newSkill, setNewSkill] = useState("");

  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    const updatedProfile = {
      ...data,
      skills: data.skills?.map((s) => s.value),
      experience: data.experience?.map(exp => ({ ...exp, endDate: exp.isPresent ? 'Present' : exp.endDate })),
      education: data.education?.map(edu => ({ ...edu, endDate: edu.isPresent ? 'Present' : edu.endDate })),
    };
    onSave(updatedProfile as Partial<User>);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
            <div className="space-y-4">
              <FormField name="name" control={form.control} render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="title" control={form.control} render={({ field }) => (<FormItem><FormLabel>Title / Headline</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="location" control={form.control} render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="about" control={form.control} render={({ field }) => (<FormItem><FormLabel>About</FormLabel><FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <h3 className="text-lg font-semibold border-b pb-2">Skills</h3>
            <div>
               <div className="flex gap-2 mt-2">
                <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a new skill" />
                <Button type="button" onClick={() => { if (newSkill.trim()) { appendSkill({ value: newSkill.trim() }); setNewSkill(""); } }}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {skillFields.map((field, index) => (
                  <Badge key={field.id} className="flex items-center gap-2 min-w-[100px] justify-between">
                    <span>{field.value}</span>
                    <button type="button" onClick={() => removeSkill(index)}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold border-b pb-2">Experience</h3>
            <div className="space-y-4">
              {expFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md space-y-4 relative">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeExp(index)}><X className="h-4 w-4" /></Button>
                  <FormField name={`experience.${index}.title`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField name={`experience.${index}.company`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <div className="grid grid-cols-2 gap-4 items-start">
                    <FormField control={form.control} name={`experience.${index}.startDate`} render={({ field }) => (
                      <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl>
                          <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value && isValid(field.value) ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1960} toYear={new Date().getFullYear()} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Controller control={form.control} name={`experience.${index}.isPresent`} render={({ field: isPresentField }) => (
                      <FormField control={form.control} name={`experience.${index}.endDate`} render={({ field: endDateField }) => (
                        <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel>
                          <Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !endDateField.value && "text-muted-foreground")} disabled={!!isPresentField.value}>
                              {isPresentField.value ? "Present" : (endDateField.value instanceof Date && isValid(endDateField.value)) ? format(endDateField.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl></PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={endDateField.value instanceof Date ? endDateField.value : undefined} onSelect={endDateField.onChange} captionLayout="dropdown-buttons" fromYear={1960} toYear={new Date().getFullYear()} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover>
                          <FormMessage />
                        </FormItem>
                      )} />
                    )} />
                  </div>
                  <FormField control={form.control} name={`experience.${index}.isPresent`} render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <div className="space-y-1 leading-none"><FormLabel>I am currently working in this role</FormLabel></div>
                    </FormItem>
                  )} />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendExp({ title: "", company: "", startDate: new Date(), endDate: undefined, isPresent: false, description: "" })}>Add Experience</Button>
            </div>
            
            <h3 className="text-lg font-semibold border-b pb-2">Education</h3>
            <div className="space-y-4">
              {eduFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md space-y-4 relative">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeEdu(index)}><X className="h-4 w-4" /></Button>
                  <FormField name={`education.${index}.school`} control={form.control} render={({ field }) => (<FormItem><FormLabel>School</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Degree</FormLabel>
                      <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                          {field.value ? commonDegrees.find(degree => degree === field.value) ?? field.value : "Select or type a degree"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl></PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0"><Command>
                        <CommandInput placeholder="Search degrees..." onValueChange={field.onChange} />
                        <CommandList><CommandEmpty>No degree found. Type to add.</CommandEmpty>
                        <CommandGroup>{commonDegrees.map(degree => (<CommandItem value={degree} key={degree} onSelect={() => {form.setValue(`education.${index}.degree`, degree)}}><Check className={cn("mr-2 h-4 w-4", degree === field.value ? "opacity-100" : "opacity-0")} />{degree}</CommandItem>))}</CommandGroup>
                        </CommandList></Command></PopoverContent></Popover>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4 items-start">
                    <FormField control={form.control} name={`education.${index}.startDate`} render={({ field }) => (
                      <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl>
                          <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value && isValid(field.value) ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1960} toYear={new Date().getFullYear()} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Controller control={form.control} name={`education.${index}.isPresent`} render={({ field: isPresentField }) => (
                      <FormField control={form.control} name={`education.${index}.endDate`} render={({ field: endDateField }) => (
                        <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel>
                          <Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !endDateField.value && "text-muted-foreground")} disabled={!!isPresentField.value}>
                              {isPresentField.value ? "Present" : (endDateField.value instanceof Date && isValid(endDateField.value)) ? format(endDateField.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl></PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={endDateField.value instanceof Date ? endDateField.value : undefined} onSelect={endDateField.onChange} captionLayout="dropdown-buttons" fromYear={1960} toYear={new Date().getFullYear()} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover>
                          <FormMessage />
                        </FormItem>
                      )} />
                    )} />
                  </div>
                  <FormField control={form.control} name={`education.${index}.isPresent`} render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <div className="space-y-1 leading-none"><FormLabel>I am currently studying here</FormLabel></div>
                    </FormItem>
                  )} />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendEdu({ school: "", degree: "", startDate: new Date(), endDate: undefined, isPresent: false })}>Add Education</Button>
            </div>

            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;