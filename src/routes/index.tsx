import { createFileRoute, Link } from "@tanstack/react-router";
import { Code, Eye, Layers, Move, Palette, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const features = [
  {
    title: "Drag & Drop Builder",
    icon: Move,
    description: (
      <>
        Intuitive{" "}
        <span className="font-bold text-primary">drag-and-drop interface</span>{" "}
        for building forms quickly. Add, rearrange, and configure{" "}
        <span className="font-bold text-primary">form fields</span> with ease.
      </>
    ),
  },
  {
    title: "Type-Safe Code Generation",
    icon: Code,
    description: (
      <>
        Generate{" "}
        <span className="font-bold text-primary">
          fully typed React components
        </span>{" "}
        with TypeScript support. Automatic{" "}
        <span className="font-bold text-primary">schema generation</span> for
        form validation.
      </>
    ),
  },
  {
    title: "ShadCN UI Integration",
    icon: Palette,
    description: (
      <>
        Seamlessly integrated with{" "}
        <span className="font-bold text-primary">ShadCN UI components</span>.
        Generate{" "}
        <span className="font-bold text-primary">customizable, accessible</span>{" "}
        form components out of the box.
      </>
    ),
  },
  {
    title: "Multi-Step & Field Arrays",
    icon: Layers,
    description: (
      <>
        Create{" "}
        <span className="font-bold text-primary">complex multi-step forms</span>{" "}
        and dynamic field arrays. Perfect for{" "}
        <span className="font-bold text-primary">
          advanced form requirements
        </span>{" "}
        and data structures.
      </>
    ),
  },
  {
    title: "Save, Share & Export",
    icon: Share2,
    description: (
      <>
        Save your{" "}
        <span className="font-bold text-primary">form configurations</span>,
        share them with team members, and export{" "}
        <span className="font-bold text-primary">generated code</span> for
        immediate use in your projects.
      </>
    ),
  },
  {
    title: "Real-time Preview",
    icon: Eye,
    description: (
      <>
        See your{" "}
        <span className="font-bold text-primary">form changes instantly</span>{" "}
        with live preview. Test{" "}
        <span className="font-bold text-primary">
          form behavior and styling
        </span>{" "}
        as you build.
      </>
    ),
  },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">TanStack Form Builder</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build powerful forms and tables with ease using TanStack
            technologies. Create dynamic, type-safe forms and tables with
            generated code.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Form Builder</CardTitle>
              <CardDescription>
                Create dynamic forms with drag-and-drop interface. Generate
                type-safe React components with TanStack Form integration and
                real-time preview.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/form-builder">
                <Button className="w-full">Explore Form Builder</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Table Builder</CardTitle>
              <CardDescription>
                Build powerful data tables with sorting, filtering, and
                pagination. Generate tables from your form schemas
                automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled variant="outline">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-8">Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.title} className="relative group h-full">
                  {/* Floating Icon */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  {/* Feature Card */}
                  <div className="h-full flex flex-col p-6 pt-8 rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-semibold mb-4 text-lg text-center">
                        {feature.title}
                      </h3>
                      <div className="flex-1 flex items-center">
                        <p className="text-sm text-muted-foreground leading-relaxed text-center w-full">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
