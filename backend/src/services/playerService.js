const Player = require("../models/Player");
const { SORT } = require("../config/constants");
const { getPaginationMetadata } = require("../utils/pagination");
const { buildPlayerQuery } = require("../utils/queryBuilder");

class PlayerService {
  /**
   * Get all players with filtering, sorting, and pagination
   */
  async getAllPlayers(queryParams) {
    const { page, limit, sort } = queryParams;

    // 1. Build DB Query Object
    const filter = buildPlayerQuery(queryParams);

    // 2. Build Pagination skip & limits
    const totalItems = await Player.countDocuments(filter);
    const { skip, limit: parsedLimit, metadata } = getPaginationMetadata(page, limit, totalItems);

    // 3. Build Sort Object
    let sortOption = {};
    if (sort) {
      const isDesc = sort.startsWith("-");
      const field = isDesc ? sort.substring(1) : sort;

      if (SORT.ALLOWED_FIELDS.includes(field)) {
        sortOption[field] = isDesc ? -1 : 1;
      } else {
        // Fallback to default sorting if field is not allowed
        sortOption[SORT.DEFAULT_FIELD] = SORT.DEFAULT_ORDER;
      }
    } else {
      // Default sort
      sortOption[SORT.DEFAULT_FIELD] = SORT.DEFAULT_ORDER;
    }

    // 4. Query Database
    const players = await Player.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parsedLimit);

    return {
      players,
      pagination: metadata,
    };
  }

  /**
   * Get single player by database ID (_id) or custom playerId
   */
  async getPlayerById(id) {
    let player;
    // Check if the id is a valid Mongo ObjectId format
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      player = await Player.findById(id);
    }

    // Fallback to searching by custom playerId
    if (!player) {
      player = await Player.findOne({ playerId: id });
    }

    if (!player) {
      const error = new Error(`Player with ID '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return player;
  }

  /**
   * Create a new player
   */
  async createPlayer(playerData) {
    // Generate playerId if not provided
    if (!playerData.playerId) {
      const count = await Player.countDocuments({});
      playerData.playerId = `custom_${count + 1}`;
    }

    // Ensure playerId is unique
    const existing = await Player.findOne({ playerId: playerData.playerId });
    if (existing) {
      const error = new Error(`Player with ID '${playerData.playerId}' already exists`);
      error.statusCode = 400;
      throw error;
    }

    return await Player.create(playerData);
  }

  /**
   * Update a player
   */
  async updatePlayer(id, updateData) {
    const player = await this.getPlayerById(id);

    // Prevent direct manual update of playerId to a duplicate value
    if (updateData.playerId && updateData.playerId !== player.playerId) {
      const existing = await Player.findOne({ playerId: updateData.playerId });
      if (existing) {
        const error = new Error(`Player with ID '${updateData.playerId}' already exists`);
        error.statusCode = 400;
        throw error;
      }
    }

    Object.assign(player, updateData);
    return await player.save();
  }

  /**
   * Delete a player
   */
  async deletePlayer(id) {
    const player = await this.getPlayerById(id);
    await player.deleteOne();
    return player;
  }
}

module.exports = new PlayerService();
