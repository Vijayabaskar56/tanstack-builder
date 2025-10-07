import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { FrownIcon } from "../ui/frown";
import { FormElementsDropdown } from "./form-elements-dropdown";

type NoFieldPlaceholderProps = {
	title?: string;
	description?: string;
	showbutton?: boolean;
};

const NoFieldPlaceholder = ({
	title = "No Form Elements Yet",
	description = "You haven't added any form elements yet. Get started by creating your first form element.",
	showbutton = true,
}: NoFieldPlaceholderProps) => {
	return (
		<div className="h-full py-10 px-3">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<FrownIcon size={40} />
					</EmptyMedia>
					<EmptyTitle>{title}</EmptyTitle>
					<EmptyDescription>{description}</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					{showbutton && (
						<div className="flex gap-2">
							<FormElementsDropdown />
						</div>
					)}
				</EmptyContent>
			</Empty>
		</div>
	);
};

export default NoFieldPlaceholder;
