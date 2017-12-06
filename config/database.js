if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://amquinte:prod@ds133136.mlab.com:33136/vidjot-prod'}
}
else{
    module.exports = {mongoURI: 'mongodb://amquinte:test@ds153015.mlab.com:53015/vidjot'}
}