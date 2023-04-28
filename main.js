let WALLET_CONNECTED = "";
let contractAddress = "0x5A72EFF58E9570aA7E91ba2014aCd12A0153ffb4";
let contractAbi = [
  {
    inputs: [
      {
        internalType: "string[]",
        name: "_candidateNames",
        type: "string[]",
      },
      {
        internalType: "uint256",
        name: "_durationInMinutes",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "addCandidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "candidates",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "voteCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllVotesOfCandidates",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "voteCount",
            type: "uint256",
          },
        ],
        internalType: "struct Voting.Candidate[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRemainingTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVotingStatus",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_candidateIndex",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "voters",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "votingEnd",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "votingStart",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// function connect to Metamask Wallet
const connectMetamask = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  WALLET_CONNECTED = await signer.getAddress();
  var element = document.getElementById("metamasknotification");
  element.innerHTML = "Metamask is Connected " + WALLET_CONNECTED;
};

// function to get all candidate from smart contract
const getAllCandidates = async () => {
  var p3 = document.getElementById("p3");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();
  const contractInstance = new ethers.Contract(
    contractAddress,
    contractAbi,
    signer
  );
  p3.innerHTML =
    "Please wait, getting all candidates from voting smart contract";
  var candidates = await contractInstance.getAllVotesOfCandidates();
  console.log(candidates);

  var table = document.getElementById("myTable");
  for (let i = 0; i < candidates.length; i++) {
    var row = table.insertRow();
    var idCell = row.insertCell();
    var nameCell = row.insertCell();
    var vc = row.insertCell();

    idCell.innerHTML = i;
    nameCell.innerHTML = candidates[i].name;
    vc.innerHTML = candidates[i].voteCount;
  }

  p3.innerHTML = "The candidates list is updates!";
};

const voteStatus = async () => {
  if (WALLET_CONNECTED != 0) {
    var status = document.getElementById("status");
    var remainingTime = document.getElementById("time");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    const currentStatus = await contractInstance.getVotingStatus();
    const time = await contractInstance.getRemainingTime();
    status.innerHTML =
      currentStatus == 1 ? "Voting is currently open" : "Voting is finished";
    remainingTime.innerHTML = `Remaining time is ${parseInt(time, 16)} seconds`;
  } else {
    var status = document.getElementById("status");
    status.innerHTML = "Please connect Metamask Wallet First!";
  }
};

const addVote = async () => {
  if (WALLET_CONNECTED != 0) {
    var name = document.getElementById("vote");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    var cand = document.getElementById("cand");
    cand.innerHTML = "Please wait, adding a vote in the smart contract";
    const tx = await contractInstance.vote(name.value);
    await tx.wait();
    cand.innerHTML = "Vote added";
  } else {
    var status = document.getElementById("cand");
    status.innerHTML = "Please connect Metamask Wallet First!";
  }
};
