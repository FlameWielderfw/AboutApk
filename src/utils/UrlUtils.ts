const staticImageUrl = (uri: string) => {
  return `${import.meta.env.VITE_APP_API_URL}${uri}`
}

const UrlUtils = {
  staticImageUrl: staticImageUrl
}

export default UrlUtils
