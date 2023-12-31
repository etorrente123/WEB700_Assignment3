//Pang imports mo to
let express = require("express");
let HTTP_PORT = process.env.PORT || 8080;
let eli = express();
let path = require("path");
let collegeData = require("./modules/collegeData");
const { countReset } = require("console");


eli.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "views","home.html"));
});

eli.get("/about", (req, res)=>{
    res.sendFile(path.join(__dirname, "views","about.html"));
});

eli.get("/htmlDemo", (req, res)=>{
    res.sendFile(path.join(__dirname, "views","htmlDemo.html"));
});

eli.get("/tas", (req, res)=>{
    collegeData.getTAs()
    .then((tas)=>{
        if(tas.length == 0){
            res.json({message: "error"});
        }else{
            res.json(tas);
        }
    })
    .catch((err)=>{
        res.status(500).json({error:err.message});
    });
});

eli.get("/courses", (req,res)=>{
    collegeData.getCourses()
    .then((courses)=>{
        if(courses.length===0){
            res.json({message:"error"});
        }else{
            res.json(courses);
        }
    })
    .catch((err)=>{
        res.status(500).json({error:err.message});
    });
});

eli.get("/student/:num", (req,res)=>{
    var paramNum = req.params.num;
    collegeData.getStudentByNum(paramNum)
    .then((student)=>{
        if(!student){
            console.log("error");
        }else{
            res.json(student);
        }
    })
    .catch((err)=>{
        res.status(500).json({error: err.message});
    });
});

eli.get("/student", (req,res)=>{
    var courses = req.query.course;
    collegeData.getAllStudents()
    .then((students)=>{
        if(students.length === 0){
            console.log("no student")
        }else{
            if(courses){
                return collegeData.getStudentsByCourse(courses);
            }else{
                return students;
            }
        }
    })
    .then((studentByCourse) => {
        res.json(studentByCourse)
    })
    .catch((err)=>{
        res.status(500).json({error: err.message});
    });
});

collegeData.initialize()
    .then(()=>{
        eli.listen(HTTP_PORT, () =>{
            console.log("Server now on " + HTTP_PORT);
        });
    })
    .catch((err)=>{
        console.error(err)
    });