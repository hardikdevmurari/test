var conn = require('../utils/connection');
var express = require('express');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var values = require('../authentication/values');
const { sha_key } = require('../authentication/values');
const con = require('../utils/connection');
const paginate = require('jw-paginate');
var fs = require('fs');


var app = express();


module.exports = {
    login: (req, res) => {

        console.log("in admin login panel");
        var emailaddress = req.body.emailaddress;
        var password = req.body.password;

        if (emailaddress == null || emailaddress == "" || emailaddress == undefined) {

            res.json({ 'status': 'False', 'number': '27', 'message': 'Email Address is null' });

        }
        else if (password == null || password == "" || password == undefined) {

            res.json({ 'status': 'False', 'number': '28', 'message': 'Password is null' });

        }
        else {

            var query1 = "SELECT * FROM `admin` WHERE `emailaddress` = '" + emailaddress + "'";
            conn.query(query1, (err, result) => {
                if (err) {

                    res.json({ 'status': 'False', 'number': '23', 'message': 'Error in login' });

                }
                else if (result.length == 0) {

                    res.json({ 'status': 'False', 'number': '24', 'message': 'Email Address is not present' });

                }
                else {


                    var query2 = "SELECT * FROM `admin` WHERE `emailaddress` = '" + emailaddress + "' && `password` = '" + password + "'";

                    conn.query(query2, (err, result2) => {

                        if (err) {


                            res.json({ 'status': 'False', 'number': '25', 'message': 'Error in login' });

                        }
                        else if (result2.length == 0) {

                            res.json({ 'status': 'False', 'number': '26', 'message': 'Password is wrong !! TRY AGAIN' });

                        }
                        else {

                            const token = jwt.sign(
                                {
                                    id: result2[0].id,
                                    emailaddress: result2[0].emailaddress,
                                    role: result2[0].role
                                },
                                sha_key,
                                { expiresIn: '24h' }

                            )
                            console.log(token);
                            let date_ob = new Date();

                            var sqlsyntax = "UPDATE `admin` SET `token`= '" + token + "' ,`LastLoginAt`=NOW() WHERE id= '" + result2[0].id + "'";

                            conn.query(sqlsyntax, (err, result4) => {
                                if (err) {

                                    res.json({ 'status': 'False', 'number': '29', 'message': 'Error in login !! TRY AGAIN' });

                                }
                                else {

                                    res.json({ 'status': 'True', 'token': token, 'msg': 'Successfully Login', role: result2[0].role });

                                }
                            })



                        }

                    })


                }

            })



        }


    },
    insertadmin: (req, res) => {
       // console.log(JSON.parse(req.body.json));
        var jsondata = JSON.parse(req.body.json);

        var emailaddress = jsondata.email;
        var password = jsondata.password;
        var name = jsondata.name;
        var otherinfo = jsondata.otherinfo;

        if (req.file) {

            //   console.log("in insert  admin  method",req.file.filename);
            var profilepic = req.file.filename;

            var sqlsyntax = "INSERT INTO `admin` ( `name`, `emailaddress`, `password` , `role` , `otherInfo`, `profilepic`) VALUES ('" + name + "','" + emailaddress + "', '" + password + "','ADMIN' , '" + otherinfo + "' , '" + profilepic + "')";

            if (emailaddress == null || emailaddress == "" || emailaddress == undefined) {
                fs.unlink('./upload/' + profilepic, function (err) {
                    if (err) {

                    };

                    console.log('file deleted');
                })
                res.json({ 'status': 'False', 'number': '12', 'message': 'Email Address is null' });

            }
            else if (password == null || password == "" || password == undefined) {

                fs.unlink('./upload/' + profilepic, function (err) {
                    if (err) {

                    };

                    console.log('file deleted');
                })

                res.json({ 'status': 'False', 'number': '13', 'message': 'Password is null' });

            }
            else if (name == null || name == "" || name == undefined) {

                fs.unlink('./upload/' + profilepic, function (err) {
                    if (err) {

                    };

                    console.log('file deleted');
                })

                res.json({ 'status': 'False', 'number': '14', 'message': 'name is null' });

            }
            else {


                conn.query("SELECT * FROM `admin` WHERE `emailaddress` = '" + emailaddress + "'", (err, result1) => {

                    if (result1.length >= 1) {
                        fs.unlink('./upload/' + profilepic, function (err) {
                            if (err) {

                            };

                            console.log('file deleted');
                        })

                        res.json({ 'status': 'False', 'number': '15', 'message': 'Email address is already present' });

                    }
                    else if (err) {
                        fs.unlink('./upload/' + profilepic, function (err) {
                            if (err) {

                            };

                            console.log('file deleted');
                        })

                        res.json({ 'status': 'False', 'number': '16', 'message': 'Error  in insertion' });

                    }
                    else {

                        conn.query(sqlsyntax, (err, result) => {

                            if (err) {

                                console.log(err);
                                fs.unlink('./upload/' + profilepic, function (err) {
                                    if (err) {

                                    };

                                    console.log('file deleted');
                                })

                                res.json({ 'status': 'False', 'number': '14', 'message': 'Error  in insertion' });

                            }
                            else {
                                var sqlqry = "SELECT * FROM `admin` WHERE emailaddress = '" + emailaddress + "'";
                                conn.query(sqlqry, (err, addedadmin) => {
                                    if (err) {
                                        fs.unlink('./upload/' + profilepic, function (err) {
                                            if (err) {

                                            };

                                            console.log('file deleted');
                                        })
                                        res.json({ 'status': 'False', 'number': '37', 'message': 'Error  in insertion' });
                                    }
                                    else {
                                        // console.log(addedadmin);
                                        res.json({ 'status': 'True', 'msg': 'Successfully added', data: addedadmin });
                                    }
                                })


                            }

                        })

                    }

                })

            }

        }
        else {

            var sqlsyntax = "INSERT INTO `admin` ( `name`, `emailaddress`, `password` , `role` , `otherInfo`) VALUES ('" + name + "','" + emailaddress + "', '" + password + "','ADMIN' , '" + otherinfo + "')";

            if (emailaddress == null || emailaddress == "" || emailaddress == undefined) {
                fs.unlink('./upload/' + profilepic, function (err) {
                    if (err) {

                    };

                    console.log('file deleted');
                })
                res.json({ 'status': 'False', 'number': '12', 'message': 'Email Address is null' });

            }
            else if (password == null || password == "" || password == undefined) {
                fs.unlink('./upload/' + profilepic, function (err) {
                    if (err) {

                    };

                    console.log('file deleted');
                })

                res.json({ 'status': 'False', 'number': '13', 'message': 'Password is null' });

            }
            else if (name == null || name == "" || name == undefined) {
                fs.unlink('./upload/' + profilepic, function (err) {
                    if (err) {

                    };

                    console.log('file deleted');
                })

                res.json({ 'status': 'False', 'number': '14', 'message': 'name is null' });

            }
            else {


                conn.query("SELECT * FROM `admin` WHERE `emailaddress` = '" + emailaddress + "'", (err, result1) => {

                    if (result1.length >= 1) {
                        fs.unlink('./upload/' + profilepic, function (err) {
                            if (err) {

                            };

                            console.log('file deleted');
                        })
                        res.json({ 'status': 'False', 'number': '15', 'message': 'Email address is already present' });

                    }
                    else if (err) {
                        fs.unlink('./upload/' + profilepic, function (err) {
                            if (err) {

                            };

                            console.log('file deleted');
                        })
                        res.json({ 'status': 'False', 'number': '16', 'message': 'Error  in insertion' });

                    }
                    else {

                        conn.query(sqlsyntax, (err, result) => {

                            if (err) {

                                console.log(err);
                                fs.unlink('./upload/' + profilepic, function (err) {
                                    if (err) {

                                    };

                                    console.log('file deleted');
                                })
                                res.json({ 'status': 'False', 'number': '14', 'message': 'Error  in insertion' });

                            }
                            else {
                                var sqlqry = "SELECT * FROM `admin` WHERE emailaddress = '" + emailaddress + "'";
                                conn.query(sqlqry, (err, addedadmin) => {
                                    if (err) {
                                        fs.unlink('./upload/' + profilepic, function (err) {
                                            if (err) {

                                            };

                                            console.log('file deleted');
                                        })

                                        res.json({ 'status': 'False', 'number': '37', 'message': 'Error  in insertion' });
                                    }
                                    else {
                                        // console.log(addedadmin);
                                        res.json({ 'status': 'True', 'msg': 'Successfully added', data: addedadmin });
                                    }
                                })


                            }

                        })

                    }

                })

            }

        }



    },
    updateadmin: (req, res) => {
      //  console.log("In update method");
     //   console.log(JSON.parse(req.body.json));
        var jsondata = JSON.parse(req.body.json);
        // console.log(jsondata);
        var jsondata = JSON.parse(req.body.json);



        var adminid = req.params.adminid;
        console.log("In update method", adminid);


        var emailaddress = jsondata.email;

        var name = jsondata.name;
        var otherinfo = jsondata.otherinfo;

        if (req.file) {
            console.log("in if condition");
            var profilepic = req.file.filename;

            if (emailaddress == null || emailaddress == "" || emailaddress == undefined) {
                fs.unlink('./upload/' + profilepic, function (err) {
                    if (err) {

                    };

                    console.log('file deleted');
                })

                res.json({ 'status': 'False', 'number': '12', 'message': 'Email Address is null' });

            }

            else if (name == null || name == "" || name == undefined) {

                fs.unlink('./upload/' + profilepic, function (err) {
                    if (err) {

                    };

                    console.log('file deleted');
                })

                res.json({ 'status': 'False', 'number': '14', 'message': 'name is null' });

            }
            else {


                var sql4 = " SELECT * FROM `admin` WHERE `id` = '" + adminid + "'";

                conn.query(sql4, (err, result7) => {

                    if (result7.length == 0) {

                        fs.unlink('./upload/' + profilepic, function (err) {
                            if (err) {

                            };

                            console.log('file deleted');
                        })

                        res.json({ 'status': 'False', 'number': '17', 'message': 'Id is not present' });

                    }
                    else if (err) {

                        fs.unlink('./upload/' + profilepic, function (err) {
                            if (err) {

                            };

                            console.log('file deleted');
                        })

                        res.json({ 'status': 'False', 'number': '18', 'message': 'Error in updation' });

                    }
                    else {

                        var sql = " SELECT * FROM `admin` WHERE `emailaddress` = '" + emailaddress + "' AND `id` != '" + adminid + "'";

                        conn.query(sql, (err, result2) => {

                            if (result2.length >= 1) {

                                // insert code here 
                                fs.unlink('./upload/' + profilepic, function (err) {
                                    if (err) {

                                    };

                                    console.log('file deleted');
                                })

                                res.json({ 'status': 'False', 'number': '15', 'message': 'EMail address is already present' });

                            }
                            else if (err) {

                                fs.unlink('./upload/' + profilepic, function (err) {
                                    if (err) {

                                    };

                                    console.log('file deleted');
                                })

                                res.json({ 'status': 'False', 'number': '19', 'message': 'Error in updation' });


                            }
                            else {
                                console.log("--------", result7[0]);
                                console.log("____", result7[0].profilepic);
                                if (result7[0].profilepic) {


                                    fs.unlink('./upload/' + result7[0].profilepic, function (err) {
                                        if (err) {

                                        };

                                        console.log('file deleted');
                                    })


                                    var sql1 = " UPDATE `admin` SET `name`= '" + name + "',`emailaddress`= '" + emailaddress + "' , `otherInfo` = '" + otherinfo + "', `profilepic` = '" + profilepic + "' WHERE `id` = '" + adminid + "'";

                                    conn.query(sql1, (err, result3) => {

                                        if (err) {
                                            console.log(err);

                                            fs.unlink('./upload/' + profilepic, function (err) {
                                                if (err) {

                                                };

                                                console.log('file deleted');
                                            })

                                            res.json({ 'status': 'False', 'number': '16', 'message': 'Error in updation' });

                                        }
                                        else {

                                            var sqlquery1 = "SELECT * from `admin` WHERE `id` = '" + adminid + "'";
                                            conn.query(sqlquery1, (err, result10) => {
                                                if (err) {


                                                    fs.unlink('./upload/' + profilepic, function (err) {
                                                        if (err) {

                                                        };

                                                        console.log('file deleted');
                                                    })


                                                    res.json({ 'status': 'False', 'number': '41', 'message': 'Error in updation' });

                                                }
                                                else {
                                                    res.json({ 'status': 'True', 'msg': 'Successfully updated', data: result10 });

                                                }

                                            })

                                        }

                                    })



                                }
                                else {

                                    var sql1 = " UPDATE `admin` SET `name`= '" + name + "',`emailaddress`= '" + emailaddress + "' , `otherInfo` = '" + otherinfo + "', `profilepic` = '" + profilepic + "' WHERE `id` = '" + adminid + "'";

                                    conn.query(sql1, (err, result3) => {

                                        if (err) {
                                            console.log(err);

                                            fs.unlink('./upload/' + profilepic, function (err) {
                                                if (err) {

                                                };

                                                console.log('file deleted');
                                            })

                                            res.json({ 'status': 'False', 'number': '16', 'message': 'Error in updation' });

                                        }
                                        else {

                                            var sqlquery1 = "SELECT * from `admin` WHERE `id` = '" + adminid + "'";
                                            conn.query(sqlquery1, (err, result10) => {
                                                if (err) {

                                                    fs.unlink('./upload/' + profilepic, function (err) {
                                                        if (err) {

                                                        };

                                                        console.log('file deleted');
                                                    })

                                                    res.json({ 'status': 'False', 'number': '41', 'message': 'Error in updation' });

                                                }
                                                else {
                                                    res.json({ 'status': 'True', 'msg': 'Successfully updated', data: result10 });

                                                }

                                            })

                                        }

                                    })

                                }


                            }

                        })

                    }

                })

            }



        }



        else {


            console.log("in else condition")
            if (emailaddress == null || emailaddress == "" || emailaddress == undefined) {


                fs.unlink('./upload/' + profilepic, function (err) {
                    if (err) {

                    };

                    console.log('file deleted');
                })

                res.json({ 'status': 'False', 'number': '12', 'message': 'Email Address is null' });

            }

            else if (name == null || name == "" || name == undefined) {

                fs.unlink('./upload/' + profilepic, function (err) {
                    if (err) {

                    };

                    console.log('file deleted');
                })


                res.json({ 'status': 'False', 'number': '14', 'message': 'name is null' });

            }
            else {


                var sql4 = " SELECT * FROM `admin` WHERE `id` = '" + adminid + "'";

                conn.query(sql4, (err, result7) => {

                    if (result7.length == 0) {

                        fs.unlink('./upload/' + profilepic, function (err) {
                            if (err) {

                            };

                            console.log('file deleted');
                        })

                        res.json({ 'status': 'False', 'number': '17', 'message': 'Id is not present' });

                    }
                    else if (err) {

                        fs.unlink('./upload/' + profilepic, function (err) {
                            if (err) {

                            };

                            console.log('file deleted');
                        })



                        res.json({ 'status': 'False', 'number': '18', 'message': 'Error in updation' });

                    }
                    else {

                        var sql = " SELECT * FROM `admin` WHERE `emailaddress` = '" + emailaddress + "' AND `id` != '" + adminid + "'";

                        conn.query(sql, (err, result2) => {

                            if (result2.length >= 1) {


                                fs.unlink('./upload/' + profilepic, function (err) {
                                    if (err) {

                                    };

                                    console.log('file deleted');
                                })

                                res.json({ 'status': 'False', 'number': '15', 'message': 'EMail address is already present' });

                            }
                            else if (err) {


                                fs.unlink('./upload/' + profilepic, function (err) {
                                    if (err) {

                                    };

                                    console.log('file deleted');
                                })


                                res.json({ 'status': 'False', 'number': '19', 'message': 'Error in updation' });


                            }
                            else {

                                var sql1 = " UPDATE `admin` SET `name`= '" + name + "',`emailaddress`= '" + emailaddress + "' , `otherInfo` = '" + otherinfo + "' WHERE `id` = '" + adminid + "'";

                                conn.query(sql1, (err, result3) => {

                                    if (err) {
                                        console.log(err);

                                        fs.unlink('./upload/' + profilepic, function (err) {
                                            if (err) {

                                            };

                                            console.log('file deleted');
                                        })


                                        res.json({ 'status': 'False', 'number': '16', 'message': 'Error in updation' });

                                    }
                                    else {

                                        var sqlquery1 = "SELECT * from `admin` WHERE `id` = '" + adminid + "'";
                                        conn.query(sqlquery1, (err, result10) => {
                                            if (err) {


                                                fs.unlink('./upload/' + profilepic, function (err) {
                                                    if (err) {

                                                    };

                                                    console.log('file deleted');
                                                })


                                                res.json({ 'status': 'False', 'number': '41', 'message': 'Error in updation' });

                                            }
                                            else {
                                                res.json({ 'status': 'True', 'msg': 'Successfully updated', data: result10 });

                                            }

                                        })

                                    }

                                })

                            }

                        })

                    }

                })

            }
        }



    },
    deleteadmin: (req, res) => {

        var adminid = req.params.adminid;
        console.log("In delete method", adminid);

        var sql1 = " SELECT * FROM `admin` WHERE `id` = '" + adminid + "'";

        conn.query(sql1, (err, result2) => {

            if (err) {

                res.json({ 'status': 'False', 'number': '21', 'message': 'Error in delete' });


            } else if (result2.length == 0) {

                res.json({ 'status': 'False', 'number': '22', 'message': 'Id is not present' });


            }
            else {

                if (result2[0].profilepic != null && result2[0].profilepic != undefined && result2[0].profilepic != "") {



                    fs.unlink('./upload/' + result2[0].profilepic, function (err) {
                        if (err) {
                            /*   console.log(err) */
                        };

                        console.log('file deleted');
                    })


                    var sql = " DELETE FROM `admin` WHERE `id` = '" + adminid + "'";

                    conn.query(sql, (err, result) => {

                        if (err) {

                            res.json({ 'status': 'False', 'number': '20', 'message': 'Error in delete' });

                        }
                        else {

                            res.json({ 'status': 'True', 'msg': 'Successfully Deleted' });

                        }

                    })

                }
                else {


                    var sql = " DELETE FROM `admin` WHERE `id` = '" + adminid + "'";

                    conn.query(sql, (err, result) => {

                        if (err) {

                            res.json({ 'status': 'False', 'number': '20', 'message': 'Error in delete' });

                        }
                        else {

                            res.json({ 'status': 'True', 'msg': 'Successfully Deleted' });

                        }

                    })

                }

            }

        })



    },
    /* getAllAdmin : (req ,res) => {
        console.log("in get all admin method");
        var query = "SELECT * FROM `admin` WHERE role = 'admin'";
        conn.query(query , (err , result) => {
            if(err){
  
              
              res.json({'status':'False', 'number':'29' , 'message':'Error in getting data !! TRY AGAIN'});
  
  
            }
            else {
              
              res.json({'status':'True', 'msg': 'Successfull ' ,  data: result  , 'pager' : pager , 'pageOfItems' : pageOfItems});
          
            }
        })
  
    }, */
    getadmin: (req, res) => {


        console.log("in get admin method===", req.body.pageperitem, req.body.searchvalue);

        var pageperitem = req.body.pageperitem;
        var serchvalue = req.body.searchvalue;


        if (serchvalue == null || serchvalue == "" || serchvalue == undefined) {
            if (pageperitem == "ALL" || pageperitem == "All") {
                var query = "SELECT * FROM `admin` WHERE role = 'admin'";
                conn.query(query, (err, result) => {
                    if (err) {


                        res.json({ 'status': 'False', 'number': '29', 'message': 'Error in getting data !! TRY AGAIN' });


                    }
                    else {

                        const items = result;

                        // get page from query params or default to first page
                        const page = 1;

                        // get pager object for specified page

                        const pager = paginate(items.length, page, parseInt(result.length));

                        // get page of items from items array
                        const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

                        // return pager object and current page of items
                        //return res.json({ pager, pageOfItems });


                        return res.json({ 'status': 'True', 'msg': 'Successfull ', 'pager': pager, 'pageOfItems': pageOfItems });

                    }
                })



            }
            else if (pageperitem != null || pageperitem != "" || pageperitem != undefined) {

                console.log(parseInt(pageperitem));

                var query = "SELECT * FROM `admin` WHERE role = 'admin'";
                conn.query(query, (err, result) => {
                    if (err) {


                        res.json({ 'status': 'False', 'number': '29', 'message': 'Error in getting data !! TRY AGAIN' });


                    }
                    else {


                        const items = result;

                        // get page from query params or default to first page
                        const page = parseInt(req.query.page) || 1;

                        // get pager object for specified page
                        const pageSize = 3;
                        const pager = paginate(items.length, page, parseInt(pageperitem));

                        // get page of items from items array
                        const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

                        // return pager object and current page of items
                        //return res.json({ pager, pageOfItems });


                        return res.json({ 'status': 'True', 'msg': 'Successfull ', 'pager': pager, 'pageOfItems': pageOfItems });

                    }
                })



            }

        }
        else {

            if (pageperitem == "ALL" || pageperitem == "All") {
                var query = "SELECT * FROM `admin` WHERE role = 'admin'  && emailaddress LIKE '%" + serchvalue + "%'";
                console.log(query)
                conn.query(query, (err, result) => {
                    if (err) {


                        res.json({ 'status': 'False', 'number': '29', 'message': 'Error in getting data !! TRY AGAIN' });


                    }
                    else {

                        const items = result;

                        // get page from query params or default to first page
                        const page = 1;

                        // get pager object for specified page

                        const pager = paginate(items.length, page, parseInt(result.length));

                        // get page of items from items array
                        const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

                        // return pager object and current page of items
                        //return res.json({ pager, pageOfItems });


                        return res.json({ 'status': 'True', 'msg': 'Successfull ', 'pager': pager, 'pageOfItems': pageOfItems });

                    }
                })



            }
            else if (pageperitem != null || pageperitem != "" || pageperitem != undefined) {

                console.log(parseInt(pageperitem));

                var query = "SELECT * FROM `admin` WHERE role = 'admin'  && emailaddress LIKE '%" + serchvalue + "%'";
                console.log(query);
                conn.query(query, (err, result) => {
                    if (err) {


                        res.json({ 'status': 'False', 'number': '29', 'message': 'Error in getting data !! TRY AGAIN' });


                    }
                    else {


                        const items = result;

                        // get page from query params or default to first page
                        const page = parseInt(req.query.page) || 1;

                        // get pager object for specified page
                        const pageSize = 3;
                        const pager = paginate(items.length, page, parseInt(pageperitem));

                        // get page of items from items array
                        const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

                        // return pager object and current page of items
                        //return res.json({ pager, pageOfItems });


                        return res.json({ 'status': 'True', 'msg': 'Successfull ', 'pager': pager, 'pageOfItems': pageOfItems });

                    }
                })



            }



        }





    }



}







