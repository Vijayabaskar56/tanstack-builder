import { revalidateLogic, useForm } from "@tanstack/react-form";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { z } from "zod";

const zodSchema = z.object({
	people: z.array(
		z.object({
			name: z.string().min(1, "this field is required"),
			age: z.number(),
		}),
	),
});
function App() {
	const form = useForm({
		defaultValues: { people: [] } as z.infer<typeof zodSchema>,
		validationLogic: revalidateLogic(),
		validators: {
			onSubmit: zodSchema,
		},
		onSubmit({ value }) {
			alert(JSON.stringify(value));
		},
	});

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<form.Field name="people" mode="array">
					{(field) => {
						return (
							<div>
								{field.state.value.map((_, i) => {
									return (
										<>
											<form.Field key={i} name={`people[${i}].name`}>
												{(subField) => {
													return (
														<div>
															<label>
																<div>Name for person {i}</div>
																<input
																	value={subField.state.value}
																	onChange={(e) =>
																		subField.handleChange(e.target.value)
																	}
																/>
															</label>
															{subField.state.meta.errors?.filter(Boolean).map((v, i) => (
																<p key={i} style={{ color: 'red' }}>
																	{v?.message || ''}
																</p>
															))}
														</div>
													);
												}}
											</form.Field>
											<form.Field key={i} name={`people[${i}].age`}>
												{(subField) => {
													return (
														<div>
															<label>
																<div>Age for person {i}</div>
																<input
																	type="number"
																	value={subField.state.value}
																	onChange={(e) =>
																		subField.handleChange(Number(e.target.value))
																	}
																/>
															</label>
															{subField.state.meta.errors?.filter(Boolean).map((v, i) => (
																<p key={i} style={{ color: 'red' }}>
																	{v?.message || ''}
																</p>
															))}
														</div>
													);
												}}
											</form.Field>
										</>
									);
								})}
								<button
									onClick={() => field.pushValue({ name: "", age: 0 })}
									type="button"
								>
									Add person
								</button>
							</div>
						);
					}}
				</form.Field>
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => (
						<button type="submit" disabled={!canSubmit}>
							{isSubmitting ? "..." : "Submit"}
						</button>
					)}
				/>
			</form>
		</div>
	);
}

const rootElement = document.getElementById("root")!;

createRoot(rootElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
