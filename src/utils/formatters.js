// export const interceptorLoadingElements = (calling) => {
//   const elements = document.querySelectorAll('.interceptor-loading')
//   for (let i = 0; i < elements.length; i++) {
//     if (calling) {
//       elements[i].style.opacity = '0.5'
//       elements[i].style.pointerEvents = 'none'
//     } else {
//       elements[i].style.opacity = 'initial'
//       elements[i].style.pointerEvents = 'initial'
//     }
//   }
// }

export const interceptorLoadingElements = (calling) => {
  const elements = document.querySelectorAll('.interceptor-loading')

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i]

    if (calling) {
      // Ngăn người dùng tương tác
      el.style.opacity = '0.5'
      el.style.pointerEvents = 'none'

      // Lưu nội dung gốc nếu chưa có
      if (!el.dataset.originalContent) {
        el.dataset.originalContent = el.innerHTML
      }

      // Gắn spinner loading
      el.innerHTML = `
        <div style="
          width: 24px;
          height: 24px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: rgba(0,0,0,0.6);
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        "></div>
        <style>
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      `

    } else {
      // Khôi phục tương tác
      el.style.opacity = 'initial'
      el.style.pointerEvents = 'initial'

      // Khôi phục nội dung gốc
      if (el.dataset.originalContent) {
        el.innerHTML = el.dataset.originalContent
        delete el.dataset.originalContent
      }
    }
  }
}

export const slugify = (val) => {
  if (!val) return ''
  return String(val)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replaceAll('đ', 'd')
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove consecutive hyphens
}

export const formatPercentage = (minFixed, maxFixed, numerator, denominator) => {
  if (denominator === 0) return '0'
  let fixed = minFixed
  let rawPercent = (numerator / denominator) * 100
  let percent = rawPercent.toFixed(fixed)
  while (!(Number(percent) > 0) && fixed <= maxFixed) {
    fixed += 1
    percent = rawPercent.toFixed(fixed)
  }

  return Number(percent)
}
