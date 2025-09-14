import { createFileRoute, Outlet } from "@tanstack/react-router";
import FormHeader from "@/components/header";

export const Route = createFileRoute("/form-builder")({
  component: FormBuilderLayout,
});

function FormBuilderLayout() {
  return (
    <>
      <FormHeader />
      <Outlet />
    </>
  );
}
