import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { notes } from '@/data/notes'
export function generateStaticParams(){return notes.map((note)=>({slug:note.slug}))}
export default async function NotePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params; const note=notes.find((item)=>item.slug===slug); if(!note) notFound(); return <main className="detail-shell note-detail"><Link className="back-link" href="/#notes"><ArrowLeft /> Back to Notes</Link><p className="eyebrow">{note.date} / {note.readingTime}</p><h1 className="detail-title">{note.title}</h1><p className="detail-lead">A short field note from building products and interfaces.</p><article className="detail-copy"><p>{note.body}</p><p>Writing is a way to make decisions visible. These notes collect the small patterns, trade-offs and observations that keep shaping my work.</p></article></main>}
