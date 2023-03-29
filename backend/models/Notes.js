/* eslint-disable no-undef */
const mongoose = require('mongoose');
const {Schema} = mongoose



const notesSchema = new Schema({
   title:{
    type:String,
    required:true,
   },
   tag:{
    type:String,
    default:"General"
   },
   description:{
    type:String,
    required:true
   },
   date:{
    type:Date,
    default:Date.now 
   }
  }); 

  module.exports = mongoose.model('notes', notesSchema)