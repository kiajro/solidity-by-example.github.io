import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { CRYPTO_JOBS_LIST_URL } from "../config"
import SEO from "../components/SEO"
import SearchBar from "../components/SearchBar"
import CryptoJobsList from "../components/svg/CryptoJobsList"
import useDebounce from "../hooks/useDebounce"
import { search, unique } from "../lib/search"
import styles from "./index.module.css"
import youTube from "../components/youtube.png"
import { ROUTES, ROUTES_BY_CATEGORY, TRANSLATIONS } from "../nav"

const UPDATES = [
  "2024/05/15 - GitHub PR by FarrukhTahir5",
  "2024/05/14 - GitHub PR by open-dev-top",
  "2024/04/19 - EVM memory",
  "2024/04/07 - Fix WETH permit hack",
]

export default function HomePage() {
  const [query, setQuery] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchResults, setSearchResults] = useState<{
    [key: string]: boolean
  } | null>(null)

  useEffect(() => {
    const q = searchParams.get("q")
    if (q != null && q.length > 0) {
      setQuery(q)
      _search(q, false)
    }
  }, [])

  function _search(query: string, save: boolean) {
    const q = query.trim()

    if (q.length == 0) {
      setSearchResults(null)
      if (save) {
        setSearchParams({ q: "" })
      }
      return
    }

    const words = unique(q.split(" "))
    const pages: { [key: string]: boolean } = {}

    for (const word of words) {
      const res = search(word)
      for (const page of res) {
        pages[page] = true
      }
    }

    setSearchResults(pages)
    if (save) {
      setSearchParams({ q })
    }
  }

  const _searchWithDelay = useDebounce((query: string) => _search(query, true), 500, [])

  function onChangeSearchQuery(query: string) {
    setQuery(query)
    _searchWithDelay(query)
  }

  function renderLinks() {
    if (searchResults) {
      if (Object.keys(searchResults).length == 0) {
        return <div>No results</div>
      }

      return (
        <ul className={styles.list}>
          {ROUTES.filter(({ path }) => searchResults[path]).map(({ path, title }) => (
            <li className={styles.listItem} key={path}>
              <a href={path}>{title}</a>
            </li>
          ))}
        </ul>
      )
    }

    return (
      <>
        {ROUTES_BY_CATEGORY.map(({ routes, title }, i) => (
          <div key={i}>
            {title && <h3 className={styles.category}>{title}</h3>}

            <ul className={styles.list}>
              {routes.map(({ path, title }) => (
                <li className={styles.listItem} key={path}>
                  <a href={path}>{title}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className={styles.category}>Translations</h3>
          {TRANSLATIONS.map(({ lang, url }) => (
            <li className={styles.listItem} key={url}>
              <a href={url} target="__blank">
                {lang}
              </a>
            </li>
          ))}
        </div>
      </>
    )
  }

  return (
    <div className={styles.component}>
      <SEO
        title="Solidity by Example | 0.8.24"
        description="Learn smart contract programming using Solidity"
      />
      <h1 className={styles.header}>
        <a href="/">Solidity by Example</a>
      </h1>
      <div className={styles.subHeader}>v 0.8.24</div>
      <div className={styles.main}>
        <p>
          Introduction to <a href="https://solidity.readthedocs.io">Solidity</a> with
          simple examples
        </p>

        <div className={styles.youTube}>
          <img src={youTube} alt="logo" className={styles.youTubeLogo} />
          <a href="https://www.youtube.com/@smartcontractprogrammer" target="__blank">
            Most code are explained here
          </a>
        </div>

        <div className={styles.cryptoJobsList}>
          <CryptoJobsList size={24} className={styles.cryptoJobsListLogo} />
          <a href={CRYPTO_JOBS_LIST_URL} target="__blank">
            Looking for Solidity jobs?
          </a>
        </div>

        <div className={styles.updates}>
          {UPDATES.map((text, i) => (
            <div key={i}>{text}</div>
          ))}
        </div>

        <div className={styles.search}>
          <SearchBar value={query} onChange={onChangeSearchQuery} />
        </div>

        {renderLinks()}
      </div>
    </div>
  )
}
