
const staticImageUrl = (uri) => {
  return `${import.meta.env.VITE_APP_API_URL}${uri}`
}

const UrlUtils = {
  staticImageUrl: staticImageUrl
}
export default UrlUtils