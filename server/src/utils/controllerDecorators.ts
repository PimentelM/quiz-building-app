/* eslint-disable @typescript-eslint/ban-types */
import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";

type ExpressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => any;

export const Controller = (
	prefix = "",
	...middlewares: ExpressMiddleware[]
): ClassDecorator => {
	return (target: any) => {
		// Makes it Injectable
		Service()(target);

		Reflect.defineMetadata("prefix", prefix, target);
		Reflect.defineMetadata("middlewares", middlewares, target);

		// Since routes are set by our methods this should almost never be true (except the controller has no methods)
		if (!Reflect.hasMetadata("routes", target)) {
			Reflect.defineMetadata("routes", [], target);
		}
	};
};

export interface RouteDefinition {
  path: string;
  method: "get" | "post" | "put" | "patch" | "delete";
  name: string;
  middleware: ExpressMiddleware[];
}

const mapping = (
	verb: "get" | "post" | "put" | "patch" | "delete",
	path = "",
	middleware: ExpressMiddleware[],
): MethodDecorator =>
	(target: Object, propertyKey: string | symbol): void => {
		// In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
		// To prevent any further validation simply set it to an empty array here.
		if (!Reflect.hasMetadata("routes", target.constructor)) {
			Reflect.defineMetadata("routes", [], target.constructor);
		}

		if(typeof propertyKey === "symbol") throw new Error("Symbol is not supported as a route name");

		// Get the routes stored so far, extend it by the new route and re-set the metadata.
		const routes = Reflect.getMetadata(
			"routes",
			target.constructor,
		) as Array<RouteDefinition>;

		routes.push({
			method: verb,
			path,
			name: propertyKey,
			middleware,
		});
		Reflect.defineMetadata("routes", routes, target.constructor);
	};

export const Get = (
	path?: string,
	...middleware: ExpressMiddleware[]
): MethodDecorator => {
	return mapping("get", path, middleware);
};

export const Put = (
	path?: string,
	...middleware: ExpressMiddleware[]
): MethodDecorator => {
	return mapping("put", path, middleware);
};

export const Post = (
	path?: string,
	...middleware: ExpressMiddleware[]
): MethodDecorator => {
	return mapping("post", path, middleware);
};

export const Patch = (
	path?: string,
	...middleware: ExpressMiddleware[]
): MethodDecorator => {
	return mapping("patch", path, middleware);
};

export const Delete = (
	path?: string,
	...middleware: ExpressMiddleware[]
): MethodDecorator => {
	return mapping("delete", path, middleware);
};
