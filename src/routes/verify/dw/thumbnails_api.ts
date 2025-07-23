import * as v from 'valibot';
import axios from 'axios';

async function fetchThumbnailApi(requests: { requestId: string, type: string, targetId: number, format: string, size: string }[]): Promise<any> {
    const url = new URL('https://thumbnails.roblox.com/v1/batch');
    url.searchParams.set('requests', JSON.stringify(requests));

    return axios.get(url.toString(), { responseType: 'json' })
        .then(res => res.data);
}

// await fetch("https://thumbnails.roblox.com/v1/batch", {
//     "credentials": "include",
//     "headers": {
//         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0",
//         "Accept": "application/json, text/plain, */*",
//         "Accept-Language": "en-US,en;q=0.5",
//         "Content-Type": "application/json",
//         "x-csrf-token": "8r+cxi2DtSt3",
//         "Sec-GPC": "1",
//         "Sec-Fetch-Dest": "empty",
//         "Sec-Fetch-Mode": "cors",
//         "Sec-Fetch-Site": "same-site"
//     },
//     "referrer": "https://www.roblox.com/",
//     "body": "[{\"requestId\":\"331184:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":331184,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"4839892977:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":4839892977,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"1471282326:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":1471282326,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"2310444729:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":2310444729,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"2313126868:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":2313126868,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"3066443703:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":3066443703,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"1594581927:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":1594581927,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"2454760909:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":2454760909,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"7756126069:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":7756126069,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"7669803249:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":7669803249,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"3606120806:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":3606120806,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"4007505042:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":4007505042,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"2760706046:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":2760706046,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"1741319448:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":1741319448,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"3325894381:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":3325894381,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"2686167571:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":2686167571,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"7899910632:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":7899910632,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"795577212:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":795577212,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"7936383098:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":7936383098,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"4695992622:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":4695992622,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"7609136593:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":7609136593,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"2357497428:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":2357497428,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"8735571358:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":8735571358,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"8811172243:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":8811172243,\"format\":\"webp\",\"size\":\"150x150\"},{\"requestId\":\"7060842900:undefined:AvatarHeadshot:150x150:webp:regular:0\",\"type\":\"AvatarHeadShot\",\"targetId\":7060842900,\"format\":\"webp\",\"size\":\"150x150\"}]",
//     "method": "POST",
//     "mode": "cors"
// });

// {
// 	"data": [
// 		{
// 			"requestId": "331184:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 331184,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-74370519C9E4017B7C372012B23AEB45-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "4839892977:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 4839892977,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-2A0C00A4E87DC909B4A92CC0A653FD50-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "1471282326:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 1471282326,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-921B7BD07D93401C16719A3D8EB1AF02-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "2310444729:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 2310444729,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-E0C87082734736A5F6583D6AE751B349-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "2313126868:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 2313126868,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-B8D3BB80A7613BD3BDE617516BAD0671-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "3066443703:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 3066443703,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-3D7F6868E82FBAE17FD2E17C28E7165D-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "1594581927:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 1594581927,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-83BEEE9024C4324806A5561E16D5EFED-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "2454760909:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 2454760909,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-353664FFC4F5E294257EBBA812DC2BE0-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "7756126069:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 7756126069,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-6C0BAF0F3F46BB02C1C4F612C32758B5-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "7669803249:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 7669803249,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-A5C705A9544FE12B8FF71C74EB293D58-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "3606120806:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 3606120806,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-0002722E53B829773CCF9236D954071F-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "4007505042:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 4007505042,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-2D6C6CC60EBF219067063AEAD2AC7FCF-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "2760706046:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 2760706046,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-E58B1D3F74EF04B94D111516E0B8B37D-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "1741319448:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 1741319448,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-F131C7A8D565D0E4A3EDF7FAF9068AC2-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "3325894381:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 3325894381,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-A41409AD0AF7FCE9EA13FFC2E4F17D97-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "2686167571:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 2686167571,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-80748661501FCB9AC5D6A344ECF325C9-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "7899910632:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 7899910632,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-531DB162D168E1D277B2C687C54B372B-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "795577212:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 795577212,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-06763F09A605C4E6DFD3F9FD18E585E8-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "7936383098:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 7936383098,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-4162D16811110DD1742CF2FC066E0720-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "4695992622:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 4695992622,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-650DC1A5E427287D7556730E4F1F5FB4-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "7609136593:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 7609136593,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-3925BCE5F6F08AE2D7F5960C354A9BF9-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "2357497428:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 2357497428,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-9F9AA449664DDCD0CA899202F358F363-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "8735571358:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 8735571358,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-ADACE860DEF46A0C565CB9E33CA23EE6-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "8811172243:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 8811172243,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-CEF1E6CF6B44FCC7AB1BACCCD96120DF-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		},
// 		{
// 			"requestId": "7060842900:undefined:AvatarHeadshot:150x150:webp:regular:0",
// 			"errorCode": 0,
// 			"errorMessage": "",
// 			"targetId": 7060842900,
// 			"state": "Completed",
// 			"imageUrl": "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-0248CFEDC0809F6D500CDF68B850F00F-Png/150/150/AvatarHeadshot/Webp/noFilter",
// 			"version": "TN3"
// 		}
// 	]
// }