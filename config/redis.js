import { createClient } from "redis";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

// Get environment variables
const username = process.env.REDIS_USERNAME;
const password = process.env.REDIS_PASSWORD;
const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;
const config = { username, password, socket: { host, port } };

// Create clients
const redisClient = createClient(config);
const redisSubscriber = createClient(config);
const redisPublisher = createClient(config);

// Initialize Redis connections
const initializeRedis = async () => {
  // Set up client
  redisClient.on("error", (err) => console.error("[Redis Client] Error", err));
  redisClient.on("ready", () => console.log("[Redis Client] Ready"));

  // Clear all data in the database
  redisClient.flushDb();

  // Set up subscriber
  redisSubscriber.on("error", (err) =>
    console.error("[Redis Subscriber] Error", err)
  );
  redisSubscriber.on("ready", () => console.log("[Redis Subscriber] Ready"));

  // Set up publisher
  redisPublisher.on("error", (err) =>
    console.error("[Redis Publisher] Error", err)
  );
  redisPublisher.on("ready", () => console.log("[Redis Publisher] Ready"));

  const connections = [
    { name: "Client", instance: redisClient },
    { name: "Publisher", instance: redisPublisher },
    { name: "Subscriber", instance: redisSubscriber },
  ];

  const result = await Promise.allSettled(
    connections.map(({ name, instance }) =>
      instance.connect().catch((error) => {
        throw new Error(`[Redis ${name}] Connection failed: ${error.message}`);
      })
    )
  );

  // Check if any connections failed
  const failedConnections = result.filter((r) => r.status === "rejected");
  if (failedConnections?.length > 0) {
    console.error(
      `[Redis] Failed to connect to ${failedConnections.length} Redis instances:`
    );
    failedConnections.forEach((failure) => {
      console.error(failure?.reason?.message);
    });

    // Attempt to close any successful connections before throwing
    await Promise.allSettled(
      connections.map(({ instance }) => instance.disconnect().catch(() => {}))
    );

    throw new Error(
      `Failed to establish ${failedConnections.length} Redis connections`
    );
  }

  console.log("[Redis] All Redis connections established successfully");
};

// Initialize connections
try {
  initializeRedis();
} catch (error) {
  console.error("[Redis] Error initializing Redis:", error);
}

export { redisClient, redisSubscriber, redisPublisher };
