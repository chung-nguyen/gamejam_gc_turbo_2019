// @flow

export const httpRequest = (opts: any, callback: Function) => {
    const { url, method, header, data, timeout } = opts;
    const xhr = cc.loader.getXMLHttpRequest();
    xhr.open((method || "GET"), url, true);    

    xhr.timeout = timeout || 5000;

    // set the header
    if (header) {
        for (const k in header) {
            xhr.setRequestHeader(k, header[k]);
        }
    }

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback && callback(xhr.status, xhr.response, xhr.responseText);
            callback = null;
        }        
    };

    xhr.onerror = function() {
        callback && callback(xhr.status, null, 'loaded ' + url + ' error');
        callback = null;
    }

    xhr.ontimeout = function () {
        callback && callback(-1, null, 'loaded ' + url + ' timeout');
        callback = null;
    }

    if (data) {
        xhr.send(data);
    } else {
        xhr.send();
    }    
}

export default httpRequest;