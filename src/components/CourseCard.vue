<script setup>
import { computed } from "vue";
import {
  labAverage,
  theoryAverage,
  finalAverage,
  round2,
  MAX_GRADE,
} from "../utils/calc.js";

const props = defineProps({
  course: { type: Object, required: true }, // { name, labs[], exams[], weights[] }
});

const lab = computed(() => labAverage(props.course.labs, props.course.weights));
const theory = computed(() => theoryAverage(props.course.exams));
// Sin teoría: el final es 100% laboratorio.
const final = computed(() =>
  props.course.hasTheory ? finalAverage(lab.value, theory.value) : lab.value,
);
const passed = computed(() => final.value >= 12.5);

// Estado del curso: pendiente cuando no hay notas, aprobado/desaprobado si las hay.
const hasInput = computed(
  () =>
    props.course.labs.some((g) => g > 0) ||
    props.course.exams.some((g) => g > 0),
);
const status = computed(() =>
  !hasInput.value ? "pending" : passed.value ? "pass" : "fail",
);
const statusLabel = computed(
  () =>
    ({ pending: "Pendiente", pass: "Aprobado", fail: "Desaprobado" })[
      status.value
    ],
);
</script>

<template>
  <section class="card" :class="`card--${status}`">
    <header class="card__head">
      <input class="card__name" v-model="course.name" />
      <label class="toggle">
        <input type="checkbox" v-model="course.hasTheory" />
        <span>Con teoría</span>
      </label>
    </header>

    <div class="grid" :class="{ 'grid--solo': !course.hasTheory }">
      <!-- Laboratorio -->
      <div class="block">
        <h3>
          Laboratorio
          <small>({{ course.hasTheory ? "70%" : "100%" }} del final)</small>
        </h3>
        <div class="labs">
          <label v-for="(g, i) in course.labs" :key="i" class="field">
            <span
              >Lab {{ i + 1 }} <em>{{ course.weights[i] }}%</em></span
            >
            <input
              type="number"
              min="0"
              :max="MAX_GRADE"
              step="0.1"
              v-model.number="course.labs[i]"
              placeholder="0"
            />
          </label>
        </div>
        <p class="sub">
          Promedio lab: <b>{{ round2(lab) }}</b>
        </p>
      </div>

      <!-- Teoría -->
      <div class="block" v-if="course.hasTheory">
        <h3>Teoría <small>(30% del final)</small></h3>
        <div class="labs">
          <label v-for="(g, i) in course.exams" :key="i" class="field">
            <span>Examen {{ i + 1 }}</span>
            <input
              type="number"
              min="0"
              :max="MAX_GRADE"
              step="0.1"
              v-model.number="course.exams[i]"
              placeholder="0"
            />
          </label>
        </div>
        <p class="sub">
          Promedio teoría: <b>{{ round2(theory) }}</b>
        </p>
      </div>
    </div>

    <footer class="card__final">
      <span class="card__final-label">Promedio final</span>
      <span class="card__final-value">
        <span class="badge" :class="`badge--${status}`">{{ statusLabel }}</span>
        <strong :class="`grade grade--${status}`">{{ round2(final) }}</strong>
      </span>
    </footer>
  </section>
</template>
