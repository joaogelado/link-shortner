import { NextApiRequest } from "next";
import { Metadata } from "./Metadata";

export interface NextApiRequestWithMetadata extends NextApiRequest {
    metadata: Metadata;
}
