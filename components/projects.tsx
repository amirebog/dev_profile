import { getGitHubRepositories } from "@/lib/github"
import { ProjectsClient } from "./projects-client"

export async function Projects() {
  const projects = await getGitHubRepositories()

  return <ProjectsClient projects={projects} />
}