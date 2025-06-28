"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/app/_lib/utils";

const Progress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
		customColor?: string;
	}
>(({ className, value, customColor, ...props }, ref) => (
	<ProgressPrimitive.Root
		ref={ref}
		className={cn(
			"relative h-4 w-full overflow-hidden rounded-full bg-white bg-opacity-[8%]",
			className,
		)}
		{...props}
	>
		<ProgressPrimitive.Indicator
			className="h-full w-full flex-1 transition-all"
			style={{
				background: customColor
					? customColor
					: "linear-gradient(to bottom, #55b02ed8, #55b02e7f, #55b02e33)",
				transform: `translateX(-${100 - (value || 0)}%)`,
			}}
		/>
	</ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
