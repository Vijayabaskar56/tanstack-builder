import { revalidateLogic, useStore } from "@tanstack/react-form";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import {
	MultiSelect,
	MultiSelectContent,
	MultiSelectItem,
	MultiSelectList,
	MultiSelectTrigger,
	MultiSelectValue,
} from "@/components/ui/multi-select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/testing/")({
	component: RouteComponent,
	beforeLoad: () => {
		const env = import.meta.env.MODE;
		console.log("🚀 ~ env:", env);
		if (env !== "development") {
			return <Navigate to="/" />;
		}
	},
});

export const formSchema = z.object({
  "Checkbox-1756491828239": z.boolean(),
  "DatePicker-1756491828986": z.date(),
  "Input-1756491829757": z.string(),
  "OTP-1756491830520": z.string(),
  "MultiSelect-1756491831577": z.array(z.string()).nonempty("Please at least one item"),
  "Password-1756491832369": z.string(),
  "RadioGroup-1756491833109": z.string(),
  "Select-1756491833887": z.string(),
  "Slider-1756491834643": z.number().min(1).max(100),
  "Switch-1756491835428": z.boolean(),
  "Textarea-1756491836266": z.string(),
  "ToggleGroup-1756491837079": z.array(z.string()).nonempty("Please at least one item")
});

