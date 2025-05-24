// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CommentContract {
    struct Comment {
        address user;
        string message;
        uint timestamp;
    }

    Comment[] public comments;

    function addComment(string calldata _message) external {
        comments.push(Comment(msg.sender, _message, block.timestamp));
    }

    function getComments() external view returns (Comment[] memory) {
        return comments;
    }
}
