"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  File,
  Folder,
  Home,
} from "lucide-react"
import type { GitHubRepositoryFile } from "@/lib/github"

type Props = {
  files: GitHubRepositoryFile[]
  repositoryUrl: string
  branch: string
}

type BrowserItem = {
  name: string
  path: string
  type: "file" | "directory"
  size: number
  htmlUrl: string
}

function formatSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function GitHubFileBrowser({
  files,
  repositoryUrl,
  branch,
}: Props) {
  const [currentPath, setCurrentPath] = useState("")

  const currentItems = useMemo(() => {
    const prefix = currentPath
      ? `${currentPath}/`
      : ""

    const items = new Map<string, BrowserItem>()

    for (const file of files) {
      if (!file.path.startsWith(prefix)) continue

      const remaining = file.path.slice(prefix.length)

      if (!remaining) continue

      const slashIndex = remaining.indexOf("/")

      /*
       * Example:
       *
       * currentPath = ""
       * file.path = "app/api/portfolio/route.ts"
       *
       * remaining = "app/api/portfolio/route.ts"
       * first item = "app"
       *
       * So we only show "app" here.
       */

      if (slashIndex === -1) {
        items.set(remaining, {
          name: remaining,
          path: file.path,
          type: "file",
          size: file.size,
          htmlUrl: file.htmlUrl,
        })
        continue
      }

      const directoryName = remaining.slice(0, slashIndex)
      const directoryPath = `${prefix}${directoryName}`

      if (!items.has(directoryName)) {
        items.set(directoryName, {
          name: directoryName,
          path: directoryPath,
          type: "directory",
          size: 0,
          htmlUrl: `${repositoryUrl}/tree/${branch}/${directoryPath}`,
        })
      }
    }

    return Array.from(items.values()).sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "directory" ? -1 : 1
      }

      return a.name.localeCompare(b.name)
    })
  }, [files, currentPath, repositoryUrl, branch])

  const breadcrumbs = currentPath
    ? currentPath.split("/")
    : []

  function openDirectory(path: string) {
    setCurrentPath(path)
  }

  function goBack() {
    if (!currentPath) return

    const parts = currentPath.split("/")

    parts.pop()

    setCurrentPath(parts.join("/"))
  }

  function goHome() {
    setCurrentPath("")
  }

  return (
    <div className="github-files">
      {/* Header */}
      <div className="github-files-header">
        <div className="github-path">
          <button
            type="button"
            className="github-path-home"
            onClick={goHome}
            aria-label="Repository root"
          >
            <Home size={14} />
          </button>

          {breadcrumbs.map((part, index) => {
            const path = breadcrumbs
              .slice(0, index + 1)
              .join("/")

            const isLast =
              index === breadcrumbs.length - 1

            return (
              <div
                key={path}
                className="github-breadcrumb-item"
              >
                <ChevronRight size={13} />

                {isLast ? (
                  <span>{part}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentPath(path)}
                  >
                    {part}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <span>Size</span>
      </div>

      {/* Back */}
      {currentPath && (
        <button
          type="button"
          className="github-directory github-parent"
          onClick={goBack}
        >
          <div className="github-file-main">
            <ArrowLeft className="github-file-icon" />

            <span className="github-file-name">
              ..
            </span>
          </div>

          <div />
        </button>
      )}

      {/* Files */}
      {currentItems.length === 0 ? (
        <div className="github-empty">
          This directory is empty.
        </div>
      ) : (
        currentItems.map((item) => {
          if (item.type === "directory") {
            return (
              <button
                type="button"
                key={item.path}
                className="github-directory"
                onClick={() =>
                  openDirectory(item.path)
                }
              >
                <div className="github-file-main">
                  <Folder className="github-file-icon" />

                  <span className="github-file-name">
                    {item.name}
                  </span>

                  <ChevronRight className="github-file-arrow" />
                </div>

                <div className="github-file-size">
                  —
                </div>
              </button>
            )
          }

          return (
            <a
              key={item.path}
              href={item.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="github-file"
            >
              <div className="github-file-main">
                <File className="github-file-icon" />

                <span className="github-file-name">
                  {item.name}
                </span>
              </div>

              <div className="github-file-size">
                {formatSize(item.size)}
              </div>
            </a>
          )
        })
      )}
    </div>
  )
}