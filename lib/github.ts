import "server-only"

const GITHUB_GRAPHQL_URL =
  "https://api.github.com/graphql"

const GITHUB_REST_URL =
  "https://api.github.com"

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type GitHubContributionDay = {
  date: string
  contributionCount: number
  color: string
  contributionLevel: string
  weekday: number
}

export type GitHubContributionWeek = {
  firstDay: string
  contributionDays: GitHubContributionDay[]
}

export type GitHubMonth = {
  name: string
  firstDay: string
  totalWeeks: number
  year: number
}

export type GitHubDayRepository = {
  name: string
  owner: string
  url: string
  description: string | null
  stars: number
  language: string | null
  languageColor: string | null
  commits: number
  issues: number
  pullRequests: number
}

/**
 * Real public GitHub repository.
 */
export type GitHubRepository = {
  name: string
  description: string | null
  url: string
  homepageUrl: string | null
  stars: number
  forks: number
  language: string | null
  languageColor: string | null
  topics: string[]
  createdAt: string
  updatedAt: string
  isFork: boolean
  isArchived: boolean
}

/**
 * File/folder inside a GitHub repository.
 */
export type GitHubRepositoryFile = {
  name: string
  path: string
  type: "file" | "directory"
  size: number
  url: string
  htmlUrl: string
}

/**
 * Detailed repository information used by /work/[slug].
 */
export type GitHubRepositoryDetails =
  GitHubRepository & {
    owner: string
    defaultBranch: string
    readme: string | null
    files: GitHubRepositoryFile[]
    languages: Array<{
      name: string
      bytes: number
    }>
  }

export type GitHubData = {
  username: string
  totalContributions: number
  weeks: GitHubContributionWeek[]
  months: GitHubMonth[]
  colors: string[]
  repositories: number
  followers: number
  dayRepositories: Record<
    string,
    GitHubDayRepository[]
  >
}

/* -------------------------------------------------------------------------- */
/* GraphQL repository types                                                   */
/* -------------------------------------------------------------------------- */

type RepositoryNode = {
  name: string
  description: string | null
  url: string
  homepageUrl: string | null
  stargazerCount: number
  forkCount: number
  isFork: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string

  primaryLanguage: {
    name: string
    color: string
  } | null

  repositoryTopics: {
    nodes: Array<{
      topic: {
        name: string
      }
    }>
  }
}

/* -------------------------------------------------------------------------- */
/* GraphQL query                                                              */
/* -------------------------------------------------------------------------- */

const QUERY = `
query GetGitHubData($username: String!) {
  user(login: $username) {
    login

    followers {
      totalCount
    }

    repositories(
      first: 1
      privacy: PUBLIC
      ownerAffiliations: OWNER
    ) {
      totalCount
    }

    publicRepositories: repositories(
      first: 50
      privacy: PUBLIC
      ownerAffiliations: OWNER
      orderBy: {
        field: UPDATED_AT
        direction: DESC
      }
    ) {
      nodes {
        name
        description
        url
        homepageUrl
        stargazerCount
        forkCount
        isFork
        isArchived
        createdAt
        updatedAt

        primaryLanguage {
          name
          color
        }

        repositoryTopics(first: 10) {
          nodes {
            topic {
              name
            }
          }
        }
      }
    }

    contributionsCollection {
      contributionCalendar {
        totalContributions
        colors

        months {
          name
          firstDay
          totalWeeks
          year
        }

        weeks {
          firstDay

          contributionDays {
            date
            contributionCount
            contributionLevel
            color
            weekday
          }
        }
      }

      commitContributionsByRepository(
        maxRepositories: 100
      ) {
        repository {
          name

          owner {
            login
          }

          url
          description
          stargazerCount

          primaryLanguage {
            name
            color
          }
        }

        contributions(first: 100) {
          nodes {
            occurredAt
            commitCount
          }
        }
      }

      issueContributionsByRepository(
        maxRepositories: 100
      ) {
        repository {
          name

          owner {
            login
          }

          url
          description
          stargazerCount

          primaryLanguage {
            name
            color
          }
        }

        contributions(first: 100) {
          nodes {
            occurredAt
          }
        }
      }

      pullRequestContributionsByRepository(
        maxRepositories: 100
      ) {
        repository {
          name

          owner {
            login
          }

          url
          description
          stargazerCount

          primaryLanguage {
            name
            color
          }
        }

        contributions(first: 100) {
          nodes {
            occurredAt
          }
        }
      }
    }
  }
}
`

/* -------------------------------------------------------------------------- */
/* GraphQL response                                                           */
/* -------------------------------------------------------------------------- */

