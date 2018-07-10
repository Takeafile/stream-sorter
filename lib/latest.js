const {Transform} = require('stream')

const {defaultSort} = require('./util')


module.exports = function latest({
  idField = 'id', lastId = -Infinity, sort = defaultSort, ...options} = {}
) {
  return new Transform({
    ...options,
    objectMode: true,
    transform(chunk, _, callback)
    {
      const id = chunk[idField]

      if(sort(lastId, id) > 0)
      {
        this.push(chunk)  // It's simpler to ignore if reader needs more data,
                          // anyway we only empty one buffer and fill another...

        lastId = id
      }

      callback()
    }
  })
}
