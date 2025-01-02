import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export interface User {
  email: string;
  password: string;
}

export class AuthService {
  client = new Client();
  account: Account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createUser({ email, password }: User) {
    try {
      const response = await this.account.create(ID.unique(), email, password);
      if (response) {
        this.login({ email, password });
      } else {
        throw new Error("Failed to create user");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login({ email, password }: User) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite serive :: getCurrentUser :: error", error);
    }

    return null;
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite serive :: logout :: error", error);
    }
  }
}

const authService = new AuthService();

export default authService;
