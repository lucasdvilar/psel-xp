import HttpException from "../helpers/HttpException";
import Jwt from "../helpers/Jwt";
import { IClient } from "../interfaces/IClient";
import IDeposit from '../interfaces/IDeposit';
import ClientModel from "../models/Client";
import connection from "../models/connection";

class ClientService {
  private model: ClientModel;

  constructor() {
    this.model = new ClientModel(connection);
  }

  public login = async (client: IClient): Promise<string> => {
    const clientInfo = await this.model.getByUsernameAndPw(client);
    if (!clientInfo) throw new HttpException(401, 'Invalid username or password');
    return new Jwt().generateToken(clientInfo);
  }

  public deposit = async (clientId: number, amount: number): Promise<IDeposit> => {
    const client = await this.model.getById(clientId);
    const newBalance = client.balance + amount;
    await this.model.update(clientId, newBalance);
    return { codCliente: clientId, valor: amount };
  }
}

export default ClientService;
