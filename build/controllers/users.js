var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');
usersRouter.post('/', (request, response) => __awaiter(this, void 0, void 0, function* () {
    const { username, password } = request.body;
    const saltRounds = 10;
    const passwordHash = yield bcrypt.hash(password, saltRounds);
    const user = new User({
        username,
        passwordHash,
    });
    const savedUser = yield user.save();
    response.status(201).json(savedUser);
}));
module.exports = usersRouter;
