import type { CookieOptions } from "express";

export const AUTH_COOKIE_NAME = "authToken";

export const getAuthCookieOptions = (): CookieOptions => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api"
});