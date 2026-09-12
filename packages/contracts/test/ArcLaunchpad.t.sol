// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {ArcUsd} from "../src/ArcUsd.sol";
import {ArcLaunchFactory} from "../src/ArcLaunchFactory.sol";
import {ArcBondingCurve} from "../src/ArcBondingCurve.sol";
import {MockGraduationVenue} from "../src/MockGraduationVenue.sol";

contract ArcLaunchpadTest is Test {
    MockGraduationVenue internal venue;
    ArcLaunchFactory internal factory;
    address internal alice = address(0xA11CE);

    function setUp() public {
        venue = new MockGraduationVenue();
        factory = new ArcLaunchFactory(address(venue));
        vm.deal(alice, 1_000_000 ether);
    }

    function testUsd6ToNative18() public pure {
        uint256 usd6 = 69_000 * 1e6;
        uint256 native18 = ArcUsd.usd6ToNative18(usd6);
        assertEq(native18, 69_000 ether);
        assertEq(ArcUsd.native18ToUsd6(native18), usd6);
    }

    function testLaunchAndBuy() public {
        (address curveAddr,) = factory.launch("Cloudkitty", "CKTY", 69_000 * 1e6);
        ArcBondingCurve curve = ArcBondingCurve(curveAddr);

        assertEq(uint256(curve.phase()), uint256(ArcBondingCurve.Phase.Trading));
        assertEq(curve.graduationThresholdNative18(), 69_000 ether);

        vm.prank(alice);
        uint256 tokens = curve.buy{value: 100 ether}(0);
        assertGt(tokens, 0);
        assertEq(curve.realNative18(), 100 ether);
        assertEq(curve.token().balanceOf(alice), tokens);
    }

    function testSellRoundTrip() public {
        (address curveAddr,) = factory.launch("Inkdrip", "INK", 69_000 * 1e6);
        ArcBondingCurve curve = ArcBondingCurve(curveAddr);

        vm.startPrank(alice);
        uint256 tokens = curve.buy{value: 50 ether}(0);
        curve.token().approve(curveAddr, tokens);
        uint256 out = curve.sell(tokens / 2, 0);
        vm.stopPrank();

        assertGt(out, 0);
        assertLt(curve.realNative18(), 50 ether);
    }

    function testTwoPhaseGraduation() public {
        (address curveAddr,) = factory.launch("Burstberry", "BBRY", 1_000 * 1e6);
        ArcBondingCurve curve = ArcBondingCurve(curveAddr);

        vm.prank(alice);
        curve.buy{value: 1_000 ether}(0);

        assertTrue(curve.canGraduate());
        curve.prepareGraduation();
        assertEq(uint256(curve.phase()), uint256(ArcBondingCurve.Phase.Prepared));

        curve.finalizeGraduation();
        assertEq(uint256(curve.phase()), uint256(ArcBondingCurve.Phase.Graduated));
        assertEq(venue.graduatedCount(), 1);
    }

    function testCannotBuyAfterGraduate() public {
        (address curveAddr,) = factory.launch("Softorb", "ORB", 500 * 1e6);
        ArcBondingCurve curve = ArcBondingCurve(curveAddr);

        vm.prank(alice);
        curve.buy{value: 500 ether}(0);
        curve.graduate();

        vm.prank(alice);
        vm.expectRevert(bytes("curve: phase"));
        curve.buy{value: 1 ether}(0);
    }
}
