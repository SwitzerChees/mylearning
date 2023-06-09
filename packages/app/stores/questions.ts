import { defineStore, storeToRefs } from 'pinia'

import { ProcessingStates, Question } from '@mylearning/common/definitions'

const questions = ref<Question[]>([])

export const useQuestionsStore = defineStore('questions', () => {
  const { getSafeAPIResponse } = useAPI()
  const { find, create } = useStrapi()

  const fetchQuestions = async () => {
    const request = find('questions', {
      filters: {
        lesson: selectedLesson.value?.id,
        course: selectedCourse.value?.id,
        status: { $ne: ProcessingStates.Archived },
      },
      populate: {
        course: {
          fields: ['id', 'name'],
        },
        lesson: {
          fields: ['id', 'title'],
        },
      },
      sort: ['createdAt:desc'],
    })
    const { ok, result } = await getSafeAPIResponse<Question[]>(request)
    if (!ok) return
    questions.value = result
  }

  const fetchOpenQuestions = async () => {
    const openQuestions = questions.value.filter((q) => q.status === 'open')
    if (openQuestions.length === 0) return
    const request = find('questions', {
      fields: ['id', 'answer', 'status'],
      filters: {
        id: { $in: openQuestions.map((q) => q.id) },
        lesson: selectedLesson.value?.id,
        course: selectedCourse.value?.id,
      },
    })
    const { ok, result } = await getSafeAPIResponse<Question[]>(request)
    if (!ok) return
    for (const openQuestion of result) {
      if (openQuestion.status !== 'done') continue
      const foundQuestion = questions.value.find((q) => q.id === openQuestion.id)
      if (!foundQuestion) continue
      foundQuestion.answer = openQuestion.answer
      foundQuestion.status = openQuestion.status
    }
  }

  const addQuestion = async (question: string) => {
    const request = create('questions', {
      question,
      lesson: selectedLesson.value?.id,
      course: selectedCourse.value?.id,
    })
    const { ok, result } = await getSafeAPIResponse<Question>(request)
    if (!ok) return
    if (selectedCourse.value) result.course = selectedCourse.value
    if (selectedLesson.value) result.lesson = selectedLesson.value
    questions.value.unshift(result)
  }

  const { selectedCourse, selectedLesson } = storeToRefs(useSidebarsStore())
  watch([selectedCourse, selectedLesson], () => {
    fetchQuestions()
  })

  setInterval(() => {
    fetchOpenQuestions()
  }, 2000)

  return { questions, fetchQuestions, addQuestion }
})
