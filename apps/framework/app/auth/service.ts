import { PrismaClient, User } from "@prisma/client";
import { password } from "bun";
import { SALT_ROUNDS } from "../../config/auth";
import { ErrorFactory } from "../../config/error";
import { omit } from "../../utils/omit";

export class AuthService {
  private prisma: PrismaClient;
  private errorFactory: ErrorFactory;

  constructor(prisma: PrismaClient, errorFactory: ErrorFactory) {
    this.prisma = prisma;
    this.errorFactory = errorFactory;
  }

  public async createUser(userData: any): Promise<User> {
    return await this.prisma.user.create({
      data: {
        ...omit(userData, ["password"]),
        password: {
          create: {
            hash: await this.createPasswordHash(userData.password),
          },
        },
      },
    });
  }

  public async comparePasswords(
    hashed_password: string,
    hash: string
  ): Promise<boolean> {
    try {
      return await password.verify(hashed_password, hash);
    } catch (error) {
      // @TODO:  log error to sentry
      return false;
    }
  }

  private async createPasswordHash(
    plain_text_password: string
  ): Promise<string | null> {
    try {
      const res = await password.hash(plain_text_password, {
        algorithm: "bcrypt",
        cost: SALT_ROUNDS,
      });

      return res;
    } catch (error) {
      // @TODO:  log error to sentry
      return null;
    }
  }
}
