const {Transform} = require('stream')

const {defaultSort} = require('./util')


module.exports = function consecutive({
  idField = 'id', nextId = 0, sort = defaultSort, ...options} = {}
) {
  const buffer = new Map

  return new Transform({
    ...options,
    objectMode: true,
    transform(chunk, _, callback)
    {
      const id = chunk[idField]
      if(buffer.has(id)) return callback()  // Ignore duplicated chunks

      const result = sort(nextId, id)
      if(result > 0) buffer.set(id, chunk)

      else if(result === 0)
        do
        {
          nextId++
          this.push(chunk)  // It's simpler to ignore if reader needs more data,
                            // anyway we only empty one buffer and fill another...

          chunk = buffer.get(nextId)
        }
        while(buffer.delete(nextId))  // `false` when `nextId` didn't exists

      callback()
    }
  })
}
