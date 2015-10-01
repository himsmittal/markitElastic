var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());

//elasticstart
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client();
var ejs = require('./elastic.min');
//elastic end
var router = express.Router();              // get an instance of the express Router

var dbCollection  = require('./askTomModel');
var historyCollection =  require('./historyModel');
var tagsCollection =  require('./tagsModel');
var feedbackCollection = require('./feedbackModel.js');

var network = require('network');

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    cors();
     res.header("Access-Control-Allow-Origin", "*");
 res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

router.post('/feedback',function(req,res){
    
     feedbackCollection.create( {name:req.body.name, email: req.body.email, suggestions: req.body.suggestions,rate:req.body.rate}, function(err, data) {
		if (err) {
			console.log(err);
			res.end();
		}
		res.send(data);
	});
});

router.post('/celebLinks',function(req,res){
    
      dbCollection.where()
          .limit(7)
          .sort('-count')
          .exec(function(err,data){
          
          if (err){
                console.log(err);
              		res.end();
          }
          //console.log("found celeb links");
         // console.log(data);
          res.send(data);
         
      });
});

router.post('/resultStats',function(req,res){
    
   historyCollection.aggregate([
    // Get only records created in the last 30 days
    {$match:{
          "time":{$gt: new Date(new Date().getTime() - 1000*60*60*24*30)}
    }}, 
   
    {$group:{
			
          _id:"$noOfResults",
          "count":{$sum:1}
    }},
       
       {$sort:{"_id":1}}
], function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
     // console.log(result);
       res.send(result);
   
    });  
});

router.post('/userActivity',function(req,res){
    
   historyCollection.aggregate([
    // Get only records created in the last 30 days
    {$match:{
          "time":{$gt: new Date(new Date().getTime() - 1000*60*60*24*15)}
    }}, 
    // Get the year, month and day from the createdTimeStamp
    {$project:{
          "year":{$year:"$time"}, 
          "month":{$month:"$time"}, 
          "day": {$dayOfMonth:"$time"}
    }}, 
    // Group by year, month and day and get the count
    {$group:{
			
          _id:{year:"$year", month:"$month", day:"$day"},
          "count":{$sum:1}
    }},
       
       {$sort:{"_id":1}}
], function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
       //console.log(result);
       res.send(result);
   
    });  
});


