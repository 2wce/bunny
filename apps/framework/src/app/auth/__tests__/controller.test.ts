import { Context } from 'hono';
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthController } from '../controller';

vi.mock('./service', () => {
  return {
    AuthService: vi.fn().mockImplementation(() => {
      return {
        createUser: vi.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
      };
    }),
  };
});

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(() => {
    controller = new AuthController();
  });

  it('should register a new user', async () => {
    const mockContext = {
      req: {
        json: vi.fn().mockReturnValue({ email: 'test@test.com', password: 'password', name: 'Test User', phoneNumber: '1234567890' }),
      },
      json: vi.fn(),
    } as unknown as Context;

    await controller.register(mockContext);

    expect(mockContext.json).toHaveBeenCalledWith({ id: 1, name: 'Test User' });
  });

  // Add similar tests for other methods
});