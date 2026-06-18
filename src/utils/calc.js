// Pesos de laboratorio (en %). Suman 100.
export const STD_LAB_WEIGHTS = [10, 10, 10, 10, 10, 10, 10, 30]   // cursos 1-6
export const SPECIAL_LAB_WEIGHTS = [12, 12, 12, 12, 13, 13, 13, 13] // curso 7

export const LAB_FINAL_WEIGHT = 0.7
export const THEORY_FINAL_WEIGHT = 0.3
export const MAX_GRADE = 20

// Convierte "" o null a 0; recorta a [0, 20].
function clean(v) {
  const n = Number(v)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.min(n, MAX_GRADE)
}

// Promedio de laboratorio: suma ponderada por pesos en %.
export function labAverage(labs, weights) {
  return labs.reduce((acc, g, i) => acc + clean(g) * (weights[i] / 100), 0)
}

// Promedio de teoría: media simple de los 3 exámenes.
export function theoryAverage(exams) {
  if (!exams.length) return 0
  return exams.reduce((acc, g) => acc + clean(g), 0) / exams.length
}

// Promedio final: lab 70% + teoría 30%.
export function finalAverage(lab, theory) {
  return lab * LAB_FINAL_WEIGHT + theory * THEORY_FINAL_WEIGHT
}

// Redondea a 2 decimales para mostrar.
export function round2(n) {
  return Math.round(n * 100) / 100
}
