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
  ssr: false,
});

const Step1Group = withFieldGroup({
  defaultValues: {
    name: "",
    lastName: "",
  },
  render: function Step1Render({ group }) {
    return (
      <div>
        <h2 className="text-2xl font-bold">Step 1</h2>
        <h2 className="text-2xl font-bold">Personal Details</h2>
        <p className="text-base">Please provide your personal details</p>
        <group.AppField
          name={"name"}
          children={(field) => (
            <field.FormItem className="w-full">
              <field.FormLabel>First name *</field.FormLabel>
              <field.FormControl>
                <Input
                  name={"name"}
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
        />

        <group.AppField
          name={"lastName"}
          children={(field) => (
            <field.FormItem className="w-full">
              <field.FormLabel>Last name </field.FormLabel>
              <field.FormControl>
                <Input
                  name={"lastName"}
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
        />
      </div>
    );
  },
});
const Step2Group = withFieldGroup({
  defaultValues: {
    yourEmail: "",
    phoneNumber: "",
  },
  render: function Step2Render({ group }) {
    return (
      <div>
        <h2 className="text-2xl font-bold">Step 2</h2>
        <h2 className="text-2xl font-bold">Contact Information</h2>
        <p className="text-base">Please provide your contact information</p>
        <group.AppField
          name={"yourEmail"}
          children={(field) => (
            <field.FormItem className="w-full">
              <field.FormLabel>Your Email *</field.FormLabel>
              <field.FormControl>
                <Input
                  name={"yourEmail"}
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
        />

        <group.AppField
          name={"phoneNumber"}
          children={(field) => (
            <field.FormItem className="w-full">
              <field.FormLabel>Phone Number </field.FormLabel>
              <field.FormControl>
                <Input
                  name={"phoneNumber"}
                  placeholder="Enter your phone number"
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                />
              </field.FormControl>

              <field.FormMessage />
            </field.FormItem>
          )}
        />
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
        <h2 className="text-2xl font-bold">Step 3</h2>
        <h2 className="text-2xl font-bold">Your Preferences</h2>
        <group.AppField
          name={"preferences"}
          children={(field) => {
            const options = [
              { label: "Technology", value: "technology" },
              { label: "Business", value: "Business" },
              { label: "Health", value: "Health" },
              { label: "Science", value: "Science" },
            ];
            return (
              <field.FormItem className="flex flex-col gap-2 w-full py-1">
                <field.FormLabel>
                  Tell us about your interests and preferences.{" "}
                </field.FormLabel>
                <field.FormControl>
                  <ToggleGroup
                    variant="outline"
                    onValueChange={field.handleChange}
                    defaultValue={field.state.value}
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
        />

        <group.AppField
          name={"comment"}
          children={(field) => (
            <field.FormItem>
              <field.FormLabel>Feedback Comment </field.FormLabel>
              <field.FormControl>
                <Textarea
                  placeholder="Share your feedback"
                  className="resize-none"
                  name={"comment"}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </field.FormControl>

              <field.FormMessage />
            </field.FormItem>
          )}
        />
      </div>
    );
  },
});
// Full form schema for validation
export const formSchema = z.object({
  name: z.string().min(1, "This field is required"),
  lastName: z.string().min(1, "This field is required").optional(),
  yourEmail: z.email(),
  phoneNumber: z.number().optional(),
  preferences: z.array(z.string().min(1, "This field is required")).optional(),
  comment: z.string().min(1, "This field is required").optional(),
});
// Step-specific schemas for the stepper hook
const stepSchemas = [
  // Step 1
  z.object({
    name: z.string().min(1, "This field is required"),
    lastName: z.string().min(1, "This field is required").optional(),
  }),
  // Step 2
  z.object({
    yourEmail: z.email(),
    phoneNumber: z.number().optional(),
  }),
  // Step 3
  z.object({
    preferences: z
      .array(z.string().min(1, "This field is required"))
      .optional(),
    comment: z.string().min(1, "This field is required").optional(),
  }),
];
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
    1: (
      <Step1Group
        form={form}
        fields={{ name: "name" as never, lastName: "lastName" as never }}
      />
    ),
    2: (
      <Step2Group
        form={form}
        fields={{
          yourEmail: "yourEmail" as never,
          phoneNumber: "phoneNumber" as never,
        }}
      />
    ),
    3: (
      <Step3Group
        form={form}
        fields={{
          preferences: "preferences" as never,
          comment: "comment" as never,
        }}
      />
    ),
  };
  const handleNext = async () => {
    await handleNextStepOrSubmit(form);
  };
  const handlePrevious = () => {
    handleCancelOrBack({
      onBack: () => {},
    });
  };
  const current = groups[currentStep];
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
  return (
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
        </form>
      </form.AppForm>
    </div>
  );
}