type GraphQLResponse = {
  data?: {
    user?: {
      login: string

      followers: {
        totalCount: number
      }

      repositories: {
        totalCount: number
      }

      publicRepositories: {
        nodes: RepositoryNode[]
      }

      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number
          colors: string[]
          months: GitHubMonth[]
          weeks: GitHubContributionWeek[]
        }

        commitContributionsByRepository: Array<{
          repository: {
            name: string

            owner: {
              login: string
            }

            url: string
            description: string | null
            stargazerCount: number

            primaryLanguage: {
              name: string
              color: string
            } | null
          }

          contributions: {
            nodes: Array<{
              occurredAt: string
              commitCount: number
            }>
          }
        }>

        issueContributionsByRepository: Array<{
          repository: {
            name: string

            owner: {
              login: string
            }

            url: string
            description: string | null
            stargazerCount: number

            primaryLanguage: {
              name: string
              color: string
            } | null
          }

          contributions: {
            nodes: Array<{
              occurredAt: string
            }>
          }
        }>

        pullRequestContributionsByRepository: Array<{
          repository: {
            name: string

            owner: {
              login: string
            }

            url: string
            description: string | null
            stargazerCount: number

            primaryLanguage: {
              name: string
              color: string
            } | null
          }

          contributions: {
            nodes: Array<{
              occurredAt: string
            }>
          }
        }>
      }
    }
  }

  errors?: Array<{
    message: string
  }>
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function dateKey(date: string) {
  return date.slice(0, 10)
}

function getGitHubCredentials() {
  const username =
    process.env.GITHUB_USERNAME

  const token =
    process.env.GITHUB_TOKEN

  if (!username) {
    throw new Error(
      "Missing GITHUB_USERNAME",
    )
  }

  if (!token) {
    throw new Error(
      "Missing GITHUB_TOKEN",
    )
  }

  return {
    username,
    token,
  }
}

/* -------------------------------------------------------------------------- */
/* GraphQL request                                                            */
/* -------------------------------------------------------------------------- */

async function getGitHubDataFromApi() {
  const { username, token } =
    getGitHubCredentials()

  const response = await fetch(
    GITHUB_GRAPHQL_URL,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify({
        query: QUERY,

        variables: {
          username,
        },
      }),

      next: {
        revalidate: 300,
      },
    },
  )

  if (!response.ok) {
    throw new Error(
      `GitHub API request failed: ${response.status} ${response.statusText}`,
    )
  }

  const json =
    (await response.json()) as GraphQLResponse

  if (json.errors?.length) {
    throw new Error(
      json.errors
        .map((error) => error.message)
        .join(", "),
    )
  }

  const user = json.data?.user

  if (!user) {
    throw new Error(
      `GitHub user "${username}" was not found`,
    )
  }

  return user
}

/* -------------------------------------------------------------------------- */
/* REST request                                                               */
/* -------------------------------------------------------------------------- */

