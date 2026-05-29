import { memo } from "react";
import { ArrowLeft, Spinner, CalendarBlank, Clock, Tag } from "@phosphor-icons/react";
import { publicActions } from "@/lib/actions/public.action";
import { Link, getRouteApi } from "@tanstack/react-router";
import { Reader } from "@/components/shared/reader";

// Mengambil API dari route yang sesuai untuk mengekstrak parameter URL
const routeApi = getRouteApi('/notes/$slug');

export const RouteComponent = memo(function RouteComponent() {
    // 1. Ambil parameter slug dari URL
    const { slug } = routeApi.useParams();

    // 2. Fetch data menggunakan action React Query yang sudah dibuat
    const { data: response, isLoading, isError } = publicActions.useGetNoteBySlug(slug);
    const note = response?.data;

    // --- LOADING STATE ---
    if (isLoading) {
        return (
            <div className="flex min-h-[70vh] w-full items-center justify-center flex-col gap-4">
                <Spinner size={40} className="animate-spin text-primary" weight="bold" />
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
                    Loading Note...
                </p>
            </div>
        );
    }

    // --- ERROR / NOT FOUND STATE ---
    if (isError || !note) {
        return (
            <div className="flex min-h-[70vh] w-full items-center justify-center flex-col gap-6">
                <div className="border-4 border-foreground p-8 rounded-xl bg-card shadow-brutal text-center">
                    <p className="font-heading text-3xl font-bold text-foreground mb-2">Note Not Found</p>
                    <p className="font-sans text-muted-foreground mb-6">The article you are looking for does not exist or has been archived.</p>
                    <Link
                        to="/notes"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-mono text-xs font-bold tracking-widest uppercase hover:-translate-y-1 transition-transform border-2 border-foreground shadow-brutal-sm dark:shadow-none"
                    >
                        <ArrowLeft size={16} weight="bold" />
                        Return to all notes
                    </Link>
                </div>
            </div>
        );
    }

    // --- FORMAT DATA ---
    const date = new Date(note.published_at || note.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const primaryCategory = note.type_language || (note.tags && note.tags.length > 0 ? note.tags[0].name : "General");
    const textContent = note.content || note.description || "";
    const wordCount = textContent.trim().split(/\s+/).length;
    const readingTimeMins = Math.max(1, Math.ceil(wordCount / 200));

    // --- RENDER COMPONENT ---
    return (
        <article className="grow w-full max-w-3xl mx-auto px-6 py-20 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Navigasi Kembali */}
            <Link
                to="/notes"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-mono text-[11px] font-bold uppercase tracking-widest mb-10 transition-colors w-fit px-3 py-1.5 border-2 border-transparent hover:border-foreground rounded-md hover:bg-card hover:shadow-brutal-sm dark:hover:shadow-none"
            >
                <ArrowLeft size={16} weight="bold" />
                Back to Notes
            </Link>

            {/* Header Artikel */}
            <header className="mb-10 pb-10 border-b-2 border-border">
                <div className="mb-6 flex flex-wrap items-center gap-4">
                    <span className="inline-block bg-primary text-primary-foreground font-mono text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded shadow-brutal-sm dark:shadow-none border-2 border-primary">
                        {primaryCategory}
                    </span>
                    <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px] tracking-wider font-bold uppercase">
                        <CalendarBlank size={14} weight="bold" />
                        <time dateTime={note.published_at || note.created_at}>{date}</time>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px] tracking-wider font-bold uppercase">
                        <Clock size={14} weight="bold" />
                        <span>{readingTimeMins} min read</span>
                    </div>
                </div>

                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6">
                    {note.title}
                </h1>

                {note.description && (
                    <p className="font-sans text-xl text-muted-foreground leading-relaxed border-l-4 border-primary pl-4 bg-muted/30 py-3 rounded-r-md">
                        {note.description}
                    </p>
                )}
            </header>

            {/* Gambar Utama (Jika ada) */}
            {note.image && (
                <figure className="w-full mb-12 rounded-xl border-4 border-border overflow-hidden shadow-brutal dark:shadow-none bg-muted">
                    <img
                        src={note.image}
                        alt={note.title}
                        className="w-full h-auto object-cover max-h-125"
                    />
                </figure>
            )}

            {/* Konten Artikel */}
            <div className="font-sans text-foreground/90">
                {note.content ? (
                    <Reader content={note.content} />
                ) : (
                    <p className="italic text-muted-foreground font-mono bg-muted p-4 rounded-md border border-border">
                        Content is empty.
                    </p>
                )}
            </div>

            {/* Footer Artikel (Tags) */}
            <footer className="pt-8 border-t-2 border-border flex flex-wrap gap-2 items-center">
                <Tag size={20} weight="bold" className="text-muted-foreground mr-2" />
                {note.tags && note.tags.length > 0 ? (
                    note.tags.map(tag => (
                        <span key={tag.id} className="font-mono text-[10px] font-bold uppercase tracking-wider text-foreground bg-muted px-3 py-1.5 rounded border-2 border-border shadow-sm hover:-translate-y-0.5 transition-transform">
                            {tag.name}
                        </span>
                    ))
                ) : (
                    <span className="font-mono text-xs text-muted-foreground uppercase font-bold tracking-widest">No tags attached</span>
                )}
            </footer>
        </article>
    );
});