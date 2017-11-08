// @flow

import httpRequest from '../utils/httpRequest';

var config = require('config');

export const apiMiddleware = (store: Store, action: any, next: Function) => {
    if (action.api && !action.response && !action.error) {        
        const accessToken = store.getState().authenticate.accessToken;
        const apiHeader = {
            "Content-Type": "application/json",
            "X-Access-Token": accessToken
        };                

        httpRequest({
            url: config.gatewayAddress + action.api.endpoint, 
            method: action.api.method || "POST", 
            header: apiHeader, 
            data: JSON.stringify(action.api.payload),
            timeout: 5000
        }, (status, res, responseText) => {                    
            if (status == 200) {
                try {                    
                    const response = JSON.parse(responseText);
                    const error = response.error;

                    if (!error) {
                        action.response = response;
                        return next(action);
                    } else {
                        action.error = error;
                        if (action.api.ignoreError) {
                            return next(action);
                        }
                    }
                } catch (e) {
                    action.error = [{code: 'invalid_response', what: [responseText], say: e.toString()}];
                }                                
            } else {            
                action.error = [{code: 'http_error', what: [status]}];                
            }            
            
            store.discard(action);
        });
    } else {
        next(action);
    }    
}

export default apiMiddleware;