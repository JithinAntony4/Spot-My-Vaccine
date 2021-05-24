// log the pageview with their URL
export const pageview = (url) => {
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
        page_path: url,
    })
}

/*ga.event({
      action: "search",
      params : {
        search_term: query
      }
    })*/
// log specific events happening.
export const event = ({action, params}) => {
    window.gtag('event', action, params)
}
