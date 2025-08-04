import axios from "axios";
import * as v from "valibot";
import type { UserDetails } from "./user_details";
import { cacheUserDetails, getCachedUserDetails } from "./cache";

const ApiResponseSchema = v.looseObject({
    id: v.number(),
    name: v.string(),
    displayName: v.string(),
});

async function fetchUsersApi(robloxId: number): Promise<UserDetails> {
    const url = new URL(`https://users.roblox.com/v1/users/${robloxId}`);
    
    return axios.get(url.toString(), { responseType: "json" })
        .then(res => v.parse(ApiResponseSchema, res.data))
        .then(data => ({
            robloxId: data.id,
            username: data.name,
            displayName: data.displayName
        }));
}

export async function getUserDetails(robloxId: number): Promise<UserDetails> { //throws
    const cached = getCachedUserDetails(robloxId);
    
    if (cached) {
        return cached;
    }

    const userDetails = await fetchUsersApi(robloxId);

    cacheUserDetails(robloxId, userDetails);

    return userDetails;
}