const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    examId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    section:{ type:String , enum:['apitude','technical'],required:true},
    type:{ type:String , enum:['mcq','coding'], required:true},
    questiionText:{type:String, required : true},
    options:[{type:String, required:true}],
    conrrectAnswer:{type: String},
    marks:{type:Number , default: 1},
    codingProblemDetails:{
        inputFormat: String,
        outputFormat: String,
        sampleInput :String,
        sampleOutput:String
    }    
},{teimestamps:true});
module.export = mongoose.model('Question',questionSchema);