export function generateRandomB64(length: number): string {
    let result = "";

    for (let i = 0; i < length; i++) {
        result += randomB64Char();
    }

    return result;
}

export function randomB64Char(): string {
    return b64chars[Math.floor(Math.random() * 64)];
}

export const b64chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
