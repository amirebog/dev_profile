import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { StackSection } from '@/components/stack-section'

export default function StackPage() {
  return <><Navbar /><main className="page-shell"><Link className="back-link" href="/"><ArrowLeft /> Back home</Link><StackSection /></main></>
}
