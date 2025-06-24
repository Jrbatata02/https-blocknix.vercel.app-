// Blocknix Staking App (React + Ethers.js)
// Interface completa com MetaMask, Staking, Contador e Links Sociais

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STAKING_CONTRACT = "<STAKING_CONTRACT_ADDRESS>";
const BLNX_TOKEN = "<BLNX_TOKEN_ADDRESS>";
const ABI_STAKING = [
  "function stake(uint256 amount) public",
  "function unstake(uint256 amount) public",
  "function claimRewards() public",
  "function calculateReward(address user) view returns (uint256)",
  "function stakes(address user) view returns (uint256 amount, uint256 timestamp, uint256 rewards)"
];

export default function BlocknixStakingApp() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [stakingData, setStakingData] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);
    }
  }, []);

  const connectWallet = async () => {
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setSigner(signer);
    setAccount(accounts[0]);
    fetchStakingData(accounts[0]);
  };

  const fetchStakingData = async (address) => {
    const contract = new ethers.Contract(STAKING_CONTRACT, ABI_STAKING, provider);
    const data = await contract.stakes(address);
    setStakingData({ amount: data.amount.toString(), rewards: data.rewards.toString() });
  };

  const stakeTokens = async () => {
    const contract = new ethers.Contract(STAKING_CONTRACT, ABI_STAKING, signer);
    const tx = await contract.stake(ethers.utils.parseUnits(stakeAmount.toString(), 18));
    await tx.wait();
    fetchStakingData(account);
  };

  const unstakeTokens = async () => {
    const contract = new ethers.Contract(STAKING_CONTRACT, ABI_STAKING, signer);
    const tx = await contract.unstake(ethers.utils.parseUnits(stakeAmount.toString(), 18));
    await tx.wait();
    fetchStakingData(account);
  };

  const claimRewards = async () => {
    const contract = new ethers.Contract(STAKING_CONTRACT, ABI_STAKING, signer);
    const tx = await contract.claimRewards();
    await tx.wait();
    fetchStakingData(account);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold flex items-center">
          <img src="/logo-caramelo.png" className="h-10 w-10 rounded-full mr-2" />
          Blocknix Staking
        </h1>
        <Button onClick={connectWallet}>{account ? "Conectado" : "Conectar Wallet"}</Button>
      </div>

      <Card className="mb-6">
        <CardContent>
          <div className="space-y-2">
            <div>Stake Atual: {stakingData?.amount || 0} BLNX</div>
            <div>Recompensas: {stakingData?.rewards || 0} BLNX</div>
            <input
              type="number"
              placeholder="Quantidade para stake..."
              className="p-2 text-black rounded"
              onChange={(e) => setStakeAmount(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={stakeTokens}>Stake</Button>
              <Button onClick={unstakeTokens}>Unstake</Button>
              <Button onClick={claimRewards}>Claim</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 items-center">
        <a href="https://t.me/blocknix" target="_blank" className="text-blue-400">Telegram</a>
        <a href="https://twitter.com/blocknix" target="_blank" className="text-blue-300">Twitter</a>
        <a href="https://instagram.com/blocknix" target="_blank" className="text-pink-400">Instagram</a>
        <Button
          onClick={() => navigator.share?.({ title: "Blocknix", text: "Entre no staking da Blocknix!", url: window.location.href })}
        >Compartilhar</Button>
      </div>
    </div>
  );
}
