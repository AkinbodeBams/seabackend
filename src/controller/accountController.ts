import { findAccountByEmail } from "../Dao/accountDao";
import { catchAsync } from "./helper";
import { Request, Response, NextFunction } from "express";

interface accountParams {
  email: string;
}
const getAccount = catchAsync(
  async (req: Request<accountParams>, res: Response, next: NextFunction) => {
    const { email } = req.params;
    const account = await findAccountByEmail(email);
    if (!account) {
      res.status(404).json({ data: null, message: "Account not found" });
    }
    const resp = {
      _id: account?.seafarer?.id,
      createdAt: {
        $date: "2026-01-31T08:19:41.841Z",
      },
      email: account?.email,
      fullName: `${account?.profile?.firstName} ${account?.profile?.lastName}`,
      accountId: account?.id,
      dateOfBirth: {
        $date: account?.profile?.dateOfBirth,
      },
      nationality: "",
      gender: "",
      phoneNumber: `${account?.profile?.countryCode}${account?.profile?.phoneNumber}`,
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
        $date: account?.createdAt,
      },
      displayName: `${account?.profile?.firstName} ${account?.profile?.lastName}`,
      completionMessage: "",
      _class:
        "online.crew360.seafarer_wellness_platform.seafarer_profile.api.read_model.SeafarerProfileView",
    };

    res.status(200).json({ data: resp });
  },
);

export default { getAccount };
