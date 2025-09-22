// index.tsx
import CTASection from "@/components/cta";
import FAQSection from "@/components/faq";
import FooterSection from "@/components/footer";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import {
	Code,
	Eye,
	Layers,
	Move,
	Palette,
	Share2,
	CheckCircle,
	Clock,
	Circle,
} from "lucide-react";
export const Route = createFileRoute("/")({
	component: HomePage,
});

// features array removed as it is unused
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

const roadmapItems = [
	// Completed Features
	{
		title: "Core Form Builder",
		description: "Drag-and-drop form builder with real-time preview",
		status: "completed",
	},
	{
		title: "Type-Safe Code Generation",
		description: "Generate fully typed React components with TypeScript",
		status: "completed",
	},
	{
		title: "ShadCN UI Integration",
		description: "Seamless integration with ShadCN UI components",
		status: "completed",
	},
	{
		title: "Multi-Step Forms",
		description: "Support for complex multi-step form workflows",
		status: "completed",
	},
	{
		title: "Field Array Support",
		description: "Dynamic field arrays for complex data structures",
		status: "completed",
	},
	{
		title: "Schema Generation",
		description: "Automatic schema generation for form validation",
		status: "completed",
	},

	// In Progress Features
	{
		title: "Export & Import",
		description: "Save and share form configurations",
		status: "in-progress",
	},
	{
		title: "Template Library",
		description: "Pre-built form templates for common use cases",
		status: "in-progress",
	},
	{
		title: "Advanced Validation",
		description: "Custom validation rules and error handling",
		status: "in-progress",
	},

	// Planned Features
	{
		title: "Table Builder",
		description: "Auto-generate tables from form schemas",
		status: "planned",
	},
	{
		title: "Team Collaboration",
		description: "Share and collaborate on form designs",
		status: "planned",
	},
	{
		title: "API Integration",
		description: "Connect forms to external APIs and databases",
		status: "planned",
	},
	{
		title: "Advanced Analytics",
		description: "Form performance and usage analytics",
		status: "planned",
	},
	{
		title: "Mobile App Builder",
		description: "Generate mobile forms and PWA support",
		status: "planned",
	},
];

