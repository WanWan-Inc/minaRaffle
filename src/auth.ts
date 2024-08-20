import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import {getRequestContext} from "@cloudflare/next-on-pages";
import {D1Adapter, up} from "@auth/d1-adapter";

export const runtime = "edge";

let migration = false;

export const {handlers, auth, signIn, signOut} = NextAuth(async (request) => {

    // @ts-ignore
    const d1 = getRequestContext().env.AUTHDB;
    if (!migration) {
        try {
            await up(d1);
            migration = true;
        } catch (e) {
            console.error(e);
        }
    }
    return {
        providers: [
            Discord
        ],
        adapter: D1Adapter(d1),
    }
})