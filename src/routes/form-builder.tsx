import { createFileRoute, Outlet } from "@tanstack/react-router";
import FormHeader from "@/components/header";
import { FormStateSearchParamsSchemaSingle } from "@/lib/search-schema";

export const Route = createFileRoute("/form-builder")({
  component: FormBuilderLayout,
  validateSearch : FormStateSearchParamsSchemaSingle
});

function FormBuilderLayout() {
  return (
    <>
      <FormHeader />
      <Outlet />
    </>
  );
}