function HomePage() {
	const [activeCard, setActiveCard] = useState(0);
	const [progress, setProgress] = useState(0);
	const mountedRef = useRef(true);

	useEffect(() => {
		const progressInterval = setInterval(() => {
			if (!mountedRef.current) return;

			setProgress((prev) => {
				if (prev >= 100) {
					if (mountedRef.current) {
						setActiveCard((current) => (current + 1) % 3);
					}
					return 0;
				}
				return prev + 2; // 2% every 100ms = 5 seconds total
			});
		}, 100);

		return () => {
			clearInterval(progressInterval);
			mountedRef.current = false;
		};
	}, []);

	useEffect(() => {
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const handleCardClick = (index: number) => {
		if (!mountedRef.current) return;
		setActiveCard(index);
		setProgress(0);
	};

	// getDashboardContent removed as it is unused

	return (
		<>
			<div className="w-full min-h-screen relative bg-background overflow-x-hidden flex flex-col justify-start items-center">
				<div className="relative flex flex-col justify-start items-center w-full">
					{/* Main container with proper margins */}
					<div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
						{/* vertical line */}
						{/* <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-foreground   dark:bg-foreground shadow-[1px_0px_0px_white] z-0" />

          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-foreground dark:bg-foreground shadow-[1px_0px_0px_white] z-0" /> */}

						<div className="self-stretch pt-[9px] overflow-hidden border-b border-border flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
							{/* Hero Section */}
							<div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[216px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full sm:pl-0 sm:pr-0 pl-0 pr-0">
								<div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
									<div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
										<div className="w-full max-w-[748.71px] lg:w-[748.71px] text-center flex justify-center flex-col text-foreground text-[24px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[70px] font-normal leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-24 font-serif px-2 sm:px-4 md:px-0">
											TanStack Form Builder
										</div>
										<div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-muted-foreground sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-[1.5] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
											Build powerful forms with ease using TanStack technologies
											<br className="hidden sm:block" />
											Code generation with 100% Type-Safe.
										</div>
									</div>
								</div>

								<div className="w-full max-w-[497px] lg:w-[497px] flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative z-10 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
									<Button variant="default" size="lg" className="w-32 rounded">
										Start Building
									</Button>
								</div>

								<div className="absolute top-[232px] sm:top-[248px] md:top-[264px] lg:top-[320px] left-1/2 transform -translate-x-1/2 z-0 pointer-events-none">
									<img
										src="/mask-group-pattern.svg"
										alt=""
										className="w-[936px] sm:w-[1404px] md:w-[2106px] lg:w-[2808px] h-auto opacity-30 sm:opacity-40 md:opacity-50 mix-blend-multiply"
										style={{
											filter: "hue-rotate(15deg) saturate(0.7) brightness(1.2)",
										}}
									/>
								</div>

								<div className="w-full max-w-[960px] lg:w-[960px] pt-2 sm:pt-4 pb-6 sm:pb-8 md:pb-10 px-2 sm:px-4 md:px-6 lg:px-11 flex flex-col justify-center items-center gap-2 relative z-5 my-8 sm:my-12 md:my-16 lg:my-16 mb-0 lg:pb-0">
									<div className="w-full max-w-[960px] lg:w-[960px] h-[200px] sm:h-[280px] md:h-[450px] lg:h-[550px] bg-white shadow-[0px_0px_0px_0.9056603908538818px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] sm:rounded-[8px] lg:rounded-[9.06px] flex flex-col justify-start items-start">
										{/* Dashboard Content */}
										<div className="self-stretch flex-1 flex justify-start items-start">
											{/* Main Content */}
											<div className="w-full h-full flex items-center justify-center">
												<div className="relative w-full h-full overflow-hidden">
													{/* Product Image 1 - Plan your schedules */}
													<div
														className={`absolute inset-0 transition-all duration-500 ease-in-out ${
															activeCard === 0
																? "opacity-100 scale-100 blur-0"
																: "opacity-0 scale-95 blur-sm"
														}`}
													>
														<img
															src="/assets/form-builder.png"
															alt="Form Builder Interface"
															className="w-full h-full  object-contain"
														/>
													</div>

													{/* Product Image 2 - Data to insights */}
													<div
														className={`absolute inset-0 transition-all duration-500 ease-in-out ${
															activeCard === 1
																? "opacity-100 scale-100 blur-0"
																: "opacity-0 scale-95 blur-sm"
														}`}
													>
														<img
															src="/analytics-dashboard-with-charts-graphs-and-data-vi.jpg"
															alt="Analytics Dashboard"
															className="w-full h-full object-cover"
														/>
													</div>

													{/* Product Image 3 - Data visualization */}
													<div
														className={`absolute inset-0 transition-all duration-500 ease-in-out ${
															activeCard === 2
																? "opacity-100 scale-100 blur-0"
																: "opacity-0 scale-95 blur-sm"
														}`}
													>
														<img
															src="/data-visualization-dashboard-with-interactive-char.jpg"
															alt="Data Visualization Dashboard"
															className="w-full h-full object-contain" // Changed from object-cover to object-contain to preserve landscape aspect ratio
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="self-stretch border-t border-b border-border flex justify-center items-start">
									<div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
										{/* Left decorative pattern */}
										<div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
											{Array.from({ length: 50 }).map((_, i) => (
												<div
													key={i}
													className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-border outline-offset-[-0.25px]"
												/>
											))}
										</div>
									</div>

									<div className="flex-1 px-0 sm:px-2 md:px-0 flex flex-col md:flex-row justify-center items-stretch gap-0">
										{/* Feature Cards */}
										<FeatureCard
											title="Plan your schedules"
											description="Streamline customer subscriptions and billing with automated scheduling tools."
											isActive={activeCard === 0}
											progress={activeCard === 0 ? progress : 0}
											onClick={() => handleCardClick(0)}
										/>
										<FeatureCard
											title="Analytics & insights"
											description="Transform your business data into actionable insights with real-time analytics."
											isActive={activeCard === 1}
											progress={activeCard === 1 ? progress : 0}
											onClick={() => handleCardClick(1)}
										/>
										<FeatureCard
											title="Collaborate seamlessly"
											description="Keep your team aligned with shared dashboards and collaborative workflows."
											isActive={activeCard === 2}
											progress={activeCard === 2 ? progress : 0}
											onClick={() => handleCardClick(2)}
										/>
									</div>

									<div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
										{/* Right decorative pattern */}
										<div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
											{Array.from({ length: 50 }).map((_, i) => (
												<div
													key={i}
													className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-border outline-offset-[-0.25px]"
												/>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="mt-16 text-center">
							<h2 className="text-2xl font-semibold mb-8">Features</h2>
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-10">
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
											<div className="h-full flex flex-col p-6 pt-8 rounded-xl border bg-card hover:shadow-md transition-all duration-300">
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

						{/* Roadmap Section */}
						<div className="mt-16 text-center">
							<h2 className="text-2xl font-semibold mb-8">
								Development Roadmap
							</h2>
							<div className="grid gap-6 max-w-6xl mx-4 sm:mx-6 md:mx-8 lg:mx-10">
								{/* Completed Features */}
								<div className="text-left">
									<div className="flex items-center gap-3 mb-4">
										<CheckCircle className="w-6 h-6 text-green-500" />
										<h3 className="text-xl font-semibold text-foreground">
											Completed Features
										</h3>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
										{roadmapItems
											.filter((item) => item.status === "completed")
											.map((item) => (
												<div
													key={item.title}
													className="p-4 rounded-lg border bg-card border-border"
												>
													<div className="flex items-start gap-3">
														<CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
														<div className="flex-1">
															<h4 className="font-medium text-foreground mb-1">
																{item.title}
															</h4>
															<p className="text-sm text-muted-foreground">
																{item.description}
															</p>
														</div>
													</div>
												</div>
											))}
									</div>
								</div>

								{/* In Progress Features */}
								<div className="text-left">
									<div className="flex items-center gap-3 mb-4">
										<Clock className="w-6 h-6 text-yellow-500" />
										<h3 className="text-xl font-semibold text-foreground">
											In Progress
										</h3>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
										{roadmapItems
											.filter((item) => item.status === "in-progress")
											.map((item) => (
												<div
													key={item.title}
													className="p-4 rounded-lg border bg-card border-border"
												>
													<div className="flex items-start gap-3">
														<Clock className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
														<div className="flex-1">
															<h4 className="font-medium text-foreground mb-1">
																{item.title}
															</h4>
															<p className="text-sm text-muted-foreground">
																{item.description}
															</p>
														</div>
													</div>
												</div>
											))}
									</div>
								</div>

								{/* Planned Features */}
								<div className="text-left">
									<div className="flex items-center gap-3 mb-4">
										<Circle className="w-6 h-6 text-blue-500" />
										<h3 className="text-xl font-semibold text-foreground">
											Planned Features
										</h3>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
										{roadmapItems
											.filter((item) => item.status === "planned")
											.map((item) => (
												<div
													key={item.title}
													className="p-4 rounded-lg border bg-card border-border"
												>
													<div className="flex items-start gap-3">
														<Circle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
														<div className="flex-1">
															<h4 className="font-medium text-foreground mb-1">
																{item.title}
															</h4>
															<p className="text-sm text-muted-foreground">
																{item.description}
															</p>
														</div>
													</div>
												</div>
											))}
									</div>
								</div>
							</div>
						</div>

						{/* FAQ Section */}
						<FAQSection />

						{/* CTA Section */}
						<CTASection />

						{/* Footer Section */}
						<FooterSection />
					</div>
				</div>
			</div>
		</>
	);
}

// FeatureCard component definition inline to fix import error
function FeatureCard({
	title,
	description,
	isActive,
	progress,
	onClick,
}: {
	title: string;
	description: string;
	isActive: boolean;
	progress: number;
	onClick: () => void;
}) {
	return (
		<div
			className={`w-full md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 ${
				isActive
					? "bg-card shadow-[0px_0px_0px_0.75px_var(--color-border)_inset]"
					: "border-l-0 border-r-0 md:border border-border"
			}`}
			onClick={onClick}
			onKeyUp={onClick}
		>
			{isActive && (
				<div className="absolute top-0 left-0 w-full h-0.5 bg-[var(--color-border)]">
					<div
						className="h-full bg-foreground transition-all duration-100 ease-linear"
						style={{ width: `${progress}%` }}
					/>
				</div>
			)}

			<div className="self-stretch flex justify-center flex-col text-foreground text-sm md:text-sm font-semibold leading-6 md:leading-6 font-sans">
				{title}
			</div>
			<div className="self-stretch text-muted-foreground text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px] font-sans">
				{description}
			</div>
		</div>
	);
}
