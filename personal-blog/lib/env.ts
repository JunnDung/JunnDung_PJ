export function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function assertStrongSecret(name: string, value: string) {
  if (value.length < 32) {
    throw new Error(`${name} must be at least 32 characters long`);
  }
}
