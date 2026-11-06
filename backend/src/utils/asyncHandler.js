// Express 4 no captura promesas rechazadas: este wrapper envia el error a next().
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
