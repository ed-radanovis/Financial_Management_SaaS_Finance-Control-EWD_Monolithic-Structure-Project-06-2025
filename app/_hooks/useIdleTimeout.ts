"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

const idleTimeout = 15 * 60 * 1000;
const warningBeforeTimeout = 15000;
const dialogDuration = 13000;

export const useIdleTimeout = () => {
	const { signOut, session } = useClerk();
	const router = useRouter();
	const [showIdleDialog, setShowIdleDialog] = useState(false);

	useEffect(() => {
		// apply timer when user is authenticated
		if (!session) {
			return;
		}

		let idleTimer: NodeJS.Timeout;
		let warningTimer: NodeJS.Timeout;
		let dialogTimer: NodeJS.Timeout;

		// reset inactivity timer
		const resetIdleTimer = () => {
			clearTimeout(idleTimer);
			clearTimeout(warningTimer);
			clearTimeout(dialogTimer);
			setShowIdleDialog(false);

			// dialogue timer
			warningTimer = setTimeout(() => {
				setShowIdleDialog(true);

				// display timer and redirect
				dialogTimer = setTimeout(() => {
					setShowIdleDialog(false);
					signOut(() => router.push("/login?reason=idle-timeout"));
				}, dialogDuration);
			}, idleTimeout - warningBeforeTimeout);

			// ensure logout ends
			idleTimer = setTimeout(() => {
				setShowIdleDialog(false);
				signOut(() => router.push("/login?reason=idle-timeout"));
			}, idleTimeout);
		};

		const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

		events.forEach((event) => window.addEventListener(event, resetIdleTimer));

		resetIdleTimer();

		// cleanup
		return () => {
			clearTimeout(idleTimer);
			clearTimeout(warningTimer);
			clearTimeout(dialogTimer);
			events.forEach((event) => window.removeEventListener(event, resetIdleTimer));
		};
	}, [signOut, router, session]);

	return { showIdleDialog, setShowIdleDialog };
};
