// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentContract {
    event Payment(address indexed buyer, uint amount);

    function pay() external payable {
        require(msg.value > 0, "Payment must be > 0");
        emit Payment(msg.sender, msg.value);
    }
}
