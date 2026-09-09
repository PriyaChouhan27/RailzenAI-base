import { Router, type IRouter } from "express";
import {
  HealthCheckResponse,
  RailzenHealthResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

router.get("/health", (_req, res) => {
  const data = RailzenHealthResponse.parse({
    status: "ok",
    service: "RailZen AI",
    phase: "0.1",
  });
  res.json(data);
});

export default router;
