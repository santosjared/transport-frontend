// ** Returns initials from string
export const getInitials = (string: string) =>
  string.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '')

export const getThreeDigits = (string:string)=>{
  return string.substring(0, 3);
}