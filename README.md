# stream-sorter

Emit sorted stream chunks, buffering the quick ones and discarding the ones that
lost the train

## Install

```sh
npm install stream-sorter
```

## API

### consecutive

Emit the data chunks in order, ignoring the old ones

- *options*: options passed to underlying `Transform` stream
  - *idField*: fields used to store data chunk identifier
  - *nextId*: initial ID
  - *sort*: function used to compare and sort the data chunks

### latest

Drop data chunks older than the latest emitted one

- *options*: options passed to underlying `Transform` stream
  - *idField*: fields used to store data chunk identifier
  - *lastId*: initial ID
  - *sort*: function used to compare and sort the data chunks

### start

Emit the data chunks in bytes order ignoring old ones and allowing intersections

- *options*: options passed to underlying `Transform` stream
  - *idField*: fields used to store data chunk identifier
  - *start*: initial ID
  - *sort*: function used to compare and sort the data chunks
