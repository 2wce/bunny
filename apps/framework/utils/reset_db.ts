// Import the Prisma client from the database configuration
import prisma from "../config/database";

// Define an asynchronous function to reset the database
export const reset_db = async () => {
  // Query the PostgreSQL system catalog to get a list of all table names in the 'public' schema
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  try {
    // Map over the table names, filter out the Prisma migrations table,
    // and format the names for use in a SQL query
    const tables = tablenames
      .map(({ tablename }) => tablename)
      // Filter out the Prisma migrations table to avoid deleting it
      .filter((name) => name !== "_prisma_migrations")
      // Format the table names for use in a SQL query
      .map((name) => `"public"."${name}"`)
      // Join the table names into a comma-separated string
      .join(", ");

    console.log({ tables });
    // If there are any tables, execute a SQL query to truncate them
    if (tables.length > 0) {
      const res = await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE ${tables} CASCADE;`
      );

      console.log(`deleted from ${res} tables`);
    }
  } catch (error) {
    // If an error occurs, log it and throw it
    throw error; // throw the error
  } finally {
    // Finally, disconnect the Prisma client
    await prisma.$disconnect(); // close the Prisma client
  }
};
