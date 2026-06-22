<script setup>
import { reactive, computed } from "vue";
import CourseCard from "./components/CourseCard.vue";
import {
  STD_LAB_WEIGHTS,
  SPECIAL_LAB_WEIGHTS,
  labAverage,
  theoryAverage,
  finalAverage,
  round2,
} from "./utils/calc.js";

function makeCourse(name, weights) {
  return {
    name,
    weights,
    hasTheory: true,
    labs: Array(8).fill(""),
    exams: Array(3).fill(""),
  };
}

// 6 cursos estándar + 1 especial (curso 7).
const courses = reactive([
  ...Array.from({ length: 6 }, (_, i) =>
    makeCourse(`Curso ${i + 1}`, STD_LAB_WEIGHTS),
  ),
  makeCourse("Curso 7 (especial)", SPECIAL_LAB_WEIGHTS),
]);

// Promedio final de cada curso, para el promedio general.
const finals = computed(() =>
  courses.map((c) => {
    const lab = labAverage(c.labs, c.weights);
    // Sin teoría: el final es 100% laboratorio.
    return c.hasTheory ? finalAverage(lab, theoryAverage(c.exams)) : lab;
  }),
);

const general = computed(() => {
  if (!finals.value.length) return 0;
  return finals.value.reduce((a, b) => a + b, 0) / finals.value.length;
});

function resetAll() {
  courses.forEach((c) => {
    c.labs = Array(8).fill("");
    c.exams = Array(3).fill("");
  });
}
</script>

<template>
  <div class="app">
    <header class="top">
      <div>
        <h1>Promedios TECSUP</h1>
        <p>Simulador de promedios — 7 cursos · notas base 20</p>
      </div>
      <div class="general">
        <span>Promedio general</span>
        <strong>{{ round2(general) }}</strong>
        <button class="reset" @click="resetAll">Limpiar todo</button>
      </div>
    </header>

    <main class="courses">
      <CourseCard v-for="(c, i) in courses" :key="i" :course="c" />
    </main>
    <footer class="footer">
      <p class="footer__name">Huber Lope</p>
      <p class="footer__sub">Simulador de promedios TECSUP</p>
      <p class="footer__copy">© {{ new Date().getFullYear() }} Todos los derechos reservados</p>
    </footer>
  </div>
</template>
