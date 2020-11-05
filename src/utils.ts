import { extname, basename } from 'path'

export function type (file: string, ext: string): string {
  return ext !== '' ? extname(basename(file, ext)) : extname(file)
}