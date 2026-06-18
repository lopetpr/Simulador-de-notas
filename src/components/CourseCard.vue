<script setup>
import { computed } from 'vue'
import {
  labAverage,
  theoryAverage,
  finalAverage,
  round2,
  MAX_GRADE,
} from '../utils/calc.js'

const props = defineProps({
  course: { type: Object, required: true }, // { name, labs[], exams[], weights[] }
})

const lab = computed(() => labAverage(props.course.labs, props.course.weights))
const theory = computed(() => theoryAverage(props.course.exams))
// Sin teoría: el final es 100% laboratorio.
const final = computed(() =>
  props.course.hasTheory ? finalAverage(lab.value, theory.value) : lab.value
)
const passed = computed(() => final.value >= 11)
</script>

<template>
  <section class="card">
    <header class="card__head">
      <input class="card__name" v-model="course.name" />
      <label class="toggle">
        <input type="checkbox" v-model="course.hasTheory" />
        <span>Con teoría</span>
      </label>
      <span class="badge" :class="passed ? 'badge--ok' : 'badge--no'">
        {{ passed ? 'Aprobado' : 'Desaprobado' }}
      </span>
    </header>

    <div class="grid" :class="{ 'grid--solo': !course.hasTheory }">
      <!-- Laboratorio -->
      <div class="block">
        <h3>Laboratorio <small>({{ course.hasTheory ? '70%' : '100%' }} del final)</small></h3>
        <div class="labs">
          <label v-for="(g, i) in course.labs" :key="i" class="field">
            <span>Lab {{ i + 1 }} <em>{{ course.weights[i] }}%</em></span>
            <input
              type="number" min="0" :max="MAX_GRADE" step="0.1"
              v-model.number="course.labs[i]"
              placeholder="0"
            />
          </label>
        </div>
        <p class="sub">Promedio lab: <b>{{ round2(lab) }}</b></p>
      </div>

      <!-- Teoría -->
      <div class="block" v-if="course.hasTheory">
        <h3>Teoría <small>(30% del final)</small></h3>
        <div class="labs">
          <label v-for="(g, i) in course.exams" :key="i" class="field">
            <span>Examen {{ i + 1 }}</span>
            <input
              type="number" min="0" :max="MAX_GRADE" step="0.1"
              v-model.number="course.exams[i]"
              placeholder="0"
            />
          </label>
        </div>
        <p class="sub">Promedio teoría: <b>{{ round2(theory) }}</b></p>
      </div>
    </div>

    <footer class="card__final">
      Promedio final:
      <strong :class="passed ? 'ok' : 'no'">{{ round2(final) }}</strong>
    </footer>
  </section>
</template>
