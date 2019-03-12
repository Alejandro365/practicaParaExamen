var express = require('express');
var router = express.Router();

function practicaInit(db){
    
    var practicaModel = require ('./praticamodel')(db);

    var practicaDatos = {
        'Nombre' : '',
        'Direccion' : '',
        'Telefono' : '',
        'Descripcion' : ''
    };

    router.get("/", function(req,res,next){
        practicaModel.getAllPractica(
            (err,docs) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Murio"});
                }
                return res.status(200).json({docs});
            }
        )
    });

    router.get("/byID/:practicaID", function(req,res,next){
        practicaModel.getByID(req.params.practicaID, (err,docs) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Murio"});
                }
                return res.status(200).json({docs});
            }
        )
    });

    router.get('/bytags/:tag', (req, res, next)=>{
        practicaModel.searchByTag((req.params.tag || '').split('_'), (err, docs)=>{
          if(err){
            console.log(err);
            return res.status(500).json({"error":"No se encontro practica"});
          }else{
            return res.status(200).json(docs);
          }
        } ); //searchByTag
      });//by tag

    router.post("/new", function(req, res, next){
        var _practicaDatos = Object.assign({}, practicaDatos, req.body);
        
        practicaModel.addNew(_practicaDatos, (err, newPractica)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"error":"No se puede cargar esta Onda!"});
            }else{
                return res.status(200).json(newPractica);
            }

        });
    });

    router.put('/done/:id', function(req, res, next){
        var _practicaId = req.params.id;
        practicaModel.togglePractica(_practicaId, (err, rs)=>{
          if(err){
            console.log(err);
            return res.status(500).json({"error":"No se pudo actualizar"});
          }
          return res.status(200).json(rs);
        });
    });

    router.put('/addtags/:id', (req, res, next)=>{
        practicaModel.addTagsToPractica((req.body.tags || '').split('|'), req.params.id, (err, rs)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"error":"No se puede actualizar"});
              }else{
                return res.status(200).json(rs);
              }
        });//end addTagsToPractica
    });//addTags

    router.delete('/delete/:id', function(req, res, next){
        var _practicaID = req.params.id;
        practicaModel.deleteById(_practicaID, (err, rs) =>{
            if(err){
                return res.status(500).json({"error":"No se pudo eliminar dato"});
            }else{
                return res.status(200).json(rs);
            }
        })
    });
      

    return router;
}

module.exports = practicaInit;