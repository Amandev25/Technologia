    const mongoose = require('mongoose');

    const userSchema = new mongoose.Schema({
        username: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        reports:[{
            type:String,
        }],
        updatedAt: {
            type: Date,
            default: Date.now
        }
    });
    userSchema.pre('save', function(next) {
        this.updatedAt = Date.now();
        next();
    });

    const User = mongoose.model('User', userSchema);

    module.exports = User;