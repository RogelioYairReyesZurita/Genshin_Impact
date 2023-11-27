const {request, response} = require('express');
const bcrypt = require('bcrypt');
const usermodels = require('../modelos/usuarios');
const pool=require('../db');


const ListaUSUARIOS = async (req = request, res = response) => {
    let conn; 

    try{
        conn = await pool.getConnection();

    const usuarios = await conn.query (usermodels.getAll, (err)=>{
        if(err){
            throw err
        }
    });

    res.json(usuarios);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
    
}

////////////////////////////buscar por id/////////////////////////////////////////////
const BuscarPORid = async (req = request, res = response) => {
    const {id} = req.params;

    if (isNaN(id)) {
        res.status(400).json({msg: 'Invalid ID'});
        return;
    }
    let conn; 

    try{
        conn = await pool.getConnection();

    const [user] = await conn.query (usermodels.getByID, [id], (err)=>{
        if(err){
            throw err
        }
    });

    if (!user) {
        res.status(404).json({msg: 'User not foud'});
        return;
    }

    res.json(user);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
}
/*
http://localhost:3000/api/v1/genshin/1
*/

////////////////////////////agregar usuario/////////////////////////////////////////////
const AgregarUsuario =async(req = request, res= response)=>{
    let conn;
    const {
        Nombre,
        Rareza,
        Region,
        Vision,
        Arma,
        CumpleAños ='',
        Trabajo =''
    } = req.body;
    if (!Nombre|| !Rareza|| !Region|| !Vision|| !Arma){
res.status(400).json({msg:'Missing informarion'});
return;
        }

        const user= [Nombre, Rareza, Region, Vision, Arma, CumpleAños, Trabajo];
    
    try {
        conn = await pool.getConnection();

        const [usernameUser] = await conn.query(
            usermodels.getByUsername,
            [Nombre],
            (err)=>{if(err) throw err;}
        );
        if(usernameUser){
            res.status(409).json({msg:`User with username ${Nombre} alredy exists`});
            return;
        }

        const userAdded = await conn.query(usermodels.addRow,[...user],(err)=>{})
        
        if(userAdded.affectedRow === 0)throw new Error({msg:'Failed to add user'});
        res.json({msg:'User updated succesfully'});
    }catch(error){
console.log(error);
res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}
/*
{
    "Nombre": "fasd",
    "Rareza": 5,
    "Region": "Fontine",
    "Vision": "Hydro",
    "Arma": "Catalizador",
    "CumpleAños": "wqe",
    "Trabajo": "wqe"
}
*/ 


/////////////////////////////Modifica Usuario//////////////////////////////////////////////////

const ModificaUsuario=async(req, res)=>{
    const {
        Nombre,
        Rareza,
        Region,
        Vision,
        Arma,
        CumpleAños,
        Trabajo
    } = req.body;

const {id} = req.params;

let newUserData=[
    Nombre,
    Rareza,
    Region,
    Vision,
    Arma,
    CumpleAños,
    Trabajo  
];
let conn;
try{
    conn = await pool.getConnection();
const [userExists]=await conn.query(
    usermodels.getByID,
    [id],
    (err) => {if (err) throw err;}
);
if (!userExists){
    res.status(404).json({msg:'User not found'});
    return;
}

const [usernameUser] = await conn.query(
    usermodels.getByUsername,
    [Nombre],
    (err) => {if (err) throw err;}
);
if (usernameUser){
    res.status(409).json({msg:`User with username ${Nombre} already exists`});
    return;
}

const oldUserData = [
    userExists.Nombre,
    userExists.Rareza,
    userExists.Region,
    userExists.Vision,
    userExists.Arma,
    userExists.CumpleAños,
    userExists.Trabajo  
];

newUserData.forEach((userData, index)=> {
    if (!userData){
        newUserData[index] = oldUserData[index];
    }
})

const userUpdate = await conn.query(
    usermodels.getActuData,
    [...newUserData, id],
    (err) => {if (err) throw err;}
);
if(userUpdate.affecteRows === 0){
    throw new Error ('User not updated');
}
res.json({msg:'User updated successfully'})
}catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
}





/////////////////////////////////eliminar dato/////////////////////////////////////////////////////////

    const Eliminardatos = async (req=request,res=response)=>{
        let conn;
        try {
            conn= await pool.getConnection();
            const {id}=req.params;

            const[userExists]=await conn.query(
                usermodels.getByID,
                [id],
                (err)=>{if(err) throw err;}
            );
            if(!userExists){
                res.status(404).json({msg: 'User not found'})
                return;
            }
            const userDelete = await conn.query(
                usermodels.deleteRow,
                [id],
                (err)=>{if(err) throw err;}
            );
            if(userDelete.affectedRow===0){
                throw new Error({msg: 'Failed to delete user'});
            }
            res.json({msg:'User delete succesfelly'});

        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }finally{
            if(conn) conn.end();
        }
    }

module.exports={ListaUSUARIOS,BuscarPORid,AgregarUsuario,ModificaUsuario,Eliminardatos};
