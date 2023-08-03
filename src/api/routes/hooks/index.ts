import { Router, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { wrapHandler } from "@medusajs/medusa";
import { parseCorsOrigins } from "medusa-core-utils";
import { type ConfigModule } from "@medusajs/types";
import configLoader from "@medusajs/medusa/dist/loaders/config";
import DirectusService from "../../../services/directus";

export default (app: Router, rootDirectory: string) => {
  const router = Router();
  app.use("/hooks", router);

  const config = configLoader(rootDirectory);
  const projectConfig = config.projectConfig as ConfigModule["projectConfig"];

  const corsOptions = {
    origin: parseCorsOrigins(projectConfig.store_cors || ""),
    credentials: true,
  };
  router.use(cors(corsOptions));

  router.get("/directus", bodyParser.json(), wrapHandler(directusHandler));
};

const directusHandler = async (req: Request, res: Response) => {
  try {
    const directusService = req.scope.resolve(
      "directusService"
    ) as DirectusService;

    const directusType = req.body.directusType;
    const entryId = req.body.id;

    let updated: Record<string, any> = {};
    switch (directusType) {
      case "Product":
        updated = await directusService.sendDirectusProductToAdmin(entryId);
        break;
      case "ProductVariant":
        updated = await directusService.sendDirectusProductVariantToAdmin(
          entryId
        );
        break;
      default:
        break;
    }
    res.status(200).send(updated);
  } catch (error: any) {
    res.status(400).send(`Webhook error: ${error.message}`);
  }
};
