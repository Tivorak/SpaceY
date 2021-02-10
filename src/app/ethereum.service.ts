import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

const spaceYAbi = require('../assets/SpaceY.json');


@Injectable({
  providedIn: 'root'
})
export class EthereumService {
  public static readonly NULL_ADDRESS: string = '0x0000000000000000000000000000000000000000';

  private provider: ethers.providers.Web3Provider;
  private signer: ethers.Signer;
  private playerAddress: string;

  private contract: ethers.Contract;
  private contractAddress: string;

  private initialized = false;

  async initialize(contractAddress: string): Promise<void> {
    if (this.initialized) {
      throw Error("EthereumService is already initialized @" + this.contractAddress);
    }

    this.contractAddress = contractAddress;

    await detectEthereumProvider({ mustBeMetaMask: true });

    const ethereum: any = window.ethereum;
    await ethereum.send('eth_requestAccounts');

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
    this.playerAddress = await this.signer.getAddress();

    this.contract = new ethers.Contract(this.contractAddress, spaceYAbi.abi, this.provider).connect(this.signer);

    console.info('Initialized EthereumSerivce for account: ' + this.playerAddress);
    this.initialized = true;
  }

  private initializeGuard(): void {
    if (!this.initialized) {
      throw new Error('Trying to access non initialized ethereum service ...');
    }
  }

  async isActivePlayer(): Promise<boolean> {
    this.initializeGuard();
    const result = await this.contract.startPlanets(this.getPlayerAddress());
    return result.conquerBlockNumber.toNumber() === 0;
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
    return this.playerAddress;
  }
}
