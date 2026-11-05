import type { Database } from "./database.types";

export type IApplicationRecord = Database["public"]["Tables"]["applications"]["Row"];
export type IApplicationDetailsRecord = Database["public"]["Tables"]["application_details"]["Row"];
export type IProfile = Database["public"]["Tables"]["profiles"]["Row"];

export type Row = Omit<IApplicationRecord, "id"> & { id?: string; details?: never };
