import * as v from 'valibot';

export const RobloxUserSearchResult = v.array(v.object({
    username: v.string(),
    displayName: v.string(),
    id: v.number(),
}));

