import { Injectable } from '@angular/core';
import { ethers } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider';

let spaceYAbi = require('../assets/SpaceY.json');


@Injectable({
  providedIn: 'root'
})
export class EthereumService {
  public static readonly NULL_ADDRESS: string = "0x0000000000000000000000000000000000000000";

  private provider: ethers.providers.Web3Provider;
  private signer: ethers.Signer;
  private player_address: string;

  private contract: ethers.Contract;
  private contractAddress: string = "0xd9145CCE52D386f254917e481eB44e9943F39138";

  private initialized: boolean = false;

  async connectToMetaMask() {
    if (this.initialized) {
      return;
    }
    await detectEthereumProvider({ mustBeMetaMask: true });

    var ethereum: any = window.ethereum;
    await ethereum.send('eth_requestAccounts');

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
    this.player_address = await this.signer.getAddress();

    this.contract = new ethers.Contract(this.contractAddress, spaceYAbi["abi"], this.provider).connect(this.signer);

    console.info("Initialized EthereumSerivce");
    this.initialized = true;
  }

  private initializeGuard() {
    if (!this.initialized) {
      throw new Error("Trying to access non initialized ethereum service ...");
    }
  }

  getContract(): ethers.Contract {
    this.initializeGuard();
    return this.contract;
  }

  getProvider(): ethers.providers.Web3Provider {
    this.initializeGuard();
    return this.provider;
  }

  getPlayerAddress(): string {
    this.initializeGuard();
    return this.player_address;
  }
}