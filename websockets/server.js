const { WebsocketController } = require("./controller");

const port = 8000;

const controller = new WebsocketController(port);

controller.open();

controller.run('price_feed');