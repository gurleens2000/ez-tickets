'use strict';

var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        type: DataTypes.STRING
    }, {});
    User.beforeSave((user, options) => {
        if (user.changed('password')) {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
        }
    });
    User.prototype.comparePassword = function(passw, cb) {
        bcrypt.compare(passw, this.password, function(err, isMatch) {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        });
    };
    User.associate = function(models) {
        models.User.hasMany(models.Venue, {
            onDelete: "CASCADE"
        })
    };
    return User;
};