const {Transform} = require('stream')

const {defaultSort} = require('./util')


module.exports = function start(
  {
    idField = 'start',
    start = 0,
    sort = defaultSort,
    ...options
  } = {}
) {
  const buffer = new Map

  function transform(chunk, _, callback)
  {
    const id     = chunk[idField]
    const end    = id + chunk.length || 1
    const sorted = Array.from(buffer.keys()).sort()

    // Get buffer intersections from chunk
    const prefixIndex = sorted.find(function(key)
    {
      return id <= key
    })

    const suffixIndex = sorted.reverse().find(function(key)
    {
      return key + buffer.get(key).length < end
    })

    // Remove buffer intersections from chunk
    if(suffixIndex != null && suffixIndex >= 0)
    {
      const suffixEnd = suffixIndex + buffer.get(suffixIndex).length
      if(id < suffixEnd) buffer.set(suffixEnd, chunk.slice(end - suffixEnd))
    }

    if(prefixIndex >= 0 && prefixIndex < end)
    {
      chunk = chunk.slice(0, prefixIndex - id)

      if(!chunk.length) return callback()
    }

    // Emit data chunks
    const result = sort(start, id)
    if(result > 0) buffer.set(id, chunk)

    else if(result === 0)
      do
      {
        this.push(chunk)  // It's simpler to ignore if reader needs more data,
                          // anyway we only move data chunks from one buffer to
                          // another...

        start += chunk.length || 1
        chunk = buffer.get(start)
      }
      while(buffer.delete(start))  // `false` when `start` entry didn't exists

    callback()
  }

  return new Transform({...options, objectMode: true, transform})
}
