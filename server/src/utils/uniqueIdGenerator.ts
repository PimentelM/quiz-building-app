import {Types} from "mongoose";

export const getUniqueId = (): string => {
	let objectId = new Types.ObjectId();
	return objectId.toHexString();
}


export const getPermaLinkId = (): string => {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < 6; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}