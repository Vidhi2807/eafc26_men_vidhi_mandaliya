const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");

router
  .route("/")
  .get(playerController.getAllPlayers)
  .post(playerController.createPlayer);

// Preset analytics filters (e.g. /players/filter/high-rated)
router.get("/filter/:filterType", playerController.getPredefinedFilteredPlayers);

router
  .route("/:id")
  .get(playerController.getPlayerById)
  .patch(playerController.updatePlayer)
  .delete(playerController.deletePlayer);

module.exports = router;
