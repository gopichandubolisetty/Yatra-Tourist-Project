const fs = require('fs');
const path = require('path');
const { generateId } = require('./generateId');

const DATA_DIR = path.join(__dirname, '../../data');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    console.error('fileStore ensureDataDir:', e.message);
  }
}

function filePath(filename) {
  return path.join(DATA_DIR, filename);
}

function readData(filename) {
  ensureDataDir();
  const fp = filePath(filename);
  try {
    if (!fs.existsSync(fp)) {
      fs.writeFileSync(fp, '[]', 'utf8');
      return [];
    }
    const raw = fs.readFileSync(fp, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error(`readData(${filename}):`, e.message);
    return [];
  }
}

function writeData(filename, data) {
  ensureDataDir();
  const fp = filePath(filename);
  try {
    if (!Array.isArray(data)) {
      throw new Error('writeData expects an array');
    }
    fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error(`writeData(${filename}):`, e.message);
    return false;
  }
}

function findById(filename, id) {
  const items = readData(filename);
  return items.find((item) => item.id === id) || null;
}

function findByField(filename, field, value) {
  const items = readData(filename);
  return items.filter((item) => item[field] === value);
}

function insertOne(filename, object) {
  const items = readData(filename);
  const row = {
    ...object,
    id: object.id || generateId(),
    createdAt: object.createdAt || new Date().toISOString(),
  };
  items.push(row);
  writeData(filename, items);
  return row;
}

function updateOne(filename, id, updates) {
  const items = readData(filename);
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates, id: items[idx].id };
  writeData(filename, items);
  return items[idx];
}

function deleteOne(filename, id) {
  const items = readData(filename);
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  writeData(filename, next);
  return true;
}

module.exports = {
  readData,
  writeData,
  findById,
  findByField,
  insertOne,
  updateOne,
  deleteOne,
  DATA_DIR,
};
