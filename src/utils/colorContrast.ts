/**
 * Determines if white or black text should be used based on background HEX color
 * @param hexColor - The background color in #RRGGBB format
 * @returns '#FFFFFF' or '#000000'
 */
export const getContrastColor = (hexColor: string): '#FFFFFF' | '#000000' => {
  // Remove the hash if it exists
  const hex = hexColor.replace('#', '')

  // Convert hex to RGB components
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Calculate relative luminance using WCAG formula
  // The weights represent how sensitive the human eye is to each color
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  // 128 is the middle point. Over 128 is "light", under is "dark"
  return yiq >= 128 ? '#000000' : '#FFFFFF'
}
