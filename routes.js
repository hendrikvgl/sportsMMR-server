const express = require("express");
const playercontroller = require("./playercontroller");
const server = require("./server");
const router = server.router;

router.route('/players').get(playercontroller.getPlayers);

module.exports = router;
