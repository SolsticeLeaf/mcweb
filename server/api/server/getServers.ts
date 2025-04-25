import { connectDB } from "../database/MongoDB";
import { getServers } from "../interfaces/Server";

export default defineEventHandler(async (event) => {
    try {
        await connectDB();
        return { servers: await getServers() };
    } catch (error) {
        return { servers: [] };
    }
});

