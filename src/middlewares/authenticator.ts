import * as jwt from "jsonwebtoken";


process.env.JWT_SECRETKEY = '3e8d4f8a14b5d9c3b3e2e073f85c6193a2d7b82e5f9b42465d722d3f858b9a7c';

export class Authenticator {

    generateToken = (payload: AuthenticationData): string => {
        return jwt.sign(payload, process.env.JWT_SECRETKEY as string, {
            expiresIn: "59min",
        });
    };

    getTokenData = (token: string): AuthenticationData => {
    try {
        let decoded = jwt.verify(token, process.env.JWT_KEY as string);
        return decoded as AuthenticationData;
    } catch (error: any) {
        if (error.message.includes("jwt expired")) {
            throw new Error("Token expired");
        }
        throw new Error(error.message);
    }
  };
}

export interface AuthenticationData {
  id: string;
}
