const {Router} = require ('express')
const{ListaUSUARIOS,BuscarPORid,AgregarUsuario,ModificaUsuario,Eliminardatos}=require('../controladores/usuarios');

const router =Router();

//http://localhost:3000/api/v1/users/
//http://localhost:3000/api/v1/users/1
//http://localhost:3000/api/v1/users/3

router.get('/', ListaUSUARIOS);
router.get('/:id', BuscarPORid);
router.put('/', AgregarUsuario);
router.patch('/:id', ModificaUsuario);
router.delete('/:id', Eliminardatos);
module.exports =router;
