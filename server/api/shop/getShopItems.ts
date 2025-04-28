import { connectDB } from '../database/MongoDB';
import { getAllItems } from '../interfaces/ShopItem';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    return { items: await getAllItems() };
  } catch (error) {
    return { items: [] };
  }
});
