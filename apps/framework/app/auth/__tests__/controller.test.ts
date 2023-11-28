import { beforeAll, beforeEach, describe, expect, it, jest } from "bun:test";
import { Context } from "hono";
import { reset_db } from "../../../utils/reset_db";
import { AuthController } from "../controller";

// mock('./service', () => {
//   return {
//     AuthService: jest.fn().mockImplementation(() => {
//       return {
//         createUser: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
//       };
//     }),
//   };
// });

beforeAll(async () => {
  await reset_db();
});

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(() => {
    controller = new AuthController();
  });

  it("should register a new user", async () => {
    const mockContext = {
      req: {
        json: jest.fn().mockReturnValue({
          email: "test@test.com",
          password: "password",
          name: "Test User",
          phoneNumber: "1234567890",
        }),
      },
      json: jest.fn(),
    } as unknown as Context;

    await controller.register(mockContext);

    expect(mockContext.json).toHaveBeenCalled();
  });

  // Add similar tests for other methods
});
