'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class user extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate(models) {
			// define association here
			models.user.hasMany(models.note);

			// // this solution did not work
			models.user.belongsToMany(models.tweet, { through: 'user_tweet' });
		}
	}
	user.init(
		{
			firstName: DataTypes.STRING(255),
			lastName: DataTypes.STRING(255),
			email: DataTypes.STRING(255),
			password: DataTypes.STRING(255)
		},
		{
			sequelize,
			modelName: 'user'
		}
	);
	return user;
};
