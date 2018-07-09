const Consecutive = require('..')


test('basic', function(done)
{
  const consecutive = new Consecutive

  consecutive.write({id: 2})
  consecutive.write({id: -2})
  consecutive.write({id: 1})
  consecutive.write({id: 1})
  consecutive.write({id: 0})
  consecutive.write({id: 0})

  consecutive.once('data', function(data)
  {
    expect(data).toEqual({id: 0})

    consecutive.once('data', function(data)
    {
      expect(data).toEqual({id: 1})

      consecutive.once('data', function(data)
      {
        expect(data).toEqual({id: 2})

        done()
      })
    })
  })
})
