import jwt from "jsonwebtoken";

import { createHash, isValidPassword } from "../utils.js";
import config from "../config/config.js";
import { userService } from "../repositories/index.js";
import UserDTO from "../dao/DTOs/user.dto.js";
import CustomError from "../services/errors/CustomError.js";
import { generateUserErrorInfo, mongoError, unfindField, uniqueField } from "../services/errors/info.js";
import EErrors from "../services/errors/enums.js";

class UserController {

  registerUser = async (req, res, next) => {
    try {
      const { first_name, last_name, email, age, password } = req.body;
      if (!(await userService.existEmail(email))) {
        let newUser = {
          first_name,
          last_name,
          email,
          age,
          password: password
        };
        if (Object.values(newUser).every((value) => String(value).trim() !== "" && value !== undefined)) {
          newUser.password = createHash(password);
          const result = await userService.createUser(newUser);
          if (result) {
            res.send({ status: "success", payload: result });
          } else {
            const err = new CustomError(
              "error de mongoDB",
              mongoError(),
              "falla al guardar el usuario en BDD",
              EErrors.DATABASE_ERROR
            )
            return next(err);
          }
        } else {
          const err = new CustomError(
            "error al crear usuario",
            generateUserErrorInfo(newUser),
            "faltan campos obligatorios para crear usuario",
            EErrors.INVALID_TYPES_ERROR
          )
          return next(err);
        }
      } else {
        const err = new CustomError(
          "correo ya existe",
          uniqueField("email"),
          "el correo ingresado ya existe",
          EErrors.ALREADY_EXIST
        );
        return next(err);
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  login = async (req, res, next) => {
    const { email, password } = req.body;
    let usrDTO;
    if (email === config.admin && password === config.passAdmin) {
      usrDTO = {
        first_name: "",
        last_name: "Administrador",
        email: email,
        age: 0,
        rol: "ADMIN",
      };
      const token = jwt.sign({usrDTO}, config.tokenPass, {expiresIn: "24h"});
      res.cookie("tokenUsrCookie", token, {maxAge: 60 * 60 * 1000 * 24, httpOnly: true});
        
        // se envia user completo en lugar de dto para tener toda la info para testear 
      res.send({ status: "success", payload: usrDTO, token: token });
    } else {
      const user = await userService.findOneUser(email);
      if (user) {
        if (isValidPassword(user, password)) {
          usrDTO = new UserDTO(user);
          const token = jwt.sign({usrDTO}, config.tokenPass, {expiresIn: "24h"});
          res.cookie("tokenUsrCookie", token, {maxAge: 60 * 60 * 1000 * 24, httpOnly: true});
          
          // se envia user completo en lugar de dto para tener toda la info para testear 
          res.send({ status: "success", payload: user, token: token });
        } else {
          res.send({ status: "error", message: "Contraseña incorrecta" });
        }
      } else {
        const err = new CustomError(
          "usuario no registrado",
          unfindField("email"),
          "el correo ingresado no existe",
          EErrors.DATABASE_ERROR
        );
        return next(err);
      }
    }
  };
}
export default UserController;
