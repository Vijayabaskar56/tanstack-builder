import type { FormElement } from '@/form-types';

export const getFormElementCode = (field: FormElement) => {
  switch (field.fieldType) {
    case 'Input':
      return `<form.AppField
                name="${field.name}"
                children={(field) => (
                    <field.FormItem className="w-full">
                     ${field.label && `<field.FormLabel>${field.label} ${field.required ? '*' : ''}</field.FormLabel>`}
                      <field.FormControl>
                        <Input
                          name={field.name}
                          placeholder="${field.placeholder}"
                          type={"${field.type}"}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </field.FormControl>
                      ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ''}
                      <field.FormMessage />
                  </field.FormItem>
                  )}
              />
              `;
    case 'OTP':
      return `
       <form.AppField
          name="${field.name}"
          children={(field) => (
           <field.FormItem className="w-full">
          ${field.label && `<field.FormLabel>${field.label} ${field.required ? '*' : ''}</field.FormLabel>`}
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
          ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ''}
          <field.FormMessage />
        </field.FormItem>
          )}
        />`;
    case 'Textarea':
      return `
        <form.AppField
          name="${field.name}"
          children={(field) => (
            <field.FormItem>
           ${field.label && `<field.FormLabel>${field.label} ${field.required ? '*' : ''}</field.FormLabel>`}
              <field.FormControl>
                <Textarea
                  placeholder="${field.placeholder ?? ''}"
                  className="resize-none"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </field.FormControl>
              ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ''}
              <field.FormMessage />
            </field.FormItem>
          )}
        />`;
    case 'Password':
      return `
          <form.AppField
          name="${field.name}"
          children={(field) => (
            <field.FormItem className="w-full">
            ${field.label && `<field.FormLabel>${field.label} ${field.required ? '*' : ''}</field.FormLabel>`}
              <field.FormControl>
                <Input
                  name={field.name}
                  placeholder="${field.placeholder}"
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </field.FormControl>
              ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ''}
              <field.FormMessage />
            </field.FormItem>
          )}
        />
        `;
    case 'Checkbox':
      return `<form.AppField
          name="${field.name}"
          children={(field) => (
            <field.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <field.FormControl>
                <Checkbox
                  name={field.name}
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onCheckedChange={(checked : boolean) => {field.handleChange(checked)}}
                  ${field.disabled ? 'disabled' : ''}
                />
              </field.FormControl>
              <div className="space-y-1 leading-none">
                <field.FormLabel>${field.label}</field.FormLabel>
                ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ''}
                <field.FormMessage />
              </div>
            </field.FormItem>
          )}
        />`;
    case 'DatePicker':
      return `
      <form.AppField
      name="${field.name}"
      children={(field) => (
        <field.FormItem className="flex flex-col">
            ${field.label && `<field.FormLabel>${field.label} ${field.required ? '*' : ''}</field.FormLabel>`}
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
            ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ''}
          <field.FormMessage />
        </field.FormItem>
      )}
    />`;
    case 'MultiSelect':
      return `
           <form.AppField
              name="${field.name}"
              children={(field) => {
              const options = [
                      { value: '1', label: 'Option 1' },
                      { value: '2', label: 'Option 2' },
                      { value: '2', label: 'Option 3' },
                    ]
              return (
                <field.FormItem className="w-full">
                 ${field.label && `<field.FormLabel>${field.label} ${field.required ? '*' : ''}</field.FormLabel>`}
                  <MultiSelect value={field.state.value} onValueChange={field.handleChange}>
                    <field.FormControl>
                      <MultiSelectTrigger>
                        <MultiSelectValue
                          placeholder={"${field.placeholder}"}
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
                  ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ''}
                  <field.FormMessage />
                </field.FormItem>
              )}}
            />`;
    case 'Select':
      return `
        <form.AppField
          name="${field.name}"
          children={(field) => {
          const options =[
            { value: 'option-1', label: 'Option 1' },
            { value: 'option-2', label: 'Option 2' },
            { value: 'option-3', label: 'Option 3' },
          ]
          return (
            <field.FormItem className="w-full">
            ${field.label && `<field.FormLabel>${field.label} ${field.required ? '*' : ''}</field.FormLabel>`}
              <Select name={field.name} onValueChange={field.handleChange} defaultValue={field.state.value} value={field.state.value as string}>
                <field.FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="${field.placeholder}" />
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
                ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ''}
              <field.FormMessage />
            </field.FormItem>
          )}}
        />`;
    case 'Slider':
      return `
            <form.AppField
              name="${field.name}"
              children={(field) => (
              <field.FormItem>
                <field.FormLabel className="flex justify-between items-center">${field.label}<span>{field.state.value}/${field?.max}</span>
                </field.FormLabel>
                <field.FormControl>
                  <Slider
                    name={field.name}
                    min={${field?.min}}
                    max={${field?.max}}
                    step={${field?.step}}
                    defaultValue={[5]}
                    onValueChange={(values) => {
                      field.handleChange(values[0]);
                    }}
                  />
                </field.FormControl>
                ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ''}
                <field.FormMessage />
              </field.FormItem>
              )}
            />`;
    case 'Switch':
      return `
            <form.AppField
              name="${field.name}"
              children={(field) => (
                <field.FormItem className="flex flex-col p-3 justify-center w-full border rounded">
                    <div className="flex items-center justify-between h-full">
                      ${field.label && `<field.FormLabel>${field.label} ${field.required ? '*' : ''}</field.FormLabel>`}
                      <field.FormControl>
                        <Switch
                          checked={field.state.value}
                          onCheckedChange={field.handleChange}
                        />
                      </field.FormControl>
                    </div>
                    ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ''}
                </field.FormItem>
              )}
            />`;
    case 'RadioGroup':
      return `<form.AppField
              name="${field.name}"
              children={(field) => {
                const options =[
                  { value: 'option-1', label: 'Option 1' },
                  { value: 'option-2', label: 'Option 2' },
                  { value: 'option-3', label: 'Option 3' },
                ]
              return (
                <field.FormItem className="flex flex-col gap-2 w-full py-1">
                   ${field.label && `<field.FormLabel>${field.label} ${field.required ? '*' : ''}</field.FormLabel>`}
                    <field.FormControl>
                      <RadioGroup
                        name={field.name}
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
                    ${field.description ? `<field.FormDescription>${field.description}</field.FormDescription>` : ''}
                    <field.FormMessage />
                </field.FormItem>
              )}}
            />`;
    case 'ToggleGroup':
      return `<form.AppField
              name="${field.name}"
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
               ${field.label && `<field.FormLabel>${field.label} ${field.required ? '*' : ''}</field.FormLabel>`}
                <field.FormControl>
                  <ToggleGroup
                      variant="outline"
                      onValueChange={field.handleChange}
                      defaultValue={field.state.value}
                      type='${field.type}'
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
                ${field.description && `<field.FormDescription>${field.description}</field.FormDescription>`}
                <field.FormMessage />
              </field.FormItem>
            )
              }}
            />`;
    case 'H1':
      return `<h1 className="text-3xl font-bold">${field.content}</h1>`;
    case 'H2':
      return `<h2 className="text-2xl font-bold">${field.content}</h2>`;
    case 'H3':
      return `<h3 className="text-xl font-bold">${field.content}</h3>`;
    case 'P':
      return `<p className="text-base">${field.content}</p>`;
    case 'Separator':
      return `<div className="py-3 w-full">
                <Separator />
              </div>`;
    default:
      return null;
  }
};
