module.exports = {
  apps: [{
    name: 'RemoteReq',
    script: './server/server.js',
  }],
  deploy: {
    production: {
      key: '/home/ryden/.ssh/Normal-Strom.pem',
      user: 'ubuntu',
      host: '3.138.218.62',
      ref: 'origin/master',
      repo: 'git@github.com:RemoteReq/Backend.git',
      path: '/home/ubuntu/',
      'pre-deploy-local': "echo 'beginning production deployment'",
      'post-deploy': '&& pm2 startOrRestart ecosystem.config.js --env production',
    },
    development: {
      key: '/home/ryden/.ssh/Heavy-Storm.pem',
      user: 'ubuntu',
      host: '3.139.183.13',
      ref: 'origin/development',
      repo: 'git@github.com:RemoteReq/Backend.git',
      path: '/home/ubuntu/',
      'pre-deploy-local': "echo 'beginning dev server deployment'",
      'post-deploy': 'pm2 startOrRestart ecosystem.config.js --env development',
    },
  },
};
