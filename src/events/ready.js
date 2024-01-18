const { Client, Events, ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const chalk = require('chalk');
const mongo = process.env.DATABASE;
 
function progressBar(progress) {
    const width = 20;
    const percentage = Math.floor(progress / 100 * width);
    const progressBar = `${'='.repeat(percentage)}${' '.repeat(width - percentage)}`;
    return `[${progressBar}] ${progress}%`;
}
 
module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(chalk.bold("Connecting to the database..."));

        client.user.setActivity("For People Breaking the Rules", { type: ActivityType.Watching })

        try {
            let progress = 10;
            const progressUpdateInterval = 10; // Increase to set more frequent updates
            const maxProgress = 100;
 
            while (progress <= maxProgress) {
                console.log(chalk.yellow.bold(`Database Connecting: ${progressBar(progress)}`));
                await new Promise(resolve => setTimeout(resolve, 500)); // Increased to 0.5 second delay
                progress += progressUpdateInterval;
            }
 
            await new Promise(resolve => setTimeout(resolve, 1000)); // Increased to 1 second delay
 
            mongoose.connection.on('connecting', () => {
                console.log(chalk.gray.bold('Database Connection: Attempting to connect...'));
            });
 
            mongoose.connection.on('connected', () => {
                console.log(chalk.green.bold('Database Connection: ✅ Connected'));
            });
 
            mongoose.connection.on('error', (error) => {
                console.error(chalk.red.bold('Error connecting to the database:', error.message));
            });
 
            mongoose.connection.on('disconnected', () => {
                console.log(chalk.red.bold('Database Connection: ❌ Disconnected'));
            });
 
            await mongoose.connect(mongo, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
 
            if (mongoose.connection.readyState !== 1) {
                console.log(chalk.red.bold('Database Connection: ❌ Weak'));
            }
 
            // Adding a 1-second delay here before printing "Ence is now online."
            await new Promise(resolve => setTimeout(resolve, 1000));
 
            console.log(chalk.blue.bold(`${client.user.username} is now online.`));
        } catch (error) {
            console.error(chalk.red.bold('Error connecting to the database:', error.message));
            console.log(chalk.red.bold('Database Connection: ❌ Failed'));
        }
    }
};