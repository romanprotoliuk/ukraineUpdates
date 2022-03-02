'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class tweet extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate(models) {
			// define association here
			models.tweet.belongsToMany(models.user, { through: 'user_tweet' });
		}
	}
	tweet.init(
		{
			tweetId: DataTypes.STRING(255),
			text: DataTypes.TEXT,
			source: DataTypes.STRING(255),
			url: DataTypes.TEXT
		},
		{
			sequelize,
			modelName: 'tweet'
		}
	);
	return tweet;
};
