//utility  (higher order function)

const asyncHandler = (reqHandler) => {
    (req, res, next) => {
        Promise
        .resolve(reqHandler(req, res, next))
        .catch((error) => next(error));
    }
}

export default asyncHandler;