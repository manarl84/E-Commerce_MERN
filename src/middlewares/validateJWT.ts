import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";
import { type ExtendRequest } from "../types/extendedRequest.js";


const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {

    try {

        // Suggested by Copilot
        //const authorizationHeader = req.headers['authorization'];

        const authorizationHeader = req.get('Authorization');

        if (!authorizationHeader) {
            return res.status(403).send('Authorization header missing');

            // same result but more statements
            // res.status(403).send('Authorization header missing');
            // return;
        }

        const token = authorizationHeader.split(' ')[1];

        // same result but more statements
        //const bearerToken = authorizationHeader.split(' ');
        //const token = bearerToken[1];

        if (!token) {
            return res.status(403).send('Token missing');
        }

        jwt.verify(token, 'j71FqEQKQoHiukox9MVmT4j6WuhIbXnP', async (err, payload) => {
            if (err) 
                //wrong token, expired token
                return res.status(401).send('Invalid token');
            if (!payload){
                return res.status(401).send('Invalid token payload');
            } 

            
            // Another way to handle the type of payload - suggested by Yahya
            /*const userPayload = payload as { 
            email: string,
            firstName: string,
            lastName: string };*/

            // Fetch user from database based on payload
            const user = await UserModel.findOne({ email: (payload as any).email });
            req.user = user;
            next();

        });
    }

    catch (error) {
        res.status(500).send({message: 'Internal Server Error'});
    }

}

export default validateJWT;