const DiscoveryController = require('../Controllers/Discoverycontroller');
const DiscoveryRouter = require('express').Router();

DiscoveryRouter.get('/discover', DiscoveryController.getDiscoveryData);

module.exports = DiscoveryRouter;
