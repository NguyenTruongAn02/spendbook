import { app } from "@/app";
import { connectDB } from "@/config/db";
import "dotenv/config";

const port = process.env.PORT || 4000;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`🚀 API running on http://localhost:${port}`);
    });
});
