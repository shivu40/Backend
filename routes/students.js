
const express = require('express');
const Student = require('../models/student');
const router = express.Router()


router.get('/get', async (req, res) => {
        try {
                const student = await Student.findOne({_id : req.query._id});       //Getting the data
                const newData = removeIdAndV(student);                  //Removing _id and __V from the document
                const response = {                                      //Creating a new response as mentioned in the assignment
                    message : "success",
                    data : newData
                }
                
                res.json(response);                                     //Sending the response.

        } catch (err) {
                res.json('Error:' + err)
        }
})


function removeIdAndV(data){
    //Deep copying the result to another object to delete _id and __v
    const newData = JSON.parse(JSON.stringify(data));
    delete newData._id;
    delete newData.__v;
    return newData;
}

router.post('/create', async (req, res) => {
        const student = new Student(req.body);              //creating student object from body object of the request.

        try {
                const result = await student.save();        //creating new document in the database.               
                const newData = removeIdAndV(result);       //removing _id and __v from the result.
                const response = {                          //Creating a new response as mentioned in the assignment.
                    message : "success",
                    data : newData
                }                
                res.json(response);                         //Sending the response.
        } catch (err) {
                res.json('Error:' + err)                    //Sending the error (If Any).
        }
})


router.post('/update', async(req, res) => {
    try {
        //Getting the student from the database with the given id.
        const student = await Student.findOne({_id : req.body._id});
        
        const additionalFields = {};
        //Filling the additionalFields object with the fields which are new.
        for(key in req.body){
            if(!(key in student)){
                additionalFields[key] = String;
            }
        }
        if(Object.keys(additionalFields).length > 0 ){

            //If we have to add any new field then updating the schema with the new fields 
            //and then after adding the new fields adding document to the database.
            //Using replace here because update was only updating the existing fields but was not adding the new fields.
            Student.schema.add(additionalFields);
        
            const newStudent = JSON.parse(JSON.stringify(student));
            
            for(key in req.body){            
                newStudent[key] = req.body[key];
            }

            await Student.replaceOne({_id: req.body._id}, newStudent);
            
            
        }else if(Object.keys(additionalFields).length === 0 ){

            //If the body of the request do not contain any new field then simply updating
            //the existing fields values in the document.
            await Student.updateOne({_id: req.body._id}, req.body);
        }


        const updatedStudent = await Student.findOne({_id: req.body._id});      //Getting the updated data

        const response = {                                                      //Preparing Response.
            message : "success",
            data : removeIdAndV(updatedStudent)
        }  
        
        res.json(response);                                                     //Sending response.
        
        
    } catch (error) {
        res.json('Error:' + error)
    }
})



router.delete('/delete', async (req, res) => {
        try {
                const student = await Student.findOneAndDelete({ _id: req.body._id });          //Deleting the data 
                console.log(student);
                const response = {
                    message : "success",
                    data : "Document deleted successfully"
                }

                res.json(response);
        } catch (error) {
                res.json(error)
        }
})

module.exports = router