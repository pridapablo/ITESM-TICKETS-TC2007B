import user from "../models/user";

// @ts-ignore
export const getUsers = async (_req, res) => {
    let u;
    try {
        u = await user.find();
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
    if(!u) {
        res.status(500).json({message: 'Error al obtener usuarios'});
    }
    res.status(200).json(u);
};

// @ts-ignore
export const getUser = async (req, res) => {
    let u;
    try {
        u =await user.findById(req.params.id);
    }
    catch (error: any) {
        res.status(500).json({message: error.message});
    }
    if(!u) {
        res.status(500).json({message: 'Error al obtener usuario'});
    }
    res.status(200).json(u);
}

// @ts-ignore
export const createUser = async (req, res) => {
    const { username, pwdHash, role } = req.body;

    if (!username || !pwdHash || !role) {
        res.status(400).json({message: 'Faltan datos'});
    }
    const u = new user({
        username,
        pwdHash,
        role,
    });

    let result;
    try {
         result = await u.save();
    } catch (error : any) {
        res.status(500).json({message: error.message});
    }
    if(!result) {
        res.status(500).json({message: 'Error al crear usuario'});
    }
    res.status(201).json(result);
}   

// @ts-ignore
export const updateUser = async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ message: 'Faltan datos' });
    }
    let u;
    try {
        u = await user.findByIdAndUpdate(req.params.id, req.body);
    
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
    if (!u) {
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
    
  res.status(200).json(u);
}

// @ts-ignore
export const deleteUser = async (req, res) => {
    let u;
try {
        u = await user.findByIdAndDelete(req.params.id);
    
} catch (error: any) {
    res.status(500).json({message: error.message});
    
}
    if (!u) {
        res.status(500).json({message: 'Error al eliminar usuario'});
    }
    res.status(200).json(u);
}
