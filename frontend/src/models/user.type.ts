interface User {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    email_verified?: boolean;
    course?: string;
    semester?: string;
    section?: string;
    otp?: string;
    otpExpiry?: Date;
    role: 'student' | 'faculty' | 'admin';
    profile_picture?: string;
    face_descriptor: number[];
    face_image: string;
    face_verified: boolean;
    last_login_ip?: string;
}
export type { User };