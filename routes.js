const playercontroller = require("./playercontroller");
const sessioncontroller = require("./sessioncontroller");
const matchcontroller = require("./matchcontroller");
const server = require("./server");
const router = server.router;

router.route('/players').get(playercontroller.getPlayers);
router.route('/player').post(playercontroller.postPlayer);
router.route('/player').delete(playercontroller.deletePlayer);

router.route('/session').get(sessioncontroller.findActiveSession);
router.route('/session').post(sessioncontroller.postSession);
router.route('/session').put(sessioncontroller.endSession);

router.route('/activematch').get(matchcontroller.findActiveMatch);
router.route('/match').get(matchcontroller.getMatchesForId);
router.route('/match').post(matchcontroller.postMatch);
router.route('/match').put(matchcontroller.endMatch);

module.exports = router;
