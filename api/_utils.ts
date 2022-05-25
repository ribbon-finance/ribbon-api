const ethers = require('ethers')
const {BigNumber} = ethers;
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/d43d838246464b5690f8b10337b446d7')

const totalSupply = ethers.utils.parseEther('1000000000')

export const getTotalSupply = () => {
    return 1000000000
}

const vestingContracts = [
    '0xAD689459a783Cb3d3156e886dbE4aaC178eB38BD',
    '0x3a3165Cd21814EBA6a31fDB41dF51b0c905AF97B',
    '0x36652F64D444394E1Ca02D65ed47Acf6bf28E7fc',
    '0x7D87d369243e44C21A48A89A8b3dD663f38F7863',
    '0xA18E6dB731aD07AC60e5351f0ac20E46DD3bE822',
    '0xAc89a29Daf12426BC352cb729015E46fDf609947',
    '0x28655a2fc7410F7aF8691B1179Fd42f8DE16E76d',
    '0x41460e8A051A274C100CC68bAF5cdd8d77210a2F',
    '0x3220b5ffa91a2565cD13506f95B36D243f689C99',
    '0xE4ECA1232DAf05811baDfc53b50eA71cBC7Fdd08',
    '0xFe40f01C7C9B81DEEaCe1133524eB42467408301',
    '0x304C305a2d9332c93cC99D163A1581Eb505CC17f',
    '0x2Dad20b6d5F4d1413Af7998b2d55653EaADc7E45',
    '0x7aDB57A219b26C19b681dfeaa0a4a2944de32D59',
    '0x5a61800F0b4869d2507015B530133E6360454031',
    '0xeEC2FF5FA0147A609490C10Cb7400cD35eA7B399',
    '0xD72171553f3eB11224Ad6eAbf6A0560d764700C6',
    '0x950b314Bab8B606f37b170a773945625c8d832c1',
    '0x275cDe983b1Bb902a6B1C4727a2B265B1A542a75',
    '0xb48351Ad1907410f7E4939Fa1686F3acAb6a34bB',
    '0x263F15E83ED674a9f1089f1e25dB1AA3b3958180',
    '0xCEebD6A2c6bA40D07995B1A87d61769B03b1218a',
    '0x17d9895B86B94c089E78b93aF9F4019D0cC34B25',
    '0xe49211a96E1d3AAD2C96583a60cE7DE3F0797CB2', // MM 1
    '0xC62d0a26cEA12213B23CA1fa52f870CAFeAC8215', // MM 2
]

const unissuedHolders = [
    '0x42C1357aAA3243EA30c713cdFEd115D09F10a71D', // DAO vesting
    '0xDAEada3d210D2f45874724BeEa03C7d4BBD41674', // DAO multisig
    '0x3AB38c803C8e26bB4ecCeeEb5AA601f7076d32Fc', // Team
    '0xEa26a24cD2a56314ebC87fA7838F08F918A03aDB', // Corporate property
    '0x7902e4bfb1eb9F4559d55417Aee1Dc6E4b8cC1Bf', // Airdrop contract
]

const RBN = '0x6123B0049F904d730dB3C36a31167D9d4121fA6B'
const tokenABI = [{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
const vestingABI = [{"stateMutability":"view","type":"function","name":"locked","inputs":[],"outputs":[{"name":"","type":"uint256"}],"gas":50000},{"stateMutability":"view","type":"function","name":"total_locked","inputs":[],"outputs":[{"name":"","type":"uint256"}],"gas":50000}]


const token = new ethers.Contract(RBN, tokenABI, provider)

export const getCirculatingSupply = async () => {
    const unissuedAmountsBN = await Promise.all(unissuedHolders.map(getTokenBalance))
    const unissuedTotal = unissuedAmountsBN.reduce((acc: BigNumber, u: BigNumber) => acc.add(u), BigNumber.from(0))
    const lockedAmounts = await getSumOfLockedAmounts()
    const circulating = totalSupply.sub(unissuedTotal).sub(lockedAmounts)
    return parseFloat(ethers.utils.formatEther(circulating))
}

const getSumOfLockedAmounts = async () => {
    const lockedAmounts = await Promise.all(vestingContracts.map(v => {
        const vesting = new ethers.Contract(v, vestingABI, provider)
        return vesting.locked()
    }))
    return lockedAmounts.reduce((acc: BigNumber, u: BigNumber) => acc.add(u), BigNumber.from(0))
}

const getTokenBalance = async (address:string) => {
    const bal =  await token.balanceOf(address);
    return bal
}
