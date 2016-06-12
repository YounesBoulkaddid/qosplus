
var mongoose = require('mongoose');
var MailDataSchema = require('mailData').MailData;

var MailSchema = new mongoose.Schema({

    type: {
      type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    },
    date: {
        type: MailDataSchema,
        required: true
    },
    isSended: {
        type: Boolean,
        required: true,
        default: false
    },
    hasCrashed: {
        type: Boolean,
        required: true,
        default: false
    }
});

var Mail = mongoose.model('Mail', MailSchema);

module.exports = {
    Mail: Mail
};