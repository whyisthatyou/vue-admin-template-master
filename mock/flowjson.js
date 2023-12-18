

  
  module.exports = [
    // user login
 
    // user logout
    {
      url: '/flowjson',
      type: 'get',
      response: _ => {
        return {
          code: 20000,
          data: 'success'
        }
      }
    }
  ]
  