import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

/**
 * 
 * @param str An aws s3 object key
 * @returns A trimmed string with just file name from str param
 */
export function extractRightOfSlash(str: string) {
  const slashIndex = str.lastIndexOf("/");
  if (slashIndex !== -1) {
    return str.substring(slashIndex + 1);
  }
  return str;
}
/**
 * returns bytes into KB/MB
 */
export function formatFileSize(bytes: number) {
  if (bytes >= 1000000) {
    return (bytes / 1000000).toFixed(2) + ' MB';
  } else if (bytes >= 1000) {
    return (bytes / 1000).toFixed(2) + ' KB';
  } else if (bytes > 1) {
    return bytes + ' bytes';
  } else if (bytes == 1) {
    return bytes + ' byte';
  } else {
    return '0 bytes';
  }
}
