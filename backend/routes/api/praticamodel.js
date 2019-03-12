var ObjectId = require("mongodb").ObjectID;

function practicaModel(db){

    var lib = {};
    var query = db.collection('practica_collection');
    
    lib.getAllPractica = (handler) => {
        query.find({}).toArray(        
            (err,docs) => {
                if(err){
                    handler(err,null);
                }else{
                    handler(null,docs);
                }//end if (err)
            }//end (err,docs)
        );//end toArray
    }//end getAllPractica

    lib.getByID = (PracticaID, handler) =>{
        query.findOne({"_id": new ObjectId(PracticaID)}, (err,docs)=>{
            if(err){
                handler(err,null);
            }else{
                handler(null,docs);
            }//end if (err)
        });
    }

    lib.addNew = (newPractica, handler) =>{
        query.insertOne(newPractica, (err, rs) => {
            if(err){
                handler(err, null);
            }else{
                handler(null, rs.result);
            }
        });//Insert One
    }//addNewPractica

    lib.addTagsToPractica = (tags, id, handler) => {
        var curatedTags = Array.isArray(tags)? tags: [tags];
        var updateObject = {"$set": {"tags": curatedTags}};
        query.updateOne({"_id": ObjectId(id)}, updateObject, (err, rs) =>{
            if(err){
                handler(err, null);
            }else{
                handler(null, rs.result);
            }                            
        });//updateOne
    }//addTagsToPractica

    lib.searchByTag = (tags, handler)=>{
        var queryObject= {"tags": {"$in": Array.isArray(tags)? tags: [tags]}};
        query.find(queryObject).toArray((err, docs) => {
            if(err){
                handler(err, null);
            }else{
                handler(null, docs);
            }
        });//toArray
    }//searchByTag

    lib.togglePractica = (id, handler) => {
        var filter = {"_id": ObjectId(id)};
        // get filered document
        query.findOne(filter, (err, docs) => {
          if(err) {
            handler(err, null);
          } else {
              if(docs){
                  //doc.done = !doc.done;
                  //doc.fcDone = new Date();
                  var updateExpression = {};
                  if(docs.done){
                      updateExpression = {"$set": {done : false }};
                  }else{
                      updateExpression = { "$set": { done: true}};
                  }
                  query.updateOne(filter, updateExpression, (err, rs)=> {
                      if(err) {
                        handler(err, null);
                      }else{
                        handler(null, rs.result);
                      }
                  });//updateOne
              }else{
                handler(new Error("El documento no Existe"), null)
              }
          }
        } );//findOne
      }

      lib.deleteById = (id, handler)=>{
        query.deleteOne({"_id": ObjectId(id)}, (err, rs)=>{
          if(err){
            console.log(err);
            handler(err, null);
          } else {
            handler(null, rs.result);
          }
        });//deleteOne
      }//deleteById

    return lib;
}

module.exports = practicaModel;