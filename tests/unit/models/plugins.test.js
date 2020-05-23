const mongoose = require('mongoose');
const { describe, test, beforeEach } = require('@jest/globals');

const { toJSON } = require('../../../src/models/plugins');

describe('Model utils', () => {
  describe('toJSON plugin', () => {
    let connection;

    beforeEach(() => {
      connection = mongoose.createConnection();
    });

    test('should replace _id with id', () => {
      const schema = mongoose.Schema();
      schema.plugin(toJSON);
      const Model = connection.model('Model', schema);
      const doc = new Model();
      expect(doc.toJSON()).not.toHaveProperty('_id');
      expect(doc.toJSON()).toHaveProperty('id', doc._id.toString());
    });

    test('should remove __v', () => {
      const schema = mongoose.Schema();
      schema.plugin(toJSON);
      const Model = connection.model('Model', schema);
      const doc = new Model();
      expect(doc.toJSON()).not.toHaveProperty('__v');
    });

    test('should remove createdAt and updatedAt', () => {
      const schema = mongoose.Schema({}, { timestamps: true });
      schema.plugin(toJSON);
      const Model = connection.model('Model', schema);
      const doc = new Model();
      expect(doc.toJSON()).not.toHaveProperty('createdAt');
      expect(doc.toJSON()).not.toHaveProperty('updatedAt');
    });

    test('should remove any path set as private', () => {
      const schema = mongoose.Schema({
        public: { type: String },
        private: { type: String, private: true },
      });
      schema.plugin(toJSON);
      const Model = connection.model('Model', schema);
      const doc = new Model({ public: 'some public value', private: 'some private value' });
      expect(doc.toJSON()).not.toHaveProperty('private');
      expect(doc.toJSON()).toHaveProperty('public');
    });

    test('should also call the schema toJSON transform function', () => {
      const schema = mongoose.Schema(
        {
          public: { type: String },
          private: { type: String },
        },
        {
          toJSON: {
            transform: (doc, ret) => {
              // eslint-disable-next-line no-param-reassign
              delete ret.private;
            },
          },
        }
      );
      schema.plugin(toJSON);
      const Model = connection.model('Model', schema);
      const doc = new Model({ public: 'some public value', private: 'some private value' });
      expect(doc.toJSON()).not.toHaveProperty('private');
      expect(doc.toJSON()).toHaveProperty('public');
    });
  });
});
