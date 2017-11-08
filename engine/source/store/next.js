// @flow

export const nextMiddleware = (store: Store, action: any, next: Function) => {
    next(action);

    if (action.next) {
        const nextAction = action.next;
        delete action.next;
        store.dispatch(nextAction);
    }
}

export default nextMiddleware;