import dotenv from 'dotenv';
import path from 'path';
import type { InitOptions } from 'payload/config';
import Payload from 'payload';

// Loading environment variables from the .env file
dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

// Checking if a cached payload exists in the global object
let cached = (global as any).payload;

// If no cached payload exists, initialize it
if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}

// Defining the Args interface for the getPayloadClient function
interface Args {
  initOptions?: Partial<InitOptions>;
}
export const getPayloadClient = async ({ initOptions }: Args = {}) => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET is not defined');
  }
  if (cached.client) {
    return cached.client;
  }
  // If no cached promise exists, initialize it
  if (!cached.promise) {
    cached.promise = Payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...(initOptions || {}),
    });

    // Trying to set the cached client to the resolved promise
    try {
      cached.client = await cached.promise;
    } catch (e: unknown) {
      cached.promise = null;
      throw e;
    }

    return cached.client;
  }
};
