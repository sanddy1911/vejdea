if(process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI: 'mongodb+srv://sundeep:' + 'ZqX8gYNBg5Mv9gkK' + '@cluster0-60xdb.mongodb.net/vejdea?retryWrites=true'}
} else {
    module.exports = {mongoURI: 'mongodb://127.0.0.1:27017/vejdea'}
}