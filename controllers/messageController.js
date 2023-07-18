const Message = require('../models/messageModel.js');
const emailValidator = require('deep-email-validator');

const isEmailValid = async (email) => {
    return await emailValidator.validate({
        email,
        validateRegex: true,
        validateMx: true,
        validateTypo: true,
        validateDisposable: true,
        validateSMTP: false, // I temporarily disable smtp validation by setting it's 
                            // attribute to false since it throws an error and I countn't 
                            // even know how to solve it.
    });
}

const newMessage = async (req, res) => { 
    try {
        const { name, email, message } = req.body;

        // validation
        if (!name || !email || !message) throw Error('All fields must be filled');

        // validate email
        const { valid } = await isEmailValid(email);
        if(!valid) throw Error('Please provide a valid email address.');

        // save to mongo db
        const clientMessage = await Message.create({ name, email, body: message });

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

const getAllMessages = async (req, res) => {
    try {
        const { password } = req.body;
        if(password !== process.env.RESTRICT_KEY) throw Error('Invalid Password.');
        const inbox = await Message.find();

        res.json(inbox);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: `Something went wrong: ${ error.message }`,
        });
    }
}

module.exports = { newMessage, getAllMessages };

// email validation blog - https://www.abstractapi.com/guides/node-email-validation