function RouteComponent() {
	const form = useAppForm({
		defaultValues: {} as z.infer<typeof formSchema>,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamicAsyncDebounceMs: 500,
			onDynamic: formSchema,
		},
		onSubmit: ({ value }) => {
			console.log(value);
			toast.success("success");
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
	const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
  return (<div>
    <form.AppForm>
      <form onSubmit={handleSubmit} className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border"  noValidate>
        <form.AppField
          name="Checkbox-1756491828239"
          children={(field) => (
            <field.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <field.FormControl>
                <Checkbox
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onCheckedChange={(checked : boolean) => {field.handleChange(checked)}}

                />
              </field.FormControl>
              <div className="space-y-1 leading-none">
                <field.FormLabel>Checkbox Label</field.FormLabel>

                <field.FormMessage />
              </div>
            </field.FormItem>
          )}
        />

      <form.AppField
      name="DatePicker-1756491828986"
      children={(field) => (
        <field.FormItem className="flex flex-col">
            <field.FormLabel>Pick a date </field.FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <field.FormControl>
                <Button
                  variant={"outline-solid"}
                  className={cn(
                    "w-[240px] pl-3 text-start font-normal",
                    !field.state.value && "text-muted-foreground"
                  )}
                >
                  {field.state.value ? (
                    format(field.state.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </field.FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.state.value}
                onSelect={field.handleChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <field.FormMessage />
        </field.FormItem>
      )}
    />
<form.AppField
                name="Input-1756491829757"
                children={(field) => (
                    <field.FormItem className="w-full">
                     <field.FormLabel>Input Field </field.FormLabel>
                      <field.FormControl>
                        <Input
                          placeholder="Enter your text"
                          type={"text"}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </field.FormControl>

                      <field.FormMessage />
                  </field.FormItem>
                  )}
              />

       <form.AppField
          name="OTP-1756491830520"
          children={(field) => (
           <field.FormItem className="w-full">
          <field.FormLabel>One-Time Password </field.FormLabel>
          <field.FormControl>
            <InputOTP
              maxLength={6}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </field.FormControl>
          <field.FormDescription>Please enter the one-time password sent to your phone.</field.FormDescription>
          <field.FormMessage />
        </field.FormItem>
          )}
        />

           <form.AppField
              name="MultiSelect-1756491831577"
              children={(field) => {
              const options = [
                      { value: '1', label: 'Option 1' },
                      { value: '2', label: 'Option 2' },
                      { value: '2', label: 'Option 3' },
                    ]
              return (
                <field.FormItem className="w-full">
                 <field.FormLabel>Select multiple options </field.FormLabel>
                  <MultiSelect value={field.state.value} onValueChange={field.handleChange}>
                    <field.FormControl>
                      <MultiSelectTrigger>
                        <MultiSelectValue
                          placeholder={"undefined"}
                        />
                      </MultiSelectTrigger>
                    </field.FormControl>
                    <MultiSelectContent>
                      <MultiSelectList>
                        {options.map(({ label, value }) => (
                          <MultiSelectItem key={label} value={value}>
                            {label}
                          </MultiSelectItem>
                        ))}
                      </MultiSelectList>
                    </MultiSelectContent>
                  </MultiSelect>

                  <field.FormMessage />
                </field.FormItem>
              )}}
            />

          <form.AppField
          name="Password-1756491832369"
          children={(field) => (
            <field.FormItem className="w-full">
            <field.FormLabel>Password Field </field.FormLabel>
              <field.FormControl>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </field.FormControl>

              <field.FormMessage />
            </field.FormItem>
          )}
        />

<form.AppField
              name="RadioGroup-1756491833109"
              children={(field) => {
                const options =[
                  { value: 'option-1', label: 'Option 1' },
                  { value: 'option-2', label: 'Option 2' },
                  { value: 'option-3', label: 'Option 3' },
                ]
              return (
                <field.FormItem className="flex flex-col gap-2 w-full py-1">
                   <field.FormLabel>Pick one option </field.FormLabel>
                    <field.FormControl>
                      <RadioGroup
                        onValueChange={field.handleChange}
                        defaultValue={field.state.value}
                      >
                        {options.map(({ label, value }) => (
                          <RadioGroupItem
                          key={value}
                          value={value}
                          className="flex items-center gap-x-2"
                        >
                          {label}
                        </RadioGroupItem>
                        ))}
                      </RadioGroup>
                    </field.FormControl>

                    <field.FormMessage />
                </field.FormItem>
              )}}
            />

        <form.AppField
          name="Select-1756491833887"
          children={(field) => {
          const options =[
            { value: 'option-1', label: 'Option 1' },
            { value: 'option-2', label: 'Option 2' },
            { value: 'option-3', label: 'Option 3' },
          ]
          return (
            <field.FormItem className="w-full">
            <field.FormLabel>Select option </field.FormLabel>
              <Select onValueChange={field.handleChange} defaultValue={field.state.value}>
                <field.FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </field.FormControl>
                <SelectContent>
                  {options.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <field.FormMessage />
            </field.FormItem>
          )}}
        />

            <form.AppField
              name="Slider-1756491834643"
              children={(field) => (
              <field.FormItem>
                <field.FormLabel className="flex justify-between items-center">Set Range<span>{field.state.value}/{100}</span>
                </field.FormLabel>
                <field.FormControl>
                  <Slider
                    min={1}
                    max={100}
                    step={2}
                    defaultValue={[5]}
                    onValueChange={(values) => {
                      field.handleChange(values[0]);
                    }}
                  />
                </field.FormControl>
                <field.FormDescription>Adjust the range by sliding.</field.FormDescription>
                <field.FormMessage />
              </field.FormItem>
              )}
            />

            <form.AppField
              name="Switch-1756491835428"
              children={(field) => (
                <field.FormItem className="flex flex-col p-3 justify-center w-full border rounded">
                    <div className="flex items-center justify-between h-full">
                      <field.FormLabel>Toggle Switch </field.FormLabel>
                      <field.FormControl>
                        <Switch
                          checked={field.state.value}
                          onCheckedChange={field.handleChange}
                        />
                      </field.FormControl>
                    </div>
                    <field.FormDescription>Turn on or off.</field.FormDescription>
                </field.FormItem>
              )}
            />

        <form.AppField
          name="Textarea-1756491836266"
          children={(field) => (
            <field.FormItem>
           <field.FormLabel>Textarea </field.FormLabel>
              <field.FormControl>
                <Textarea
                  placeholder="Enter your text"
                  className="resize-none"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </field.FormControl>
              <field.FormDescription>A multi-line text input field</field.FormDescription>
              <field.FormMessage />
            </field.FormItem>
          )}
        />
<form.AppField
              name="ToggleGroup-1756491837079"
              children={(field) => {
              const options= [
                     { value: 'monday', label: 'Mon' },
                     { value: 'tuesday', label: 'Tue' },
                     { value: 'wednesday', label: 'Wed' },
                     { value: 'thursday', label: 'Thu' },
                     { value: 'friday', label: 'Fri' },
                     { value: 'saturday', label: 'Sat' },
                     { value: 'sunday', label: 'Sun' },
                  ]
            return (
              <field.FormItem className="flex flex-col gap-2 w-full py-1">
               <field.FormLabel>Pick multiple days </field.FormLabel>
                <field.FormControl>
                  <ToggleGroup
                      variant="outline"
                      onValueChange={field.handleChange}
                      defaultValue={field.state.value}
                      type='multiple'
                      className="flex justify-start items-center gap-2 flex-wrap"
                    >
                     {options.map(({ label, value }) => (
                        <ToggleGroupItem
                          key={value}
                          value={value}
                          className="flex items-center gap-x-2"
                        >
                          {label}
                        </ToggleGroupItem>))
                    }
                  </ToggleGroup>
                </field.FormControl>
                undefined
                <field.FormMessage />
              </field.FormItem>
            )
              }}
            />
<h1 className="text-3xl font-bold">Heading 1</h1>
<h2 className="text-2xl font-bold">Heading 2</h2>
<h3 className="text-xl font-bold">Heading 3</h3>
<p className="text-base">E.g This is a note</p>
<div className="py-3 w-full">
                <Separator />
              </div>
        <div className="flex justify-end items-center w-full pt-3">
          <Button className="rounded-lg" size="sm">
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </form.AppForm>
  </div>)
}
