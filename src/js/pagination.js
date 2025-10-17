import InfiniteScroll from 'infinite-scroll'

(function (document) {
  const FEED_BATCH = 4

  const feedElement = document.querySelector('.js-feed-entry')
  if (!feedElement) return

  const loadMoreButton = document.querySelector('.load-more-btn')
  if (!loadMoreButton) return

  const nextElement = document.querySelector('link[rel=next]')

  let visibleCount = FEED_BATCH
  let isLoadingNextPage = false
  let reachedEnd = false

  const hiddenClass = 'is-hidden-by-feed-limit'

  const getStories = () => Array.prototype.slice.call(feedElement.querySelectorAll('.js-story'))

  const applyVisibility = () => {
    const stories = getStories()
    stories.forEach((story, index) => {
      if (index < visibleCount) {
        story.classList.remove(hiddenClass)
        story.removeAttribute('hidden')
      } else {
        story.classList.add(hiddenClass)
        story.setAttribute('hidden', 'hidden')
      }
    })
    updateButtonState()
  }

  const updateButtonState = () => {
    const stories = getStories()
    const hasHiddenStories = stories.length > visibleCount
    const canLoadMorePages = !!infScroll && !reachedEnd

    if (hasHiddenStories || canLoadMorePages) {
      loadMoreButton.classList.remove('hidden')
      loadMoreButton.disabled = isLoadingNextPage
      loadMoreButton.classList.toggle('is-loading', isLoadingNextPage)
    } else {
      loadMoreButton.classList.add('hidden')
      loadMoreButton.disabled = false
      loadMoreButton.classList.remove('is-loading')
    }
  }

  const revealStories = () => {
    const stories = getStories()
    if (visibleCount >= stories.length) return false

    visibleCount = Math.min(visibleCount + FEED_BATCH, stories.length)
    applyVisibility()
    return true
  }

  const startLoading = () => {
    isLoadingNextPage = true
    loadMoreButton.disabled = true
    loadMoreButton.classList.add('is-loading')
  }

  const finishLoading = () => {
    isLoadingNextPage = false
    loadMoreButton.disabled = false
    loadMoreButton.classList.remove('is-loading')
    updateButtonState()
  }

  let infScroll
  if (nextElement) {
    infScroll = new InfiniteScroll(feedElement, {
      append: '.js-story',
      history: false,
      debug: false,
      hideNav: '.pagination',
      path: '.pagination .older-posts',
      loadOnScroll: false
    })

    infScroll.on('append', () => {
      applyVisibility()
      finishLoading()
    })

    infScroll.on('last', () => {
      reachedEnd = true
      updateButtonState()
    })

    infScroll.on('error', finishLoading)
  }

  loadMoreButton.addEventListener('click', () => {
    if (isLoadingNextPage) return

    const revealed = revealStories()
    if (revealed) return

    if (infScroll && !reachedEnd) {
      startLoading()
      infScroll.loadNextPage()
    }
  })

  // initialize
  visibleCount = Math.min(FEED_BATCH, getStories().length)
  applyVisibility()
})(document)
