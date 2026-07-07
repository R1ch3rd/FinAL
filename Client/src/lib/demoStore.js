// localStorage-backed demo persistence.
// The original app stored transactions and the stock portfolio in
// Firestore; the public demo keeps everything on-device instead.
const KEY = 'final-demo-store'

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function getAll(collection) {
  return read()[collection] || []
}

export function add(collection, item) {
  const data = read()
  const list = data[collection] || []
  const withId = { id: crypto.randomUUID(), ...item }
  data[collection] = [...list, withId]
  write(data)
  return withId
}

export function remove(collection, id) {
  const data = read()
  data[collection] = (data[collection] || []).filter((x) => x.id !== id)
  write(data)
}
