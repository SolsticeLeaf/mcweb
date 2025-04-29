import { connectDB } from '../database/MongoDB';
import { getQa } from '../interfaces/QuestionsAnswers';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    return { questions: await getQa() };
  } catch (error) {
    return { questions: [] };
  }
});
