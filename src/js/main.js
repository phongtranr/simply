/* global followSocialMedia menuDropdown localStorage */

// lib
import 'lazysizes'

// import loadScript from './util/load-script'
import urlRegexp from './util/url-regular-expression'
import docSelectorAll from './util/document-query-selector-all'

const simplySetup = () => {
  const rootEl = document.documentElement
  const documentBody = document.body

  /* Menu DropDown
  /* ---------------------------------------------------------- */
  const dropDownMenu = () => {
    // Checking if the variable exists and if it is an object
    if (typeof menuDropdown !== 'object' || menuDropdown === null) return

    // check if the box for the menu exists
    const $dropdownMenu = document.querySelector('.js-dropdown-menu')
    if (!$dropdownMenu) return

    Object.entries(menuDropdown).forEach(([name, url]) => {
      if (name !== 'string' && !urlRegexp(url)) return

      const link = document.createElement('a')
      link.href = url
      link.classList = 'dropdown-item block py-2 leading-tight px-5 hover:text-primary'
      link.innerText = name

      $dropdownMenu.appendChild(link)
    })
  }

  dropDownMenu()

  /* Social Media
  /* ---------------------------------------------------------- */
  const socialMedia = () => {
    // Checking if the variable exists and if it is an object
    if (typeof followSocialMedia !== 'object' || followSocialMedia === null) return

    // check if the box for the menu exists
    const $socialMedia = docSelectorAll('.js-social-media')
    if (!$socialMedia.length) return

    const linkElement = element => {
      Object.entries(followSocialMedia).forEach(([name, urlTitle]) => {
        const url = urlTitle[0]

        // The url is being validated if it is false it returns
        if (!urlRegexp(url)) return

        const link = document.createElement('a')
        link.href = url
        link.title = urlTitle[1]
        link.classList = 'p-2 inline-block hover:opacity-70'
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        link.innerHTML = `<svg class="icon"><use xlink:href="#icon-${name}"></use></svg>`

        element.appendChild(link)
      })
    }

    $socialMedia.forEach(linkElement)
  }

  socialMedia()

  /*  Toggle modal
  /* ---------------------------------------------------------- */
  /*const simplyModal = () => {
    const $modals = docSelectorAll('.js-modal')
    const $modalButtons = docSelectorAll('.js-modal-button')
    const $modalCloses = docSelectorAll('.js-modal-close')

    // Modal Click Open
    if (!$modalButtons.length) return
    $modalButtons.forEach($el => $el.addEventListener('click', () => openModal($el.dataset.target)))

    // Modal Click Close
    if (!$modalCloses.length) return
    $modalCloses.forEach(el => el.addEventListener('click', () => closeModals()))

    const openModal = target => {
      documentBody.classList.remove('has-menu')
      const $target = document.getElementById(target)
      rootEl.classList.add('overflow-hidden')
      $target.classList.add('is-active')
    }

    const closeModals = () => {
      rootEl.classList.remove('overflow-hidden')
      $modals.forEach($el => $el.classList.remove('is-active'))
    }

    document.addEventListener('keydown', function (event) {
      const e = event || window.event
      if (e.keyCode === 27) {
        closeModals()
        // closeDropdowns()
      }
    })
  }

  simplyModal()
  */

  /* Header Transparency
  /* ---------------------------------------------------------- */
  const headerTransparency = () => {
    const hasCover = documentBody.closest('.has-cover')
    const $jsHeader = document.querySelector('.js-header')

    window.addEventListener('scroll', () => {
      const lastScrollY = window.scrollY

      if (lastScrollY > 5) {
        $jsHeader.classList.add('shadow-header', 'header-bg')
      } else {
        $jsHeader.classList.remove('shadow-header', 'header-bg')
      }

      if (!hasCover) return

      lastScrollY >= 20 ? documentBody.classList.remove('is-head-transparent') : documentBody.classList.add('is-head-transparent')
    }, { passive: true })
  }

  headerTransparency()

  /* Dark Mode
  /* ---------------------------------------------------------- */
  const darkMode = () => {
    const $toggleDarkMode = docSelectorAll('.js-dark-mode')

    if (!$toggleDarkMode.length) return

    $toggleDarkMode.forEach(item => item.addEventListener('click', function (event) {
      event.preventDefault()

      if (!rootEl.classList.contains('dark')) {
        rootEl.classList.add('dark')
        localStorage.theme = 'dark'
      } else {
        rootEl.classList.remove('dark')
        localStorage.theme = 'light'
      }
    }))
  }

  darkMode()

  /* Load more posts
  /* ---------------------------------------------------------- */
  const setupLoadMoreFeeds = () => {
    const wrappers = docSelectorAll('[data-load-more]')
    if (!wrappers.length) return

    const resolveUrl = url => {
      if (!url) return null

      try {
        return new URL(url, window.location.href).href
      } catch (error) {
        return null
      }
    }

    const updateHeadNextLink = href => {
      const existing = document.querySelector('head link[rel="next"]')

      if (href) {
        if (existing) {
          existing.setAttribute('href', href)
        } else {
          const nextLink = document.createElement('link')
          nextLink.rel = 'next'
          nextLink.href = href
          document.head.appendChild(nextLink)
        }
      } else if (existing) {
        existing.parentNode.removeChild(existing)
      }
    }

    const hideArticle = article => {
      article.classList.add('hidden')
      article.setAttribute('aria-hidden', 'true')
    }

    const showArticle = article => {
      article.classList.remove('hidden')
      article.removeAttribute('aria-hidden')
    }

    wrappers.forEach(wrapper => {
      const feed = wrapper.querySelector('.js-feed-entry')
      const button = wrapper.querySelector('.js-load-more')
      const paginationNav = wrapper.querySelector('.pagination')

      if (!feed || !button) return

      const batchSize = 4
      let nextPageUrl = null
      let isLoading = false

      const setInitialNextUrl = () => {
        const headNext = document.querySelector('link[rel="next"]')
        if (headNext) {
          nextPageUrl = resolveUrl(headNext.getAttribute('href'))
          return
        }

        if (!paginationNav) return

        const olderPostsLink = paginationNav.querySelector('.older-posts')
        nextPageUrl = resolveUrl(olderPostsLink ? olderPostsLink.getAttribute('href') : null)
      }

      const hideExtraPosts = () => {
        const articles = docSelectorAll('.js-story', feed)

        articles.forEach((article, index) => {
          if (index < batchSize) {
            showArticle(article)
          } else {
            hideArticle(article)
          }
        })
      }

      const revealHiddenArticles = count => {
        const hiddenArticles = feed.querySelectorAll('.js-story.hidden')
        let revealed = 0

        hiddenArticles.forEach(article => {
          if (revealed >= count) return

          showArticle(article)
          revealed += 1
        })

        return revealed
      }

      const fetchNextPage = async () => {
        if (!nextPageUrl) return []

        try {
          const response = await window.fetch(nextPageUrl, { credentials: 'same-origin' })
          if (!response.ok) throw new Error(response.statusText)

          const html = await response.text()
          const parser = new window.DOMParser()
          const doc = parser.parseFromString(html, 'text/html')
          const newFeed = doc.querySelector('.js-feed-entry')

          if (!newFeed) {
            nextPageUrl = null
            updateHeadNextLink(null)
            return []
          }

          const fragment = document.createDocumentFragment()
          const articles = newFeed.querySelectorAll('.js-story')

          articles.forEach(article => {
            hideArticle(article)
            fragment.appendChild(article)
          })

          feed.appendChild(fragment)

          const nextLink = doc.querySelector('link[rel="next"]')
          const olderPosts = doc.querySelector('.pagination .older-posts')
          const newNextUrl = resolveUrl(nextLink ? nextLink.getAttribute('href') : olderPosts ? olderPosts.getAttribute('href') : null)

          nextPageUrl = newNextUrl
          updateHeadNextLink(newNextUrl)

          return articles
        } catch (error) {
          nextPageUrl = null
          updateHeadNextLink(null)
          return []
        }
      }

      const syncPaginationVisibility = hasMore => {
        if (!paginationNav) return

        if (hasMore) {
          paginationNav.classList.add('hidden')
        } else {
          paginationNav.classList.remove('hidden')
        }
      }

      const updateButtonVisibility = () => {
        const hiddenArticle = feed.querySelector('.js-story.hidden')
        const hasMore = Boolean(hiddenArticle || nextPageUrl)

        if (hasMore) {
          button.classList.remove('hidden')
        } else {
          button.classList.add('hidden')
        }

        syncPaginationVisibility(hasMore)
      }

      const loadMore = async () => {
        if (isLoading) return

        isLoading = true
        button.disabled = true
        button.setAttribute('aria-busy', 'true')

        let revealed = revealHiddenArticles(batchSize)

        while (revealed < batchSize && nextPageUrl) {
          const appendedArticles = await fetchNextPage()
          if (!appendedArticles.length) break

          revealed += revealHiddenArticles(batchSize - revealed)
        }

        updateButtonVisibility()

        button.disabled = false
        button.removeAttribute('aria-busy')
        isLoading = false
      }

      const init = () => {
        setInitialNextUrl()
        hideExtraPosts()
        updateButtonVisibility()

        button.addEventListener('click', loadMore)
      }

      init()
    })
  }

  setupLoadMoreFeeds()

  /* DropDown Toggle
  /* ---------------------------------------------------------- */
  const dropDownMenuToggle = () => {
    const dropdowns = docSelectorAll('.dropdown:not(.is-hoverable)')

    if (!dropdowns.length) return

    dropdowns.forEach(function (el) {
      el.addEventListener('click', function (event) {
        event.stopPropagation()
        el.classList.toggle('is-active')
        documentBody.classList.remove('has-menu')
      })
    })

    const closeDropdowns = () => dropdowns.forEach(function (el) {
      el.classList.remove('is-active')
    })

    document.addEventListener('click', closeDropdowns)
  }

  dropDownMenuToggle()

  /* Toggle Menu
  /* ---------------------------------------------------------- */
  document.querySelector('.js-menu-toggle').addEventListener('click', function (e) {
    e.preventDefault()
    documentBody.classList.toggle('has-menu')
  })
}

document.addEventListener('DOMContentLoaded', simplySetup)
