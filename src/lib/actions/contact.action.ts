import { useMutation } from "@tanstack/react-query";
import type { ContactForm } from "@/lib/schemas/contact.schema";
import { contactService } from "@/lib/services/contact.service";
import type { AppResponse } from "@/utils/middleware";

export const contactKeys = {
	all: ["contact"] as const,
	messages: () => [...contactKeys.all, "messages"] as const,
};

export const contactActions = {
	useSendMessage() {
		return useMutation<AppResponse, AppResponse, ContactForm>({
			mutationFn: (payload: ContactForm) => contactService.sendMessage(payload),
		});
	},
};
