import Container from "typedi";
import { RouteDefinition } from "./controllerDecorators";
import express from "express";
import { promiseWrap } from "./expressPromiseWrap";

export default (app: express.Express, BASE_PATH, controllers) => {
	const controllerInstances = Object.values(controllers).map(controller =>
		Container.get(controller as any),
	);
	controllerInstances.forEach(instance =>
		registerControllerRoutes(instance, app, BASE_PATH),
	);
};

function registerControllerRoutes(controller, app, BASE_PATH) {
	const controllerClass = controller.constructor;

	// The route prefix saved to our controller
	const prefix = Reflect.getMetadata("prefix", controllerClass);

	const rootMiddlewares = Reflect.getMetadata("middlewares", controllerClass);
	// Our `routes` array containing all our routes for this controller
	const routes: Array<RouteDefinition> = Reflect.getMetadata(
		"routes",
		controllerClass,
	);

	// Iterate over all routes and register them to our express application
	routes.forEach(route => {
		const controllerMiddlewares = rootMiddlewares || [];
		const routeMiddlewares = route.middleware || [];
		const completePath = (BASE_PATH + prefix + route.path).replace(/\/\//g, "/"); // Remove "/" duplicates

		// Register the handler to a route
		app[route.method](
			completePath, // Path
			[...controllerMiddlewares, ...routeMiddlewares], // Middlewares
			promiseWrap(controller[route.name].bind(controller)), // Handler
		);

		console.log(
			"\x1b[33m%s\x1b[0m",
			`Registered controller method ${controllerClass.name}.${
				route.name
			} at route [${route.method.toUpperCase()}]${completePath}`,
		);
	});
}
