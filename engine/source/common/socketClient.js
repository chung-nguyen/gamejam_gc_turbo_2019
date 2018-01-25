// @flow
class SocketClient {
    constructor() {
        this._socket = null;
        this._messagesQueue = [];
        this._pendingQueue = [];
        this._pendingBuffer = [];
        this._query = null;
        this._address = null;

        this.isReady = false;
        this._isActive = true;
    }

    close() {
        this.flush();
        this.isReady = false;
        this._isActive = false;

        if (this._socket) {
            this._socket.close();
            this._socket = null;
        }
    }

    connect(address, query) {
        this._address = address;
        this._query = query;
        this.tryConnect();
    }

    buildQuery(address, query) {
        var url = address;
        var i = 0;
        for (var q in query) {
            url += (i === 0 ? "?" : "&") + q + "=" + query[q];
            ++i;
        }
        return url;
    }

    tryConnect() {
        this._socket = new WebSocket(this.buildQuery(this._address, this._query));
        //this._socket.binaryType = "arraybuffer";

        var self = this;
        this._socket.onopen = function(evt) {
            cc.log("Socket client connected.");
            self.isReady = true;

            for (var i = 0; i < self._pendingQueue.length; ++i) {
                self.send(self._pendingQueue[i]);
            }
            self._pendingQueue.length = 0;

            for (var i = 0; i < self._pendingBuffer.length; ++i) {
                self.sendBuffer(self._pendingBuffer[i]);
            }
            self._pendingBuffer.length = 0;
        };

        this._socket.onmessage = function(evt) {
            if (evt.data) {
                self._messagesQueue.push(evt.data);
            }
        };

        this._socket.onclose = function(evt) {
            cc.log("Socket was closed");

            if (evt.reason) {
                self._messagesQueue.push(
                    JSON.stringify({
                        type: "close",
                        reasons: evt.reason
                    })
                );
            }

            self._socket = null;
            self.isReady = false;

            if (self._isActive) {
                // retry
                setTimeout(() => {
                    cc.log("Retry socket connection");
                    self.tryConnect();
                }, 1000);
            }
        };

        this._socket.onerror = function(evt) {
            self._socket = null;
            self.isReady = false;
        };
    }

    popMessage() {
        if (this._messagesQueue.length > 0) {
            var msg = this._messagesQueue.shift();

            var data;
            try {
                data = JSON.parse(msg);
            } catch (e) {
                cc.error(e);
            }

            return data;
        }

        return null;
    }

    popRawMessage() {
        if (this._messagesQueue.length > 0) {
            return this._messagesQueue.shift();
        }

        return null;
    }

    send(data) {
        if (this.isReady && this._socket) {
            var msg = JSON.stringify(data);
            this._socket.send(msg);
        } else {
            this._pendingQueue.push(data);
        }
    }

    sendBuffer(buffer) {
        if (this.isReady && this._socket) {
            this._socket.send(buffer);
        } else {
            this._pendingBuffer.push(buffer);
        }
    }

    flush() {
        this._messagesQueue.length = 0;
        this._pendingQueue.length = 0;
        this._pendingBuffer.length = 0;
    }
}

module.exports = SocketClient;
