pragma solidity >=0.4.21 <0.7.0;

contract Addition {
  int public sum = 5;
  
  function getSum() public view returns(int){
    return sum;
  }
  function add (int x, int y) public {
    sum = x + y;
  }
}