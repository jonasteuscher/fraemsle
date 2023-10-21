module.exports = {
  apps : [{
    script: 'npm start',
  }, ],

  deploy : {
    production : {
      key: 'ec2_keypair.pem',
      user : 'ubuntu',
      host : '',
      ref  : 'origin/main',
      repo : 'git@github.com:jonasteuscher/fraemsle.git', 
      path : '/home/ubuntu',
      'pre-deploy-local': '',
      'post-deploy': 'source ~/.nvm/nvm.sh && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
