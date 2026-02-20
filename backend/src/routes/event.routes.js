const router = require("express").Router();
const eventsController = require("../controllers/events.controller.js");

router.get("/", eventsController.listPublic);

module.exports = router;