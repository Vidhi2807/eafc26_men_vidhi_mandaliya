const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

router
  .route("/")
  .get(playerController.getAllPlayers)
  .post(protect, restrictTo("admin"), playerController.createPlayer);

// Preset analytics filters (e.g. /players/filter/high-rated)
router.get("/filter/:filterType", playerController.getPredefinedFilteredPlayers);

router
  .route("/:id")
  .get(playerController.getPlayerById)
  .patch(protect, restrictTo("admin"), playerController.updatePlayer)
  .delete(protect, restrictTo("admin"), playerController.deletePlayer);

module.exports = router;
