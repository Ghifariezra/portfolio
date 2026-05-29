import {
	EnvelopeSimple,
	GithubLogo,
	LinkedinLogo,
	// TwitterLogo,
} from "@phosphor-icons/react";

export const CONTACT_LINKS = [
	{
		label: "GitHub",
		href: "https://github.com/Ghifariezra",
		icon: <GithubLogo size={16} />,
	},
	{
		label: "LinkedIn",
		href: "https://www.linkedin.com/in/ghifariezraramadhan",
		icon: <LinkedinLogo size={16} />,
	},
	// {
	// 	label: "Twitter",
	// 	href: "https://twitter.com/ezdev",
	// 	icon: <TwitterLogo size={16} />,
	// },
	{
		label: "Email",
		href: "mailto:ghifariezraramadhan@gmail.com",
		icon: <EnvelopeSimple size={16} />,
	},
];

export function ContactLinks() {
	return (
		<div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
			{CONTACT_LINKS.map((link) => (
				<a
					key={link.label}
					href={link.href}
					target={link.href.startsWith("mailto") ? undefined : "_blank"}
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded font-mono text-[11px] text-muted-foreground hover:text-primary hover:border-primary transition-colors tracking-wider uppercase"
				>
					{link.icon}
					{link.label}
				</a>
			))}
		</div>
	);
}
