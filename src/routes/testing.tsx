import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useAppForm, withFieldGroup } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useFormStepper } from "@/hooks/use-stepper";
import { revalidateLogic, useStore } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback } from "react";
import { toast } from "sonner";
import * as z from "zod";
export const Route = createFileRoute("/testing")({
 component: DraftForm,
 ssr : false,
});

// Step-specific schemas for the stepper hook
const stepSchemas = [
 // Step 1: Personal Details
 z.object({
  name: z.string().min(1, "This field is required"),
  lastName: z.string().min(1, "This field is required"),
  formArray_1758095351255: z.array(
   z.object({
    Checkbox_1758095354066: z.boolean(),
    Checkbox_1758095355944: z.boolean(),
    Input_1758095358624: z.string().min(1, "This field is required"),
    Slider_1758095363568: z
     .number()
     .min(0, "Must be at least 0")
     .max(100, "Must be at most 100"),
   }),
  ),
 }),
 // Step 2: Contact Information
 z.object({
  yourEmail: z.email(),
  phoneNumber: z.number(),
 }),
 // Step 3: Preferences
 z.object({
  preferences: z.array(z.string().min(1, "This field is required")),
  comment: z.string().min(1, "This field is required"),
 }),
];

const Step1Group = withFieldGroup({
 defaultValues: {
  name: "",
  lastName: "",
  formArray_1758095351255: [
   {
    Checkbox_1758095354066: false,
    Checkbox_1758095355944: false,
    Input_1758095358624: "",
    Slider_1758095363568: 0,
   },
  ],
 },
 render: function Step1Render({ group }) {
  return (
   <div>
    <h2 className="text-2xl font-bold">Personal Details</h2>
    <p className="text-base">Please provide your personal </p>
    <group.AppField
     name="name"
    >
     {(field) => (
      <field.FormItem className="w-full">
       <field.FormLabel>First name *</field.FormLabel>
       <field.FormControl>
        <Input
         placeholder="First name"
         type="text"
         value={field.state.value}
         onBlur={field.handleBlur}
         onChange={(e) => field.handleChange(e.target.value)}
        />
       </field.FormControl>
       <field.FormMessage />
      </field.FormItem>
     )}
    </group.AppField>
    <group.AppField
     name="lastName"
    >
     {(field) => (
      <field.FormItem className="w-full">
       <field.FormLabel>Last name</field.FormLabel>
       <field.FormControl>
        <Input
         placeholder="Last name"
         type="text"
         value={field.state.value}
         onBlur={field.handleBlur}
         onChange={(e) => field.handleChange(e.target.value)}
        />
       </field.FormControl>
       <field.FormMessage />
      </field.FormItem>
     )}
    </group.AppField>
    <group.AppField
     name="formArray_1758095351255"
     mode="array"
    >
     {(field) => (
      <div className="w-full space-y-4">
       {field.state.value.map((_, i) => (
        <div key={i} className="space-y-3 p-4 relative">
         <Separator />

         <div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
          <group.AppField
           name={`formArray_1758095351255[${i}].Checkbox_1758095354066`}>
           {(field) => (
            <field.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
             <field.FormControl>
              <Checkbox
               name={`formArray_1758095351255[${i}].Checkbox_1758095354066`}
               checked={field.state.value}
               onBlur={field.handleBlur}
               onCheckedChange={(checked: boolean) => {
                field.handleChange(checked);
               }}
              />
             </field.FormControl>
             <div className="space-y-1 leading-none">
              <field.FormLabel>Checkbox Label</field.FormLabel>

              <field.FormMessage />
             </div>
            </field.FormItem>
           )}
          </group.AppField>
          <group.AppField
           name={`formArray_1758095351255[${i}].Checkbox_1758095355944`}>
           {(field) => (
            <field.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
             <field.FormControl>
              <Checkbox
               name={`formArray_1758095351255[${i}].Checkbox_1758095355944`}
               checked={field.state.value}
               onBlur={field.handleBlur}
               onCheckedChange={(checked: boolean) => {
                field.handleChange(checked);
               }}
              />
             </field.FormControl>
             <div className="space-y-1 leading-none">
              <field.FormLabel>Checkbox Label</field.FormLabel>

              <field.FormMessage />
             </div>
            </field.FormItem>
           )}
          </group.AppField>
         </div>
         <group.AppField
          name={`formArray_1758095351255[${i}].Input_1758095358624`}>
          {(field) => (
           <field.FormItem className="w-full">
            <field.FormLabel>Input Field *</field.FormLabel>
            <field.FormControl>
             <Input
              name={`formArray_1758095351255[${i}].Input_1758095358624`}
              placeholder="Enter your text"
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
             />
            </field.FormControl>

            <field.FormMessage />
           </field.FormItem>
          )}
         </group.AppField>

         <group.AppField
          name={`formArray_1758095351255[${i}].Slider_1758095363568`}>
          {(field) => (
           <field.FormItem>
            <field.FormLabel className="flex justify-between items-center">
             Set Range<span>{field.state.value}/100</span>
            </field.FormLabel>
            <field.FormControl>
             <Slider
              name={`formArray_1758095351255[${i}].Slider_1758095363568`}
              min={0}
              max={100}
              step={5}
              value={[field.state.value]}
              onValueChange={(values) => {
               field.handleChange(values[0]);
              }}
             />
            </field.FormControl>
            <field.FormDescription>
             Adjust the range by sliding.
            </field.FormDescription>
            <field.FormMessage />
           </field.FormItem>
          )}
         </group.AppField>
        </div>
       ))}
       <div className="flex justify-between pt-2">
        <Button
         variant="outline"
         type="button"
         onClick={() =>
          // group.pushFieldValue('formArray_1758095351255', {
          // 	Checkbox_1758095354066: false,
          // 	Checkbox_1758095355944: false,
          // 	Input_1758095358624: "",
          // 		Slider_1758095363568: 0,
          // 	},
          // 	{
          // 		dontValidate : true,
          // 	}
          // )
          field.pushValue({
           Checkbox_1758095354066: false,
           Checkbox_1758095355944: false,
           Input_1758095358624: "",
           Slider_1758095363568: 0,
          }, {
           dontValidate: true,
          })
         }
        >
         <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
        <Button
         variant="outline"
         type="button"
         onClick={() =>
          // group.removeFieldValue('formArray_1758095351255', field.state.value.length - 1, {
          // 	dontValidate : true,
          // })
          field.removeValue(field.state.value.length - 1)
         }
         disabled={field.state.value.length <= 1}
        >
         <Trash2 className="h-4 w-4 mr-2" /> Remove
        </Button>
       </div>
      </div>
     )}
    </group.AppField>
   </div>
  );
 },
});
const Step2Group = withFieldGroup({
 defaultValues: {
  yourEmail: "",
  phoneNumber: 0,
 },
 render: function Step2Render({ group }) {
  return (
   <div>
    <h2 className="text-2xl font-bold">Contact Information</h2>
    <p className="text-base">Please provide your contact information</p>
    <group.AppField
     name="yourEmail"
    >
     {(field) => (
      <field.FormItem className="w-full">
       <field.FormLabel>Your Email *</field.FormLabel>
       <field.FormControl>
        <Input
         placeholder="Enter your email"
         type="email"
         value={field.state.value}
         onBlur={field.handleBlur}
         onChange={(e) => field.handleChange(e.target.value)}
        />
       </field.FormControl>
       <field.FormMessage />
      </field.FormItem>
     )}
    </group.AppField>
    <group.AppField
     name="phoneNumber"
    >
     {(field) => (
      <field.FormItem className="w-full">
       <field.FormLabel>Phone Number</field.FormLabel>
       <field.FormControl>
        <Input
         placeholder="Enter your phone number"
         type="number"
         value={field.state.value}
         onBlur={field.handleBlur}
         onChange={(e) =>
          field.handleChange(e.target.valueAsNumber || 0)
         }
        />
       </field.FormControl>
       <field.FormMessage />
      </field.FormItem>
     )}
    </group.AppField>
   </div>
  );
 },
});
const Step3Group = withFieldGroup({
 defaultValues: {
  preferences: [] as string[],
  comment: "",
 },
 render: function Step3Render({ group }) {
  return (
   <div>
    <h2 className="text-2xl font-bold">Your Preferences</h2>
    <group.AppField
     name="preferences"
    >
     {(field) => {
      const options = [
       { value: "monday", label: "Mon" },
       { value: "tuesday", label: "Tue" },
       { value: "wednesday", label: "Wed" },
       { value: "thursday", label: "Thu" },
       { value: "friday", label: "Fri" },
       { value: "saturday", label: "Sat" },
       { value: "sunday", label: "Sun" },
      ];
      return (
       <field.FormItem className="flex flex-col gap-2 w-full py-1">
        <field.FormLabel>
         Tell us about your interests and preferences.{" "}
        </field.FormLabel>
        <field.FormControl>
         <ToggleGroup
          variant="outline"
          value={field.state.value}
          onValueChange={(value) => field.handleChange(value)}
          type="multiple"
          className="flex justify-start items-center gap-2 flex-wrap"
         >
          {options.map(({ label, value }) => (
           <ToggleGroupItem
            key={value}
            value={value}
            className="flex items-center gap-x-2"
           >
            {label}
           </ToggleGroupItem>
          ))}
         </ToggleGroup>
        </field.FormControl>
        <field.FormMessage />
       </field.FormItem>
      );
     }}
    </group.AppField>

    <group.AppField
     name="comment"
    >
     {(field) => (
      <field.FormItem>
       <field.FormLabel>Feedback Comment</field.FormLabel>
       <field.FormControl>
        <Textarea
         placeholder="Share your feedback"
         className="resize-none"
         value={field.state.value}
         onBlur={field.handleBlur}
         onChange={(e) => field.handleChange(e.target.value)}
        />
       </field.FormControl>
       <field.FormMessage />
      </field.FormItem>
     )}
    </group.AppField>
   </div>
  );
 },
});
// Full form schema for validation
export const formSchema = z.object({
 name: z.string().min(1, "This field is required"),
 lastName: z.string().min(1, "This field is required"),
 formArray_1758095351255: [
  {
   Checkbox_1758095354066: false,
   Checkbox_1758095355944: false,
   Input_1758095358624: "",
   Slider_1758095363568: 0,
  },
 ],
 yourEmail: z.email(),
 phoneNumber: z.number(),
 preferences: z.array(z.string().min(1, "This field is required")),
 comment: z.string().min(1, "This field is required"),
});

