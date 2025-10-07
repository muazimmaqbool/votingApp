const express=require('express');
const router=express.Router();//used to manage routes
const {jwtAuthMiddleware,generateToken}=require("../jwt")
const Candidate=require("../Models/candidate")
