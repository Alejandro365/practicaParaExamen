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

    return lib;
}

module.exports = practicaModel;