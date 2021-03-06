const mongoose = require('mongoose');
const consoleUtil = require(`${process.cwd()}/util/console`);

require('dotenv').config();
const { MONGO_URI } = process.env;

module.exports = class Mongoose {
  constructor(client, options = {}) {

    /**
     * The client that instantiated this
     * @name Mongoose#client
     * @type {MikaClient}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client })

    /**
     * The connection URI for this instance
     * @type {string}
     */
    if (typeof options.connector === 'string') {
      this.connector = options.connector;
    } else {
      // this.connector = `mongodb://botAdmin:${options.password}@botdev-shard-00-00-pblka.mongodb.net:27017,botdev-shard-00-01-pblka.mongodb.net:27017,botdev-shard-00-02-pblka.mongodb.net:27017/vileDocs?replicaSet=BotDev-shard-0&ssl=true&authSource=admin`;
      this.connector = MONGO_URI;
    };

    /**
     * The connection settings for this instance
     * @type {object}
     */
    this.settings = options.config;

    /**
     * instance of mongoose library
     * @type {object}
     */
    this.db = mongoose;

    /**
     * whether the client is connected to the database
     * @type {string}
     */
    this.connected = false;

    // Listen to event to set connected to true or false
    this.db.connection.on('connected', () => this.connected = true);
    this.db.connection.on('disconnect', () => this.connected = false);
  }

  /**
   * Initialize this database
   * @returns {Object<Database>}
   */
  init() {

    this.db.connect(this.connector, this.settings).catch((error) => {
      consoleUtil.error(error.message, 'db');
    });

    this.db.set('useFindAndModify', false)
    this.db.Promise = global.Promise;

    this.db.connection.on('connected', () => consoleUtil.success('Connected to MongoDB!'));

    return this.db;
  };
};
