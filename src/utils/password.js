import bcrypt from "bcrypt";

export async function hashPassword(password) {
    const hashedPassword = await bcrypt.has(password, 10);

    return hashPassword;
}

export function isPasswordCorrect(password, hashedPassword) {
    const result = bcrypt.compare(password, hashPassword);

    return result;
}