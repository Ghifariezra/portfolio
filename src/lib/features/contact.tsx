import { useForm } from '@tanstack/react-form'
import {
    CheckCircle,
    EnvelopeSimple,
    GithubLogo,
    LinkedinLogo,
    PaperPlaneTilt,
    Spinner,
    TwitterLogo,
    Warning,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { z } from 'zod'

// ─── Schema ───────────────────────────────────────────────────────────────────

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactForm = z.infer<typeof contactSchema>

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldLabel({
    htmlFor,
    children,
    optional,
}: {
    htmlFor: string
    children: React.ReactNode
    optional?: boolean
}) {
    return (
        <label
            htmlFor={htmlFor}
            className="flex items-center justify-between font-mono text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground"
        >
            <span>{children}</span>
            {optional && (
                <span className="font-mono text-[10px] normal-case tracking-normal text-muted-foreground font-normal">
                    (Optional)
                </span>
            )}
        </label>
    )
}

function FieldError({ message }: { message: string }) {
    return (
        <span className="flex items-center gap-1.5 font-sans text-[12px] text-destructive">
            <Warning size={12} />
            {message}
        </span>
    )
}

function inputClass(hasError: boolean) {
    return [
        'w-full bg-background border rounded px-4 py-3',
        'font-sans text-sm text-foreground placeholder:text-muted-foreground/50',
        'focus:outline-none focus:ring-1 transition-colors duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        hasError
            ? 'border-destructive focus:border-destructive focus:ring-destructive'
            : 'border-border focus:border-primary focus:ring-primary',
    ].join(' ')
}

// ─── Success State ────────────────────────────────────────────────────────────

function SuccessMessage() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="w-14 h-14 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center">
                <CheckCircle size={28} className="text-primary" weight="fill" />
            </div>
            <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                    Message Sent
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-xs">
                    Thanks for reaching out. I'll review your message and get back to you
                    within 24–48 hours.
                </p>
            </div>
            <div className="font-mono text-[11px] text-muted-foreground tracking-wider mt-2">
                <span className="text-primary">{'>'}</span> Transmission received.
            </div>
        </div>
    )
}

// ─── Contact Links ────────────────────────────────────────────────────────────

const LINKS = [
    {
        label: 'GitHub',
        href: 'https://github.com/Ghifariezra',
        icon: <GithubLogo size={16} />,
    },
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/ghifariezraramadhan',
        icon: <LinkedinLogo size={16} />,
    },
    {
        label: 'Twitter',
        href: 'https://twitter.com/ezdev',
        icon: <TwitterLogo size={16} />,
    },
    {
        label: 'Email',
        href: 'mailto:ghifariezraramadhan@gmail.com',
        icon: <EnvelopeSimple size={16} />,
    },
]

// ─── Main Component ───────────────────────────────────────────────────────────

