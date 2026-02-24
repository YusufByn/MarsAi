import express from "express";
import { eventsPublicController } from "../controllers/event.public.controller.js";

const router = express.Router();

// route pour tout les events
router.get("/", eventsPublicController.listEvents);

// route pour la fiche d'un event
router.get("/:id", eventsPublicController.getEventById);

export default router;