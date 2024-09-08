module.exports = {
  apps: [
    {
      name: 'instamoa',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        HOST: '0.0.0.0',
        PORT: 33012,
        NODE_ENV: 'production'
      },
      output: './logs/console.log',
      error: './logs/consoleError.log'
    }
  ]
}
