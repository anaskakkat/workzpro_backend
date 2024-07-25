interface JWT {
  generateToken(userId: string, email: string): string;
}

export default JWT;
