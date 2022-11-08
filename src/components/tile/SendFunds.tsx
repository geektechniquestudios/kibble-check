import { Button } from "@mui/material"
import dayjs, { Dayjs } from "dayjs"
import { ethers } from "ethers"
import Frozr from "../../artifacts/contracts/Frozr.sol/Frozr.json"
import Swal from "sweetalert2"
import { Auth } from "../../containers/Auth"
import { Form } from "../../containers/Form"

declare let window: any
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS

interface Props {
  amount: string
  date: Dayjs | null
  currency: string
}

export const SendFunds: React.FC<Props> = ({ amount, date, currency }) => {
  const {
    setConnectBorderColor,
    setCurrencyBorderColor,
    setCalendarBorderColor,
    setAmountBorderColor,
    refreshDeposits,
  } = Form.useContainer()

  // use this version for mainnet inclusion
  // const isCorrectBlockchain = async (
  //   provider: ethers.providers.Web3Provider,
  // ) => {
  //   const { chainId } = await provider.getNetwork()
  //   if (isLocal && chainId !== 43113) {
  //     alert("You are on the wrong network. Please switch to the fuji network.")
  //     return false
  //   }
  //   else if (!isLocal && chainId !== 43114) {
  //     alert(
  //       "You are on the wrong network. Please switch to the avalanche mainnet.",
  //     )
  //     return false
  //   }
  //   else {
  //     return true
  //   }
  // }

  //
  // use this version until mainnet

  const { isWalletConnected } = Auth.useContainer()

  const isCorrectBlockchain = async (
    provider: ethers.providers.Web3Provider,
  ) => {
    const { chainId } = await provider.getNetwork()
    if (chainId !== 43113) {
      alert("You are on the wrong network. Please switch to the fuji network.")
      return false
    } else {
      return true
    }
  }

  const sendDeposit = async (): Promise<void> => {
    const doesUserAccept = async (daysToFreeze: number): Promise<boolean> => {
      const isConfirmed = await Swal.fire({
        title: `Are you sure you want to store ${amount} ${currency} for ${daysToFreeze} ${
          daysToFreeze === 1 ? "day" : "days"
        }?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Send",
        confirmButtonColor: "#93c5fd",
      }).then((res) => res.isConfirmed)
      return isConfirmed
    }

    const areFieldsFilled = () => {
      const reddenWalletButton = () => {
        setConnectBorderColor("red")
        return false
      }
      const reddenCurrencyButton = () => {
        setCurrencyBorderColor("")
        setCurrencyBorderColor("border-red-600")
        return false
      }
      const reddenCalendarButton = () => {
        setConnectBorderColor("")
        setCurrencyBorderColor("border-transparent")
        setCalendarBorderColor("border-red-600")
        return false
      }
      const reddenAmountButton = () => {
        setConnectBorderColor("")
        setCurrencyBorderColor("border-transparent")
        setCalendarBorderColor("border-transparent")
        setAmountBorderColor("border-red-600")
        return false
      }
      if (!isWalletConnected) return reddenWalletButton()
      else if (!currency) return reddenCurrencyButton()
      else if (!date || dayjs(date) < dayjs()) return reddenCalendarButton()
      else if (!amount || Number(amount) <= 0) return reddenAmountButton()
      return true
    }

    const callSmartContract = async () => {
      if (typeof window.ethereum !== undefined) {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer: ethers.providers.JsonRpcSigner = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, Frozr.abi, signer)
        try {
          if (!(await isCorrectBlockchain(provider))) return
          const date1 = dayjs()
          const date2 = dayjs(date)
          const diff = date2.diff(date1, "day", true)
          const daysToFreeze = Math.floor(diff) + 1

          if (!(await doesUserAccept(daysToFreeze))) return

          const bigAmount = ethers.utils.parseEther(String(Number(amount)))

          const overrides = {
            value: bigAmount,
            gasLimit: 1000000,
          }

          const transaction = await contract.deposit(daysToFreeze, overrides)
          transaction.wait().then(() => {
            contract.removeAllListeners()
            refreshDeposits()
          })
        } catch (err) {
          contract.removeAllListeners()
          console.error(err)
        }
      } else {
        alert("Please install MetaMask to place a bet.")
      }
    }

    if (!areFieldsFilled()) return
    callSmartContract()
  }

  return (
    <div className="grid h-1/5 place-content-center">
      <Button
        onClick={sendDeposit}
        className="h-14 w-48"
        variant="outlined"
        sx={{ fontWeight: "bold" }}
      >
        Store your funds
      </Button>
    </div>
  )
}
