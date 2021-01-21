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
      'post-setup': 'npm version,',
      'post-deploy': 'npm install && npm run build:pro && pm2 startOrRestart ecosystem.config.js --env production',
    },
    staging: {
      key: '/home/ryden/.ssh/Heavy-Storm.pem',
      user: 'ubuntu',
      host: '3.17.59.237',
      ref: 'origin/Automate',
      repo: 'git@github.com:RemoteReq/Backend.git',
      path: '/home/ubuntu/',
      'pre-deploy-local': "echo 'beginning dev server deployment'",
      'post-setup': 'npm version,',
      'post-deploy': 'npm install && npm run build:dev && pm2 startOrRestart ecosystem.config.js --env staging',
    },
  },
};
