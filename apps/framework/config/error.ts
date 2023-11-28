class UserCreationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserCreationError';
  }
}

class PasswordCreationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PasswordCreationError';
  }
}

export class ErrorFactory {
  createUserCreationError(message: string): Error {
    return new UserCreationError(message);
  }

  createPasswordCreationError(message: string): Error {
    return new PasswordCreationError(message);
  }
}