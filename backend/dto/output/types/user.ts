import z from "zod";
import { user } from "../schemas/user";

export type UserOutput = z.infer<typeof user>;
