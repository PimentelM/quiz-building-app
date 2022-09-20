# Quiz Builder Server

Back-end for the Quiz Builder app.

![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)


## Instructions on how to use:

You will need to have [NodeJS](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/) installed on your machine.
Recommended versions are NodeJS 16.15.0> and Yarn 1.22.19>

First, start by copying .env.example to .env and filling in the values.

```bash
cp .env.example .env
```

Then, install the dependencies and run the server.
```bash
yarn install
yarn run dev
```

### Accessing the endpoints:

You can access the endpoints by doing http calls at `http://127.0.0.1:<PORT>/<PATH>`

All endpoints are listed once the server is properly initialized. 

```
... [POST]/api/auth/login
... [POST]/api/auth/register
... [POST]/api/auth/send-reset-password-email
... [POST]/api/auth/reset-password
... [POST]/api/auth/change-password
... [POST]/api/auth/activate-account
... [POST]/api/auth/resend-activation-email
... [POST]/api/quiz/
... [GET]/api/quiz/:id
... [GET]/api/quiz/by-permalink-id/:id
... [GET]/api/quiz/
... [DELETE]/api/quiz/:id
... [POST]/api/quiz/:id/compute-score
App is running on port 8081
```

You can see example usages of the endpoints at [Postman Documentation - quiz-builder-app](https://documenter.getpostman.com/view/4127404/2s7Z16j2mz)

## Architecture

The system uses simple 3 layer architecture with a decorator based dependency injection system and router.

You should take into considerationthe standard rules of this kind of archictecture when contributing to this system.



### Considerations:

#### Regarding the models:

Our models are currently immutable since we only use them to validate data at object creation time and do no further changes to the instance, but you can refactor them in such a way that they are mutable and still "Always valid".

For our purposes, it's important that the model instance is always valid through it's entire life-cycle so we can be sure we never store data in inconsistent state.

That's why it's important to keep a close eye on encapsulation once the models become mutable.

You will need to create a way to properly map the model data from the database to the model instance and vice-versa once you start to change property names. ( Which is a consequence of adding mutability + encapsulation ).

#### Regarding error handling:

We never return internal errors to the user (only in development mode), but we have some specific error classes that when throwed are captured and properly handled by our exception handling layer to display a specific message to the user.

Example: You can use the "InvalidInputError" to throw an error at any layer of the system and the user will receive a 400 error with a message that you can customize.

All these custom application errors will implement the "IAppError" interface.

They are currently located at the "src/errors" folder.


