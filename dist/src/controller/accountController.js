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
Object.defineProperty(exports, "__esModule", { value: true });
const accountDao_1 = require("../Dao/accountDao");
const helper_1 = require("./helper");
const getAccount = (0, helper_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { email } = req.params;
    const account = yield (0, accountDao_1.findAccountByEmail)(email);
    if (!account) {
        res.status(404).json({ data: null, message: "Account not found" });
    }
    const resp = {
        _id: (_a = account === null || account === void 0 ? void 0 : account.seafarer) === null || _a === void 0 ? void 0 : _a.id,
        createdAt: {
            $date: "2026-01-31T08:19:41.841Z",
        },
        email: account === null || account === void 0 ? void 0 : account.email,
        fullName: `${(_b = account === null || account === void 0 ? void 0 : account.profile) === null || _b === void 0 ? void 0 : _b.firstName} ${(_c = account === null || account === void 0 ? void 0 : account.profile) === null || _c === void 0 ? void 0 : _c.lastName}`,
        accountId: account === null || account === void 0 ? void 0 : account.id,
        dateOfBirth: {
            $date: (_d = account === null || account === void 0 ? void 0 : account.profile) === null || _d === void 0 ? void 0 : _d.dateOfBirth,
        },
        nationality: "",
        gender: "",
        phoneNumber: `${(_e = account === null || account === void 0 ? void 0 : account.profile) === null || _e === void 0 ? void 0 : _e.countryCode}${(_f = account === null || account === void 0 ? void 0 : account.profile) === null || _f === void 0 ? void 0 : _f.phoneNumber}`,
        rank: "",
        seamansBookNumber: "CERT-2024-00123",
        yearsOfService: 0,
        credentialsVerified: false,
        hasActiveAssignment: false,
        emergencyContactCount: 0,
        hasEmergencyContacts: false,
        preferredLanguage: "en",
        timezone: "America/New_York",
        dailyCheckInReminderTime: "",
        crisisDetectionEnabled: true,
        allowTherapistAccess: false,
        profileStatus: "=",
        completenessScore: 90,
        completedAt: {
            $date: "",
        },
        lastModifiedAt: {
            $date: "",
        },
        memberSince: {
            $date: account === null || account === void 0 ? void 0 : account.createdAt,
        },
        displayName: `${(_g = account === null || account === void 0 ? void 0 : account.profile) === null || _g === void 0 ? void 0 : _g.firstName} ${(_h = account === null || account === void 0 ? void 0 : account.profile) === null || _h === void 0 ? void 0 : _h.lastName}`,
        completionMessage: "",
        _class: "online.crew360.seafarer_wellness_platform.seafarer_profile.api.read_model.SeafarerProfileView",
    };
    res.status(200).json({ data: resp });
}));
exports.default = { getAccount };
