import UserSchema from "../models/userSchema.js";
import bcrypt from "bcrypt"
import {verifyToken} from "./authController.js"
import  jwt  from "jsonwebtoken";

const getAll =  (req, res) => {
  UserSchema.find((err,users) =>{
    if(err){
      res.status(500).send({message: err.message})
    }
    res.status(200).send(users)
    
    })     
};

const getIdByToken =  async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
   
    await verifyToken(token)

    jwt.verify(token, process.env.SECRET, (err, decodedData) =>{
   
      const decodedToken = decodedData;
//      res.status(200).send(decodedToken)
      
      const findUserToken = UserSchema.findById(decodedToken.id, (err, user) =>{
        if (err){
          res.status(500).send({message:err.message});
        }
        else{
          res.status(200).send(user)
        }
      } )
   
    })    
    
    
  
} catch (error) {
    res.status(403).send({error:error.message})
    console.error("erro", error);
  }
  
}


const getUser =  (req, res) =>{
  
  const findUser =  UserSchema.findById(req.params.id, (err, user) =>{
    if (err){
      res.status(500).send({message:err.message});
    }
    else{
      res.status(200).send(user)
    }
  } )
  
  }

const createUser = async(req, res) =>{

  const hashedPassword = bcrypt.hashSync(req.body.password, 10) //10 é salt
  req.body.password = hashedPassword;

  try{

  const {
    email,
    password,
    name,
    gender,
    birthDate,
    cpf,
    phoneNumber,
    //roles
  }= req.body;

  const newUser = new UserSchema({
    email,
    password,
    name,
    gender,
    birthDate,
    cpf,
    phoneNumber,
    role:"user"
  })
  
  const savedUser = await newUser.save()

  res.status(201).send({
    message:"usuário cadastrado com sucesso",
    statusCode: 201,
    data: savedUser,
  });
  }
  catch(err){
  console.log("erro em"+ err);
  res.status(400).json(
    {message:"Ocorreu um erro, não foi possível cadastrar",
    statusCode:400,
    error:{
      code:400,
      message:"Faltou algum item a ser preenchido"}
    }
  )
}
}

const updateUser = async (req, res) =>{
  try {
 const updatedUser = await UserSchema.findByIdAndUpdate(req.params.id, req.body) //fBIAU metodo do mongoose ver documentação.
 
 res.status(200).send({
  message: "usuario atualizado com sucesso",
  statusCode:200,
  data: updatedUser,
})

} catch (err) {
    res.status(500).send({message:"err.message"});
    console.log("erro em:"+err);
  }
}

const deleteUser = async (req,res) =>{
  try {
    await UserSchema.findByIdAndDelete(req.params.id)

    res.status(200).send({
      message: "usuario deletado com sucesso",
      statusCode:200,
    })
  } catch (err) {
    console.log(err);
  }
}



export default {
  getAll,
  getIdByToken,
  getUser,
  createUser,
  updateUser,
  deleteUser
};

