<template>
  <div class="flex justify-center p-2">
    <div class="w-2/3 flex flex-col gap-2">
      <span class="self-center text-sm"
        >Stelle eine beliebige Frage über den Inhalt des Kurses und GPT wid versuchen, dir weiterzuhelfen.</span
      >
      <InputText v-model="question" type="text" placeholder="Meine Frage..." @keyup.enter="executeQuestion" />
      <span class="self-center text-xs text-gray-300"
        >Sie haben jeweils eine begrenzte Anzahl an Fragen pro Tag. Aktuell haben Sie noch <span class="font-bold">20</span> Fragen zur
        Verfügung.</span
      >
    </div>
  </div>
</template>
<script setup lang="ts">
  const question = ref('')
  const { addQuestion } = useQuestionsStore()

  const executeQuestion = () => {
    if (!question.value) return
    addQuestion(question.value)
    question.value = ''
  }
</script>
