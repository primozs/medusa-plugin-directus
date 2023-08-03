import { Router } from "express";
import configureHooks from "./hooks";

export default (app: Router, rootDirectory: string) => {
  configureHooks(app, rootDirectory);

  return app;
};
