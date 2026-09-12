RPC_URL ?= https://rpc.testnet.arc.io

.PHONY: test deploy-anvil deploy-arc-testnet

test:
	forge test -vv

deploy-anvil:
	forge script script/Deploy.s.sol:DeployScript \
		--rpc-url http://127.0.0.1:8545 \
		--broadcast \
		--unlocked \
		--sender 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

# Requires PRIVATE_KEY in the environment to broadcast. Never commit keys.
deploy-arc-testnet:
	RPC_URL=$(RPC_URL) ./script/deploy-arc-testnet.sh
