'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('tweets', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			tweetId: {
				type: Sequelize.STRING
			},
			text: {
				type: Sequelize.TEXT
			},
			author_id: {
				type: Sequelize.STRING
			},
			username: {
				type: Sequelize.STRING
			},
			url: {
				type: Sequelize.TEXT
			},
			userId: {
				type: Sequelize.INTEGER
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('tweets');
	}
};
