import { connectDB } from '../database/MongoDB';
import { getAllTypes } from '../interfaces/ShopType';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    return { types: await getAllTypes() };
  } catch (error) {
    console.error('❌ Error fetching shop types:', error);
    return { types: [] };
  }
});
