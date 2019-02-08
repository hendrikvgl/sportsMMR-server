const playercontroller = require("./playercontroller");
const sessioncontroller = require("./sessioncontroller");
const matchcontroller = require("./matchcontroller");
const server = require("./server");
const router = server.router;

router.route('/players').get(playercontroller.getPlayers);
router.route('/player').post(playercontroller.postPlayer);
router.route('/player').delete(playercontroller.deletePlayer);
router.route('/playersmmr').post(playercontroller.getPlayersMMR);

router.route('/session').get(sessioncontroller.findActiveSession);
router.route('/session').post(sessioncontroller.postSession);
router.route('/session').put(sessioncontroller.endSession);
router.route('/sessions').get(sessioncontroller.findAllSessions);

router.route('/activematch').get(matchcontroller.findActiveMatch);
router.route('/matches').post(matchcontroller.getMatchesForId);
router.route('/match').post(matchcontroller.postMatch);
router.route('/match').put(matchcontroller.endMatch);
router.route('/match/tmmr').post(matchcontroller.getTMMR);

module.exports = router;
