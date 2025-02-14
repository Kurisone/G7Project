
class NoResourceError extends Error {
    constructor(message, status = 404) {
        super(message)
        this.status = status;
    }

    throwThis(){
        throw this;
    }

    static throw(message, status){
        const newError = new NoResourceError(message, status);
        throw newError;
    }
}

module.exports = {NoResourceError};
