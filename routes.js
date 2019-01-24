const playercontroller = require("./playercontroller");
const server = require("./server");
const router = server.router;

router.route('/players').get(playercontroller.getPlayers);
router.route('/player').post(playercontroller.postPlayer);
router.route('/player').delete(playercontroller.deletePlayer);

module.exports = router;
