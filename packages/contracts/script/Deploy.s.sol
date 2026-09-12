// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {MockGraduationVenue} from "../src/MockGraduationVenue.sol";
import {ArcLaunchFactory} from "../src/ArcLaunchFactory.sol";

/// @notice Anvil or Arc Testnet prototype deploy. Venue is a mock — Uniswap V4 on Arc is UNVERIFIED.
contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        MockGraduationVenue venue = new MockGraduationVenue();
        ArcLaunchFactory factory = new ArcLaunchFactory(address(venue));
        vm.stopBroadcast();

        console2.log("venue", address(venue));
        console2.log("factory", address(factory));
        console2.log("Paste factory into apps/web/.env.local as NEXT_PUBLIC_FACTORY_ADDRESS");
        console2.log("Simulation addresses are not on-chain. Only trust them after a --broadcast receipt.");
    }
}
