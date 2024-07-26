<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div class="inputLabel">
        <label for="email">Email: </label>
        <input v-model="email" type="email" id="email" required />
      </div>
      <div class="inputLabel">
        <label for="number">Number: </label>
        <input v-model="number" type="text" id="number" v-mask="'##-##-##'" />
      </div>
      <button type="submit">Submit</button>
    </form>
    <div v-if="results.length">
      <h2>Results:</h2>
      <ul>
        <li v-for="(result, index) in results" :key="index">
          {{ result.email }} - {{ result.number }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import axios, { CancelTokenSource } from 'axios';

const email = shallowRef('');
const number = shallowRef('');
const results = shallowRef<Array<{ email: string, number: string }>>([]);
let cancelTokenSource: CancelTokenSource | null = null;

const onSubmit = async () => {
  // Отменить предыдущий запрос, если он существует
  if (cancelTokenSource) {
    cancelTokenSource.cancel('Request canceled due to new request.');
  }

  // Создать новый источник токенов отмены перед выполнением запроса
  cancelTokenSource = axios.CancelToken.source();

  try {
    const response = await axios.post('http://localhost:3000/search', {
      email: email.value,
      number: number.value
    }, {
      cancelToken: cancelTokenSource.token
    });
    results.value = response.data;
  } catch (error) {
    // проверяем, был ли запрос отменен
    if (axios.isCancel(error)) {
      console.log('Request canceled.', error.message);
    } else {
      console.error(error);
    }
  }
};
</script>

<style scoped>
.inputLabel {
  margin: 1rem;
}
</style>
