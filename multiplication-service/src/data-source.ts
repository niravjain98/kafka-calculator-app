import "reflect-metadata";
import { DataSource } from "typeorm";
import { Operation } from "./entity/Operation";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "postgres",
  port: 5432,
  username: "pix_user",
  password: "pixservice123",
  database: "pix_reaction_db",
  synchronize: true,
  logging: false,
  entities: [Operation],
  migrations: [],
  subscribers: [],
});
