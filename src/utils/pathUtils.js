export const replaceLastSegment = (baseUrl, newLastSegment) => {
  const pathSegments = baseUrl.split('/')
  pathSegments[pathSegments.length - 1] = newLastSegment
  const newPath = pathSegments.join('/')
  return newPath
}