const knex = require('./knex');

class BaseRepo {
  constructor(table, { defaultSelect = '*', upsertIndex = 'id' } = {}) {
    if (!table) {
      throw new Error('Must provide a table');
    }

    this._table = table;
    this._defaultSelect = defaultSelect;
    this._upsertIndex = upsertIndex;
  }

  create({ data = {}, select } = {}) {
    return knex.transaction(trx => (
      knex(this._table)
        .transacting(trx)
        .insert(data, select || this._defaultSelect)
        .then(trx.commit)
        .catch(trx.rollback)
    ));
  }

  selectOne({ query = {}, select } = {}) {
    return knex.transaction(trx => (
      knex(this._table)
        .transacting(trx)
        .first(select || this._defaultSelect)
        .where(query)
        .then(trx.commit)
        .catch(trx.rollback)
    ));
  }

  update({ query = {}, data = {}, select } = {}) {
    return knex.transaction(trx => (
      knex(this._table)
        .transacting(trx)
        .where(query)
        .update(data, select || this._defaultSelect)
        .then(trx.commit)
        .catch(trx.rollback)
    ));
  }

  upsert({ data = {}, select } = {}) {
    const query = { [this._upsertIndex]: data[this._upsertIndex] };

    return this.update({ query, data, select })
      .then(res => (
        res && (!Array.isArray(res) || res.length) ? res :
          this.create({ data, select })
      ));
  }

  findOrCreate({ data = {}, select } = {}) {
    const query = { [this._upsertIndex]: data[this._upsertIndex] };

    return this.selectOne({ query, select })
      .then(entity => entity || this.create({ data, select }));
  }

  select({ query = {}, select } = {}) {
    return knex.transaction(trx => (
      knex(this._table)
        .transacting(trx)
        .select(select || this._defaultSelect)
        .where(query)
        .then(trx.commit)
        .catch(trx.rollback)
    ));
  }
}

module.exports = BaseRepo;