//REMILIA COLLECTIVE x SUPER METAL X
//Copyleft (ɔ) All Rights Reversed 
//AUTHOR: ccccaa

pragma solidity >=0.4.16 <0.9.0;

import "./external/openzeppelin/access/Ownable.sol";
import "./external/openzeppelin/access/AccessControl.sol";
import "./external/openzeppelin/utils/Strings.sol";
import "./external/openzeppelin/token/ERC721/extensions/ERC721Enumerable.sol";
import "./external/openzeppelin/interfaces/IERC721Enumerable.sol";

contract SuperMetalMons is ERC721Enumerable, AccessControl, Ownable {

	bytes32 public constant SUPERMETALX_ROLE = keccak256("SUPERMETALX");
	bytes32 public constant REMILIA_ROLE = keccak256("REMILIA");

	string private __contractURI;
	string private __baseURI;

	uint256 constant max_supply = 777;

	//money pools
	uint256 private supermetalx_pool;
	uint256 private remilia_pool;
	
	//80-20 split between supermetalx and remilia 
	uint256 constant price = 100000000 gwei;
	uint256 constant remilia_cut_normal = 20000000 gwei;
	uint256 constant supermetalx_cut_normal = 80000000 gwei;
	
	uint256 constant discount_price = 90000000 gwei;
	uint256 constant remilia_cut_discount = 18000000 gwei;
	uint256 constant supermetalx_cut_discount = 72000000 gwei;
	
	//sale times
	uint256 constant mint_start = 0;
	uint256 constant presale_start = 0;
	
	//"whitelist" =]
	address constant milady_contract_address = 0x5af0d9827e0c53e4799bb226655a1de152a425a5;
	address constant claylings_contract_address = 0x8630cdeaa26d042f0f9242ca30229b425e7f243f;
	address constant j48ba_contract_address = 0xc78337ccbb2d08492ec152e501491d3a76cd5172;
	address constant tubby_cat_contract_address = 0x5af0d9827e0c53e4799bb226655a1de152a425a5;
	
	IERC721Enumerable[4] private _contract;
	mapping(uint256 => bool)[4] private blacklist;
	
	function withdraw_remilia() public {
		require(hasRole(REMILIA_ROLE, msg.sender));
		msg.sender.transfer(remilia_pool);
		remilia_pool = 0;
	}
	
	function withdraw_supermetalx() public {
		require(hasRole(SUPERMETALX_ROLE, msg.sender));
		msg.sender.transfer(supermetalx_pool);
		supermetalx_pool = 0;
	}
	
	function add_whitelist(address wallet) public onlyOwner {
		whitelist[wallet] = true;
	}

	function free_mint() public {
		require(totalSupply() < max_supply,"No more supply.");
		require(whitelist[msg.sender],"Not on whitelist.");
		//require(block.timestamp < presale_start,"Free mint is over.");
		whitelist[msg.sender] = false; 
		_safeMint(msg.sender,totalSupply());
	}
	
	function presale_mint() public payable {
		require(totalSupply() < max_supply,"No more supply.");
		require(msg.value == discount_price,"Insufficent funds.");
		//require(block.timestamp >= presale_start,"Private mint has not started yet!");
		//require(block.timestamp < mint_start,"Private mint is over.");
		
		uint256 i = 0;
		for(; i < _contract.length; i++){
			if(_contract[i].balanceOf(msg.sender)){
				uint256 held_tokenID = _contract[i].tokenOfOwnerByIndex(msg.sender,0);
				if(blacklist[i][held_tokenID]){
					revert("Multiple mints are not allowed.");
				}
				blacklist[i][held_tokenID] = true;
				break;
			}
		}
		require(i < _contract.length,"Must be whitelisted to mint from presale."); //yeah.... "whitelisted".... any questions? =] 
		
		remilia_pool += remilia_cut_discount;
		supermetalx_pool += supermetalx_cut_discount;
		
		_safeMint(msg.sender,totalSupply());
	}

	function mint1() public payable {
		require(totalSupply() < max_supply,"No more supply.");
		require(msg.value == price,"Insufficent funds.");
		//require(block.timestamp >= mint_start,"Public mint has not started yet!");
		remilia_pool += remilia_cut_normal;
		supermetalx_pool += supermetalx_cut_normal;
		_safeMint(msg.sender,totalSupply());
	}
	
	uint256 constant mint_amt2 = 3;
	function mint3() public payable {
		require(totalSupply() < max_supply,"No more supply.");
		require(msg.value == mint_amt2 * price,"Insufficent funds.");
		//require(block.timestamp >= mint_start,"Public mint has not started yet!");
		remilia_pool += mint_amt2 * remilia_cut_normal;
		supermetalx_pool += mint_amt2 * supermetalx_cut_normal;
		_safeMint(msg.sender,totalSupply());
		_safeMint(msg.sender,totalSupply());
		_safeMint(msg.sender,totalSupply());
	}
	
	uint256 constant mint_amt3 = 5;
	function mint5() public payable {
		require(totalSupply() < max_supply,"No more supply.");
		require(msg.value == mint_amt3 * price,"Insufficent funds.");
		//require(block.timestamp >= mint_start,"Public mint has not started yet!");
		remilia_pool += mint_amt3 * remilia_cut_normal;
		supermetalx_pool += mint_amt3 * supermetalx_cut_normal;
		_safeMint(msg.sender,totalSupply());
		_safeMint(msg.sender,totalSupply());
		_safeMint(msg.sender,totalSupply());
		_safeMint(msg.sender,totalSupply());
		_safeMint(msg.sender,totalSupply());
	}


	function _baseURI() internal view virtual override returns (string memory) {
		return __baseURI;
	}

	function _setBaseURI(string memory baseURI_) internal virtual {
		__baseURI = baseURI_;
	}

	function setBaseURI(string memory baseURI) public onlyOwner {
		_setBaseURI(baseURI);
	}
	
	function _contractURI() internal view virtual override returns (string memory) {
		return __contractURI;
	}

	function _setContractURI(string memory contractURI_) internal virtual {
		__contractURI = contractURI_;
	}

	function setContractURI(string memory contractURI) public onlyOwner {
		_setContractURI(contractURI);
	}

	function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
		require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI,Strings.toString(tokenId))) : "";	
	}
	
	constructor(address remilia_wallet,address supermetalx_wallet) ERC721("Super Metal Mons Gen 2", "SMM2") {
		_setRoleAdmin(REMILIA_ROLE,REMILIA_ROLE);
		_setupRole(REMILIA_ROLE,remilia_wallet);
		
		_setRoleAdmin(SUPERMETALX_ROLE,SUPERMETALX_ROLE);
		_setupRole(SUPERMETALX_ROLE,supermetalx_wallet);
		
		_contract[0] = IERC721Enumerable(milady_contract_address);
		_contract[1] = IERC721Enumerable(claylings_contract_address);
		_contract[2] = IERC721Enumerable(j48ba_contract_address);
		_contract[3] = IERC721Enumerable(tubby_cat_contract_address);
	}
	
	
}