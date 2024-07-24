interface Encrypt {
  encrypt(otp: string | number): Promise<string>;
  compare(otp: string | number, hashedOtp: string): Promise<boolean>;
}

export default Encrypt;
