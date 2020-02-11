pragma solidity 0.5.4;

contract Storage {
    string storedData;

    function set(string memory file) public {
        storedData = file;
    }

    function get() public view returns (string memory data) {
        data = storedData;
    }
}
