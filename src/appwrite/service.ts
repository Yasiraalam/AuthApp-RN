import { ID, Account,Client} from 'appwrite';
import Config from 'react-native-config';
import Snackbar from 'react-native-snackbar';


const appwriteClient = new Client()

const  APPWRITE_ENDPOINT: string = Config.APPWRITE_ENDPOINT!;
const APPWRITE_PROJECT_ID: string = Config.APPWRITE_PROJECT_ID!;

type CreateUserAccount=  {
    email: string;
    password: string;
    name: string;
}
type LoginUserAccount=  {
    email: string;
    password: string;
}

class AppwriteService {
    account;
    constructor() {
        appwriteClient
            .setEndpoint(APPWRITE_ENDPOINT)
            .setProject(APPWRITE_PROJECT_ID);

        this.account = new Account(appwriteClient);
    }   

    //create user account
    async createAccount({ email, password, name }: CreateUserAccount) {
        try {
            const response = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );
            if(response){
                //TODO:
                return this.login({ email, password });
            }else{
                return response;
            }
        } catch (error) {
            Snackbar.show({
                text: String(error),
                duration: Snackbar.LENGTH_SHORT,
            });

            console.log("appwrite createAccount error:", error);
            throw error;
        }
    }
    async login({ email, password }: LoginUserAccount) {
        try {
            return  await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            Snackbar.show({
                text: String(error),
                duration: Snackbar.LENGTH_SHORT,
            });
            console.log("appwrite loginAccount error:", error);
            
            throw error;
        }
    }
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            Snackbar.show({
                text: String(error),
                duration: Snackbar.LENGTH_SHORT,
            });
            console.log("appwrite getAccount error:", error);
            
            throw error;
        }
    }

    async logout() {
        try {
            return await this.account.deleteSession('current');
        } catch (error) {
            Snackbar.show({
                text: String(error),
                duration: Snackbar.LENGTH_SHORT,
            });
            console.log("appwrite logout error:", error);
            
            throw error;
        }
    }
}

export default new AppwriteService();

