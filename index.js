const {Transform} = require('stream')


function defaultSort(a, b)
{
  return b - a
}


module.exports = class Consecutive extends Transform
{
  constructor({idField = 'id', lastId = 0, sort = defaultSort, ...options} = {})
  {
    super({...options, objectMode: true})

    this._buffer = new Map
    this._idField = idField
    this._lastId = lastId
    this._sort = sort
  }

  _transform(chunk, _, callback)
  {
    const {_buffer, _idField, _sort} = this
    let   {_lastId}                  = this

    const id = chunk[_idField]
    if(_buffer.has(id)) return callback()  // Ignore duplicated chunks

    const result = _sort(_lastId, id)
    if(result > 0) _buffer.set(id, chunk)

    else if(result === 0)
    {
      do
      {
        _lastId++
        this.push(chunk)  // It's simpler to ignore if reader needs more data,
                          // anyway we only empty one buffer and fill another...

        chunk = _buffer.get(_lastId)
      }
      while(_buffer.delete(_lastId))  // `false` when `_lastId` didn't exists

      this._lastId = _lastId
    }

    callback()
  }
}
