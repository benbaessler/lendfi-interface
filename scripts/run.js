const hre = require("hardhat");
const { providers } = require('ethers')

async function main() {
  const Loan = await hre.ethers.getContractFactory("LoanFactory");
  const contract = await Loan.deploy();

  await contract.deployed();

  console.log("Contract deployed to:", contract.address);

  const provider = providers.getDefaultProvider()
  const [user1, user2] = await ethers.getSigners()

  await contract.submitLoan(
    user1.address, 
    user2.address, 
    ethers.utils.parseEther('.5'),
    ethers.utils.parseEther('.05'),
    { contractAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', tokenId: 1 },
    1234567
  )

  console.log(await contract.getPaybackAmount(0))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
