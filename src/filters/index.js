import Numeral from 'numeral'

export { 
  million, 
  formatFileSize, 
  formatDate, 
  salesFormat
} from '@/utils'

// 价格显示
export const formatPrice = (price = 0) => {
  return Numeral(price).format('0,0.00')
}

export const formatTextEllipsis = (text, num) => {
  if (text) {
    const ellipsis = text.length > num ? '...' : ''
    return text.slice(0, num) + ellipsis
  }
}