router.post('/notFoundLinks',function(req,res){
    
      historyCollection.where('linkFound').equals('false')
          .limit(5)
          .sort('-time')
          .exec(function(err,data){
          
          if (err){
                console.log(err);
              		res.end();
          }
         // console.log("reached not found link");
         // console.log(data);
          res.send(data);
         
      });
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api/test)
router.get('/test', function(req, res) {
    res.sendfile('./public/index.html');
});

//delete a particular record
  router.post('/delete', function(req, res) {
    //  console.log("reched backend"+req.body.link);
  client.deleteByQuery({
  index: 'urlkeyword',
      type: 'urlkeyword',
       refresh: 'true',
      defaultOperator:'AND',
     
  body: {
    query: {
      term: { link_notanalyised:req.body.link,title_notanalyised:req.body.title}
       

    }
  }
}, function (error, response) {
   if (error)
                console.log(error);

           res.json({ message: 'Successfully deleted' });
});

    });


//insert data
router.post('/insert', function( req, res) {
	//console.log('Reached backend with data ',req.body.title);
client.create({
  index: 'urlkeyword',
  type: 'urlkeyword',
    refresh: 'true',
  body: {
    title: req.body.title,
      link:req.body.link,
      count:1,
      click:0
  }
}, function (err, response) {
 if (err) {
			console.log(err);
			res.end();
		}
		res.send(response);
});

});

router.post('/update', function( req, res) {
	console.log('Reached backend with data ',req.body.oldLink,req.body.oldTitle);
	//Breaking into keywords and storing
	//Keywords should be sorted for optimization for rank
     client.search({
  index: 'urlkeyword',
      type: 'urlkeyword',
       refresh: 'true',
      defaultOperator:'AND',
     
  body: {
    query: {
      term: { link_notanalyised:req.body.oldLink } , 
        term:{ title_notanalyised:req.body.oldTitle }
       

    }
  }
}, function (error, response) {
          if (error)
         {console.log(error);}
          
console.log("id",response.hits.hits[0]._id);
client.update({
  index: 'urlkeyword',
  type: 'urlkeyword',
  id: response.hits.hits[0]._id,
    refresh:'true',
  body: {
   doc:{
      link: req.body.newLink, title: req.body.newTitle
   }
  }
}, function (error, response) {
  if (error)
                console.log(error);
   // console.log(response.hits.hits);
    res.send(response);
})
         
});

});

var id;
router.post('/updateclick', function( req, res) {
	//console.log('Reached backend with data ',req.body.link);
         client.search({
  index: 'urlkeyword',
      type: 'urlkeyword',
       refresh: 'true',
      defaultOperator:'AND',
     
  body: {
    query: {
      term: { link_notanalyised:req.body.link } , 
        term:{ title_notanalyised:req.body.title }
       

    }
  }
}, function (error, response) {
          if (error)
         {console.log(error);}
          
console.log("id",response.hits.hits[0]._id);
client.update({
  index: 'urlkeyword',
  type: 'urlkeyword',
  id: response.hits.hits[0]._id,
    refresh:'true',
 body: {

       "script" : "ctx._source.click += 1"
   
  }
}, function (error, response) {
  if (error)
                console.log(error);
   console.log(error);
    res.send(response);
})
         
});

});


    

//fetch all values
router.route('/all')
        
     // get all the title/keywords (accessed at GET http://localhost:8080/all)
    .get(function(req, res) {
        historyCollection.find(function(err, data) {
            if (err)
                 console.log(err);

            res.json(data);
        });

    
    });

router.route('/feedback')
        
     // get all the title/keywords (accessed at GET http://localhost:8080/all)
    .get(function(req, res) {
        feedbackCollection.find(function(err, data) {
            if (err)
                console.log(err);

            res.json(data);
        });

    
    });

router.route('/allLinks')
        
     // get all the title/keywords (accessed at GET http://localhost:8080/all)
    .get(function(req, res) {
        dbCollection.find(function(err, data) {
            if (err)
                 console.log(err);

            res.json(data);
        });

    
    });

  router.get("/tags" , function(req, res) {
      
      client.search({
  index: 'urlkeyword',
  type: 'urlkeyword',
          size:'1000',
  body: {
    query: {
      match_all: {}
    }
  }
}).then(function (resp) {
    var hits = resp.hits.hits;
         // console.log(hits);
           res.json(hits);
}, function (err) {
    console.trace(err.message);
         console.log(err);
});


    
    });







//serahc for particular keywords
router.get('/:searchWords', function(req, res) {
    client.search({
  index: 'urlkeyword',
        type: 'urlkeyword',
        size:'1000',
        body: ejs.Request().query(ejs.FuzzyLikeThisQuery(req.params.searchWords).fields(["link_notanalyised","title_afteranalyizers","title","title_notanalyised"]).prefixLength(1).minSimilarity(0.6))
  
}, function (err,response) {
        if(err){
     console.log(err);
        }
       // console.log(response.hits.hits);

    console.log(req.connection.remoteAddress);

	//console.log(searchWordsList);
	
       if (response.hits.hits.length != 0)
           
           // for updating the count of records
           
           //if data found insert in history table
        { for (var i=0;i<response.hits.hits.length;i++)
           {
               client.update({
  index: 'urlkeyword',
  type: 'urlkeyword',
  id: response.hits.hits[i]._id,
    refresh:'true',
 body: {

       "script" : "ctx._source.count += 1"
   
  }
}, function (error, response) {
  if (error)
                 console.log(error);
});
        
         
               
           }
    network.get_public_ip(function(err, ip) {

//  console.log(err || ip); // should return your public IP address 

            var historyData= new historyCollection({ keywordsSearched: req.params.searchWords.toLowerCase().replace(/[:\\,!@#$%^&*()_+=\/]/g,' ').match(/\S+/g).sort(),
                                                    linkFound: true, 
                                                    time: Date.now() ,
                                                    noOfResults: response.hits.hits.length,
                                                    publicIp: ip
                                                 });
           
              historyData.save(function(err){
  if(err) console.log(err); 
});   
        });
        }
         else{
              network.get_public_ip(function(err, ip) {

  //console.log(err || ip); // should return your public IP address 
             //no data found then set linkfound as false
             { var historyData= new historyCollection({ keywordsSearched: req.params.searchWords.toLowerCase().replace(/[:\\,!@#$%^&*()_+=\/]/g,' ').match(/\S+/g).sort(),
                                                    linkFound: false, 
                                                    time: Date.now() ,
                                                    noOfResults: response.hits.hits.length,
                                                    publicIp: ip   
                                                 });
           
              historyData.save(function(err){
  if(err) console.log(err); 
});      
         }
                   });
         }
                                    
            
		res.send(response.hits.hits);
        
            
        
	});
		
});

module.exports = router;
