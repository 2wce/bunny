import { SALT_ROUNDS } from "@config/auth";
import prisma from "@config/database";
import { PrismaClient, User } from "@prisma/client";

export class AuthService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  public async createUser(userData: any): Promise<User> {
    return await this.prisma.$transaction(async (prisma) => {
      // create user
      const user = await prisma.user.create({
        data: userData,
      });

      // verify user exists
      if (!user) {
        // @TODO:  log error to sentry & make error obscure
        throw new Error("Could not create user");
      }

      // create password
      const password = await this.createPassword(userData.password, user.id);

      if (!password) {
        // @TODO:  log error to sentry & make error obscure
        throw new Error("Could not create password");
      }

      return user;
    });
  }

  public async comparePasswords(
    password: string,
    hash: string
  ): Promise<boolean> {
    try {
      return await Bun.password.verify(password, hash);
    } catch (error) {
      // @TODO:  log error to sentry
      return false;
    }
  }

  private async createPasswordHash(password: string): Promise<string | null> {
    try {
      return await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: SALT_ROUNDS
      });
    } catch (error) {
      // @TODO:  log error to sentry
      return null;
    }
  }

  private async createPassword(
    password: string,
    userId: string
  ): Promise<boolean> {
    try {
      const hash = await this.createPasswordHash(password);

      if (!hash) {
        return false;
      }

      const res = await this.prisma.password.create({
        data: {
          hash,
          userId,
        },
      });

      if (!res) {
        return false;
      }

      return true;
    } catch (error) {
      // @TODO:  log error to sentry
      return false;
    }
  }
}
