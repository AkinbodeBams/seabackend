"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = createAccount;
exports.findAccountByEmail = findAccountByEmail;
const prisma_1 = __importDefault(require("../../lib/prisma"));
function createAccount(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("dbbbbbb");
        return prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            // Create account
            const account = yield tx.account.create({
                data: {
                    email: data.email,
                    password: data.password,
                    type: data.type,
                },
            });
            // Create profile
            yield tx.profile.create({
                data: {
                    accountId: account.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber.value,
                    countryCode: data.phoneNumber.countryCode,
                },
            });
            // Create role-specific record
            if (account.type === "SEAFARER") {
                yield tx.seafarer.create({
                    data: { accountId: account.id },
                });
            }
            else {
                yield tx.therapist.create({
                    data: { accountId: account.id },
                });
            }
            // ✅ return account from transaction
            return account;
        }));
    });
}
function findAccountByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const account = yield prisma_1.default.account.findUnique({
            where: { email },
            include: {
                seafarer: true,
                therapist: true,
                profile: true,
            },
        });
        return account;
    });
}