export function DraftForm() {
 const {
  currentValidator,
  step,
  currentStep,
  isFirstStep,
  handleCancelOrBack,
  handleNextStepOrSubmit,
 } = useFormStepper(stepSchemas);
 const form = useAppForm({
  defaultValues: {
   name: "",
   lastName: "",
   formArray_1758095351255: [
    {
     Checkbox_1758095354066: false,
     Checkbox_1758095355944: false,
     Input_1758095358624: "",
     Slider_1758095363568: 0,
    },
   ],
   yourEmail: "",
   phoneNumber: 0,
   preferences: [],
   comment: "",
  } as z.input<typeof formSchema>,
  validationLogic: revalidateLogic(),
  validators: {
   onDynamic: currentValidator as typeof formSchema,
  },
  onSubmit: ({ value }) => {
   console.log(value);
   toast.success("Submitted Successfully");
  },
 });
 const handleSubmit = useCallback(
  (e: React.FormEvent) => {
   e.preventDefault();
   e.stopPropagation();
   form.handleSubmit();
  },
  [form],
 );

 const groups: Record<number, React.ReactNode> = {
  1: <Step1Group form={form} fields={{
   name: "name",
   lastName: "lastName",
   formArray_1758095351255: "formArray_1758095351255" as never,
  }} />,
  2: <Step2Group form={form} fields={{ yourEmail: "yourEmail", phoneNumber: "phoneNumber" }} />,
  3: <Step3Group form={form} fields={{ preferences: "preferences", comment: "comment" }} />,
 };

 const handleNext = async () => {
  await handleNextStepOrSubmit(form);
 };

 const handlePrevious = () => {
  console.log("handlePrevious");
  // handleCancelOrBack();
 };

 const current = groups[currentStep];

 const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
 return (
  <>

   <div>
    <form.AppForm>
     <form
      onSubmit={handleSubmit}
      className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border"
     >
      <div className="flex flex-col gap-2 pt-3">
       <div className="flex flex-col items-center justify-start gap-1">
        <span>
         Step {currentStep} of {Object.keys(groups).length}
        </span>
        <Progress
         value={(currentStep / Object.keys(groups).length) * 100}
        />
       </div>
       <AnimatePresence mode="popLayout">
        <motion.div
         key={currentStep}
         initial={{ opacity: 0, x: 15 }}
         animate={{ opacity: 1, x: 0 }}
         exit={{ opacity: 0, x: -15 }}
         transition={{ duration: 0.4, type: "spring" }}
         className="flex flex-col gap-2"
        >
         {current}
        </motion.div>
       </AnimatePresence>
       <div className="flex items-center justify-between gap-3 w-full pt-3">
        <Button
         size="sm"
         variant="ghost"
         onClick={() =>
          handleCancelOrBack({ onBack: () => handlePrevious() })
         }
         type="button"
         disabled={isFirstStep}
        >
         Previous
        </Button>
        {step.isCompleted ? (
         <Button
          size="sm"
          type="button"
          onClick={() => handleNextStepOrSubmit(form)}
         >
          {isSubmitting ? "Submitting..." : "Submit"}
         </Button>
        ) : (
         <Button
          size="sm"
          type="button"
          variant={"secondary"}
          onClick={handleNext}
         >
          Next
         </Button>
        )}
       </div>
      </div>
      <div className="flex justify-end items-center w-full pt-3">
       <form.SubmitButton className="rounded-lg" size="sm" label="Submit" />
      </div>
     </form>
    </form.AppForm>
   </div>
  </>
 );
}
