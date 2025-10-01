// generate-form-component.ts
import type { FormElement } from "@/types/form-types";

const formatFieldName = (name: string) => {
	// If name starts with backtick, it's an array field - ensure it ends with backtick
	if (name.startsWith("`")) {
		return name.endsWith("`") ? name : `${name}\``;
	}
	// Otherwise, wrap in quotes as string literal
	return `"${name}"`;
};

export const getFormElementCode = (
	field: FormElement,
	isInGroup = false,
	formVariableName = "form",
) => {
	const fieldPrefix = isInGroup ? "group" : formVariableName;
	switch (field.fieldType) {
		case "Input":
			return `<${fieldPrefix}.AppField name={${formatFieldName(field.name)}}>
                {(field) => (
                    <field.FormItem className="w-full">
                     ${field.label && `<field.FormLabel>${field.label} ${field.required ? "*" : ""}</field.FormLabel>`}
                      <field.FormControl>
                        <Input
                          name={${formatFieldName(field.name)}}
                          placeholder="${field.placeholder ?? ""}"
                          ${field.type === "number" || field.type === "tel" ? 'inputMode="decimal"' : ""}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value${field.type === "number" || field.type === "tel" ? "AsNumber" : ""})}
                        />
                      </field.FormControl>
                      ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ""}
                      <field.FormMessage />
                  </field.FormItem>
                  )}
              </${fieldPrefix}.AppField>
              `;
		case "OTP":
			return `
       <${fieldPrefix}.AppField name={${formatFieldName(field.name)}} >
          {(field) => (
           <field.FormItem className="w-full">
          ${field.label && `<field.FormLabel>${field.label} ${field.required ? "*" : ""}</field.FormLabel>`}
          <field.FormControl>
            <InputOTP
              maxLength={6}
              name={${formatFieldName(field.name)}}
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
          ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ""}
          <field.FormMessage />
        </field.FormItem>
          )}
        </${fieldPrefix}.AppField>
        `;
		case "Textarea":
			return `
        <${fieldPrefix}.AppField name={${formatFieldName(field.name)}} >
          {(field) => (
            <field.FormItem className="w-full">
           ${field.label && `<field.FormLabel>${field.label} ${field.required ? "*" : ""}</field.FormLabel>`}
              <field.FormControl>
                <Textarea
                  placeholder="${field.placeholder ?? ""}"
                  className="resize-none"
                  name={${formatFieldName(field.name)}}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </field.FormControl>
              ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ""}
              <field.FormMessage />
            </field.FormItem>
          )}
        </${fieldPrefix}.AppField>
        `;
		case "Password":
			return `
       <${fieldPrefix}.AppField name={${formatFieldName(field.name)}} >
          {(field) => (
            <field.FormItem className="w-full">
            ${field.label && `<field.FormLabel>${field.label} ${field.required ? "*" : ""}</field.FormLabel>`}
              <field.FormControl>
                <Input
                  name={${formatFieldName(field.name)}}
                  placeholder="${field.placeholder ?? ""}"
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </field.FormControl>
              ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ""}
              <field.FormMessage />
            </field.FormItem>
          )}
        </${fieldPrefix}.AppField>
        `;
		case "Checkbox":
			return `<${fieldPrefix}.AppField name={${formatFieldName(field.name)}}  >
          {(field) => (
            <field.FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
              <field.FormControl>
                <Checkbox
                  name={${formatFieldName(field.name)}}
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onCheckedChange={(checked : boolean) => {field.handleChange(checked)}}
                  ${field.disabled ? "disabled" : ""}
                />
              </field.FormControl>
              <div className="space-y-1 leading-none">
                <field.FormLabel>${field.label ?? ""}</field.FormLabel>
                ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ""}
                <field.FormMessage />
              </div>
            </field.FormItem>
          )}
        </${fieldPrefix}.AppField>
        `;
		case "DatePicker":
			return `
      <${fieldPrefix}.AppField name={${formatFieldName(field.name)}} >
      {(field) => (
        <field.FormItem className="flex flex-col">
            ${field.label && `<field.FormLabel>${field.label} ${field.required ? "*" : ""}</field.FormLabel>`}
          <Popover>
            <PopoverTrigger asChild>
              <field.FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-start font-normal",
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
            ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ""}
          <field.FormMessage />
        </field.FormItem>
      )}
    </${fieldPrefix}.AppField>
    `;
		case "MultiSelect":
			return `
           <${fieldPrefix}.AppField name={${formatFieldName(field.name)}} >
              {(field) => {
              const options = ${
								field.options
									? `[${field.options.map((opt) => `{label: "${opt.label}", value: "${opt.value}"}`).join(", ")}]`
									: `[
                      { value: '1', label: 'Option 1' },
                      { value: '2', label: 'Option 2' },
                      { value: '3', label: 'Option 3' },
                    ]`
							}
              return (
                <field.FormItem className="w-full">
                 ${field.label && `<field.FormLabel>${field.label} ${field.required ? "*" : ""}</field.FormLabel>`}
                  <MultiSelect value={field.state.value} onValueChange={field.handleChange}>
                    <field.FormControl>
                      <MultiSelectTrigger>
                        <MultiSelectValue
                          placeholder={"${field.placeholder ?? "Select Item"}"}
                        />
                      </MultiSelectTrigger>
                    </field.FormControl>
                    <MultiSelectContent>
                      <MultiSelectList>
                        {options.map(({ label, value }) => (
                          <MultiSelectItem key={value} value={value}>
                            {label}
                          </MultiSelectItem>
                        ))}
                      </MultiSelectList>
                    </MultiSelectContent>
                  </MultiSelect>
                  ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ""}
                  <field.FormMessage />
                </field.FormItem>
              )}}
            </${fieldPrefix}.AppField>
            `;
		case "Select":
			return `
        <${fieldPrefix}.AppField name={${formatFieldName(field.name)}} >
          {(field) => {
          const options = ${
						field.options
							? `[${field.options.map((opt) => `{label: "${opt.label}", value: "${opt.value}"}`).join(", ")}]`
							: `[
            { value: 'option-1', label: 'Option 1' },
            { value: 'option-2', label: 'Option 2' },
            { value: 'option-3', label: 'Option 3' },
          ]`
					}
          return (
            <field.FormItem className="w-full">
            ${field.label && `<field.FormLabel>${field.label} ${field.required ? "*" : ""}</field.FormLabel>`}
              <Select name={${formatFieldName(field.name)}} onValueChange={field.handleChange} defaultValue={field.state.value} value={field.state.value as string}>
                <field.FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="${field.placeholder ?? "Select an option"}" />
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
                ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ""}
              <field.FormMessage />
            </field.FormItem>
          )}}
        </${fieldPrefix}.AppField>
        `;
		case "Slider":
			return `
            <${fieldPrefix}.AppField name={${formatFieldName(field.name)}} >
              {(field) => (
              <field.FormItem className="w-full">
                <field.FormLabel className="flex justify-between items-center">${field.label ?? ""}<span>{field.state.value}/${field?.max ?? 100}</span>
                </field.FormLabel>
                <field.FormControl>
                  <Slider
                    name={${formatFieldName(field.name)}}
                    min={${field?.min ?? 0}}
                    max={${field?.max ?? 100}}
                    step={${field?.step ?? 1}}
                    defaultValue={[5]}
                    onValueChange={(values) => {
                      field.handleChange(values[0]);
                    }}
                  />
                </field.FormControl>
                ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ""}
                <field.FormMessage />
              </field.FormItem>
              )}
            </${fieldPrefix}.AppField>
            `;
		case "Switch":
			return `
            <${fieldPrefix}.AppField name={${formatFieldName(field.name)}} >
              {(field) => (
                <field.FormItem className="flex flex-col p-3 justify-center w-full border rounded">
                    <div className="flex items-center justify-between h-full">
                      ${field.label && `<field.FormLabel>${field.label} ${field.required ? "*" : ""}</field.FormLabel>`}
                      <field.FormControl>
                        <Switch
                          checked={field.state.value}
                          onCheckedChange={field.handleChange}
                        />
                      </field.FormControl>
                    </div>
                    ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ""}
                </field.FormItem>
              )}
            </${fieldPrefix}.AppField>
            `;
		case "RadioGroup":
			return `<${fieldPrefix}.AppField name={${formatFieldName(field.name)}} >
              {(field) => {
                const options = ${
									field.options
										? `[${field.options.map((opt) => `{label: "${opt.label}", value: "${opt.value}"}`).join(", ")}]`
										: `[
                  { value: 'option-1', label: 'Option 1' },
                  { value: 'option-2', label: 'Option 2' },
                  { value: 'option-3', label: 'Option 3' },
                ]`
								}
              return (
                <field.FormItem className="flex flex-col gap-2 w-full py-1">
                   ${field.label && `<field.FormLabel>${field.label} ${field.required ? "*" : ""}</field.FormLabel>`}
                    <field.FormControl>
                      <RadioGroup
                        name={${formatFieldName(field.name)}}
                        onValueChange={field.handleChange}
                        defaultValue={field.state.value}
                      >
                        {options.map(({ label, value }) => (
                        <div className="flex items-center gap-x-2">
                          <RadioGroupItem
                            key={value}
                            value={value}
                            />
                          <Label htmlFor={value}>{label}</Label>
                        </div>
                        ))}
                      </RadioGroup>
                    </field.FormControl>
                    ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ""}
                    <field.FormMessage />
                </field.FormItem>
              )}}
            </${fieldPrefix}.AppField>
            `;
		case "ToggleGroup":
			return `<${fieldPrefix}.AppField name={${formatFieldName(field.name)}} >
              {(field) => {
              const options = ${
								field.options
									? `[${field.options.map((opt) => `{label: "${opt.label}", value: "${opt.value}"}`).join(", ")}]`
									: `[
                     { value: 'monday', label: 'Mon' },
                     { value: 'tuesday', label: 'Tue' },
                     { value: 'wednesday', label: 'Wed' },
                     { value: 'thursday', label: 'Thu' },
                     { value: 'friday', label: 'Fri' },
                     { value: 'saturday', label: 'Sat' },
                     { value: 'sunday', label: 'Sun' },
                  ]`
							}
            return (
              <field.FormItem className="flex flex-col gap-2 w-full py-1">
               ${field.label && `<field.FormLabel>${field.label} ${field.required ? "*" : ""}</field.FormLabel>`}
                <field.FormControl>
                  <ToggleGroup
                      variant="outline"
                      onValueChange={field.handleChange}
                      defaultValue={field.state.value}
                      type='${field.type ?? "single"}'
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
                ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ""}
                <field.FormMessage />
              </field.FormItem>
            )
              }}
            </${fieldPrefix}.AppField>`;
		case "H1":
			return `<h1 className="text-3xl font-bold">${field.content ?? ""}</h1>`;
		case "H2":
			return `<h2 className="text-2xl font-bold">${field.content ?? ""}</h2>`;
		case "H3":
			return `<h3 className="text-xl font-bold">${field.content ?? ""}</h3>`;
		case "P":
			return `<p className="text-base">${field.content ?? ""}</p>`;
		case "Separator":
			return `<div className="py-3 w-full">
                <Separator />
              </div>`;
		default:
			return null;
	}
};