export function RouteComponent() {
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            message: '',
        } as ContactForm, // Cast defaultValues to your inferred Zod type
        validators: {
            onChange: contactSchema, // Often better to use onChange for real-time validation, or keep onSubmit
        },
        onSubmit: async () => {
            setLoading(true)
            // Simulate API call — replace with real endpoint later
            await new Promise((resolve) => setTimeout(resolve, 1200))
            setLoading(false)
            setSubmitted(true)
        },
    })

    return (
        <main className="grow relative w-full">
            {/* Subtle grid background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundSize: '40px 40px',
                    backgroundImage: `
						linear-gradient(to right, color-mix(in srgb, var(--color-border) 30%, transparent) 1px, transparent 1px),
						linear-gradient(to bottom, color-mix(in srgb, var(--color-border) 30%, transparent) 1px, transparent 1px)
					`,
                }}
            />

            <div className="relative z-10 flex flex-col items-center justify-center px-6 py-20 min-h-[calc(100vh-4rem)]">
                {/* Header */}
                <header className="text-center max-w-xl mx-auto mb-14">
                    <p className="font-mono text-[11px] text-muted-foreground tracking-[0.15em] uppercase mb-4">
                        — Let's Connect
                    </p>
                    <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
                        Get in Touch
                    </h1>
                    <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                        Open to new opportunities, project collaborations, and technical
                        discussions. Fill out the form or reach out directly.
                    </p>

                    {/* Direct links */}
                    <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
                        {LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded font-mono text-[11px] text-muted-foreground hover:text-primary hover:border-primary transition-colors tracking-wider uppercase"
                            >
                                {link.icon}
                                {link.label}
                            </a>
                        ))}
                    </div>
                </header>

                {/* Form Card */}
                <section className="w-full max-w-lg">
                    <div className="bg-card border border-border rounded-lg p-8 md:p-10">
                        {submitted ? (
                            <SuccessMessage />
                        ) : (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    form.handleSubmit()
                                }}
                                noValidate
                                className="flex flex-col gap-5"
                            >
                                {/* Name */}
                                <form.Field
                                    name="name"
                                    validators={{ onBlur: z.string().min(2, 'Name must be at least 2 characters') }}
                                >
                                    {(field) => (
                                        <div className="flex flex-col gap-1.5">
                                            <FieldLabel htmlFor="name">Name</FieldLabel>
                                            <input
                                                id="name"
                                                type="text"
                                                placeholder="Jane Doe"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                className={inputClass(field.state.meta.errors.length > 0)}
                                                disabled={loading}
                                            />
                                            {field.state.meta.isTouched &&
                                                field.state.meta.errors.length > 0 && (
                                                    <FieldError message={String(field.state.meta.errors[0])} />
                                                )}
                                        </div>
                                    )}
                                </form.Field>

                                {/* Email */}
                                <form.Field
                                    name="email"
                                        validators={{ onBlur: z.string().email('Invalid email address') }}
                                >
                                    {(field) => (
                                        <div className="flex flex-col gap-1.5">
                                            <FieldLabel htmlFor="email">Email</FieldLabel>
                                            <input
                                                id="email"
                                                type="email"
                                                placeholder="jane@example.com"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                className={inputClass(field.state.meta.errors.length > 0)}
                                                disabled={loading}
                                            />
                                            {field.state.meta.isTouched &&
                                                field.state.meta.errors.length > 0 && (
                                                    <FieldError message={String(field.state.meta.errors[0])} />
                                                )}
                                        </div>
                                    )}
                                </form.Field>

                                {/* Phone (optional) */}
                                <form.Field name="phone">
                                    {(field) => (
                                        <div className="flex flex-col gap-1.5">
                                            <FieldLabel htmlFor="phone" optional>
                                                Phone Number
                                            </FieldLabel>
                                            <input
                                                id="phone"
                                                type="tel"
                                                placeholder="+62 812-3456-7890"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                className={inputClass(false)}
                                                disabled={loading}
                                            />
                                        </div>
                                    )}
                                </form.Field>

                                {/* Message */}
                                <form.Field
                                    name="message"
                                    validators={{
                                        onBlur: z.string().min(10, 'Message must be at least 10 characters'),
                                    }}
                                >
                                    {(field) => (
                                        <div className="flex flex-col gap-1.5">
                                            <FieldLabel htmlFor="message">Message</FieldLabel>
                                            <textarea
                                                id="message"
                                                rows={5}
                                                placeholder="Detail your project requirements or inquiry here..."
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                className={`${inputClass(field.state.meta.errors.length > 0)} resize-y`}
                                                disabled={loading}
                                            />
                                            {field.state.meta.isTouched &&
                                                field.state.meta.errors.length > 0 && (
                                                    <FieldError message={String(field.state.meta.errors[0])} />
                                                )}
                                        </div>
                                    )}
                                </form.Field>

                                {/* Footer */}
                                <div className="pt-4 border-t border-border flex items-center justify-between gap-4 mt-1">
                                    <p className="font-mono text-[11px] text-muted-foreground hidden md:block">
                                        <span className="text-primary">{'>'}</span> Awaiting
                                        transmission...
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-[11px] font-semibold tracking-widest uppercase py-3 px-8 rounded hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner size={14} className="animate-spin" />
                                                <span>Processing</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Message</span>
                                                <PaperPlaneTilt size={14} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}