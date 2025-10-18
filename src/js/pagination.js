import InfiniteScroll from 'infinite-scroll'

(function (document) {
  // Next link Element
  const nextElement = document.querySelector('link[rel=next]')
  if (!nextElement) return

  // Post Feed element
  const $feedElement = document.querySelector('.js-feed-entry')
  if (!$feedElement) return

  const $viewMoreButton = document.querySelector('.load-more-btn')

  const infScroll = new InfiniteScroll($feedElement, {
    append: '.js-story',
    button: $viewMoreButton || undefined,
    history: false,
    debug: false,
    hideNav: '.pagination',
    path: '.pagination .older-posts',
    scrollThreshold: false
  })

  if ($viewMoreButton) {
    $viewMoreButton.classList.remove('hidden')
    $viewMoreButton.classList.add('flex')
    $viewMoreButton.disabled = false

    infScroll.on('request', function () {
      $viewMoreButton.disabled = true
      $viewMoreButton.setAttribute('aria-busy', 'true')
    })

    infScroll.on('append', function () {
      $viewMoreButton.disabled = false
      $viewMoreButton.setAttribute('aria-busy', 'false')
    })

    infScroll.on('error', function () {
      $viewMoreButton.disabled = false
      $viewMoreButton.setAttribute('aria-busy', 'false')
    })

    infScroll.on('last', function () {
      $viewMoreButton.classList.add('hidden')
      $viewMoreButton.classList.remove('flex')
      $viewMoreButton.setAttribute('aria-busy', 'false')
    })
  }
})(document)
