import InfiniteScroll from 'infinite-scroll'

(function (document) {
  const feedElement = document.querySelector('.js-feed-entry')
  if (!feedElement) return

  const nextElement = document.querySelector('link[rel=next]')
  if (!nextElement) return

  const viewMoreButton = document.querySelector('.load-more-btn')
  if (!viewMoreButton) return

  const setBusyState = (isBusy) => {
    viewMoreButton.setAttribute('aria-busy', isBusy ? 'true' : 'false')
    viewMoreButton.disabled = !!isBusy
  }

  viewMoreButton.classList.remove('hidden')
  viewMoreButton.classList.add('flex')

  const infScroll = new InfiniteScroll(feedElement, {
    append: '.js-story',
    button: viewMoreButton,
    history: false,
    debug: false,
    hideNav: '.pagination',
    path: '.pagination .older-posts',
    scrollThreshold: false
  })

  viewMoreButton.addEventListener('click', function (event) {
    event.preventDefault()
    setBusyState(true)
    infScroll.loadNextPage()
  })

  infScroll.on('append', function () {
    setBusyState(false)
  })

  infScroll.on('last', function () {
    setBusyState(false)
    viewMoreButton.classList.add('hidden')
  })

  infScroll.on('error', function () {
    setBusyState(false)
  })
})(document)
