import { UserModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface registerParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}


export const register = async ({firstName, lastName, email, password}:registerParams) => {

    try {

        const findUser = await UserModel.findOne({ email });
        if (findUser) {
            return {data: "User already exists", status: 400};
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        return {data: generateJWT({email, firstName, lastName}), status: 201};
    }

    catch (error) {
        return {data: "Internal Server Error", status: 500};

    }
}

interface loginParams {
    email: string;
    password: string;
}

export const login = async ({email, password}:loginParams) => {
try {

    const findUser = await UserModel.findOne({ email });
    if (!findUser) {
        return {data: "Incorrect email or password!", status: 400};
    }
    
    //const passwordMatch = findUser.password === password;
    const passwordMatch = await bcrypt.compare(password, findUser.password);
    if (!passwordMatch) {
        return {data: "Incorrect email or password!", status: 400};
    }
    return {data: generateJWT({email, firstName: findUser.firstName, lastName: findUser.lastName}), status: 200};
}

catch (error) {
    return {data: "Internal Server Error", status: 500};
}

}

const generateJWT = (data:any) => {
    try {
        return jwt.sign(data, 'j71FqEQKQoHiukox9MVmT4j6WuhIbXnP');
    }
    catch (error) {
        throw new Error('Error generating JWT');    
    }
}