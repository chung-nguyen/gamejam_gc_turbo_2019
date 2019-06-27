var express = require("express");
var router = express.Router();
var AsyncLock = require("node-async-locks").AsyncLock;
var asyncLock = new AsyncLock();

router.post("/start", function (req, res, next) {
    var lobby = require("../lobby")();
    asyncLock.enter((token) => {
        lobby
            .createRoom(req.body)
            .then((data) => {
                asyncLock.leave(token);
                res.json(data);
            })
            .catch((err) => {
                asyncLock.leave(token);
                next(err);
            });
    });
});

module.exports = router;
