const hre = require("hardhat");

async function main() {
  // Deploy CommentContract
  const Comment = await hre.ethers.getContractFactory("CommentContract");
  const comment = await Comment.deploy();
  await comment.waitForDeployment(); // ✅ mới API
  console.log("CommentContract deployed to:", await comment.getAddress());

  // Deploy PaymentContract
  const Payment = await hre.ethers.getContractFactory("PaymentContract");
  const payment = await Payment.deploy();
  await payment.waitForDeployment();
  console.log("PaymentContract deployed to:", await payment.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
