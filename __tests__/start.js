const {start} = require('..')


test('basic', function(done)
{
  const stream = start()

  stream.write({start: 2})
  stream.write({start: -2})
  stream.write({start: 1})
  stream.write({start: 1})
  stream.write({start: 0})
  stream.write({start: 0})

  stream.once('data', function(data)
  {
    expect(data).toEqual({start: 0})

    stream.once('data', function(data)
    {
      expect(data).toEqual({start: 1})

      stream.once('data', function(data)
      {
        expect(data).toEqual({start: 2})

        done()
      })
    })
  })
})
