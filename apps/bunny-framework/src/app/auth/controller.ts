import { Prisma } from "@prisma/client";
import { Context, Env } from "hono";
import { AuthService } from "./service";

type RegisterInput = Pick<Prisma.UserCreateInput, 'email' | 'password' | 'name' | 'phoneNumber'>
export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  public async forgotPassowrd(c: Context): Promise<Response> {
    return c.json({});
  }

  public async login(c: Context): Promise<Response> {
    return c.json({});
  }

  public async logout(c: Context): Promise<Response> {
    return c.json({});
  }

  public async me(c: Context): Promise<Response> {
    return c.json({});
  }

  public async register(c: Context): Promise<Response> {
    // add validation
    const user = await this.service.createUser(c.req.json<RegisterInput>());
    return c.json(user);
  }

  public async resetPassword(c: Context): Promise<Response> {
    return c.json({});
  }

  public async verifyOtp(
    c: Context<Env, "/auth/verify-otp", {}>
  ): Promise<Response> {
    return c.json({});
  }

  private async refreshToken(
    c: Context<Env, "/auth/register", {}>
  ): Promise<Response> {
    return c.json({});
  }

  private async resendOtp(
    c: Context<Env, "/auth/register", {}>
  ): Promise<Response> {
    return c.json({});
  }
}
