
module.exports = function(app , passport) {

    app.use('/api', require('./models/restApi'));


    
    app.get('/*', function(req,res){
    
   res.sendfile('./public/html/index.html'); 
});

    
};