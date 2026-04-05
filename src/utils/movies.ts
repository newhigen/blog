import fs from 'node:fs'
import path from 'node:path'

export interface Movie {
  title: string
  year: number
  month: number
}

export interface HeatmapCell {
  year: number
  month: number
  count: number
  movies: Movie[]
}

export interface YearGroup {
  year: number
  movies: Movie[]
  total: number
}

function parseCSV(csv: string): Movie[] {
  const [, ...rows] = csv.trim().split('\n')
  return rows
    .filter((line) => line.trim())
    .map((line) => {
      const cols = line.split(',')
      const title = (cols[0] ?? '').replace(/^"|"$/g, '').trim()
      const year = parseInt(cols[1] ?? '', 10)
      const month = parseInt(cols[2] ?? '', 10)
      return { title, year, month }
    })
    .filter((m) => m.title && m.year && m.month)
}

export function loadMovies(): Movie[] {
  const csvPath = path.resolve('./src/data/movies.csv')
  const csv = fs.readFileSync(csvPath, 'utf-8')
  return parseCSV(csv).sort((a, b) => b.year - a.year || b.month - a.month || a.title.localeCompare(b.title))
}

export function getHeatmapData(movies: Movie[]): { cells: Map<string, HeatmapCell>; years: number[] } {
  const cells = new Map<string, HeatmapCell>()
  const yearSet = new Set<number>()

  for (const movie of movies) {
    yearSet.add(movie.year)
    const key = `${movie.year}-${String(movie.month).padStart(2, '0')}`
    const existing = cells.get(key)
    if (existing) {
      existing.count++
      existing.movies.push(movie)
    } else {
      cells.set(key, { year: movie.year, month: movie.month, count: 1, movies: [movie] })
    }
  }

  const currentYear = new Date().getFullYear()
  const minYear = Math.min(...yearSet, currentYear)
  const years: number[] = []
  for (let y = currentYear; y >= minYear; y--) years.push(y)

  return { cells, years }
}

export function getMoviesByYear(movies: Movie[]): YearGroup[] {
  const map = new Map<number, Movie[]>()
  for (const movie of movies) {
    const list = map.get(movie.year) ?? []
    list.push(movie)
    map.set(movie.year, list)
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, movies]) => ({
      year,
      movies: movies.sort((a, b) => b.month - a.month || a.title.localeCompare(b.title)),
      total: movies.length
    }))
}

export function intensityLevel(count: number): number {
  return Math.min(count, 5)
}
