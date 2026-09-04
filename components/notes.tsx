import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { notes } from '@/data/notes'
export function Notes(){return <section id="notes" className="section notes-section" aria-labelledby="notes-title"><div className="section-heading"><span>06 / Notes</span></div><h2 id="notes-title">Things I&apos;ve been thinking about.</h2><div className="notes-list">{notes.map((note)=><Link className="note-row" href={`/notes/${note.slug}`} key={note.slug}><div><strong>{note.title}</strong><span>{note.date} · {note.readingTime}</span></div><ArrowUpRight /></Link>)}</div></section>}
