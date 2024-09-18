import dbConnection from "../config/dbConnection.js"
import { DataTypes } from "sequelize";

const Usuario = dbConnection.define("usuarios", {
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true    
    },
    nome:{
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    senha:{
        type: DataTypes.STRING,
        required: true
    }
},{
    tableName: "Usuario"
}
);

export default Usuario;