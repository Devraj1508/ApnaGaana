const DiscoveryController = require('../Controllers/Discoverycontroller');
const DiscoveryRouter = require('express').Router();
const middleware = require('../middleware/middleware');

DiscoveryRouter.get('/discover', middleware, DiscoveryController.getDiscoveryData);

module.exports = DiscoveryRouter;
