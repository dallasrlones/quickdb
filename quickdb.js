((quickdb, fs, uuid, colors)=>{

    const DB_LOCATION = process.argv[1] + "/dbdata/";

    var OnLoad = ()=>{
        if(!DirThere(DB_LOCATION + "")){
            MakeDir("", ()=>{});
        }
    };

    var ErrCheck = (err, cb)=>{
        if(typeof(err) == "array" && err !== undefined && err !== null){
            console.log("ERROR".red);
            console.log(JSON.stringify(err).red);
            return cb({ success: false , err: err });
        }
    };

    var FileThere = (location)=>{
        try {
            return fs.statSync(DB_LOCATION + location + ".json").isFile();
        } catch (e) {
            return false;
        }
    };

    var DirThere = (location)=> {
        try {
            return fs.statSync(DB_LOCATION + location).isDirectory();
        } catch (e) {
            return false;
        }
    };

    var Read = (location, cb)=> {
        fs.readFile(DB_LOCATION + location + ".json", (err, results)=>{
            ErrCheck(err, cb);

            return cb({ success: true, results: JSON.parse(results.toString()) });
        });
    };

    var ReadDir = (dirLocation, cb)=>{
        fs.readdir(DB_LOCATION + dirLocation, (err, fileNames)=>{

            ErrCheck(err, cb);

            var totalfiles = fileNames.length;

            var arrayToReturn = [];

            var Success = ()=>{
                totalfiles -= 1;
                if(totalfiles <= 0){
                    return cb({ success: true, docset: arrayToReturn });
                }
            };

            for(var i = 0; i < totalfiles; i++){
                var fileName = fileNames[i];

                fileName = fileName.replace(".json", "");

                Read(dirLocation + "/" + fileName, (readResponse)=>{
                    ErrCheck(readResponse.err, cb);

                    arrayToReturn.push(JSON.parse(readResponse.results.toString()));
                    Success();
                });
            }


        });
    };

    var MakeDir = (dirLocation, cb)=>{
        fs.mkdir(DB_LOCATION + dirLocation, (err, results)=>{
            ErrCheck(err, cb);

            return cb({ success: true, results: results });
        });
    };

    var Write = (location, newContents, cb)=>{
        fs.writeFile(DB_LOCATION + location + ".json", JSON.stringify(newContents), (err, results)=>{
            ErrCheck(err, cb);

            return cb({ success: true });
        });
    };

    var DELETE = (location, cb)=>{
        fs.unlink(DB_LOCATION + location + ".json", (err, results)=>{
            ErrCheck(err, cb);

            return cb({ success: true });
        });
    };

    quickdb.doc = {

        find : (setName, docName, compareFunc, cb)=> {
                if (FileThere(setName + "/" + docName)) {

                    Read(setName + "/" + docName, (readResponse)=>{
                        ErrCheck(readResponse.err, cb);

                        var doc = readResponse.results;

                        var found = doc.itemset.filter(compareFunc);

                        if(found.length > 0){

                            if(found.length == 1){
                                found = found[0];
                            }
                            return cb({ success: true, item: found });
                        } else {
                            return cb({ success: false, err: "no match found" });
                        }
                    });
                } else {
                   return cb({ success: false, err: "file not there" });
                }
            },

        getdoc: (setName, docName, cb)=>{
           if(FileThere(setName + "/" + docName)){

                Read(setName + "/" + docName, (readResponse)=>{

                    var doc = JSON.parse(readResponse.results.toString());

                    return cb({ success: true, doc: doc });
                });
            } else {
               return cb({ success: false, err: "file not there" });
            }
        },

        docset : (setName, cb)=>{
                if(DirThere(setName)){
                    ReadDir(setName, (response)=>{
                        var docset = response.docset;

                        return cb({ success: true, docset: docset });
                    });
                } else {
                   return cb({ success: false, err: "file not there" });
                }
            },

        //will create the dir and doc if not there
        insert : (setName, docName, newItem, cb)=>{
           if(FileThere(setName + "/" + docName)){
               Read(setName + "/" + docName, (readResponse)=>{
                   ErrCheck(readResponse.err, cb);

                   var doc = readResponse.results;

                   var match = doc.itemset.filter((val)=>{
                       return JSON.stringify(val.item) == JSON.stringify(newItem);
                   });

                   if(match.length <= 0){
                       var newUUID = uuid();
                       var newList = doc.itemset.push({ item: newItem, id: newUUID, time: Date.now() });
                       doc.lastupdate = Date.now();

                       Write(setName + "/" + docName, doc, (writeResponse)=>{
                           ErrCheck(writeResponse.err, cb);

                           return cb({ success: true, id: newUUID });
                       });
                   } else {
                       return cb({ success: false, err: "item already exists in DB" });
                   }
               });
           } else {
                //create new dir and doc and insert into new dir doc .... DUCK DODGERS...
                var newDocID = uuid();
                var newItemID = uuid();
                var newDoc = {
                    docid: newDocID,
                    lastupdate: Date.now(),
                    itemset: [{ item: newItem, id: newItemID, time: Date.now() }]
                };

                if(DirThere(setName)){
                    Write(setName + "/" + docName, newDoc, (writeResponse)=>{
                        console.log("writeresponse", writeResponse);
                        return cb({ success: true, id: newItemID });
                    });
                } else {
                    MakeDir(setName, (mkdirResponse)=>{
                        ErrCheck(mkdirResponse.err, cb);



                        Write(setName + "/" + docName, newDoc, ()=>{
                            return cb({ success: true, id: newItemID });
                        });
                    });
                }
           }
        },

        //replaces the whole doc itemset!!!
        update : (setName, docName, newItemSet, cb) => {
           if(FileThere(setName + docName)){
               Read(setName + docName, (readResponse)=>{

                   var doc = readResponse.results;

                   doc.itemset = newItemSet;
                   doc.lastupdate = Date.now();

                   Write(setName + "/" + docName, doc, (writeResponse)=>{
                       return cb({ success: true, id: doc.id });
                   });
               });
           } else {
                return cb({ success: false, err: "file not there" });
           }
        },

        //will auto remove doc if itemset is empty
        //removes by a filter, search for what you want to remove
        remove : (setName, docName, compareFunc, cb)=>{
            if (FileThere(setName + "/" + docName)) {
                Read(setName + "/" + docName, (readResponse)=>{
                    if (readResponse.success) {
                        var doc = readResponse.results;
                        var removeItemSet = doc.itemset.filter(compareFunc);

                        var newItemSet = [];

                        for(var i = 0; i < doc.itemset.length; i++) {
                            var itemSetItemActual = doc.itemset[i];

                            var match = removeItemSet.filter((val)=>{
                                return JSON.stringify(val) == JSON.stringify(itemSetItemActual);
                            });

                            if (match.length <= 0) {
                                newItemSet.push(itemSetItemActual);
                            }
                        }

                        if (newItemSet.length === doc.itemset.length) {
                            return cb({ success: false, message: "nothing removed" });
                        }

                        doc.itemset = newItemSet;

                        if (doc.itemset.length === 0) {
                            DELETE(setName + "/" + docName, (delResponse)=>{
                                if(delResponse.success == true){
                                    return cb({ success: true });
                                }
                            });
                        } else {
                            Write(setName + "/" + docName, doc, (writeResponse)=>{
                                return cb({ success: true });
                            });
                        }
                    }
                });
            } else {
                return cb({ success: false, message: "file does not exist" });
            }
        }

    };

    OnLoad();

})
(
    module.exports,
    require('fs'),
    require('uuid/v4'),
    require('colors')
);