async function githubRestFetch<T>(
  path: string,
): Promise<T> {
  const { token } =
    getGitHubCredentials()

  const response = await fetch(
    `${GITHUB_REST_URL}${path}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept:
          "application/vnd.github+json",
        "X-GitHub-Api-Version":
          "2022-11-28",
      },

      next: {
        revalidate: 300,
      },
    },
  )

  if (!response.ok) {
    throw new Error(
      `GitHub REST API request failed: ${response.status} ${response.statusText}`,
    )
  }

  return response.json() as Promise<T>
}

/* -------------------------------------------------------------------------- */
/* Contributions                                                              */
/* -------------------------------------------------------------------------- */

export async function getGitHubContributions(): Promise<GitHubData> {
  const user =
    await getGitHubDataFromApi()

  const calendar =
    user.contributionsCollection
      .contributionCalendar

  const dayRepositories: Record<
    string,
    GitHubDayRepository[]
  > = {}

  function addRepositoryActivity(
    repository: {
      name: string

      owner: {
        login: string
      }

      url: string
      description: string | null
      stargazerCount: number

      primaryLanguage: {
        name: string
        color: string
      } | null
    },

    date: string,

    type:
      | "commits"
      | "issues"
      | "pullRequests",

    amount = 1,
  ) {
    const key = dateKey(date)

    if (!dayRepositories[key]) {
      dayRepositories[key] = []
    }

    let existing =
      dayRepositories[key].find(
        (item) =>
          item.owner ===
            repository.owner.login &&
          item.name === repository.name,
      )

    if (!existing) {
      existing = {
        name: repository.name,

        owner:
          repository.owner.login,

        url: repository.url,

        description:
          repository.description,

        stars:
          repository.stargazerCount,

        language:
          repository.primaryLanguage
            ?.name ?? null,

        languageColor:
          repository.primaryLanguage
            ?.color ?? null,

        commits: 0,
        issues: 0,
        pullRequests: 0,
      }

      dayRepositories[key].push(
        existing,
      )
    }

    existing[type] += amount
  }

  const collection =
    user.contributionsCollection

  for (const item of
    collection.commitContributionsByRepository) {
    for (const contribution of
      item.contributions.nodes) {
      addRepositoryActivity(
        item.repository,

        contribution.occurredAt,

        "commits",

        contribution.commitCount,
      )
    }
  }

  for (const item of
    collection.issueContributionsByRepository) {
    for (const contribution of
      item.contributions.nodes) {
      addRepositoryActivity(
        item.repository,

        contribution.occurredAt,

        "issues",
      )
    }
  }

  for (const item of
    collection.pullRequestContributionsByRepository) {
    for (const contribution of
      item.contributions.nodes) {
      addRepositoryActivity(
        item.repository,

        contribution.occurredAt,

        "pullRequests",
      )
    }
  }

  return {
    username: user.login,

    totalContributions:
      calendar.totalContributions,

    weeks: calendar.weeks,

    months: calendar.months,

    colors: calendar.colors,

    repositories:
      user.repositories.totalCount,

    followers:
      user.followers.totalCount,

    dayRepositories,
  }
}

/* -------------------------------------------------------------------------- */
/* Repository list                                                            */
/* -------------------------------------------------------------------------- */

export async function getGitHubRepositories(): Promise<
  GitHubRepository[]
> {
  const user =
    await getGitHubDataFromApi()

  return user.publicRepositories.nodes
    .filter((repository) => {
      return (
        !repository.isFork &&
        !repository.isArchived
      )
    })

    .map((repository) => ({
      name: repository.name,

      description:
        repository.description,

      url: repository.url,

      homepageUrl:
        repository.homepageUrl,

      stars:
        repository.stargazerCount,

      forks:
        repository.forkCount,

      language:
        repository.primaryLanguage
          ?.name ?? null,

      languageColor:
        repository.primaryLanguage
          ?.color ?? null,

      topics:
        repository.repositoryTopics.nodes.map(
          ({ topic }) => topic.name,
        ),

      createdAt:
        repository.createdAt,

      updatedAt:
        repository.updatedAt,

      isFork:
        repository.isFork,

      isArchived:
        repository.isArchived,
    }))
}

/* -------------------------------------------------------------------------- */
/* Repository details                                                         */
/* -------------------------------------------------------------------------- */

export async function getGitHubRepositoryDetails(
  repositoryName: string,
): Promise<GitHubRepositoryDetails | null> {
  const { username } =
    getGitHubCredentials()

  const repositories =
    await getGitHubRepositories()

  const repository =
    repositories.find(
      (item) =>
        item.name === repositoryName,
    )

  if (!repository) {
    return null
  }

  const encodedUsername =
    encodeURIComponent(username)

  const encodedRepository =
    encodeURIComponent(repositoryName)

  /* ------------------------------------------------------------------------ */
  /* Repository metadata                                                      */
  /* ------------------------------------------------------------------------ */

  const repositoryApi =
    await githubRestFetch<{
      owner: {
        login: string
      }

      default_branch: string
    }>(
      `/repos/${encodedUsername}/${encodedRepository}`,
    )

  /* ------------------------------------------------------------------------ */
  /* Repository tree                                                          */
  /* ------------------------------------------------------------------------ */

  const tree =
    await githubRestFetch<{
      tree: Array<{
        path: string
        mode: string
        type: string
        size?: number
        url: string
      }>

      truncated: boolean
    }>(
      `/repos/${encodedUsername}/${encodedRepository}/git/trees/${encodeURIComponent(
        repositoryApi.default_branch,
      )}?recursive=1`,
    )

  /* ------------------------------------------------------------------------ */
  /* README                                                                   */
  /* ------------------------------------------------------------------------ */

  let readme: string | null = null

  try {
    const readmeResponse =
      await githubRestFetch<{
        content: string
        encoding: string
      }>(
        `/repos/${encodedUsername}/${encodedRepository}/readme`,
      )

    if (
      readmeResponse.encoding ===
      "base64"
    ) {
      readme = Buffer.from(
        readmeResponse.content.replace(
          /\n/g,
          "",
        ),
        "base64",
      ).toString("utf-8")
    }
  } catch {
    readme = null
  }

  /* ------------------------------------------------------------------------ */
  /* Languages                                                                */
  /* ------------------------------------------------------------------------ */

  const languages =
    await githubRestFetch<
      Record<string, number>
    >(
      `/repos/${encodedUsername}/${encodedRepository}/languages`,
    )

  /* ------------------------------------------------------------------------ */
  /* Return                                                                   */
  /* ------------------------------------------------------------------------ */

  return {
    ...repository,

    owner:
      repositoryApi.owner.login,

    defaultBranch:
      repositoryApi.default_branch,

    readme,

    files: tree.tree
      .filter(
        (file) =>
          file.type === "blob" ||
          file.type === "tree",
      )

      .slice(0, 100)

      .map((file) => ({
        name:
          file.path
            .split("/")
            .pop() ?? file.path,

        path: file.path,

        type:
          file.type === "tree"
            ? "directory"
            : "file",

        size:
          file.size ?? 0,

        url: file.url,

        htmlUrl:
          `https://github.com/${username}/${repositoryName}/blob/${repositoryApi.default_branch}/${file.path}`,
      })),

    languages:
      Object.entries(languages).map(
        ([name, bytes]) => ({
          name,
          bytes,
        }),
      ),
  }
}