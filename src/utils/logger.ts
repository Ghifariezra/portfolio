const isDev = import.meta.env.DEV;

export const logger = {
	debug: (...args: unknown[]) => {
		if (isDev) {
			console.log("%c[DEBUG]", "color: #a855f7; font-weight: bold;", ...args);
		}
	},

	info: (...args: unknown[]) => {
		if (isDev) {
			console.info("%c[INFO]", "color: #3b82f6; font-weight: bold;", ...args);
		}
	},

	warn: (...args: unknown[]) => {
		if (isDev) {
			console.warn("%c[WARN]", "color: #f59e0b; font-weight: bold;", ...args);
		}
	},

	error: (...args: unknown[]) => {
		// Error biasanya tetap ingin kita tangkap meskipun di production
		if (isDev) {
			console.error("%c[ERROR]", "color: #ef4444; font-weight: bold;", ...args);
		} else {
			// TODO: Di production, kamu bisa kirim error ini ke Sentry / layanan tracking lainnya
			// sendErrorToTrackingService(args);
		}
	},
};
