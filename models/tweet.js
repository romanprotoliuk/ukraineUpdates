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
			// this solution did not work
			// models.tweet.belongsToMany(models.user, { through: 'user_tweet', onDelete: 'CASCADE' });
			// switched to this
			models.tweet.belongsTo(models.user);
		}
	}
	tweet.init(
		{
			tweetId: DataTypes.STRING(255),
			text: DataTypes.TEXT,
			author_id: DataTypes.STRING(255),
			username: DataTypes.STRING(255),
			url: DataTypes.TEXT,
			userId: DataTypes.INTEGER
		},
		{
			sequelize,
			modelName: 'tweet'
		}
	);
	return tweet;
};
