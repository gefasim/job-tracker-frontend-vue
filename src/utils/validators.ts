// 8 characters, 1 number, 1 upper, 1 lower
export const checkPasswordStrength = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[0-9]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password)
  )
}
