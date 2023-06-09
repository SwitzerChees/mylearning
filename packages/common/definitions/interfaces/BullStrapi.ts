import { Strapi } from '@strapi/strapi'
import { Queue } from 'bullmq'

interface BullStrapi extends Strapi {
  bull: {
    questions: Queue
    artefacts: Queue
    summaries: Queue
  }
  t: (key: string, locale: string) => string
}

export { BullStrapi }
