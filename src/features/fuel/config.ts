const REQUIRED_ENV_KEYS = ['DISCORD_HOOKS'] as const;

type FuelEnvKey = (typeof REQUIRED_ENV_KEYS)[number];

function validateFuelEnv(): Record<FuelEnvKey, string> {
  const missing: string[] = [];
  const result: Record<string, string> = {};

  for (const key of REQUIRED_ENV_KEYS) {
    const value = process.env[key];
    if (!value) {
      missing.push(key);
    } else {
      result[key] = value;
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `[Fuel Config] Missing required environment variables: ${missing.join(', ')}`,
    );
  }

  return result as Record<FuelEnvKey, string>;
}

export const fuelConfig = validateFuelEnv();
