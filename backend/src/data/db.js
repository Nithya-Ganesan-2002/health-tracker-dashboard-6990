'use strict';
const fs = require('fs');
const path = require('path');
const { getConfig } = require('../config');

class JsonDatabase {
  constructor() {
    const cfg = getConfig();
    this.dataPath = path.join(cfg.dataDir, 'data.json');
    this._ensureFile();
    this._data = this._read();
  }

  _ensureFile() {
    const dir = path.dirname(this.dataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.dataPath)) {
      const initial = { users: [], calories: [], workouts: [] };
      fs.writeFileSync(this.dataPath, JSON.stringify(initial, null, 2));
    }
  }

  _read() {
    try {
      const raw = fs.readFileSync(this.dataPath, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to read DB file, reinitializing.', err);
      const initial = { users: [], calories: [], workouts: [] };
      fs.writeFileSync(this.dataPath, JSON.stringify(initial, null, 2));
      return initial;
    }
  }

  _write() {
    fs.writeFileSync(this.dataPath, JSON.stringify(this._data, null, 2));
  }

  // PUBLIC_INTERFACE
  getUsers() {
    /** Returns the list of users */
    return this._data.users || [];
  }

  // PUBLIC_INTERFACE
  setUsers(users) {
    /** Replaces users array and persists to disk */
    this._data.users = users;
    this._write();
  }

  // PUBLIC_INTERFACE
  getCalories() {
    /** Returns the list of calorie entries */
    return this._data.calories || [];
  }

  // PUBLIC_INTERFACE
  setCalories(calories) {
    /** Replaces calories array and persists to disk */
    this._data.calories = calories;
    this._write();
  }

  // PUBLIC_INTERFACE
  getWorkouts() {
    /** Returns the list of workout plans */
    return this._data.workouts || [];
  }

  // PUBLIC_INTERFACE
  setWorkouts(workouts) {
    /** Replaces workouts array and persists to disk */
    this._data.workouts = workouts;
    this._write();
  }
}

module.exports = new JsonDatabase();
