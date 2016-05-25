module.exports = [{
  method: 'GET',
  path: '/test',
  config: {
    handler: {
      view: 'test'
    }
  }
}, {
  method: 'GET',
  path: '/flood-test',
  config: {
    handler: {
      view: 'flood-test'
    }
  }
}]
