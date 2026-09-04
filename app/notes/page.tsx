import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Notes } from '@/components/notes'

export default function NotesPage() {
  return <><Navbar /><main className="page-shell"><Link className="back-link" href="/"><ArrowLeft /> Back home</Link><Notes /></main></>
}
