import { Hono } from "hono";
import { AuthController } from "./controller";

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
|
| Here is where you can register auth routes for your application.
|
*/

const auth = new Hono();
const controller = new AuthController();

auth.post("/register", controller.register);
auth.post("/login", controller.login);
auth.post("/logout", controller.logout);
auth.get("/me", controller.me);

export default auth;
