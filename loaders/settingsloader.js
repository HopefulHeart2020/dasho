'use strict';
/**
 * Represents SettingLoader Logic, contains NeDb Logic.
 *
 * @author Philipp Bachmann, Jon Uhlmann
 */
module.exports = (function () {
  const passwordHash = require('password-hash');
  const schemaloader = require('./schemaloader');

  // Create NeDb Datastore
  let Datastore = require('nedb'),
    db = {};

  // Initialize Datastores
  db.users = new Datastore({ filename: 'api/data/users.db', autoload: true }),
    db.configs = new Datastore({ filename: 'api/data/configs.db', autoload: true }),
    db.tiles = new Datastore({ filename: 'api/data/tiles.db', autoload: true }),
    db.clients = new Datastore({ filename: 'api/data/clients.db', autoload: true }),
    db.tokens = new Datastore({ filename: 'api/data/tokens.db', autoload: true });

  /**
   * Initialize SettingsLoader, creates if not exists all datastores.
   * @function
   */
  function init() {
    // Clients OAuth Configuration
    db.clients.count({}, function (err, count) {
      // Insert Client, if not exists.
      if (count == 0) {
        db.clients.insert([
          { clientId: 'dasho', clientSecret: '$ecret', redirectUris: [''] }
        ]);
      }
    });

    // Tiles
    db.tiles.count({}, function (err, count) {
      // Insert Tiles, if not exists.
      if (count == 0) {
        db.tiles.insert([
          { _id: "ZkNW1xMuVq7B1rn5", name: 'googleapi', baseUrl: 'https://www.googleapis.com/pagespeedonline/v2/runPagespeed', apikey: '', apisecret: '' },
          { _id: "8vJH0MaIin7KDpUY", name: 'github', baseUrl: 'https://api.github.com', apikey: '0a01416559cc95dc055d', apisecret: '' },
          { _id: "mB2wXblzppRSnewm", name: 'openweather', baseUrl: 'http://api.openweathermap.org/data/2.5/weather', apikey: '', apisecret: '' },
          { _id: "JyVSFAw0ygrFphVp", name: 'twitter', baseUrl: 'https://api.twitter.com', apikey: '', apisecret: '' },
          { _id: "tuAPdN68QwtG4Aha", name: 'fixer', baseUrl: 'http://data.fixer.io/api/latest', apikey: '', apisecret: '' },
          { _id: "d3THA4b9mkxhqVQ3", name: 'news', baseUrl: 'https://newsapi.org/v1/articles', apikey: '', apisecret: '' },
          { _id: "88MjFRnZnNrVYKsI", name: 'clock', baseUrl: '', apikey: '', apisecret: '' }
        ]);
      }
    });

    // Tiles Configuration
    db.configs.count({}, function (err, count) {
      // Insert Configurations, if not exists.
      if (count == 0) {
        db.configs.insert([
          { userid: "6kO2i9Wt2ElAjvdl", tileid: "ZkNW1xMuVq7B1rn5", position: 0, visible: true, querystring: '?url=http://www.phil.ch&strategy=${strategy}' },
          { userid: "6kO2i9Wt2ElAjvdl", tileid: "8vJH0MaIin7KDpUY", position: 1, visible: true, querystring: '/repos/pbachman/dasho?client_id=${apikey}&client_secret=${apisecret}' },
          { userid: "6kO2i9Wt2ElAjvdl", tileid: "mB2wXblzppRSnewm", position: 2, visible: true, querystring: '?q=Zug,CHE&appid=${apiKey}&units=metric' },
          { userid: "6kO2i9Wt2ElAjvdl", tileid: "JyVSFAw0ygrFphVp", position: 3, visible: true, querystring: '/1.1/users/lookup.json?screen_name=pbachman_ch' },
          { userid: "6kO2i9Wt2ElAjvdl", tileid: "tuAPdN68QwtG4Aha", position: 4, visible: true, querystring: '?access_key=${apiKey}&format=1&base=EUR' },
          { userid: "6kO2i9Wt2ElAjvdl", tileid: "d3THA4b9mkxhqVQ3", position: 5, visible: true, querystring: '?source=metro&apiKey=${apiKey}' },
          { userid: "6kO2i9Wt2ElAjvdl", tileid: "88MjFRnZnNrVYKsI", position: 6, visible: true, querystring: '' }
        ]);
      }
    });

    // Users
    db.users.count({}, function (err, count) {
      // Insert Standard User, if not exists.
      if (count == 0) {
        db.users.insert([
          { _id: "6kO2i9Wt2ElAjvdl", email: 'hi@dasho.co', password: passwordHash.generate('test1234'), caninvite: true }]
        );
      }
    });
  }

  /**
   * Gets a oAuth Client.
   * @function
   * @param {object} Client.
   * @param {object} callback
   */
  function getClients(client, callback) {
    db.clients.findOne({ clientId: client.clientId, clientSecret: client.clientSecret }, callback);
  }

  /**
   * Verifies Username/Password.
   * @function
   * @param {string} user.
   * @param {string} password.
   * @param {object} callback.
   */
  function verifyLogin(user, password, callback) {
    if (typeof callback == 'function') {
      db.users.findOne({ email: user }, function (err, user) {
        let checkpassword = passwordHash.verify(password, user.password)
        if (checkpassword) {
          callback(err, user);
        }
        else {
          callback(err, null);
        }
      });
    }
  }

  /**
   * Saves a oAuth Token.
   * @function
   * @param {string} accessToken.
   * @param {string} clientId.
   * @param {date} expires.
   * @param {object} user.
   * @param {object} callback.
   */
  function saveAccessToken(accessToken, clientId, expires, user, callback) {
    db.tokens.insert({ accessToken: accessToken, clientId: clientId, expires: expires, user: user.email }, callback);
  }

  /**
   * Gets a Token.
   * @function
   * @param {string} accessToken.
   * @param {object} callback.
   */
  function getAccessToken(accessToken, callback) {
    db.tokens.findOne({ accessToken: accessToken }, callback);
  }

  /**
   * Gets a User by Name.
   * @function
   * @param {string} user.
   * @return {promise} promise
   */
  function getUserByName(user) {
    return new Promise((resolve, reject) => {
      db.users.findOne({ email: user }, function (err, user) {
        if (err) {
          return reject(err);
        }
        if (user) {
          return resolve(user);
        }
        return resolve(null);
      });
    });
  }

  /**
   * Checks if a User is allowed to invite.
   * @function
   * @param {string} user.
   * @return {promise} promise
   */
  function isUserAllowed(user) {
    return new Promise((resolve, reject) => {
      db.users.findOne({ email: user, caninvite: true }, function (err, user) {
        if (err) {
          return reject(err);
        }
        return resolve(user);
      });
    });
  }

  /**
   * Adds a new User.
   * @function
   * @param {object} user
   * @return {promise} promise
   */
  function addUser(user) {
    return new Promise((resolve, reject) => {
      db.users.insert(user, function (err, user) {
        if (err) {
          return reject(err);
        } else {
          return resolve(user);
        }
      });
    });
  }

  /**
   * Sets a Password.
   * @function
   * @param {object} user
   * @param {string} newpassword
   * @return {promise} promise
   */
  function setsPassword(user, newpassword) {
    return new Promise((resolve, reject) => {
      db.users.update(user, { $set: { password: passwordHash.generate(newpassword) } }, { multi: true }, function (err, numReplaced) {
        if (err) {
          return reject(err);
        } else {
          return resolve(true);
        }
      });
    });
  }

  /**
   * Returns a List of Settings by User.
   * @function
   * @param {object} user
   * @return {promise} promise
   */
  function getSettings(user) {
    return new Promise((resolve, reject) => {
      db.configs.find({ userid: user._id }).sort({ position: 1 }).exec((err, configs) => {
        if (err) {
          return reject(err);
        } else {
          let userconfigs = [];

          if (configs) {
            // extends the current config with the graphql query.
            var promises = [];
            configs.forEach((configItem) => {
              promises.push(
                getTileById(configItem.tileid).then((tile) => {
                  const userConfig = {
                    id: configItem._id,
                    tile: tile.name,
                    position: configItem.position,
                    schemas: schemaloader.getSchemaQueryByTile(tile.name),
                    visible: configItem.visible,
                  };
                  userconfigs.push(userConfig);
                })
              );
            });

            return Promise.all(promises).then(() => {
              resolve(userconfigs)
            }, function (error) {
              reject(`No Configs not set! ${error}`);
            });
          }
        }
      });
    });
  }

  /**
   * Saves a List of User Configs.
   * @function
   * @param {object} setting
   * @return {promise} promise
   */
  function saveSetting(setting) {
    return new Promise((resolve, reject) => {
      db.configs.update({ _id: setting.id }, { $set: { position: setting.position, visible: setting.visible } }, function (err, setting) {
        if (err) {
          return reject(err);
        }
        return resolve(setting);
      });
    });
  }

  /**
   * Assign Tile to User.
   * @function
   * @param {string} user
   * @param {string} tile
   * @return {promise} promise
   */
  function assignTile(user, tile) {
    return new Promise((resolve, reject) => {
      return getTileByName(tile).then((tile) => {
        db.configs.insert({ userid: user, tileid: tile._id, position: 1, visible: true }, (err, config) => {
          if (err) {
            return reject(err);
          }
          return resolve(config);
        });
      }, (err) => {
        return reject(err);
      });
    });
  }

  /**
   * Gets all Tiles.
   * @function
   * @return {promise} promise
   */
  function getTiles() {
    return new Promise((resolve, reject) => {
      db.tiles.find({}, function (err, tiles) {
        if (err) {
          return reject(err);
        } else {
          return resolve(tiles);
        }
      });
    });
  }

  /**
   * Gets a Tile by Name.
   * @function
   * @param {string} name
   * @return {promise} promise
   */
  function getTileByName(name) {
    return new Promise((resolve, reject) => {
      db.tiles.findOne({ name: name }, function (err, tile) {
        if (err) {
          return reject(err);
        } else {
          return resolve(tile);
        }
      });
    });
  }

  /**
   * Gets a Tile by Id.
   * @function
   * @param {string} id
   * @return {promise} promise
   */
  function getTileById(id) {
    return new Promise((resolve, reject) => {
      db.tiles.findOne({ _id: id }, (err, tile) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(tile);
        }
      });
    });
  }

  /**
   * Gets a TileConfig.
   * @function
   * @param {string} user
   * @param {object} tile
   * @return {promise} promise
   */
  function getTileConfig(user, tile) {
    return new Promise((resolve, reject) => {
      db.tiles.findOne({ name: tile }, (err, tile) => {
        if (err) {
          return reject(err);
        } else {
          return getUserByName(user).then((user) => {
            if (user && tile) {
              db.configs.findOne({ tileid: tile._id, userid: user._id }, function (err, config) {
                if (err) {
                  return reject(err);
                } else {
                  // combines Tile and Config
                  let tileConfig = {
                    baseUrl: tile.baseUrl,
                    apikey: tile.apikey,
                    apisecret: tile.apisecret,
                    querystring: config.querystring
                  }
                  return resolve(tileConfig);
                }
              })
            } else {
              return reject('Tile or User not set!');
            }
          }, (err) => {
            return reject(err);
          })
        }
      });
    });
  }
  init();

  return {
    addUser: addUser,
    assignTile: assignTile,
    getTiles: getTiles,
    getTileById: getTileById,
    getTileByName: getTileByName,
    getClients: getClients,
    verifyLogin: verifyLogin,
    getAccessToken: getAccessToken,
    saveAccessToken: saveAccessToken,
    setsPassword: setsPassword,
    isUserAllowed: isUserAllowed,
    getSettings: getSettings,
    saveSetting: saveSetting,
    getTileConfig: getTileConfig,
    getUserByName: getUserByName
  };
})();
