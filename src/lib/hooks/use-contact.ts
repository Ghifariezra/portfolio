import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import { contactActions } from "@/lib/actions/contact.action";
import { type ContactForm, contactSchema } from "@/lib/schemas/contact.schema";

export function useContact() {
	const [submitted, setSubmitted] = useState(false);

	// Gunakan action mutation dari React Query
	const sendMessageMutation = contactActions.useSendMessage();

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			message: "",
		} as ContactForm,
		validators: {
			// Evaluasi real-time yang aman dan type-safe
			onChange: ({ value }) => {
				const result = contactSchema.safeParse(value);
				if (!result.success) {
					return result.error.issues[0]?.message;
				}
				return undefined;
			},
		},
		onSubmit: async ({ value }) => {
			try {
				// 1. Zod akan mencuci (sanitize) dan memvalidasi tipe data
				const cleanData = contactSchema.parse(value);

				// 2. Data yang masuk mutation dijamin bersih dan sesuai tipe ContactForm
				await sendMessageMutation.mutateAsync(cleanData);

				setSubmitted(true);
				toast.success("Message sent successfully!");

				form.reset();
				setTimeout(() => setSubmitted(false), 5000);
			} catch (error) {
				// 3. Type-casting aman untuk format error dari backend Hono AppResponse
				const err = error as { error?: string };
				toast.error(err?.error || "Failed to send message. Please try again.");
			}
		},
	});

	return {
		form,
		submitted,
		loading: sendMessageMutation.isPending,
		error: sendMessageMutation.isError ? sendMessageMutation.error : null,
	};
}
