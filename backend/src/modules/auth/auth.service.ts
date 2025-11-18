import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { User } from "@/modules/users/user.model";

export async function loginWithGoogle(idToken: string) {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

    if (!GOOGLE_CLIENT_ID) {
        throw new Error("GOOGLE_CLIENT_ID is not set");
    }
    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email || !payload.name) {
        throw new Error("Google token không hợp lệ");
    }

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const avatarUrl = payload.picture;

    let user = await User.findOne({ googleId });
    if (!user) {
        user = await User.create({ googleId, email, name, avatarUrl });
    }

    const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { user, token };
}
