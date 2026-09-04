export type Note = { slug: string; date: string; title: string; readingTime: string; body: string }
export const notes: Note[] = [
{ slug: 'developer-experiences', date: '2026.08.24', title: 'Designing better developer experiences', readingTime: '5 min read', body: 'Good developer experiences reduce the distance between intention and a useful result. The best interfaces make the next action feel obvious without becoming noisy.' },
{ slug: 'typescript-large-projects', date: '2026.08.12', title: 'Why I prefer TypeScript for large projects', readingTime: '4 min read', body: 'Types are not ceremony. Used well, they are a shared map for teams working on systems that need to change safely.' },
{ slug: 'scalable-monorepos', date: '2026.07.29', title: 'Building scalable monorepos', readingTime: '7 min read', body: 'A monorepo is a collaboration boundary as much as it is a repository. Conventions and ownership matter more than the folder structure.' }
]
