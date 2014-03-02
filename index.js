module.exports = process.env.GULP_AUTOPOLYFILLER_COVERAGE ?
    require('./lib-cov') :
    require('./lib');
