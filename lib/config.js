module.exports = {
  development:{
    root:require('path').normalize(__dirname + '/..')+"/",
    host:'localhost',
    port:'3000',
    version:'0.0.0',
    db_prefix: 'mongodb',
    db_port: '27017',
    db_name:'development',
  },
  test:{
    db_name: 'test',
  },
  production:{
  }
}
