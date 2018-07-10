const {latest} = require('..')


test('basic', function(done)
{
  const stream = latest()

  stream.write({id: -2})
  stream.write({id: 0})
  stream.write({id: 1})
  stream.write({id: 1})
  stream.write({id: 2})
  stream.write({id: 0})

  stream.once('data', function(data)
  {
    expect(data).toEqual({id: -2})

    stream.once('data', function(data)
    {
      expect(data).toEqual({id: 0})

      stream.once('data', function(data)
      {
        expect(data).toEqual({id: 1})

        stream.once('data', function(data)
        {
          expect(data).toEqual({id: 2})

          done()
        })
      })
    })
  })
})
