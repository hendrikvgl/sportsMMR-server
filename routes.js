const playercontroller = require("./playercontroller");
const sessioncontroller = require("./sessioncontroller");
const matchcontroller = require("./matchcontroller");
const crewcontroller = require("./crewcontroller");
const server = require("./server");
const router = server.router;
const middleware = require('./middleware');
const withAuth = middleware.withAuth;
const withAdmin = middleware.withAdmin;

router.route('/players').get(withAuth, playercontroller.getPlayers);
router.route('/player').post(withAuth, playercontroller.postPlayer);
router.route('/player').delete(withAdmin, playercontroller.deletePlayer);
router.route('/playersmmr').post(withAuth, playercontroller.getPlayersMMR);

router.route('/session').get(withAuth,sessioncontroller.findActiveSession);
router.route('/session').post(withAuth, sessioncontroller.postSession);
router.route('/session').put(withAuth, sessioncontroller.endSession);
router.route('/sessions').get(withAuth, sessioncontroller.findAllSessions);

router.route('/activematch').post(withAuth, matchcontroller.findActiveMatch);
router.route('/matches').post(withAuth, matchcontroller.getMatchesForId);
router.route('/match').post(withAuth, matchcontroller.postMatch);
router.route('/match').put(withAuth, matchcontroller.endMatch);
router.route('/match/tmmr').post(withAuth, matchcontroller.getTMMR);
router.route('/match/mostrecent').post(withAuth, matchcontroller.getMostRecentForId);

router.route('/crew').post(crewcontroller.postCrew);
router.route('/auth').post(crewcontroller.authenticate);
router.route('/crew').get(crewcontroller.getCrewId);
router.route('/logout').post(crewcontroller.logout);

router.route('/checkToken').get(withAuth, function(req, res) {
  res.sendStatus(200);
});

module.exports = router;
