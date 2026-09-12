// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {MockGraduationVenue} from "../src/MockGraduationVenue.sol";
import {ArcLaunchFactory} from "../src/ArcLaunchFactory.sol";

/// @notice Local / testnet prototype deploy. Venue is a mock — not Uniswap V4.
contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        MockGraduationVenue venue = new MockGraduationVenue();
        ArcLaunchFactory factory = new ArcLaunchFactory(address(venue));
        vm.stopBroadcast();

        // forge script prints these via traces; keep addresses out of source.
        factory;
        venue;
    }
}
