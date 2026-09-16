// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {MockGraduationVenue} from "../src/MockGraduationVenue.sol";
import {ArcLaunchFactory} from "../src/ArcLaunchFactory.sol";

/// @notice Anvil / Arc Testnet v2 deploy. The venue is intentionally a mock and must never be used as a mainnet DEX adapter.
contract DeployScript is Script {
    function run() external {
        address treasury = vm.envOr("PROTOCOL_TREASURY", address(0));
        uint16 protocolFeeBps = uint16(vm.envOr("PROTOCOL_FEE_BPS", uint256(0)));
        uint16 creatorFeeBps = uint16(vm.envOr("CREATOR_FEE_BPS", uint256(0)));

        vm.startBroadcast();
        MockGraduationVenue venue = new MockGraduationVenue();
        ArcLaunchFactory factory = new ArcLaunchFactory(address(venue), treasury, protocolFeeBps, creatorFeeBps);
        vm.stopBroadcast();

        console2.log("venue", address(venue));
        console2.log("factory", address(factory));
        console2.log("factory version", factory.VERSION());
        console2.log("protocol fee bps", protocolFeeBps);
        console2.log("creator fee bps", creatorFeeBps);
        console2.log("Set NEXT_PUBLIC_TESTNET_FACTORY_ADDRESS only after a broadcast receipt is verified.");
        console2.log("MockGraduationVenue is TESTNET ONLY; mainnet writes must remain disabled.");
    }
}
